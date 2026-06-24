import { createFileRoute } from "@tanstack/react-router";

type SmsPayload = {
  message?: string;
  sender?: string;
  received_at?: string;
};

type ParsedSms = {
  amount: number | null;
  type: "credit" | "debit" | null;
  utr: string | null;
  customerName: string | null;
  upiId: string | null;
  bankName: string | null;
  balance: number | null;
  timestamp: string | null;
};

type SupabaseAdminClient = typeof import("@/integrations/supabase/client.server").supabaseAdmin;

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-sms-webhook-secret, x-webhook-secret",
};

const transactionKeywords = [
  "upi",
  "utr",
  "ref no",
  "reference",
  "credit",
  "debit",
  "credited",
  "debited",
  "balance",
  "avl bal",
];

const ignoredKeywords = [
  "otp",
  "one time password",
  "promotional",
  "promo",
  "recharge",
  "shopping",
  "delivery",
  "loan",
  "offer",
  "cashback offer",
  "sale",
  "discount",
];

export const Route = createFileRoute("/api/sms")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: jsonHeaders }),
      POST: async ({ request }) => {
        const expectedSecret = process.env.SMS_WEBHOOK_SECRET;
        if (!expectedSecret) {
          return json({ success: false, error: "SMS webhook is not configured" }, 500);
        }

        const incomingSecret = getIncomingSecret(request);
        if (!constantTimeEqual(incomingSecret, expectedSecret)) {
          return json({ success: false, error: "Unauthorized" }, 401);
        }

        let payload: SmsPayload;
        try {
          payload = (await request.json()) as SmsPayload;
        } catch {
          return json({ success: false, error: "Invalid JSON body" }, 400);
        }

        const message = payload.message?.trim();
        const sender = payload.sender?.trim() || null;
        const receivedAt = normalizeTimestamp(payload.received_at) ?? new Date().toISOString();

        if (!message) {
          return json({ success: false, error: "Missing SMS message" }, 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const parsed = parseSms(message, receivedAt);

        if (shouldIgnoreSms(message)) {
          await writeSmsLog(supabaseAdmin, {
            sender,
            message,
            utr: parsed.utr,
            processing_status: "ignored",
            received_at: receivedAt,
          });
          return json({ success: true, status: "ignored" });
        }

        if (!containsTransactionSignal(message)) {
          await writeSmsLog(supabaseAdmin, {
            sender,
            message,
            utr: parsed.utr,
            processing_status: "ignored_non_transaction",
            received_at: receivedAt,
          });
          return json({ success: true, status: "ignored_non_transaction" });
        }

        if (!parsed.amount || !parsed.type || !parsed.utr) {
          await writeSmsLog(supabaseAdmin, {
            sender,
            message,
            utr: parsed.utr,
            processing_status: "parse_failed",
            received_at: receivedAt,
          });
          return json({ success: false, status: "parse_failed", error: "Could not parse amount, type, or UTR" }, 422);
        }

        const { data: existing, error: lookupError } = await supabaseAdmin
          .from("transactions")
          .select("id")
          .eq("utr", parsed.utr)
          .maybeSingle();

        if (lookupError) {
          await writeSmsLog(supabaseAdmin, {
            sender,
            message,
            utr: parsed.utr,
            processing_status: "lookup_failed",
            received_at: receivedAt,
          });
          return json({ success: false, error: lookupError.message }, 500);
        }

        if (existing) {
          await writeSmsLog(supabaseAdmin, {
            sender,
            message,
            utr: parsed.utr,
            processing_status: "duplicate_utr",
            received_at: receivedAt,
          });
          return json({ success: true, status: "duplicate_utr" });
        }

        const transactionId = await generateUniqueTransactionId(supabaseAdmin);
        const orderId = await generateUniqueOrderId(supabaseAdmin);

        const { data: transaction, error: insertError } = await supabaseAdmin
          .from("transactions")
          .insert({
            transaction_id: transactionId,
            order_id: orderId,
            utr: parsed.utr,
            amount: parsed.amount,
            type: parsed.type,
            customer_name: parsed.customerName,
            upi_id: parsed.upiId,
            bank_name: parsed.bankName ?? sender,
            message,
            status: "success",
            refund_status: "not_refunded",
            balance: parsed.balance,
            sms_timestamp: parsed.timestamp ?? receivedAt,
          })
          .select("id, transaction_id, order_id, utr")
          .single();

        if (insertError) {
          const status = insertError.code === "23505" ? "duplicate_utr" : "insert_failed";
          await writeSmsLog(supabaseAdmin, {
            sender,
            message,
            utr: parsed.utr,
            processing_status: status,
            received_at: receivedAt,
          });
          return json({ success: insertError.code === "23505", status, error: insertError.message }, insertError.code === "23505" ? 200 : 500);
        }

        await writeSmsLog(supabaseAdmin, {
          sender,
          message,
          utr: parsed.utr,
          processing_status: "processed",
          received_at: receivedAt,
        });

        return json({ success: true, status: "processed", transaction });
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function getIncomingSecret(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return (
    request.headers.get("x-sms-webhook-secret") ??
    request.headers.get("x-webhook-secret") ??
    new URL(request.url).searchParams.get("secret") ??
    ""
  ).trim();
}

function constantTimeEqual(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function shouldIgnoreSms(message: string) {
  const lower = message.toLowerCase();
  return ignoredKeywords.some((keyword) => lower.includes(keyword));
}

function containsTransactionSignal(message: string) {
  const lower = message.toLowerCase();
  return transactionKeywords.some((keyword) => lower.includes(keyword));
}

function parseSms(message: string, fallbackTimestamp: string): ParsedSms {
  return {
    amount: extractAmount(message),
    type: extractType(message),
    utr: extractUtr(message),
    customerName: extractCustomerName(message),
    upiId: extractUpiId(message),
    bankName: extractBankName(message),
    balance: extractBalance(message),
    timestamp: extractTimestamp(message) ?? fallbackTimestamp,
  };
}

function extractAmount(message: string) {
  const patterns = [
    /(?:inr|rs\.?|₹)\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i,
    /([0-9][0-9,]*(?:\.\d{1,2})?)\s*(?:inr|rs\.?|₹)/i,
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) return Number(match[1].replace(/,/g, ""));
  }
  return null;
}

function extractType(message: string): "credit" | "debit" | null {
  if (/\b(credited|credit|received|deposited)\b/i.test(message)) return "credit";
  if (/\b(debited|debit|paid|sent|withdrawn)\b/i.test(message)) return "debit";
  return null;
}

function extractUtr(message: string) {
  const patterns = [
    /\b(?:upi\s*)?(?:utr|rrn|ref(?:erence)?(?:\s*no)?|txn\s*ref(?:erence)?)\b\s*(?:no\.?|number|id)?\s*[:#\-]?\s*([A-Z0-9]{8,35})/i,
    /\b(?:utr|rrn)\s*([0-9]{8,35})\b/i,
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) return match[1].replace(/[^A-Z0-9]/gi, "").toUpperCase();
  }
  return null;
}

function extractUpiId(message: string) {
  const match = message.match(/\b([a-zA-Z0-9._\-]{2,})@([a-zA-Z][a-zA-Z0-9._\-]{2,})\b/);
  return match ? `${match[1]}@${match[2]}` : null;
}

function extractCustomerName(message: string) {
  const patterns = [
    /(?:from|by)\s+([A-Z][A-Za-z .]{2,40}?)(?:\s+on|\s+via|\s+upi|\s+ref|\s+utr|\.|,|$)/i,
    /(?:received from|credited from)\s+([A-Z][A-Za-z .]{2,40}?)(?:\s+upi|\s+ref|\.|,|$)/i,
    /(?:to|paid to)\s+([A-Z][A-Za-z .]{2,40}?)(?:\s+on|\s+via|\s+upi|\s+ref|\.|,|$)/i,
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    const name = match?.[1]?.replace(/\s+/g, " ").trim();
    if (name && !/^(a\/c|account|upi|rs|inr|bank)$/i.test(name)) return name;
  }
  return null;
}

function extractBankName(message: string) {
  const knownBanks = [
    "Paytm Payments Bank",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "State Bank of India",
    "SBI",
    "Kotak Mahindra Bank",
    "Yes Bank",
    "IndusInd Bank",
    "Punjab National Bank",
    "Bank of Baroda",
  ];
  const found = knownBanks.find((bank) => new RegExp(bank.replace(/\s+/g, "\\s+"), "i").test(message));
  if (found) return found;

  const senderMatch = message.match(/\b([A-Z]{2,12})\s*Bank\b/i);
  return senderMatch ? `${senderMatch[1].toUpperCase()} Bank` : null;
}

function extractBalance(message: string) {
  const match = message.match(/(?:avl\.?\s*bal(?:ance)?|available\s*balance|balance)\s*(?:is|:)?\s*(?:inr|rs\.?|₹)?\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i);
  return match?.[1] ? Number(match[1].replace(/,/g, "")) : null;
}

function extractTimestamp(message: string) {
  const dateTimeMatch = message.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})(?:\s+(?:at\s*)?(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?))?/i);
  if (!dateTimeMatch) return null;

  const [day, month, yearRaw] = dateTimeMatch[1].split(/[\/\-]/).map(Number);
  const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (dateTimeMatch[2]) {
    const timeMatch = dateTimeMatch[2].match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
    if (timeMatch) {
      hours = Number(timeMatch[1]);
      minutes = Number(timeMatch[2]);
      seconds = Number(timeMatch[3] ?? 0);
      const meridiem = timeMatch[4]?.toUpperCase();
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
    }
  }

  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeTimestamp(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function randomDigits(length: number) {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => String(value % 10)).join("");
}

function randomHex(length: number) {
  const values = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("").slice(0, length);
}

async function generateUniqueTransactionId(supabaseAdmin: SupabaseAdminClient) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = `2026${Date.now()}${randomDigits(16)}`.slice(0, 35);
    const { data } = await supabaseAdmin.from("transactions").select("id").eq("transaction_id", id).maybeSingle();
    if (!data) return id;
  }
  return `${Date.now()}${randomDigits(22)}`;
}

async function generateUniqueOrderId(supabaseAdmin: SupabaseAdminClient) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = `PTM${randomHex(32)}`;
    const { data } = await supabaseAdmin.from("transactions").select("id").eq("order_id", id).maybeSingle();
    if (!data) return id;
  }
  return `PTM${Date.now().toString(16)}${randomHex(20)}`;
}

async function writeSmsLog(
  supabaseAdmin: SupabaseAdminClient,
  row: {
    sender: string | null;
    message: string;
    utr: string | null;
    processing_status: string;
    received_at: string;
  },
) {
  const { error } = await supabaseAdmin.from("sms_logs").insert(row);
  if (error) console.error("Failed to write SMS log", error.message);
}