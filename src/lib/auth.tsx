import { createContext, useContext, useState, type ReactNode } from "react";

const VALID_EMAIL = "USER123@GMAIL.COM";
const VALID_PASS = "USER123";
const KEY = "paytmm_lite_user";

type User = { email: string };
type Ctx = {
  user: User | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);

function readStored(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStored());
  const login = (email: string, password: string) => {
    if (email.trim().toUpperCase() === VALID_EMAIL && password === VALID_PASS) {
      const u = { email: VALID_EMAIL };
      localStorage.setItem(KEY, JSON.stringify(u));
      setUser(u);
      return { ok: true as const };
    }
    return { ok: false as const, error: "Invalid Email or Password" };
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}