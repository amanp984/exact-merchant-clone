import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, HelpCircle, LogOut, User, BadgeCheck, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export function Header() {
  return (
    <header className="h-16 sticky top-0 z-40 bg-background border-b border-border flex items-center px-4 gap-4">
      <Link to="/" className="flex items-center shrink-0 w-60">
        <Logo className="h-11 w-auto object-contain" />
      </Link>
      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a Refund ID, Order ID, UTR..."
          className="pl-9 bg-muted/50 border-transparent rounded-full h-10"
        />
      </div>
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Link className="hover:text-foreground transition-colors" to="/products">Products</Link>
        <Link className="hover:text-foreground transition-colors" to="/pricing">Pricing</Link>
        <Link className="hover:text-foreground transition-colors" to="/developer">Developer</Link>
        <Link className="hover:text-foreground flex items-center gap-1 transition-colors" to="/help"><HelpCircle className="h-3.5 w-3.5" />Need Help?</Link>
      </nav>
      <ProfileDropdown />
    </header>
  );
}

function ProfileDropdown() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 focus:outline-none"
      >
        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
          A
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-popover border border-border shadow-lg py-3 z-50">
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="h-4 w-4 text-muted-foreground" />
              Mobile Number: +91 98765 43210
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mt-1.5">
              <BadgeCheck className="h-4 w-4 text-muted-foreground" />
              Merchant ID: M1234567890
            </div>
          </div>
          <div className="my-2 border-t border-border" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
