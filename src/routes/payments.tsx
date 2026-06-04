import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar, FilterField } from "@/components/dashboard/FilterBar";
import { DataTable, StatusPill } from "@/components/dashboard/DataTable";
import { PAYMENTS, fmtDate, fmtTime, inr, downloadCSV } from "@/lib/data/mock";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments — paytmm lite" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Success");
  const [method] = useState("All");

  const rows = useMemo(() => {
    return PAYMENTS.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (method !== "All" && p.method !== method) return false;
      if (search && ![p.orderId, p.txnId, p.utr, p.customer].some((v) => v.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [search, status, method]);

  const successRows = rows.filter((r) => r.status === "Success");
  const received = successRows.reduce((s, r) => s + r.amount, 0);
  const deductions = Math.round(received * 0.02);
  const available = received - deductions;

  return (
    <div>
      <PageHeader title="Payments" />
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Enter Search Value"
        onDownload={() =>
          downloadCSV("payments.csv", rows.map((r) => ({
            OrderID: r.orderId, TxnID: r.txnId, UTR: r.utr, Customer: r.customer,
            Amount: r.amount, Status: r.status, Method: r.method, Date: r.date,
          })))
        }
      >
        <FilterField label="Duration"><Select value="Today, 4 Jun" options={["Today, 4 Jun", "Yesterday", "This Week", "This Month", "Last 30 Days"]} /></FilterField>
        <FilterField label="Status">
          <Select value={status} onChange={setStatus} options={["All", "Success", "Failed", "Pending", "Refunded"]} />
        </FilterField>
      </FilterBar>
      <div className="bg-muted/30 rounded-lg px-6 py-5 grid grid-cols-1 md:grid-cols-[1fr_28px_1fr_28px_1fr_auto] items-center gap-x-3 mb-6">
        <KPI label={`${successRows.length} Payment Received`} value={inr(received)} />
        <Op>−</Op>
        <KPI label="Deductions" value={inr(deductions)} />
        <Op>=</Op>
        <KPI label="Available for Settlement" value={inr(available)} link="Settle Now" highlight />
        <a href="#" className="text-sm text-primary font-semibold md:ml-4">View Detail</a>
      </div>
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <ArrowLeftRight className="h-10 w-10 text-foreground/70" />
          </div>
          <div className="text-sm text-muted-foreground">No payments available for this duration</div>
        </div>
      ) : (
      <DataTable
        rows={rows}
        columns={[
          { key: "orderId", label: "Order ID", render: (r) => <span className="font-medium text-primary">{r.orderId}</span> },
          { key: "txnId", label: "Transaction ID", render: (r) => r.txnId },
          { key: "customer", label: "Customer", render: (r) => r.customer },
          { key: "method", label: "Method", render: (r) => r.method },
          { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
          { key: "date", label: "Date", render: (r) => <div className="text-xs"><div>{fmtDate(r.date)}</div><div className="text-muted-foreground">{fmtTime(r.date)}</div></div> },
          { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-semibold">{inr(r.amount)}</span> },
        ]}
      />
      )}
    </div>
  );
}

function KPI({ label, value, link, highlight }: { label: string; value: string; link?: string; highlight?: boolean }) {
  return (
    <div className="py-1">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${highlight ? "text-foreground" : ""}`}>{value}</div>
      {link && <button className="text-xs text-primary hover:underline mt-0.5">{link}</button>}
    </div>
  );
}

function Op({ children }: { children: React.ReactNode }) {
  return <div className="hidden md:flex justify-center items-center"><span className="h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center text-sm">{children}</span></div>;
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