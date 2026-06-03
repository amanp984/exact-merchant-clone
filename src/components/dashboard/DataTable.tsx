import { cn } from "@/lib/utils";

export function DataTable<T>({
  columns, rows, onRowClick, empty,
}: {
  columns: { key: string; label: string; render: (r: T) => React.ReactNode; align?: "left" | "right" }[];
  rows: T[];
  onRowClick?: (r: T) => void;
  empty?: React.ReactNode;
}) {
  if (!rows.length) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        {empty ?? "No records found"}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            {columns.map((c) => (
              <th key={c.key} className={cn("py-3 px-4", c.align === "right" ? "text-right" : "text-left")}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(r)}
              className={cn("border-b border-border/60 hover:bg-muted/40", onRowClick && "cursor-pointer")}
            >
              {columns.map((c) => (
                <td key={c.key} className={cn("py-3.5 px-4", c.align === "right" ? "text-right" : "text-left")}>
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Success: "bg-emerald-100 text-emerald-700",
    Settled: "bg-emerald-100 text-emerald-700",
    Online: "bg-emerald-100 text-emerald-700",
    Won: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Degraded: "bg-amber-100 text-amber-700",
    Open: "bg-blue-100 text-blue-700",
    Failed: "bg-rose-100 text-rose-700",
    Lost: "bg-rose-100 text-rose-700",
    Down: "bg-rose-100 text-rose-700",
    Refunded: "bg-violet-100 text-violet-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", map[status] ?? "bg-muted text-foreground")}>
      {status}
    </span>
  );
}