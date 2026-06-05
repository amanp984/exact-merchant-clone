import { useSyncExternalStore } from "react";

export type PaymentMethod = "UPI" | "QR" | "Card" | "Net Banking" | "Wallet";
export type PaymentStatus = "Success" | "Failed" | "Pending" | "Refunded";

export interface Payment {
  id: string;
  amount: number;
  utr: string;
  txnId: string;
  orderId: string;
  referenceId: string;
  customer: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string; // ISO
  isSettled: boolean;
  settlementId: string | null;
  smsSource: string | null;
  accountCredited: string;
}

export interface Settlement {
  id: string;
  utr: string;
  amount: number;
  transactionCount: number;
  paymentIds: string[];
  date: string; // ISO of settlement
  createdAt: string;
  status: "Settled" | "Pending" | "Failed";
}

export interface State {
  payments: Payment[];
  settlements: Settlement[];
}

const KEY = "paytmm_lite_store_v1";

function load(): State {
  if (typeof window === "undefined") return { payments: [], settlements: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { payments: [], settlements: [] };
    return JSON.parse(raw);
  } catch {
    return { payments: [], settlements: [] };
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

function setState(next: State) {
  state = next;
  persist();
}

export const store = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

function rand(n: number) {
  return Math.floor(Math.random() * n);
}

function genUTR(): string {
  let s = "";
  for (let i = 0; i < 12; i++) s += rand(10);
  // ensure uniqueness against existing
  const existing = new Set(state.payments.map((p) => p.utr));
  while (existing.has("UTR" + s)) {
    s = "";
    for (let i = 0; i < 12; i++) s += rand(10);
  }
  return "UTR" + s;
}

function genId(prefix: string) {
  return prefix + Date.now().toString(36) + rand(10000).toString(36);
}

const NAMES = [
  "Aarav Sharma", "Vivaan Patel", "Aditya Singh", "Ishaan Verma", "Diya Kapoor",
  "Anaya Nair", "Kabir Mehta", "Riya Iyer", "Arjun Reddy", "Saanvi Joshi",
];
const METHODS: PaymentMethod[] = ["UPI", "QR", "Card", "Net Banking", "Wallet"];

export function addPayment(input?: Partial<Payment>): Payment {
  const now = new Date().toISOString();
  const seq = state.payments.length + 1;
  const p: Payment = {
    id: genId("p_"),
    amount: input?.amount ?? 1000,
    utr: input?.utr ?? genUTR(),
    txnId: input?.txnId ?? "TXN" + (8821000 + seq).toString().padStart(7, "0"),
    orderId: input?.orderId ?? "ORD" + (202600 + seq).toString().padStart(6, "0"),
    referenceId: input?.referenceId ?? "REF" + (700320 + seq).toString().padStart(8, "0"),
    customer: input?.customer ?? NAMES[rand(NAMES.length)],
    method: input?.method ?? METHODS[rand(METHODS.length)],
    status: input?.status ?? "Success",
    createdAt: input?.createdAt ?? now,
    isSettled: false,
    settlementId: null,
    smsSource: input?.smsSource ?? null,
    accountCredited: input?.accountCredited ?? "HDFC ****1234",
  };
  setState({ ...state, payments: [p, ...state.payments] });
  return p;
}

export function settleNow(): Settlement | null {
  const unsettled = state.payments.filter((p) => !p.isSettled && p.status === "Success");
  if (unsettled.length === 0) return null;
  const amount = unsettled.reduce((s, p) => s + p.amount, 0);
  const now = new Date().toISOString();
  const settlement: Settlement = {
    id: genId("s_"),
    utr: "STL" + Date.now().toString().slice(-11),
    amount,
    transactionCount: unsettled.length,
    paymentIds: unsettled.map((p) => p.id),
    date: now,
    createdAt: now,
    status: "Settled",
  };
  const ids = new Set(unsettled.map((p) => p.id));
  setState({
    payments: state.payments.map((p) =>
      ids.has(p.id) ? { ...p, isSettled: true, settlementId: settlement.id } : p
    ),
    settlements: [settlement, ...state.settlements],
  });
  return settlement;
}

export function availableForSettlement(): number {
  return state.payments
    .filter((p) => !p.isSettled && p.status === "Success")
    .reduce((s, p) => s + p.amount, 0);
}

export function resetAll() {
  setState({ payments: [], settlements: [] });
}

// React hook
export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(state),
    () => selector(state)
  );
}

// Date helpers
export function isSameDay(iso: string, day: Date) {
  const d = new Date(iso);
  return (
    d.getFullYear() === day.getFullYear() &&
    d.getMonth() === day.getMonth() &&
    d.getDate() === day.getDate()
  );
}
