"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Debt, formatMoney, formatMonths, simulate } from "@/lib/snowball";
import PayoffChart from "@/components/PayoffChart";
import Timeline from "@/components/Timeline";

type DbDebt = {
  id: string;
  name: string;
  balance: number;
  min_payment: number;
  interest_rate: number;
  created_at?: string;
};

type DbHistory = {
  id: string;
  debt_id: string;
  amount: number;
  remaining_balance: number;
  paid_on: string;
  note: string | null;
};

export default function DashboardClient({
  email,
  initialDebts,
  initialHistory,
}: {
  email: string;
  initialDebts: DbDebt[];
  initialHistory: DbHistory[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [debts, setDebts] = useState<DbDebt[]>(initialDebts);
  const [history, setHistory] = useState<DbHistory[]>(initialHistory);
  const [extra, setExtra] = useState<number>(0);
  const [busy, setBusy] = useState(false);

  const calcDebts: Debt[] = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({
      id: d.id,
      name: d.name,
      balance: Number(d.balance),
      minPayment: Number(d.min_payment),
      interestRate: Number(d.interest_rate),
    }));

  const plan = useMemo(() => simulate(calcDebts, extra, "snowball"), [calcDebts, extra]);

  async function addDebt() {
    const { data, error } = await supabase
      .from("debts")
      .insert({ name: "New debt", balance: 0, min_payment: 0, interest_rate: 0 })
      .select()
      .single();
    if (!error && data) setDebts((d) => [...d, data]);
  }

  async function updateDebt(id: string, patch: Partial<DbDebt>) {
    setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    await supabase.from("debts").update(patch).eq("id", id);
  }

  async function removeDebt(id: string) {
    setDebts((ds) => ds.filter((d) => d.id !== id));
    await supabase.from("debts").delete().eq("id", id);
  }

  async function logPayment(debt: DbDebt, amount: number) {
    if (!amount || amount <= 0) return;
    setBusy(true);
    const newBalance = Math.max(0, Number(debt.balance) - amount);
    const { data, error } = await supabase
      .from("payment_history")
      .insert({
        debt_id: debt.id,
        amount,
        remaining_balance: newBalance,
        paid_on: new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();
    if (!error && data) {
      setHistory((h) => [data, ...h]);
      await updateDebt(debt.id, { balance: newBalance });
    }
    setBusy(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const totalBalance = debts.reduce((s, d) => s + Number(d.balance), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900">My Tracker</h1>
          <p className="text-brand-800/80 mt-1">Signed in as {email}</p>
        </div>
        <button onClick={signOut} className="btn-secondary !py-2 !px-4 !text-base">Sign out</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Stat label="Total balance" value={formatMoney(totalBalance)} />
        <Stat label="Debt free in" value={formatMonths(plan.totalMonths)} highlight />
        <Stat label="Total interest" value={formatMoney(plan.totalInterest)} />
      </div>

      {/* Debts */}
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand-900">My debts</h2>
          <button onClick={addDebt} className="btn-secondary !py-2 !px-4 !text-base">+ Add debt</button>
        </div>

        {debts.length === 0 ? (
          <p className="text-brand-800/80">No debts yet. Click “Add debt” to start.</p>
        ) : (
          <div className="space-y-3">
            {debts.map((d) => (
              <DebtRow
                key={d.id}
                debt={d}
                onChange={(patch) => updateDebt(d.id, patch)}
                onRemove={() => removeDebt(d.id)}
                onLogPayment={(amt) => logPayment(d, amt)}
                busy={busy}
              />
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-brand-100">
          <label className="label">Extra payment per month</label>
          <input
            type="number" min={0}
            className="input max-w-xs"
            value={extra || ""}
            onChange={(e) => setExtra(+e.target.value)}
          />
        </div>
      </div>

      {calcDebts.length > 0 && (
        <>
          <div className="card mt-6">
            <h3 className="text-lg font-bold text-brand-900 mb-2">Projected payoff</h3>
            <PayoffChart plan={plan} debts={calcDebts} />
          </div>
          <div className="card mt-6">
            <h3 className="text-lg font-bold text-brand-900 mb-4">Payoff order</h3>
            <Timeline plan={plan} />
          </div>
        </>
      )}

      {/* History */}
      <div className="card mt-6">
        <h3 className="text-lg font-bold text-brand-900 mb-4">Payment history</h3>
        {history.length === 0 ? (
          <p className="text-brand-800/80">No payments logged yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-brand-700 border-b border-brand-100">
                <th className="py-2">Date</th>
                <th className="py-2">Debt</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => {
                const d = debts.find((x) => x.id === h.debt_id);
                return (
                  <tr key={h.id} className="border-b border-brand-50">
                    <td className="py-2">{h.paid_on}</td>
                    <td className="py-2">{d?.name ?? "—"}</td>
                    <td className="py-2">{formatMoney(Number(h.amount))}</td>
                    <td className="py-2">{formatMoney(Number(h.remaining_balance))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`card ${highlight ? "bg-brand-600 text-white border-brand-600" : ""}`}>
      <p className={`text-sm font-semibold ${highlight ? "text-white/80" : "text-brand-700"}`}>{label}</p>
      <p className="text-2xl font-extrabold mt-1">{value}</p>
    </div>
  );
}

function DebtRow({
  debt, onChange, onRemove, onLogPayment, busy,
}: {
  debt: DbDebt;
  onChange: (patch: Partial<DbDebt>) => void;
  onRemove: () => void;
  onLogPayment: (amount: number) => void;
  busy: boolean;
}) {
  const [pay, setPay] = useState<number>(0);
  return (
    <div className="grid grid-cols-2 md:grid-cols-12 gap-3 items-end border border-brand-100 rounded-2xl p-3">
      <div className="col-span-2 md:col-span-3">
        <label className="label">Name</label>
        <input className="input" value={debt.name} onChange={(e) => onChange({ name: e.target.value })} />
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="label">Balance</label>
        <input type="number" className="input" value={debt.balance || ""} onChange={(e) => onChange({ balance: +e.target.value })} />
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="label">Min pay</label>
        <input type="number" className="input" value={debt.min_payment || ""} onChange={(e) => onChange({ min_payment: +e.target.value })} />
      </div>
      <div className="col-span-1 md:col-span-1">
        <label className="label">Rate %</label>
        <input type="number" step="0.01" className="input" value={debt.interest_rate || ""} onChange={(e) => onChange({ interest_rate: +e.target.value })} />
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="label">Log payment</label>
        <input type="number" className="input" placeholder="$" value={pay || ""} onChange={(e) => setPay(+e.target.value)} />
      </div>
      <div className="col-span-2 md:col-span-2 flex gap-2">
        <button
          disabled={busy || pay <= 0}
          onClick={() => { onLogPayment(pay); setPay(0); }}
          className="flex-1 rounded-xl bg-brand-600 text-white font-semibold py-3 disabled:opacity-50"
        >
          Save
        </button>
        <button onClick={onRemove} className="text-red-600 font-semibold px-2">✕</button>
      </div>
    </div>
  );
}
