import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, CheckCircle2, FileCheck2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar, FilterField } from "@/components/dashboard/FilterBar";
import { SETTLEMENTS, fmtTime, fmtDate, inr, downloadCSV } from "@/lib/data/mock";

export const Route = createFileRoute("/settlements")({
  head: () => ({ meta: [{ title: "Settlements — paytmm lite" }] }),
  component: SettlementsPage,
});

function SettlementsPage() {
  const [search, setSearch] = useState("");
  const rows = useMemo(
    () => SETTLEMENTS.filter((s) => !search || s.utr.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof rows>();
    for (const s of rows) {
      const key = fmtDate(s.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries());
  }, [rows]);

  return (
    <div>
      <PageHeader title="Settlements" />
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Enter Search Value"
        onDownload={() => downloadCSV("settlements.csv", rows)}
      >
        <FilterField label="Duration"><Select value="Today, 4 Jun" options={["Today, 4 Jun", "Last 7 Days", "This Month"]} /></FilterField>
      </FilterBar>

      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] text-[11px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border pb-3 px-4">
        <div>Time</div>
        <div>No. of Payments</div>
        <div>Collection Amount</div>
        <div>Deduction</div>
        <div className="text-right">Net Amount</div>
      </div>

      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileCheck2 className="h-10 w-10 text-foreground/70" />
          </div>
          <div className="text-sm text-muted-foreground">No settlements found for this duration</div>
        </div>
      )}
      {grouped.map(([date, list]) => (
        <div key={date}>
          <div className="text-xs font-bold py-4 px-4">{date}</div>
          {list.map((s) => (
            <Link
              to="/settlements/$id"
              params={{ id: s.id }}
              key={s.id}
              className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 hover:bg-muted/40 border-b border-border/60"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Settled at {fmtTime(s.settledAt)}</div>
                  <div className="text-xs text-muted-foreground">UTR: {s.utr}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-primary font-medium">{s.payments} Payments Received</div>
                <div className="text-xs text-muted-foreground">
                  {fmtDate(s.windowStart).split(" ").slice(0, 2).join(" ")}, {fmtTime(s.windowStart)} - {fmtTime(s.windowEnd)}
                </div>
              </div>
              <div className="text-sm">{inr(s.collection)}</div>
              <div className="text-sm">{inr(s.deduction)}</div>
              <div className="flex items-center justify-end gap-2 text-sm font-semibold">
                {inr(s.net)} <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

function Select({ value, options }: { value: string; options: string[] }) {
  return (
    <select defaultValue={value} className="bg-transparent border-b border-border py-1 pr-6 text-sm font-medium focus:outline-none focus:border-primary">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}