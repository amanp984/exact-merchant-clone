import { createFileRoute } from "@tanstack/react-router";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MERCHANT } from "@/lib/data/mock";

export const Route = createFileRoute("/my-qr-code")({
  head: () => ({ meta: [{ title: "My QR Code — PAYTMM LITE" }] }),
  component: QRPage,
});

function QRPage() {
  const upi = `paytmm.${MERCHANT.mid.slice(-8).toLowerCase()}@pty`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=0&data=${encodeURIComponent(
    `upi://pay?pa=${upi}&pn=${encodeURIComponent(MERCHANT.name)}&cu=INR`
  )}`;
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">My QR Code</h1>
      <div className="bg-muted/30 rounded-2xl p-6 md:p-10 grid md:grid-cols-[420px_1fr] gap-8">
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="bg-[hsl(195_100%_55%)] p-3">
            <div className="bg-white rounded-lg p-4 flex flex-col items-center">
              <div className="text-primary font-extrabold text-xl leading-none">PAYTMM</div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-foreground">LITE</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">Accepted Here</div>
              <img src={qrUrl} alt="UPI QR" className="my-4 w-64 h-64" />
              <div className="text-xs text-muted-foreground">UPI ID: {upi}</div>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-bold tracking-wide text-primary">
                <span>BHIM</span><span>|</span><span>UPI</span>
              </div>
            </div>
          </div>
          <div className="bg-card p-5 text-center">
            <div className="font-bold">{MERCHANT.name}</div>
            <div className="text-sm text-muted-foreground mt-1">{MERCHANT.phone}</div>
          </div>
        </div>
        <div>
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div>
              <div className="text-xs text-muted-foreground">QR Display Name</div>
              <div className="text-lg font-semibold mt-1">{MERCHANT.name}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1.5" /> Print</Button>
              <Button onClick={() => window.open(qrUrl, "_blank")}><Download className="h-4 w-4 mr-1.5" /> Download QR code</Button>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">QR Code Details</div>
              <button className="text-sm text-primary font-semibold">Edit QR detail</button>
            </div>
            <div className="border border-border rounded-lg divide-y divide-border">
              <Row k="Display Name" v={MERCHANT.name} />
              <Row k="POS ID" v="DEFAULT" />
              <Row k="UPI ID" v={upi} />
              <Row k="Mobile" v={MERCHANT.phone} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="text-sm font-semibold">{v}</span>
    </div>
  );
}