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