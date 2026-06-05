import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";

export function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 min-h-[60vh]">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Clock className="h-10 w-10 text-primary" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-3">Coming Soon</h1>
      <p className="text-base text-muted-foreground max-w-md mb-2">
        New services and features are coming soon.
      </p>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        For complete services please visit the Paytm Mobile App.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
