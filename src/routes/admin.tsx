import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { inr } from "@/lib/data/mock";
import { useStore, addPayment } from "@/lib/store";
import { Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

function AdminPanel() {
  const payments = useStore((s) => s.payments);
  const settlements = useStore((s) => s.settlements);
  const [sms, setSms] = useState("");
  const stats = [
    { l: "Total Transactions", v: payments.length },
    { l: "Total Volume", v: inr(payments.reduce((s, p) => s + p.amount, 0)) },
    { l: "Total Settlements", v: settlements.length },
    { l: "Total Refunds", v: 0 },
  ];

  const ingest = () => {
    const m = sms.match(/(?:INR|Rs\.?)\s*([\d,]+(?:\.\d{1,2})?)/i);
    if (!m) { alert("Could not parse an amount from the SMS."); return; }
    const amount = Math.round(parseFloat(m[1].replace(/,/g, "")));
    const utrMatch = sms.match(/(?:UTR|Ref(?:\s*no)?\.?)\s*[:#]?\s*(\w{8,})/i);
    addPayment({ amount, utr: utrMatch ? "UTR" + utrMatch[1] : undefined, smsSource: "SMS Ingest" });
    setSms("");
    alert(`Ingested ₹${amount}`);
  };
  return (
    <div>
      <PageHeader title="Admin Panel">
        <span className="inline-flex items-center gap-1.5 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
          <Shield className="h-3.5 w-3.5" /> Internal
        </span>
      </PageHeader>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.l} className="rounded-xl border border-border p-4 bg-card">
            <div className="text-xs text-muted-foreground uppercase">{s.l}</div>
            <div className="text-2xl font-bold mt-1">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="border border-border rounded-xl bg-card p-6">
        <h3 className="font-semibold mb-3">SMS Ingestion (preview)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Paste a bank/UPI SMS to test the parser. Once Lovable Cloud is enabled, parsed records will write to <code className="bg-muted px-1 rounded">sms_transactions</code> and update dashboards in realtime.
        </p>
        <textarea rows={4} placeholder="e.g. INR 1,250.00 credited to A/c XX1234 on 03-06-26. UPI Ref no 415424209672." className="w-full border border-border rounded-md px-3 py-2 text-sm font-mono" />
      </div>
    </div>
  );
}