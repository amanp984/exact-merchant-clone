import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Mail, Download } from "lucide-react";

type FileEntry = { id: string; name: string; ts: string };
type Ctx = { files: FileEntry[]; add: (name: string) => void };

const FilesCtx = createContext<Ctx | null>(null);

export function FilesToDownloadProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileEntry[]>([
    { id: "f1", name: "Transaction", ts: "Jun 4, 2026 10:23 PM" },
    { id: "f2", name: "Transaction", ts: "Jun 4, 2026 10:23 PM" },
    { id: "f3", name: "Transaction", ts: "Jun 4, 2026  6:31 PM" },
  ]);
  const add = useCallback((name: string) => {
    setFiles((p) => [{ id: crypto.randomUUID(), name, ts: new Date().toLocaleString("en-IN") }, ...p].slice(0, 8));
  }, []);
  return <FilesCtx.Provider value={{ files, add }}>{children}<FilesWidget /></FilesCtx.Provider>;
}

export function useFilesDownload() {
  const ctx = useContext(FilesCtx);
  if (!ctx) return { files: [] as FileEntry[], add: () => {} };
  return ctx;
}

function FilesWidget() {
  const { files } = useFilesDownload();
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-0 right-6 z-40 w-80 bg-primary text-primary-foreground rounded-t-lg shadow-xl overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 font-semibold text-sm">
        Files to Download
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
      {open && (
        <div className="bg-card text-foreground max-h-72 overflow-y-auto">
          {files.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground text-center">No files yet</div>}
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <div>
                <div className="text-sm font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.ts}</div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 hover:text-primary cursor-pointer" />
                <Download className="h-4 w-4 hover:text-primary cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}