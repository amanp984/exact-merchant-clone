import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MERCHANT } from "@/lib/data/mock";

export const Route = createFileRoute("/settings/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [p, setP] = useState({ ...MERCHANT });
  return (
    <div>
      <PageHeader title="Profile">
        <Button onClick={() => alert("Profile saved")}>Save</Button>
      </PageHeader>
      <div className="max-w-3xl grid md:grid-cols-2 gap-4">
        {([
          ["Merchant Name", "name"], ["Business Name", "businessName"], ["Email", "email"],
          ["Mobile", "phone"], ["PAN", "pan"], ["GSTIN", "gst"],
        ] as const).map(([label, k]) => (
          <label key={k} className="text-sm">
            <span className="text-xs text-muted-foreground">{label}</span>
            <input
              value={(p as Record<string, string>)[k]}
              onChange={(e) => setP({ ...p, [k]: e.target.value })}
              className="mt-1 w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
            />
          </label>
        ))}
        <label className="text-sm md:col-span-2">
          <span className="text-xs text-muted-foreground">Address</span>
          <textarea
            value={p.address}
            onChange={(e) => setP({ ...p, address: e.target.value })}
            className="mt-1 w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
            rows={3}
          />
        </label>
        <div className="md:col-span-2 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">KYC Status:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">{p.kyc}</span>
        </div>
      </div>
    </div>
  );
}