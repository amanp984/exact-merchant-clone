import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar, FilterField } from "@/components/dashboard/FilterBar";
import { inr } from "@/lib/data/mock";

export const Route = createFileRoute("/refunds")({
  head: () => ({ meta: [{ title: "Refunds — paytmm lite" }] }),
  component: RefundsPage,
});

function RefundsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  return (
    <div>
      <PageHeader title="Refunds" />
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search Refund/Order/RRN"
      >
        <FilterField label="Duration"><Select value="Today" options={["Today", "Yesterday", "This Week", "This Month"]} /></FilterField>
        <FilterField label="Status">
          <Select value={status} onChange={setStatus} options={["All", "Success", "Pending", "Failed"]} />
        </FilterField>
      </FilterBar>
      <div className="bg-muted/40 rounded-lg p-4 flex items-center justify-between mb-4">
        <div className="flex gap-12">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">Total Refund Amount</div>
            <div className="text-2xl font-bold mt-1">{inr(0)}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">Total Refund Transactions</div>
            <div className="text-2xl font-bold mt-1">0</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">Refund Count</div>
            <div className="text-2xl font-bold mt-1">0</div>
          </div>
        </div>
        <Button variant="outline" disabled>Bulk Refunds</Button>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <RotateCcw className="h-7 w-7" />
        </div>
        <div className="text-sm">No refunds available</div>
      </div>
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
