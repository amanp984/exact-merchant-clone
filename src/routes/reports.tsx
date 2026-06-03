import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PAYMENTS, SETTLEMENTS, REFUNDS, downloadCSV } from "@/lib/data/mock";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports & Invoices — paytmm lite" }] }),
  component: ReportsPage,
});

const REPORTS = [
  { name: "Payments Report", desc: "All successful, failed and pending payments", get: () => PAYMENTS },
  { name: "Settlement Report", desc: "Daily settlement breakdown with charges", get: () => SETTLEMENTS },
  { name: "Refunds Report", desc: "Initiated and processed refunds", get: () => REFUNDS },
  { name: "GST Report", desc: "GST collected and remitted (last 3 months)", get: () => SETTLEMENTS.map((s) => ({ utr: s.utr, gst: Math.round(s.deduction * 0.18), date: s.date })) },
];

function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports & Invoices" />
      <div className="grid md:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <div key={r.name} className="border border-border rounded-xl p-5 bg-card hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{r.desc}</div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => downloadCSV(`${r.name}.csv`, r.get() as Record<string, unknown>[])}>
                    <Download className="h-4 w-4 mr-1" /> CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadCSV(`${r.name}.xls`, r.get() as Record<string, unknown>[])}>
                    Excel
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.print()}>PDF</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-10 mb-4">Invoice Generator</h2>
      <div className="border border-border rounded-xl p-6 bg-card grid md:grid-cols-2 gap-4">
        {["Merchant Name", "Customer Name", "GSTIN", "Amount", "Tax %", "Invoice Number"].map((f) => (
          <label key={f} className="text-sm">
            <span className="text-muted-foreground text-xs">{f}</span>
            <input className="mt-1 w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary" />
          </label>
        ))}
        <div className="md:col-span-2">
          <Button onClick={() => window.print()}>Generate PDF Invoice</Button>
        </div>
      </div>
    </div>
  );
}