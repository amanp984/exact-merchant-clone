import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { MERCHANT, inr, fmtDate, downloadCSV } from "@/lib/data/mock";

export const Route = createFileRoute("/invoices")({
  head: () => ({ meta: [{ title: "Invoices — PAYTMM LITE" }] }),
  component: InvoicesPage,
});

interface Invoice { id: string; customer: string; amount: number; gst: number; date: string; }

function InvoicesPage() {
  const [list, setList] = useState<Invoice[]>(() =>
    Array.from({ length: 6 }).map((_, i) => ({
      id: `INV-2026-${String(1000 + i)}`,
      customer: ["Acme Corp", "Globex", "Initech", "Hooli", "Umbrella", "Wayne Ent."][i % 6],
      amount: 1500 + i * 432,
      gst: 18,
      date: new Date(Date.now() - i * 86400000).toISOString(),
    }))
  );

  const add = () => {
    const i = list.length;
    setList([
      { id: `INV-2026-${String(1000 + i)}`, customer: "New Customer", amount: 999, gst: 18, date: new Date().toISOString() },
      ...list,
    ]);
  };

  return (
    <div>
      <PageHeader title="Invoices">
        <Button variant="outline" onClick={() => downloadCSV("invoices.csv", list)}><Download className="h-4 w-4 mr-1.5" /> Export</Button>
        <Button onClick={add}>Generate Invoice</Button>
      </PageHeader>
      <DataTable
        rows={list}
        columns={[
          { key: "id", label: "Invoice #", render: (r) => <span className="text-primary font-medium">{r.id}</span> },
          { key: "merchant", label: "Merchant", render: () => MERCHANT.businessName },
          { key: "customer", label: "Customer", render: (r) => r.customer },
          { key: "amount", label: "Amount", render: (r) => inr(r.amount) },
          { key: "gst", label: "GST", render: (r) => `${r.gst}%` },
          { key: "date", label: "Date", render: (r) => fmtDate(r.date) },
          { key: "action", label: "", align: "right", render: () => (
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-1.5" /> PDF
            </Button>
          ) },
        ]}
      />
    </div>
  );
}