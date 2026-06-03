import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Check } from "lucide-react";

const services = [
  { name: "Payment Gateway", active: true },
  { name: "QR Payments", active: true },
  { name: "Payment Links", active: true },
  { name: "Subscriptions", active: false },
  { name: "Invoicing", active: true },
  { name: "Soundbox", active: false },
];

export const Route = createFileRoute("/my-services")({
  component: () => (
    <div>
      <PageHeader title="My Services" />
      <div className="grid md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.name} className="border border-border rounded-lg p-4 bg-card flex items-center justify-between">
            <span className="font-medium">{s.name}</span>
            {s.active ? <span className="text-emerald-600 inline-flex items-center gap-1 text-xs"><Check className="h-3 w-3" /> Active</span> : <span className="text-xs text-muted-foreground">Inactive</span>}
          </div>
        ))}
      </div>
    </div>
  ),
});