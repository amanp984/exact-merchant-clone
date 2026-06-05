import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ChevronRight, Eye, EyeOff, QrCode } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — PAYTMM LITE" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) setError(res.error);
    else navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      {/* Left illustration */}
      <div className="hidden md:flex flex-col items-center justify-between bg-[#0b3b8c] text-white p-12 relative overflow-hidden">
        <div className="self-start bg-white rounded-lg p-3">
          <Logo className="h-12 w-auto" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight">Safe &amp; secure<br/>lightning-fast payments</h2>
          <p className="mt-3 text-white/80">With India's most reliable<br/>payment gateway</p>
        </div>
        <div className="flex items-center gap-2 opacity-80">
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="h-1.5 w-4 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <div className="md:hidden mb-6"><Logo className="h-12 w-auto" /></div>
          <h1 className="text-[28px] font-semibold text-foreground">Login with your PAYTMM LITE account</h1>
          <p className="mt-2 text-sm text-primary">Use USER123@GMAIL.COM / USER123 to sign in</p>

          <div className="mt-8">
            <input
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="Enter your Mobile Number or Email"
              className="w-full border-0 border-b border-border focus:border-primary outline-none py-3 text-base bg-transparent"
            />
          </div>
          <div className="mt-6 relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="Password"
              className="w-full border-0 border-b border-border focus:border-primary outline-none py-3 text-base bg-transparent pr-10"
            />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <p className="mt-4 text-sm">
            <span className="font-semibold">PLEASE NOTE:</span>{" "}
            <span className="text-muted-foreground">PAYTMM LITE and Business Dashboard password are same.</span>
          </p>

          {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}

          <div className="mt-6 flex items-center gap-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold hover:bg-primary/90"
            >
              <Lock className="h-4 w-4" /> Sign in Securely <ChevronRight className="h-4 w-4" />
            </button>
            <a href="#" className="text-primary text-sm font-medium">Forgot Password</a>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            By signing in, you agree to our <a className="text-primary">privacy policy</a> and{" "}
            <a className="text-primary">terms of use</a>.
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-lg bg-muted/40 p-3">
            <QrCode className="h-10 w-10 text-foreground" />
            <div className="text-sm">
              <div>OR Login through QR Code</div>
              <a className="text-primary font-medium">click here</a>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-accent/60 px-4 py-3 text-center text-sm">
            New to PAYTMM LITE?{" "}
            <a className="text-primary font-semibold">Create an Account</a>
          </div>
        </form>
      </div>
    </div>
  );
}