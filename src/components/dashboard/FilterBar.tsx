import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FilterBar({
  children, onDownload, search, onSearch, searchPlaceholder = "Enter Search Value",
}: {
  children?: React.ReactNode;
  onDownload?: () => void;
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4 pb-4 border-b border-border mb-4">
      <div className="flex flex-wrap gap-6 flex-1">{children}</div>
      <div className="flex items-center gap-2">
        {onDownload && (
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1.5" /> Download
          </Button>
        )}
        {onSearch && (
          <div className="relative">
            <Input
              value={search ?? ""}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="pr-9 h-9 w-56"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}

export function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-[8rem]">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{label}</span>
      {children}
    </div>
  );
}