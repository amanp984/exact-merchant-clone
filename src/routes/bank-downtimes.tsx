import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, StatusPill } from "@/components/dashboard/DataTable";
import { BANK_DOWNTIMES, fmtTime } from "@/lib/data/mock";

export const Route = createFileRoute("/bank-downtimes")({
  head: () => ({ meta: [{ title: "Bank Downtimes — paytmm lite" }] }),
  component: () => (
    <div>
      <PageHeader title="Bank Downtimes" />
      <DataTable
        rows={BANK_DOWNTIMES}
        columns={[
          { key: "bank", label: "Bank", render: (r) => <span className="font-medium">{r.bank}</span> },
          { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
          { key: "updated", label: "Last Updated", render: (r) => fmtTime(r.lastUpdated) },
        ]}
      />
    </div>
  ),
});
