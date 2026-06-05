import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusPill } from "@/components/dashboard/DataTable";
import { inr, fmtDate, fmtTime } from "@/lib/data/mock";
import type { Payment } from "@/lib/store";
import { useStore } from "@/lib/store";

export function PaymentDetailDrawer({
  payment,
  onClose,
}: {
  payment: Payment | null;
  onClose: () => void;
}) {
  const settlements = useStore((s) => s.settlements);
  const settlement = payment?.settlementId
    ? settlements.find((s) => s.id === payment.settlementId)
    : null;

  return (
    <Sheet open={!!payment} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
        {payment && (
          <div>
            <div className="bg-gradient-to-br from-sky-50 to-white p-6 border-b border-border">
              <SheetHeader>
                <SheetTitle className="text-sm font-medium text-muted-foreground">
                  Amount Received
                </SheetTitle>
              </SheetHeader>
              <div className="text-3xl font-bold mt-1">{inr(payment.amount)}</div>
              <div className="mt-2 text-sm font-medium">{payment.customer}</div>
              <div className="mt-1"><StatusPill status={payment.status} /></div>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <Row label="UTR Number" value={payment.utr} mono />
              <Row label="Transaction ID" value={payment.txnId} mono />
              <Row label="Order ID" value={payment.orderId} mono />
              <Row label="Reference ID" value={payment.referenceId} mono />
              <Row label="Payment Method" value={payment.method} />
              <Row label="Date" value={fmtDate(payment.createdAt)} />
              <Row label="Time" value={fmtTime(payment.createdAt)} />
              <Row label="Created At" value={new Date(payment.createdAt).toLocaleString("en-IN")} />
              <div className="border-t border-border pt-4">
                <Row
                  label="Settlement Status"
                  value={payment.isSettled ? "Settled" : "Unsettled"}
                />
                {settlement && (
                  <>
                    <Row label="Settlement Date" value={fmtDate(settlement.date)} />
                    <Row label="Settlement UTR" value={settlement.utr} mono />
                  </>
                )}
                <Row label="Account Credited" value={payment.accountCredited} />
                <Row
                  label="SMS Source"
                  value={payment.smsSource ?? "—"}
                />
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
