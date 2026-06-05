import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ChevronRight, Eye, EyeOff, QrCode } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — PAYTMM LITE" }] }),
  component: LoginPage,
});

type Slide = {
  badge: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  visual: React.ReactNode;
};

function BadgePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-white">
      <Logo className="h-10 w-auto brightness-0 invert" />
      <span className="text-2xl font-semibold leading-none">{children}</span>
    </div>
  );
}

const slides: Slide[] = [
  {
    badge: <BadgePill>Soundbox</BadgePill>,
    title: (
      <>The sound of your<br />growing business</>
    ),
    subtitle: <>Get instant voice<br />payment confirmations</>,
    visual: (
      <div className="relative mx-auto w-[280px] h-[280px] rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
        <div className="w-[200px] h-[200px] rounded-xl bg-white shadow-2xl flex flex-col items-center justify-center p-4">
          <div className="text-[#0b3b8c] font-bold text-lg">PAYTMM LITE</div>
          <div className="text-[10px] text-foreground/70 mt-1">Accepted Here</div>
          <div className="mt-2 w-28 h-28 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22white%22/><g fill=%22black%22><rect x=%220%22 y=%220%22 width=%2210%22 height=%2210%22/><rect x=%2220%22 y=%220%22 width=%2210%22 height=%2210%22/><rect x=%2240%22 y=%2210%22 width=%2210%22 height=%2210%22/><rect x=%2260%22 y=%220%22 width=%2210%22 height=%2210%22/><rect x=%2280%22 y=%2210%22 width=%2210%22 height=%2210%22/><rect x=%220%22 y=%2230%22 width=%2210%22 height=%2210%22/><rect x=%2230%22 y=%2230%22 width=%2210%22 height=%2210%22/><rect x=%2250%22 y=%2240%22 width=%2210%22 height=%2210%22/><rect x=%2270%22 y=%2230%22 width=%2210%22 height=%2210%22/><rect x=%2210%22 y=%2250%22 width=%2210%22 height=%2210%22/><rect x=%2240%22 y=%2260%22 width=%2210%22 height=%2210%22/><rect x=%2260%22 y=%2250%22 width=%2210%22 height=%2210%22/><rect x=%2280%22 y=%2270%22 width=%2210%22 height=%2210%22/><rect x=%220%22 y=%2280%22 width=%2210%22 height=%2210%22/><rect x=%2220%22 y=%2280%22 width=%2210%22 height=%2210%22/><rect x=%2240%22 y=%2280%22 width=%2210%22 height=%2210%22/><rect x=%2270%22 y=%2280%22 width=%2210%22 height=%2210%22/></g></svg>')] bg-contain" />
        </div>
      </div>
    ),
  },
  {
    badge: <BadgePill>for Business</BadgePill>,
    title: (
      <>PAYTMM LITE for Business<br />for all your business needs</>
    ),
    subtitle: <>Payment infrastructure &amp;<br />insights at your fingertips</>,
    visual: (
      <div className="mx-auto w-[260px] rounded-[2rem] border-4 border-white/20 bg-white shadow-2xl p-3">
        <div className="text-xs text-foreground/70 mb-2">Rakesh Singh · Business Owner</div>
        <div className="rounded-xl bg-gradient-to-br from-[#0b3b8c] to-[#1859c7] text-white p-3">
          <div className="text-[11px] opacity-80">Get your money in one click!</div>
          <div className="font-semibold mt-1">Try the Settle Now option</div>
          <div className="mt-3 rounded-md bg-white/15 px-2 py-1 text-[10px]">Settle Now · ₹15,020</div>
        </div>
        <div className="mt-3 rounded-lg bg-muted/40 p-2 text-[11px] text-foreground/80">
          No payments received Today &amp; Yesterday
        </div>
      </div>
    ),
  },
  {
    badge: (
      <div className="inline-flex items-center gap-2 text-white">
        <Logo className="h-10 w-auto brightness-0 invert" />
        <span className="text-xs font-bold bg-white text-[#0b3b8c] rounded-full px-2 py-0.5">PG</span>
      </div>
    ),
    title: (
      <>Safe &amp; secure<br />lightning-fast payments</>
    ),
    subtitle: <>With India's most reliable<br />payment gateway</>,
    visual: (
      <div className="mx-auto flex items-end gap-3">
        <div className="w-[200px] h-[140px] rounded-lg bg-white shadow-xl p-2">
          <div className="text-[10px] font-semibold text-foreground">My Shopping Bag</div>
          <div className="mt-2 h-3 w-3/4 bg-muted rounded" />
          <div className="mt-1 h-3 w-1/2 bg-muted rounded" />
          <div className="mt-1 h-3 w-2/3 bg-muted rounded" />
        </div>
        <div className="w-[120px] h-[180px] rounded-xl border-2 border-white/30 bg-white shadow-2xl p-2">
          <div className="text-[9px] text-center font-semibold">Payment Options</div>
          <div className="mt-2 space-y-1">
            <div className="h-2 bg-muted rounded" />
            <div className="h-2 bg-muted rounded" />
            <div className="h-2 bg-muted rounded" />
            <div className="h-2 bg-muted rounded" />
          </div>
          <div className="mt-3 h-6 rounded-md bg-[#00b9f5] text-white text-[9px] flex items-center justify-center font-semibold">
            Pay ₹5,498
          </div>
        </div>
      </div>
    ),
  },
];

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  useEffect(() => {
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) setError(res.error);
    else navigate({ to: "/" });
  };

  const slide = slides[slideIdx];

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      {/* Left carousel */}
      <div className="hidden md:flex flex-col items-center justify-between bg-gradient-to-br from-[#0a3279] via-[#0b3b8c] to-[#1450b8] text-white p-10 relative overflow-hidden">
        <div className="self-start">{slide.badge}</div>

        <div className="flex-1 w-full flex items-center justify-center my-6">
          <div key={slideIdx} className="animate-in fade-in duration-500">
            {slide.visual}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight">{slide.title}</h2>
          <p className="mt-3 text-white/80 text-sm">{slide.subtitle}</p>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlideIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === slideIdx ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <div className="md:hidden mb-6"><Logo className="h-12 w-auto" /></div>
          <h1 className="text-[28px] font-semibold text-foreground">Login with your PAYTMM LITE account</h1>
          <p className="mt-2 text-sm text-primary">PAYTMM LITE user? No need to create a new account</p>

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
              placeholder="PAYTMM LITE Password"
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
