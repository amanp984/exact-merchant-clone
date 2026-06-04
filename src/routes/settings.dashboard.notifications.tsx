import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useState } from "react";

export const Route = createFileRoute("/settings/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notifications — PAYTMM LITE" }] }),
  component: NotificationsPage,
});

const OPTIONS = [
  { k: "payments", label: "Payment received" },
  { k: "settlements", label: "Settlement credited" },
  { k: "refunds", label: "Refund initiated / processed" },
  { k: "disputes", label: "New dispute raised" },
  { k: "downtime", label: "Bank downtime alerts" },
  { k: "reports", label: "Weekly report ready" },
];

function NotificationsPage() {
  const [state, setState] = useState<Record<string, { email: boolean; sms: boolean; push: boolean }>>(
    () => Object.fromEntries(OPTIONS.map((o) => [o.k, { email: true, sms: false, push: true }]))
  );
  const toggle = (k: string, c: "email" | "sms" | "push") =>
    setState((s) => ({ ...s, [k]: { ...s[k], [c]: !s[k][c] } }));
  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_100px] bg-muted/50 px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          <div>Event</div><div className="text-center">Email</div><div className="text-center">SMS</div><div className="text-center">Push</div>
        </div>
        {OPTIONS.map((o) => (
          <div key={o.k} className="grid grid-cols-[1fr_100px_100px_100px] px-4 py-3 border-t border-border items-center">
            <div className="text-sm">{o.label}</div>
            {(["email", "sms", "push"] as const).map((c) => (
              <div key={c} className="flex justify-center">
                <input type="checkbox" checked={state[o.k][c]} onChange={() => toggle(o.k, c)} className="h-4 w-4 accent-[hsl(195_100%_55%)]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}