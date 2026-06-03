import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar, FilterField } from "@/components/dashboard/FilterBar";
import { DataTable, StatusPill } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { DISPUTES, fmtDate, inr, downloadCSV } from "@/lib/data/mock";

export const Route = createFileRoute("/disputes")({
  head: () => ({ meta: [{ title: "Disputes — paytmm lite" }] }),
  component: DisputesPage,
});

function DisputesPage() {
  const [tab, setTab] = useState<"All" | "Open" | "Won" | "Lost" | "Pending">("All");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => DISPUTES.filter((d) => {
    if (tab !== "All" && d.status !== tab) return false;
    if (search && ![d.id, d.txnId, d.customer].some((v) => v.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  }), [tab, search]);

  return (
    <div>
      <PageHeader title="Disputes" />
      <div className="flex gap-1 mb-4 border-b border-border">
        {(["All", "Open", "Won", "Lost", "Pending"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t} {t !== "All" && <span className="text-xs">({DISPUTES.filter((d) => d.status === t).length})</span>}
          </button>
        ))}
      </div>
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search dispute ID"
        onDownload={() => downloadCSV("disputes.csv", rows)}
      >
        <FilterField label="Duration"><Select value="This Month" options={["Today", "This Week", "This Month"]} /></FilterField>
      </FilterBar>
      <DataTable
        rows={rows}
        columns={[
          { key: "id", label: "Dispute ID", render: (r) => <span className="text-primary font-medium">{r.id}</span> },
          { key: "txnId", label: "Transaction ID", render: (r) => r.txnId },
          { key: "customer", label: "Customer", render: (r) => r.customer },
          { key: "reason", label: "Reason", render: (r) => r.reason },
          { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
          { key: "createdAt", label: "Created", render: (r) => fmtDate(r.createdAt) },
          { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-semibold">{inr(r.amount)}</span> },
          { key: "action", label: "", render: () => <Button size="sm" variant="outline">Respond</Button> },
        ]}
      />
    </div>
  );
}

function Select({ value, options }: { value: string; options: string[] }) {
  return (
    <select defaultValue={value} className="bg-transparent border-b border-border py-1 pr-6 text-sm font-medium focus:outline-none focus:border-primary">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}