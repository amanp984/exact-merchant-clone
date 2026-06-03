import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CreditCard, QrCode, Link2, Smartphone } from "lucide-react";

export const Route = createFileRoute("/accept-payments")({
  component: () => (
    <div>
      <PageHeader title="Accept Payments" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { i: CreditCard, t: "Payment Gateway", d: "Accept online card, UPI, wallet payments" },
          { i: QrCode, t: "Static QR", d: "Generate QR codes for in-store payments" },
          { i: Link2, t: "Payment Links", d: "Share payment links via SMS/Email/WhatsApp" },
          { i: Smartphone, t: "Soundbox", d: "Voice notification device for shops" },
        ].map(({ i: Icon, t, d }) => (
          <div key={t} className="border border-border rounded-xl p-5 bg-card hover:shadow-md transition">
            <Icon className="h-7 w-7 text-primary mb-3" />
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-muted-foreground mt-1">{d}</div>
          </div>
        ))}
      </div>
    </div>
  ),
});