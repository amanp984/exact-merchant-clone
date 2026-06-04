import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MERCHANT } from "@/lib/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/profile")({
  component: ProfilePage,
});

type Tab = "Payment Settings" | "Settlement Settings" | "Account Details";
const TABS: Tab[] = ["Payment Settings", "Settlement Settings", "Account Details"];

interface Instrument { name: string; tag?: string; limit?: string; remaining?: string; tiers: { range: string; charge: string }[]; enabled: boolean; }

const INSTRUMENTS: Instrument[] = [
  { name: "Credit Line", tag: "New", tiers: [
    { range: "Upto ₹2,000", charge: "Free" },
    { range: "More than ₹2,000", charge: "1.99% + GST" },
  ], enabled: true },
  { name: "RuPay Credit Card", limit: "Max: ₹4,00,000 / month", remaining: "Remaining: ₹3,55,556 / month", tiers: [
    { range: "Upto ₹2,000", charge: "Free" },
    { range: "More than ₹2,000", charge: "1.99% + GST" },
  ], enabled: true },
  { name: "UPI", limit: "Max: ₹10,00,000 / month", remaining: "Remaining: ₹9,12,344 / month", tiers: [
    { range: "All Transactions", charge: "Free" },
  ], enabled: true },
  { name: "Debit Card", limit: "Max: ₹5,00,000 / month", remaining: "Remaining: ₹4,87,221 / month", tiers: [
    { range: "Upto ₹2,000", charge: "0.40% + GST" },
    { range: "More than ₹2,000", charge: "0.90% + GST" },
  ], enabled: true },
  { name: "Net Banking", tiers: [{ range: "All Transactions", charge: "1.20% + GST" }], enabled: false },
  { name: "Wallet", tiers: [{ range: "All Transactions", charge: "1.10% + GST" }], enabled: true },
];

function ProfilePage() {
  const [tab, setTab] = useState<Tab>("Payment Settings");
  const [items, setItems] = useState(INSTRUMENTS);
  const toggle = (i: number) => setItems((s) => s.map((x, k) => k === i ? { ...x, enabled: !x.enabled } : x));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">Profile</h1>
      <div className="flex gap-8 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("py-3 text-sm font-semibold border-b-2 -mb-px",
              tab === t ? "border-primary text-primary" : "border-transparent text-foreground hover:text-primary")}
          >{t}</button>
        ))}
      </div>

      {tab === "Payment Settings" && (
        <>
          <div className="bg-muted/30 rounded-lg p-5 mt-6">
            <div className="font-bold">{MERCHANT.name}</div>
            <div className="text-sm text-muted-foreground mt-1">Accepting payments with PAYTMM LITE since April 2026</div>
          </div>
          <div className="mt-6">
            <span className="inline-block bg-[hsl(195_100%_55%)] text-white text-sm font-semibold rounded-full px-5 py-1.5">Payment</span>
            <p className="text-sm text-amber-600 mt-3">Acceptance limits for all types of methods is common.</p>
          </div>
          <div className="mt-6 border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1.2fr_1.5fr_1.4fr_120px] bg-muted/40 px-5 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center">
              <div className="text-left">Payment Instrument</div>
              <div>Monthly Acceptance Limits</div>
              <div>Payment Charges</div>
              <div>Status</div>
            </div>
            {items.map((it, i) => (
              <div key={it.name} className="grid grid-cols-[1.2fr_1.5fr_1.4fr_120px] px-5 py-5 border-t border-border items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-primary">{it.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                  <div>
                    {it.tag && <span className="inline-block text-[10px] font-bold bg-amber-300 text-amber-900 rounded px-1.5 py-0.5 mb-1">{it.tag}</span>}
                    <div className="text-sm font-medium">{it.name}</div>
                  </div>
                </div>
                <div className="text-center text-sm">
                  {it.limit ? (
                    <>
                      <div>{it.limit}</div>
                      <div className="text-emerald-600 mt-1 text-xs">{it.remaining}</div>
                    </>
                  ) : <span className="text-muted-foreground">—</span>}
                </div>
                <div className="space-y-3">
                  {it.tiers.map((t, k) => (
                    <div key={k} className="text-center text-sm">
                      <div className="text-muted-foreground text-xs">{t.range}</div>
                      <div className={cn("font-semibold", t.charge === "Free" ? "text-emerald-600" : "")}>{t.charge}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className={cn("text-sm font-medium", it.enabled ? "text-foreground" : "text-muted-foreground")}>{it.enabled ? "Active" : "Inactive"}</span>
                  <button
                    onClick={() => toggle(i)}
                    className={cn("h-6 w-11 rounded-full relative transition-colors", it.enabled ? "bg-[hsl(195_100%_55%)]" : "bg-muted")}
                  >
                    <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", it.enabled ? "left-5" : "left-0.5")} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "Settlement Settings" && (
        <div className="mt-6 max-w-2xl space-y-4">
          <Field label="Bank Account" value="HDFC Bank •••• 1234" />
          <Field label="IFSC" value="HDFC0001234" />
          <Field label="Settlement Cycle" value="T+1 Daily" />
          <Field label="Minimum Settlement Amount" value="₹100" />
        </div>
      )}

      {tab === "Account Details" && (
        <div className="mt-6 max-w-2xl space-y-4">
          <Field label="Merchant Name" value={MERCHANT.name} />
          <Field label="Business Name" value={MERCHANT.businessName} />
          <Field label="Email" value={MERCHANT.email} />
          <Field label="Mobile" value={MERCHANT.phone} />
          <Field label="PAN" value={MERCHANT.pan} />
          <Field label="GSTIN" value={MERCHANT.gst} />
          <Field label="Address" value={MERCHANT.address} />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">KYC Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">{MERCHANT.kyc}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}