import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar, FilterField } from "@/components/dashboard/FilterBar";
import { DataTable, StatusPill } from "@/components/dashboard/DataTable";
import { REFUNDS, fmtDate, inr, downloadCSV } from "@/lib/data/mock";

export const Route = createFileRoute("/refunds")({
  head: () => ({ meta: [{ title: "Refunds — paytmm lite" }] }),
  component: RefundsPage,
});

function RefundsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Success");
  const [sub, setSub] = useState("All");

  const rows = useMemo(() => REFUNDS.filter((r) => {
    if (status !== "All" && r.status !== status) return false;
    if (sub !== "All" && r.subStatus !== sub) return false;
    if (search && ![r.id, r.orderId, r.txnId, r.rrn, r.customer].some((v) => v.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  }), [search, status, sub]);

  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <PageHeader title="Refunds" />
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search Refund/Order/RRN"
        onDownload={() => downloadCSV("refunds.csv", rows)}
      >
        <FilterField label="Duration"><Select value="Today, 3 Jun" options={["Today, 3 Jun", "Last 7 Days", "This Month"]} /></FilterField>
        <FilterField label="Status">
          <Select value={status} onChange={setStatus} options={["All", "Success", "Pending", "Failed"]} />
        </FilterField>
        <FilterField label="Sub-Status">
          <Select value={sub} onChange={setSub} options={["All", "Initiated", "Processed", "Bank Approved", "Customer Refunded"]} />
        </FilterField>
      </FilterBar>
      <div className="bg-muted/40 rounded-lg p-4 flex items-center justify-between mb-4">
        <div className="flex gap-12">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">Total Refund Amount</div>
            <div className="text-2xl font-bold mt-1">{inr(total)}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">Total Refund Transactions</div>
            <div className="text-2xl font-bold mt-1">{rows.length}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Bulk Refunds</Button>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <RotateCcw className="h-7 w-7" />
          </div>
          <div className="text-sm">No refunds available</div>
        </div>
      ) : (
        <DataTable
          rows={rows}
          columns={[
            { key: "id", label: "Refund ID", render: (r) => <span className="text-primary font-medium">{r.id}</span> },
            { key: "orderId", label: "Order ID", render: (r) => r.orderId },
            { key: "txnId", label: "Txn ID", render: (r) => r.txnId },
            { key: "rrn", label: "RRN", render: (r) => r.rrn },
            { key: "customer", label: "Customer", render: (r) => r.customer },
            { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
            { key: "subStatus", label: "Sub-Status", render: (r) => <span className="text-xs">{r.subStatus}</span> },
            { key: "date", label: "Date", render: (r) => fmtDate(r.date) },
            { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-semibold">{inr(r.amount)}</span> },
          ]}
        />
      )}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange?: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="bg-transparent border-b border-border py-1 pr-6 text-sm font-medium focus:outline-none focus:border-primary"
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}