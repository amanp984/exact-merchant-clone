import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  const [status, setStatus] = useState("All");
  const [method, setMethod] = useState("All");

  const rows = useMemo(() => {
    return PAYMENTS.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (method !== "All" && p.method !== method) return false;
      if (search && ![p.orderId, p.txnId, p.utr, p.customer].some((v) => v.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [search, status, method]);

  const received = rows.reduce((s, r) => s + (r.status === "Success" ? r.amount : 0), 0);
  const deductions = Math.round(received * 0.0);
  const net = received - deductions;
  const settled = Math.round(net * 1);
  const available = net - settled;

  return (
    <div>
      <PageHeader title="Payments" />
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search Order/Txn/UTR"
        onDownload={() =>
          downloadCSV("payments.csv", rows.map((r) => ({
            OrderID: r.orderId, TxnID: r.txnId, UTR: r.utr, Customer: r.customer,
            Amount: r.amount, Status: r.status, Method: r.method, Date: r.date,
          })))
        }
      >
        <FilterField label="Duration"><Select value="Last 30 Days" options={["Today", "Yesterday", "This Week", "This Month", "Last 30 Days"]} /></FilterField>
        <FilterField label="Status">
          <Select value={status} onChange={setStatus} options={["All", "Success", "Failed", "Pending", "Refunded"]} />
        </FilterField>
        <FilterField label="Payment Method">
          <Select value={method} onChange={setMethod} options={["All", "UPI", "QR", "Card", "Net Banking", "Wallet"]} />
        </FilterField>
      </FilterBar>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_24px_1fr_24px_1fr_24px_1fr_24px_1fr] items-center gap-x-2 mb-6">
        <KPI label={`${rows.filter(r=>r.status==="Success").length} Payments Received`} value={inr(received)} />
        <Op>−</Op>
        <KPI label="Deductions" value={inr(deductions)} />
        <Op>=</Op>
        <KPI label="Net Settlement" value={inr(net)} link="View Detail" highlight />
        <Op>−</Op>
        <KPI label="Settlements" value={inr(settled)} />
        <Op>=</Op>
        <KPI label="Available for Settlement" value={inr(available)} link="Settle Now" />
      </div>
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
    </div>
  );
}

function KPI({ label, value, link, highlight }: { label: string; value: string; link?: string; highlight?: boolean }) {
  return (
    <div className="py-2">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={`mt-1 text-xl font-bold ${highlight ? "text-foreground" : ""}`}>{value}</div>
      {link && <button className="text-xs text-primary hover:underline mt-0.5">{link}</button>}
    </div>
  );
}

function Op({ children }: { children: React.ReactNode }) {
  return <div className="hidden md:flex justify-center text-muted-foreground text-lg font-light">{children}</div>;
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