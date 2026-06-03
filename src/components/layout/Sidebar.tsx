import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, ArrowLeftRight, FileText, RotateCcw, AlertOctagon,
  BarChart3, Clock, CreditCard, Code2, Briefcase, Settings,
  User, Users, LayoutGrid, ChevronDown, Shield,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const dashItems = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/payments", label: "Payments", icon: ArrowLeftRight },
  { to: "/settlements", label: "Settlements", icon: FileText },
  { to: "/refunds", label: "Refunds", icon: RotateCcw },
  { to: "/disputes", label: "Disputes", icon: AlertOctagon },
  { to: "/reports", label: "Reports & Invoices", icon: BarChart3 },
  { to: "/bank-downtimes", label: "Bank Downtimes", icon: Clock },
];

const settingsItems = [
  { to: "/settings/profile", label: "Profile", icon: User },
  { to: "/settings/users", label: "Manage Users and Roles", icon: Users },
  { to: "/settings/dashboard", label: "Dashboard Settings", icon: LayoutGrid },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [openDash, setOpenDash] = useState(true);
  const [openSettings, setOpenSettings] = useState(path.startsWith("/settings"));

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden md:block">
      <nav className="py-4 text-sm">
        <Group label="Dashboard" open={openDash} onToggle={() => setOpenDash(!openDash)}>
          {dashItems.map((it) => (
            <Item key={it.to} {...it} active={isActive(it.to, it.exact)} />
          ))}
        </Group>
        <SimpleLink to="/accept-payments" icon={CreditCard} label="Accept Payments" active={isActive("/accept-payments")} />
        <SimpleLink to="/developer-settings" icon={Code2} label="Developer Settings" active={isActive("/developer-settings")} />
        <SimpleLink to="/my-services" icon={Briefcase} label="My Services" active={isActive("/my-services")} />
        <Group label="Settings" open={openSettings} onToggle={() => setOpenSettings(!openSettings)} icon={Settings}>
          {settingsItems.map((it) => (
            <Item key={it.to} {...it} active={isActive(it.to)} />
          ))}
        </Group>
        <SimpleLink to="/admin" icon={Shield} label="Admin Panel" active={isActive("/admin")} />
      </nav>
    </aside>
  );
}

function Group({ label, open, onToggle, children, icon: Icon }: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode; icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-2 text-sidebar-foreground/80 font-semibold uppercase text-xs tracking-wider hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
}

function Item({ to, label, icon: Icon, active }: { to: string; label: string; icon: React.ComponentType<{ className?: string }>; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 pl-7 pr-4 py-2.5 text-sm transition-colors border-l-[3px]",
        active
          ? "border-primary bg-accent text-primary font-medium"
          : "border-transparent text-sidebar-foreground hover:bg-muted/60"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

function SimpleLink({ to, icon: Icon, label, active }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-5 py-3 text-sm font-semibold uppercase text-xs tracking-wider transition-colors",
        active ? "text-primary" : "text-sidebar-foreground/80 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}