import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Download, Landmark, IndianRupee, RotateCcw, ChevronDown } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Cell, PieChart, Pie, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { MERCHANT, inr, downloadCSV } from "@/lib/data/mock";
import { useStore, isSameDay } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home — paytmm lite" }] }),
  component: Home,
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

function Home() {
  const [range, setRange] = useState(RANGES[0]);
  const payments = useStore((s) => s.payments);
  const settlements = useStore((s) => s.settlements);

  const totals = useMemo(() => {
    const pay = payments.filter((p) => p.status === "Success" && inRange(p.createdAt, range));
    const set = settlements.filter((s) => inRange(s.date, range));
    return {
      payAmount: pay.reduce((s, p) => s + p.amount, 0),
      payCount: pay.length,
      settle: set.reduce((s, p) => s + p.amount, 0),
      settleCount: set.length,
      lastSettle: settlements[0]?.date ?? null,
      refundAmount: 0,
      refundCount: 0,
    };
  }, [payments, settlements, range]);

  const chartData = useMemo(() => {
    const days: { day: string; amount: number; count: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      const dayPays = payments.filter((p) => p.status === "Success" && isSameDay(p.createdAt, d));
      days.push({
        day: label,
        amount: dayPays.reduce((s, p) => s + p.amount, 0),
        count: dayPays.length,
      });
    }
    return days;
  }, [payments]);

  const sources = [
    { name: "UPI", value: 58, amount: 5840, color: "hsl(210 90% 55%)" },
    { name: "QR", value: 18, amount: 1810, color: "hsl(160 70% 45%)" },
    { name: "Card", value: 12, amount: 1240, color: "hsl(280 70% 55%)" },
    { name: "Net Banking", value: 8, amount: 820, color: "hsl(40 90% 55%)" },
    { name: "Wallet", value: 4, amount: 410, color: "hsl(0 75% 60%)" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{MERCHANT.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">MID: {MERCHANT.mid}</p>
      </div>

      {/* Overview */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold">Business Overview for</h2>
          <RangePill value={range} onChange={setRange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <OverviewCard
            to="/payments"
            label="Payments"
            amount={inr(totals.payAmount)}
            sub={`${totals.payCount} Payments`}
            tint="from-sky-50 to-sky-50/50"
            icon={<IndianRupee className="h-5 w-5" />}
            iconBg="bg-sky-100 text-sky-600"
          />
          <OverviewCard
            to="/settlements"
            label="Settlement"
            amount={inr(totals.settle)}
            sub={totals.lastSettle ? `Last settled ${new Date(totals.lastSettle).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}` : "No settlements yet"}
            tint="from-emerald-50 to-emerald-50/50"
            icon={<Landmark className="h-5 w-5" />}
            iconBg="bg-emerald-100 text-emerald-600"
          />
          <OverviewCard
            to="/refunds"
            label="Refunds"
            amount={inr(totals.refundAmount)}
            sub={`${totals.refundCount} Payments`}
            tint="from-rose-50 to-rose-50/50"
            icon={<RotateCcw className="h-5 w-5" />}
            iconBg="bg-rose-100 text-rose-600"
          />
        </div>
      </section>

      {/* Payment Report */}
      <section className="border border-border rounded-2xl p-6 bg-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Payment Report</h2>
          <div className="flex items-center gap-3">
            <RangePill value="This month, 1 Jun-3 Jun" onChange={() => {}} />
            <Button
              onClick={() =>
                downloadCSV(
                  "payment-report.csv",
                  chartData.map((d) => ({ Date: d.day, Amount: d.amount, Payments: d.count }))
                )
              }
              className="rounded-full"
            >
              <Download className="h-4 w-4 mr-1.5" /> Download Report
            </Button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="hsl(220 13% 91%)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(220 9% 46%)" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tickFormatter={(v) => `₹${v}`} tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(220 13% 91%)" }} />
            <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="amount" name="Payment Amount" fill="hsl(195 100% 55%)" radius={[4, 4, 0, 0]} barSize={36} />
            <Line yAxisId="right" dataKey="count" name="No. Of Payments" stroke="hsl(220 60% 25%)" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </section>

      {/* Payment Sources */}
      <section className="border border-border rounded-2xl p-6 bg-card">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold">Payment Sources for</h2>
          <RangePill value={range} onChange={setRange} />
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={sources} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={2}>
                {sources.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {sources.map((s) => (
              <div key={s.name} className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{inr(s.amount)}</div>
                  <div className="text-xs text-muted-foreground">{s.value}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function RangePill({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-muted/60 rounded-full pl-4 pr-9 py-1.5 text-sm font-medium border border-transparent focus:outline-none cursor-pointer"
      >
        {[value, ...RANGES.filter((r) => r !== value)].map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" />
    </div>
  );
}

function OverviewCard({
  to, label, amount, sub, tint, icon, iconBg,
}: {
  to: string; label: string; amount: string; sub: string; tint: string;
  icon: React.ReactNode; iconBg: string;
}) {
  return (
    <Link
      to={to}
      className={`relative rounded-2xl p-5 bg-gradient-to-br ${tint} border border-border/60 hover:shadow-md transition-shadow group`}
    >
      <div className={`absolute top-5 right-5 h-9 w-9 rounded-full flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-3xl font-bold tracking-tight">{amount}</span>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </div>
      <div className="mt-8 text-xs text-muted-foreground">{sub}</div>
    </Link>
  );
}
