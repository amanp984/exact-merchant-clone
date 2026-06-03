import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/developer-settings")({
  component: () => (
    <div>
      <PageHeader title="Developer Settings" />
      <div className="space-y-4 max-w-3xl">
        {[
          { k: "API Keys", v: "pk_live_••••••••••••3a91" },
          { k: "Webhook URL", v: "https://yourdomain.com/api/webhook" },
          { k: "Test Mode", v: "Disabled" },
        ].map((r) => (
          <div key={r.k} className="flex items-center justify-between border border-border rounded-lg p-4 bg-card">
            <div>
              <div className="text-sm font-semibold">{r.k}</div>
              <div className="text-xs text-muted-foreground mt-0.5 font-mono">{r.v}</div>
            </div>
            <Button size="sm" variant="outline">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  ),
});