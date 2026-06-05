import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, CheckCircle2, FileCheck2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar, FilterField } from "@/components/dashboard/FilterBar";
import { fmtTime, fmtDate, inr, downloadCSV } from "@/lib/data/mock";
import { useStore, isSameDay } from "@/lib/store";

export const Route = createFileRoute("/settlements")({
  head: () => ({ meta: [{ title: "Settlements — paytmm lite" }] }),
  component: SettlementsPage,
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

function SettlementsPage() {
  const settlements = useStore((s) => s.settlements);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Today");

  const rows = useMemo(
    () =>
      settlements.filter(
        (s) =>
          inRange(s.date, range) &&
          (!search || s.utr.toLowerCase().includes(search.toLowerCase()))
      ),
    [settlements, search, range]
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
        <FilterField label="Duration">
          <Select value={range} onChange={setRange} options={RANGES} />
        </FilterField>
      </FilterBar>

      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] text-[11px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border pb-3 px-4">
        <div>Settlement Time</div>
        <div>Payment Count</div>
        <div>Status</div>
        <div className="text-right">Settlement Amount</div>
      </div>

      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileCheck2 className="h-10 w-10 text-foreground/70" />
          </div>
          <div className="text-sm text-muted-foreground">
            No settlements found for {range.toLowerCase()}
          </div>
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
              className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center px-4 py-4 hover:bg-muted/40 border-b border-border/60"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Settled at {fmtTime(s.date)}</div>
                  <div className="text-xs text-muted-foreground font-mono">UTR: {s.utr}</div>
                </div>
              </div>
              <div className="text-sm text-primary font-medium">
                {s.transactionCount} Payments
              </div>
              <div className="text-sm">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  {s.status}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 text-sm font-semibold">
                {inr(s.amount)} <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      ))}
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
