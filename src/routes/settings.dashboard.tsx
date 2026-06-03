import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings/dashboard")({
  component: () => (
    <div>
      <PageHeader title="Dashboard Settings" />
      <div className="max-w-2xl space-y-6">
        <Field label="Theme">
          <select className="border border-border rounded-md px-3 py-2 text-sm w-full"><option>Light</option><option>System</option></select>
        </Field>
        <Field label="Notifications">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Email me on new settlement</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Email me on failed payment</label>
        </Field>
        <Field label="Change Password">
          <input type="password" placeholder="Current password" className="border border-border rounded-md px-3 py-2 text-sm w-full mb-2" />
          <input type="password" placeholder="New password" className="border border-border rounded-md px-3 py-2 text-sm w-full" />
        </Field>
        <Button>Save Settings</Button>
      </div>
    </div>
  ),
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{label}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}