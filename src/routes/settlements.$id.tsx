import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SETTLEMENTS, PAYMENTS, fmtDate, fmtTime, inr } from "@/lib/data/mock";
import { DataTable, StatusPill } from "@/components/dashboard/DataTable";

export const Route = createFileRoute("/settlements/$id")({
  component: SettlementDetail,
  notFoundComponent: () => <div>Settlement not found.</div>,
});

function SettlementDetail() {
  const { id } = Route.useParams();
  const s = SETTLEMENTS.find((x) => x.id === id);
  if (!s) return <div>Settlement not found.</div>;
  const txns = PAYMENTS.filter((p) => p.status === "Success").slice(0, s.payments);

  return (
    <div className="space-y-6">
      <Link to="/settlements" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Settlements
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settlement {s.id.toUpperCase()}</h1>
          <p className="text-sm text-muted-foreground">UTR: {s.utr}</p>
        </div>
        <Button onClick={() => window.print()} variant="outline"><Download className="h-4 w-4 mr-1.5" /> Download PDF</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Settlement Date" value={fmtDate(s.date)} />
        <Stat label="Collection Amount" value={inr(s.collection)} />
        <Stat label="Charges + GST" value={inr(s.deduction)} />
        <Stat label="Net Settlement" value={inr(s.net)} highlight />
      </div>
      <div className="border border-border rounded-2xl bg-card">
        <div className="p-4 border-b border-border font-semibold">Transactions Included ({txns.length})</div>
        <DataTable
          rows={txns}
          columns={[
            { key: "orderId", label: "Order ID", render: (r) => <span className="text-primary">{r.orderId}</span> },
            { key: "txnId", label: "Txn ID", render: (r) => r.txnId },
            { key: "customer", label: "Customer", render: (r) => r.customer },
            { key: "method", label: "Method", render: (r) => r.method },
            { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
            { key: "date", label: "Time", render: (r) => fmtTime(r.date) },
            { key: "amount", label: "Amount", align: "right", render: (r) => inr(r.amount) },
          ]}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border p-4 bg-card">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className={`mt-1.5 text-xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}

