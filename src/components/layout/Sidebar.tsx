import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, ArrowLeftRight, FileText, RotateCcw, AlertOctagon,
  BarChart3, Clock, Code2, Briefcase, Settings,
  User, Users, LayoutGrid, ChevronDown, Shield, QrCode, Bell,
  FileBarChart, ReceiptText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const dashItems = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/payments", label: "Payments", icon: ArrowLeftRight },
  { to: "/settlements", label: "Settlements", icon: FileText },
  { to: "/refunds", label: "Refunds", icon: RotateCcw },
  { to: "/disputes", label: "Disputes", icon: AlertOctagon },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [openDash, setOpenDash] = useState(true);
  const [openReports, setOpenReports] = useState(path.startsWith("/reports") || path.startsWith("/invoices"));
  const [openAccept, setOpenAccept] = useState(path.startsWith("/accept-payments") || path.startsWith("/my-qr-code"));
  const [openSettings, setOpenSettings] = useState(path.startsWith("/settings"));
  const [openDashSet, setOpenDashSet] = useState(path.startsWith("/settings/dashboard"));

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden md:block">
      <nav className="py-3 text-[13.5px]">
        <Group label="Dashboard" open={openDash} onToggle={() => setOpenDash(!openDash)}>
          {dashItems.map((it) => (
            <Item key={it.to} {...it} active={isActive(it.to, it.exact)} />
          ))}
          <NestedGroup
            label="Reports & Invoices"
            icon={BarChart3}
            open={openReports}
            onToggle={() => setOpenReports(!openReports)}
            active={path.startsWith("/reports") || path.startsWith("/invoices")}
          >
            <SubItem to="/reports" icon={FileBarChart} label="Reports" active={isActive("/reports", true)} />
            <SubItem to="/invoices" icon={ReceiptText} label="Invoices" active={isActive("/invoices")} />
          </NestedGroup>
          <Item to="/bank-downtimes" label="Bank Downtimes" icon={Clock} active={isActive("/bank-downtimes")} />
        </Group>

        <Group label="Accept Payments" open={openAccept} onToggle={() => setOpenAccept(!openAccept)}>
          <Item to="/my-qr-code" label="My QR Code" icon={QrCode} active={isActive("/my-qr-code")} />
        </Group>

        <SimpleLink to="/developer-settings" icon={Code2} label="Developer Settings" active={isActive("/developer-settings")} />
        <SimpleLink to="/my-services" icon={Briefcase} label="My Services" active={isActive("/my-services")} />

        <Group label="Settings" open={openSettings} onToggle={() => setOpenSettings(!openSettings)} icon={Settings}>
          <Item to="/settings/profile" label="Profile" icon={User} active={isActive("/settings/profile")} />
          <Item to="/settings/users" label="Manage Users and Roles" icon={Users} active={isActive("/settings/users")} />
          <NestedGroup
            label="Dashboard Settings"
            icon={LayoutGrid}
            open={openDashSet}
            onToggle={() => setOpenDashSet(!openDashSet)}
            active={path.startsWith("/settings/dashboard")}
          >
            <SubItem to="/settings/dashboard/notifications" icon={Bell} label="Notifications" active={isActive("/settings/dashboard/notifications")} />
          </NestedGroup>
        </Group>
        <SimpleLink to="/admin" icon={Shield} label="Admin Panel" active={isActive("/admin")} />
      </nav>
    </aside>
  );
}

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;
function Group({ label, open, onToggle, children, icon: Icon }: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode; icon?: IconType;
}) {
  return (
    <div className="mb-0.5">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-2.5 text-foreground font-semibold text-[14px] hover:text-primary"
      >
        <span className="flex items-center gap-2.5">
          {Icon && <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />}
          {label}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
}

function NestedGroup({ label, icon: Icon, open, onToggle, active, children }: {
  label: string; icon: IconType; open: boolean; onToggle: () => void; active: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between pl-7 pr-4 py-2 text-[13.5px] font-normal transition-colors border-l-[3px]",
          active ? "border-primary text-primary" : "border-transparent text-sidebar-foreground hover:bg-muted/50"
        )}
      >
        <span className="flex items-center gap-3">
          <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
          {label}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function SubItem({ to, icon: Icon, label, active }: { to: string; icon: IconType; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 pl-12 pr-4 py-2 text-[13px] font-normal transition-colors border-l-[3px]",
        active ? "border-primary bg-accent text-primary font-medium" : "border-transparent text-sidebar-foreground hover:bg-muted/50"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </Link>
  );
}

function Item({ to, label, icon: Icon, active }: { to: string; label: string; icon: IconType; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 pl-7 pr-4 py-2 text-[13.5px] font-normal transition-colors border-l-[3px]",
        active
          ? "border-primary bg-accent text-primary font-medium"
          : "border-transparent text-sidebar-foreground hover:bg-muted/50"
      )}
    >
      <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
      <span>{label}</span>
    </Link>
  );
}

function SimpleLink({ to, icon: Icon, label, active }: { to: string; icon: IconType; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 px-5 py-2.5 text-[14px] font-semibold transition-colors",
        active ? "text-primary" : "text-foreground hover:text-primary"
      )}
    >
      <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
      {label}
    </Link>
  );
}