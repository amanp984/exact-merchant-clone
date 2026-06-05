import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Smartphone, CreditCard } from "lucide-react";

export const Route = createFileRoute("/my-services")({
  head: () => ({ meta: [{ title: "My Services — PAYTMM LITE" }] }),
  component: MyServicesPage,
});

function MyServicesPage() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-[28px] font-semibold text-foreground mb-8">My Services</h1>

      <div className="border border-border rounded-xl p-6 bg-card">
        <div className="text-[11px] font-bold tracking-wider text-foreground uppercase">PAYTMM LITE Sound Box</div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted/60 flex items-center justify-center">
              <Smartphone className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Sound Box</div>
              <div className="text-sm text-muted-foreground">Serial No. 867192063806076</div>
            </div>
          </div>
          <button className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm">
            Paid <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Grow your Business</h2>
        <p className="text-sm text-muted-foreground">with our products and services</p>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <ServiceCard
            icon={CreditCard}
            title="PAYTMM LITE Card Machine"
            desc="Accept payments instantly with our reliable, all-in-one POS solution."
            cta="Explore Card Machine"
          />
          <ServiceCard
            icon={Smartphone}
            title="PAYTMM LITE Sound Box"
            desc="Seamless audio alerts for all your UPI and QR payments."
            cta="Explore Sound Box"
          />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc, cta }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; cta: string }) {
  return (
    <div className="border border-border rounded-xl p-5 bg-card">
      <div className="h-10 w-10 rounded-lg bg-accent/60 flex items-center justify-center">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <div className="mt-6 font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
      <button className="mt-5 inline-flex items-center gap-1 border border-primary text-primary rounded-md px-4 py-2 text-sm font-semibold">
        {cta} <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}