import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Mail, Download, Link2, Settings as Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useFilesDownload } from "@/components/layout/FilesToDownload";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports & Invoices — paytmm lite" }] }),
  component: ReportsPage,
});

const TABS = ["Payment", "Refund", "Settlement", "Dispute", "Balance Statement", "Ledger"] as const;
type Tab = (typeof TABS)[number];

const RECENT = [
  { date: "04 Jun 2026", type: "Payment Report", sub: "Success payments", duration: "04 Jun 2026" },
  { date: "04 Jun 2026", type: "Payment Report", sub: "All payments", duration: "03 Jun 2026" },
  { date: "03 Jun 2026", type: "Settlement Report", sub: "Daily settlement", duration: "01 Jun 2026 - 03 Jun 2026" },
  { date: "02 Jun 2026", type: "Refund Report", sub: "Customer refunds", duration: "May 2026" },
];

function ReportsPage() {
  const [tab, setTab] = useState<Tab>("Payment");
  const { add } = useFilesDownload();
  return (
    <div>
      <PageHeader title="Reports" />
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        <ul className="border-r border-border pr-2">
          {TABS.map((t) => (
            <li key={t}>
              <button
                onClick={() => setTab(t)}
                className={`w-full flex items-center justify-between text-left px-4 py-3.5 text-sm font-medium border-l-[3px] ${
                  tab === t
                    ? "border-primary text-primary bg-accent/40"
                    : "border-transparent text-foreground hover:bg-muted/40"
                }`}
              >
                {t} <ChevronRight className="h-4 w-4 opacity-60" />
              </button>
            </li>
          ))}
        </ul>
        <div>
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-xl font-bold">{tab} Reports</h2>
            <button className="text-sm text-primary inline-flex items-center gap-1.5 hover:underline">
              <Cog className="h-4 w-4" /> Select Download Fields
            </button>
          </div>
          <p className="text-sm text-amber-600 font-medium mb-2">Please note:</p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 mb-6">
            <li>
              Data Available for 12 months: <strong className="text-foreground">5 Jun&apos; 25 - Today</strong>. Max Duration in a Single Report: <strong className="text-foreground">1 month</strong>
            </li>
          </ul>
          <div className="grid grid-cols-3 gap-6 mb-4">
            <Field label="Duration of Collections" value="Today, 4 Jun" />
            <Field label={tab === "Payment" ? "Payment Status" : "Status"} value="Success" />
            <Field label="Report Format" value="Excel (Detailed Report)" />
          </div>
          <button className="text-sm text-primary font-medium mb-6 hover:underline">+ Add Multiple Filters</button>
          <div className="flex gap-3 mb-10">
            <Button
              onClick={() => add(`${tab} Report`)}
              className="rounded-md"
            >
              Generate Report
            </Button>
            <Button variant="outline" className="rounded-md">
              <Mail className="h-4 w-4 mr-1.5" /> Send to Email
            </Button>
          </div>

          <h3 className="text-lg font-bold mb-3">Recently Generated Reports</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1.2fr_1.4fr_1.2fr_120px] text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3 bg-muted/30">
              <div>Report Generation Date</div>
              <div>Report Type</div>
              <div>Duration</div>
              <div className="text-right">Actions</div>
            </div>
            {RECENT.map((r, i) => (
              <div key={i} className="grid grid-cols-[1.2fr_1.4fr_1.2fr_120px] items-center px-5 py-4 border-t border-border/60 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {r.date}
                </div>
                <div>
                  <div className="text-primary font-medium">{r.type}</div>
                  <div className="text-xs text-muted-foreground">{r.sub}</div>
                </div>
                <div className="text-muted-foreground">{r.duration}</div>
                <div className="flex items-center justify-end gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 hover:text-primary cursor-pointer" />
                  <Download className="h-4 w-4 hover:text-primary cursor-pointer" />
                  <Link2 className="h-4 w-4 hover:text-primary cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{label}</div>
      <select defaultValue={value} className="mt-1 w-full bg-transparent border-b border-border py-1.5 text-sm font-medium focus:outline-none focus:border-primary">
        <option>{value}</option>
      </select>
    </div>
  );
}