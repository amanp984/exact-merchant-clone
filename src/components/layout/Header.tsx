import { Link } from "@tanstack/react-router";
import { Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-16 sticky top-0 z-40 bg-background border-b border-border flex items-center px-4 gap-4">
      <Link to="/" className="flex items-center gap-2 shrink-0 w-60">
        <div className="flex flex-col leading-none">
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-foreground">paytmm</span>
            <span className="text-primary"> lite</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">for Business</span>
        </div>
      </Link>
      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a Refund ID, Order ID, UTR..."
          className="pl-9 bg-muted/50 border-transparent rounded-full h-10"
        />
      </div>
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <a className="hover:text-foreground" href="#">Products</a>
        <a className="hover:text-foreground" href="#">Pricing</a>
        <a className="hover:text-foreground" href="#">Developer</a>
        <a className="hover:text-foreground flex items-center gap-1" href="#"><HelpCircle className="h-3.5 w-3.5" />Need Help?</a>
      </nav>
      <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
        A
      </div>
    </header>
  );
}