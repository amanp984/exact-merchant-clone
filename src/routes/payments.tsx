import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar, FilterField } from "@/components/dashboard/FilterBar";
import { DataTable, StatusPill } from "@/components/dashboard/DataTable";
import { PaymentDetailDrawer } from "@/components/dashboard/PaymentDetailDrawer";
import { Button } from "@/components/ui/button";
import { fmtDate, fmtTime, inr, downloadCSV } from "@/lib/data/mock";
import {
  useStore,
  addPayment,
  settleNow,
  availableForSettlement,
  isSameDay,
  type Payment,
} from "@/lib/store";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments — paytmm lite" }] }),
  component: PaymentsPage,
});

const RANGES = ["Today", "Yesterday", "This Week", "This Month", "All"];

function inRange(iso: string, range: string) {
  const d = new Date(iso);
  const now = new Date();
  if (range === "All") return true;
  if (range === "Today") return isSameDay(iso, now);
  if (range === "Yesterday") {
    const y = new Date(now); y.setDate(y.getDate() - 1);
    return isSameDay(iso, y);
  }
  if (range === "This Week") {
    const start = new Date(now); start.setDate(now.getDate() - 7);
    return d >= start;
  }
  if (range === "This Month") {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }
  return true;
}

function PaymentsPage() {
  const payments = useStore((s) => s.payments);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState("Today");
  const [selected, setSelected] = useState<Payment | null>(null);

  const rows = useMemo(() => {
    return payments.filter((p) => {
      if (!inRange(p.createdAt, range)) return false;
      if (status !== "All" && p.status !== status) return false;
      if (search && ![p.orderId, p.txnId, p.utr, p.customer].some((v) => v.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [payments, search, status, range]);

  const successRows = rows.filter((r) => r.status === "Success");
  const received = successRows.reduce((s, r) => s + r.amount, 0);
  const available = availableForSettlement();

  const handleSettle = () => {
    const s = settleNow();
    if (s) alert(`Settled ${inr(s.amount)} across ${s.transactionCount} transactions.\nUTR: ${s.utr}`);
    else alert("No unsettled payments to settle.");
  };

  const handleSimulate = () => {
    const amount = [500, 1000, 1500, 2000, 250][Math.floor(Math.random() * 5)];
    addPayment({ amount, smsSource: "HDFCBK" });
  };

  return (
    <div>
      <PageHeader title="Payments">
        <Button size="sm" variant="outline" onClick={handleSimulate}>
          <Plus className="h-4 w-4 mr-1.5" /> Simulate SMS Payment
        </Button>
      </PageHeader>
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Enter Search Value"
        onDownload={() =>
          downloadCSV("payments.csv", rows.map((r) => ({
            OrderID: r.orderId, TxnID: r.txnId, UTR: r.utr, Customer: r.customer,
            Amount: r.amount, Status: r.status, Method: r.method, Date: r.createdAt,
          })))
        }
      >
        <FilterField label="Duration">
          <Select value={range} onChange={setRange} options={RANGES} />
        </FilterField>
        <FilterField label="Status">
          <Select value={status} onChange={setStatus} options={["All", "Success", "Failed", "Pending", "Refunded"]} />
        </FilterField>
      </FilterBar>
      <div className="bg-muted/30 rounded-lg px-6 py-5 grid grid-cols-1 md:grid-cols-[1fr_28px_1fr_28px_1fr_auto] items-center gap-x-3 mb-6">
        <KPI label={`${successRows.length} Payment Received`} value={inr(received)} />
        <Op>−</Op>
        <KPI label="Deductions" value={inr(0)} />
        <Op>=</Op>
        <KPI label="Available for Settlement" value={inr(available)} />
        <Button
          size="sm"
          className="md:ml-4"
          disabled={available === 0}
          onClick={handleSettle}
        >
          Settle Now
        </Button>
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
        onRowClick={(r) => setSelected(r)}
        columns={[
          { key: "orderId", label: "Order ID", render: (r) => <span className="font-medium text-primary">{r.orderId}</span> },
          { key: "txnId", label: "Transaction ID", render: (r) => <span className="font-mono text-xs">{r.txnId}</span> },
          { key: "utr", label: "UTR Number", render: (r) => <span className="font-mono text-xs">{r.utr}</span> },
          { key: "customer", label: "Customer Name", render: (r) => r.customer },
          { key: "method", label: "Payment Method", render: (r) => r.method },
          { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
          { key: "date", label: "Date & Time", render: (r) => <div className="text-xs"><div>{fmtDate(r.createdAt)}</div><div className="text-muted-foreground">{fmtTime(r.createdAt)}</div></div> },
          { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-semibold">{inr(r.amount)}</span> },
        ]}
      />
      )}
      <PaymentDetailDrawer payment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
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
