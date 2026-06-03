export type PaymentStatus = "Success" | "Failed" | "Pending" | "Refunded";
export type PaymentMethod = "UPI" | "QR" | "Card" | "Net Banking" | "Wallet";

export interface Payment {
  id: string;
  orderId: string;
  txnId: string;
  utr: string;
  customer: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  date: string; // ISO
}

export interface Settlement {
  id: string;
  utr: string;
  date: string;
  settledAt: string;
  windowStart: string;
  windowEnd: string;
  payments: number;
  collection: number;
  deduction: number;
  net: number;
  status: "Settled" | "Pending" | "Failed";
}

export interface Refund {
  id: string;
  orderId: string;
  txnId: string;
  rrn: string;
  customer: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  subStatus: string;
  date: string;
}

export interface Dispute {
  id: string;
  txnId: string;
  customer: string;
  amount: number;
  status: "Open" | "Won" | "Lost" | "Pending";
  reason: string;
  createdAt: string;
}

export interface BankDowntime {
  bank: string;
  status: "Online" | "Degraded" | "Down";
  lastUpdated: string;
}

const NAMES = [
  "Aarav Sharma", "Vivaan Patel", "Aditya Singh", "Ishaan Verma", "Diya Kapoor",
  "Anaya Nair", "Kabir Mehta", "Riya Iyer", "Arjun Reddy", "Saanvi Joshi",
  "Mohit Gupta", "Neha Bansal", "Rohan Das", "Priya Rao", "Karan Malhotra",
];
const METHODS: PaymentMethod[] = ["UPI", "QR", "Card", "Net Banking", "Wallet"];
const STATUSES: PaymentStatus[] = ["Success", "Success", "Success", "Success", "Failed", "Pending", "Refunded"];

function seed(i: number) {
  // deterministic pseudo-random
  const x = Math.sin(i * 99991) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], i: number): T {
  return arr[Math.floor(seed(i) * arr.length)];
}

function pad(n: number, w = 4) { return n.toString().padStart(w, "0"); }

const NOW = new Date("2026-06-03T10:00:00Z").getTime();

export const PAYMENTS: Payment[] = Array.from({ length: 64 }, (_, i) => {
  const amount = Math.round(seed(i + 1) * 9500) + 50;
  const daysAgo = Math.floor(seed(i + 7) * 30);
  const date = new Date(NOW - daysAgo * 86400000 - Math.floor(seed(i + 11) * 86400000));
  return {
    id: `p_${i}`,
    orderId: `ORD${pad(202600 + i, 6)}`,
    txnId: `TXN${pad(8821000 + i, 7)}`,
    utr: `UTR${pad(15424209000 + i, 11)}`,
    customer: pick(NAMES, i + 3),
    amount,
    status: pick(STATUSES, i + 5),
    method: pick(METHODS, i + 2),
    date: date.toISOString(),
  };
});

export const SETTLEMENTS: Settlement[] = Array.from({ length: 18 }, (_, i) => {
  const daysAgo = i;
  const date = new Date(NOW - daysAgo * 86400000);
  const payments = Math.floor(seed(i + 21) * 18) + 2;
  const collection = Math.round(seed(i + 31) * 90000) + 1000;
  const deduction = Math.round(collection * 0.018);
  return {
    id: `s_${i}`,
    utr: `AXNPM${pad(15424209000 + i, 11)}`,
    date: date.toISOString(),
    settledAt: new Date(date.getTime() + 2 * 3600 * 1000 + 27 * 60000).toISOString(),
    windowStart: new Date(date.getTime() - 6 * 3600 * 1000).toISOString(),
    windowEnd: date.toISOString(),
    payments,
    collection,
    deduction,
    net: collection - deduction,
    status: "Settled",
  };
});

export const REFUNDS: Refund[] = Array.from({ length: 22 }, (_, i) => {
  const daysAgo = Math.floor(seed(i + 41) * 25);
  const date = new Date(NOW - daysAgo * 86400000);
  const amount = Math.round(seed(i + 51) * 4500) + 50;
  const sub = pick(["Initiated", "Processed", "Bank Approved", "Customer Refunded"], i + 13);
  return {
    id: `r_${i}`,
    orderId: `ORD${pad(202600 + i * 3, 6)}`,
    txnId: `TXN${pad(8821000 + i * 3, 7)}`,
    rrn: `RRN${pad(70032000 + i, 8)}`,
    customer: pick(NAMES, i + 9),
    amount,
    status: pick(["Success", "Success", "Pending", "Failed"] as const, i + 17),
    subStatus: sub,
    date: date.toISOString(),
  };
});

export const DISPUTES: Dispute[] = Array.from({ length: 12 }, (_, i) => {
  const daysAgo = Math.floor(seed(i + 61) * 30);
  return {
    id: `DSP${pad(50230 + i, 6)}`,
    txnId: `TXN${pad(8821000 + i * 5, 7)}`,
    customer: pick(NAMES, i + 19),
    amount: Math.round(seed(i + 71) * 8000) + 100,
    status: pick(["Open", "Won", "Lost", "Pending"] as const, i + 23),
    reason: pick(["Item not received", "Duplicate charge", "Unauthorized", "Quality issue"], i + 29),
    createdAt: new Date(NOW - daysAgo * 86400000).toISOString(),
  };
});

export const BANK_DOWNTIMES: BankDowntime[] = [
  { bank: "HDFC Bank", status: "Online", lastUpdated: new Date(NOW - 5 * 60000).toISOString() },
  { bank: "ICICI Bank", status: "Online", lastUpdated: new Date(NOW - 3 * 60000).toISOString() },
  { bank: "State Bank of India", status: "Degraded", lastUpdated: new Date(NOW - 12 * 60000).toISOString() },
  { bank: "Axis Bank", status: "Online", lastUpdated: new Date(NOW - 8 * 60000).toISOString() },
  { bank: "Kotak Mahindra", status: "Online", lastUpdated: new Date(NOW - 2 * 60000).toISOString() },
  { bank: "Punjab National Bank", status: "Down", lastUpdated: new Date(NOW - 25 * 60000).toISOString() },
  { bank: "Yes Bank", status: "Online", lastUpdated: new Date(NOW - 1 * 60000).toISOString() },
  { bank: "IDFC First", status: "Degraded", lastUpdated: new Date(NOW - 18 * 60000).toISOString() },
];

export const MERCHANT = {
  name: "Aman Jatashankar Prajapati",
  mid: "PLMVcH22845451615122",
  businessName: "Prajapati Enterprises",
  email: "aman@prajapati.in",
  phone: "+91 98765 43210",
  address: "204, MG Road, Bengaluru, Karnataka 560001",
  pan: "ABCDE1234F",
  gst: "29ABCDE1234F1Z5",
  kyc: "Verified",
};

export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => {
        const v = String(r[h] ?? "").replace(/"/g, '""');
        return /[",\n]/.test(v) ? `"${v}"` : v;
      }).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}