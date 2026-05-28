"use client";
import { useMemo, useState } from "react";
import {
  Debt,
  formatMoney,
  formatMonths,
  simulate,
  Strategy,
} from "@/lib/snowball";
import { downloadPlan } from "@/lib/excel";
import PayoffChart from "@/components/PayoffChart";
import DebtPie from "@/components/DebtPie";
import Timeline from "@/components/Timeline";

const sample: Debt[] = [
  { id: "1", name: "Store Card", balance: 450, minPayment: 25, interestRate: 24.99 },
  { id: "2", name: "Credit Card", balance: 1800, minPayment: 45, interestRate: 19.99 },
  { id: "3", name: "Car Loan", balance: 8500, minPayment: 220, interestRate: 6.5 },
];

let nextId = 4;

export default function CalculatorPage() {
  const [debts, setDebts] = useState<Debt[]>(sample);
  const [extra, setExtra] = useState<number>(100);
  const [strategy, setStrategy] = useState<Strategy>("snowball");

  function update(id: string, patch: Partial<Debt>) {
    setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }
  function add() {
    setDebts((ds) => [
      ...ds,
      { id: String(nextId++), name: "", balance: 0, minPayment: 0, interestRate: 0 },
    ]);
  }
  function remove(id: string) {
    setDebts((ds) => ds.filter((d) => d.id !== id));
  }

  const validDebts = debts.filter((d) => d.balance > 0 && d.minPayment >= 0);

  const plan = useMemo(
    () => simulate(validDebts, extra, strategy),
    [validDebts, extra, strategy]
  );
  const planNoExtra = useMemo(
    () => simulate(validDebts, 0, strategy),
    [validDebts, strategy]
  );

  const monthsSaved = planNoExtra.totalMonths - plan.totalMonths;
  const interestSaved = +(planNoExtra.totalInterest - plan.totalInterest).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900">
          Your Debt Snowball Plan
        </h1>
        <p className="text-brand-800/80 mt-2">
          Enter your debts below. We’ll build your plan instantly. Nothing is saved unless you sign in.
        </p>
      </header>

      {/* Inputs */}
      <div className="card">
        <h2 className="text-xl font-bold text-brand-900 mb-4">My debts</h2>

        <div className="hidden md:grid grid-cols-12 gap-3 text-sm font-semibold text-brand-700 mb-2 px-1">
          <div className="col-span-4">Debt name</div>
          <div className="col-span-2">Balance</div>
          <div className="col-span-2">Min payment</div>
          <div className="col-span-2">Interest %</div>
          <div className="col-span-2"></div>
        </div>

        <div className="space-y-3">
          {debts.map((d) => (
            <div key={d.id} className="grid grid-cols-2 md:grid-cols-12 gap-3 items-end">
              <div className="col-span-2 md:col-span-4">
                <label className="label md:hidden">Debt name</label>
                <input
                  className="input"
                  placeholder="e.g. Visa card"
                  value={d.name}
                  onChange={(e) => update(d.id, { name: e.target.value })}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="label md:hidden">Balance</label>
                <input
                  type="number" inputMode="decimal" min={0}
                  className="input"
                  value={d.balance || ""}
                  onChange={(e) => update(d.id, { balance: +e.target.value })}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="label md:hidden">Min payment</label>
                <input
                  type="number" inputMode="decimal" min={0}
                  className="input"
                  value={d.minPayment || ""}
                  onChange={(e) => update(d.id, { minPayment: +e.target.value })}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="label md:hidden">Interest %</label>
                <input
                  type="number" inputMode="decimal" min={0} step="0.01"
                  className="input"
                  value={d.interestRate || ""}
                  onChange={(e) => update(d.id, { interestRate: +e.target.value })}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <button
                  className="text-red-600 hover:text-red-700 font-semibold py-3"
                  onClick={() => remove(d.id)}
                  aria-label={`Remove ${d.name || "debt"}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={add} className="btn-secondary mt-4">+ Add another debt</button>

        <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-brand-100">
          <div>
            <label className="label">Extra money I can pay each month</label>
            <input
              type="number" inputMode="decimal" min={0}
              className="input"
              value={extra || ""}
              onChange={(e) => setExtra(+e.target.value)}
            />
            <p className="text-xs text-brand-700/70 mt-1">Even $25 extra makes a real difference.</p>
          </div>
          <div>
            <label className="label">Strategy</label>
            <div className="flex gap-2">
              <button
                onClick={() => setStrategy("snowball")}
                className={`flex-1 rounded-xl px-4 py-3 font-semibold border-2 ${
                  strategy === "snowball"
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-brand-700 border-brand-200"
                }`}
              >
                Snowball (smallest first)
              </button>
              <button
                onClick={() => setStrategy("avalanche")}
                className={`flex-1 rounded-xl px-4 py-3 font-semibold border-2 ${
                  strategy === "avalanche"
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-brand-700 border-brand-200"
                }`}
              >
                Avalanche (highest rate)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {validDebts.length === 0 ? (
        <div className="card mt-8 text-center text-brand-800/80">
          Add at least one debt above to see your plan. ✏️
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Stat label="Debt free in" value={formatMonths(plan.totalMonths)} highlight />
            <Stat label="Total interest" value={formatMoney(plan.totalInterest)} />
            <Stat label="Total paid" value={formatMoney(plan.totalPaid)} />
            <Stat
              label="Saved with extra"
              value={
                extra > 0
                  ? `${formatMonths(monthsSaved)} • ${formatMoney(interestSaved)}`
                  : "Add extra ↑"
              }
              highlight={extra > 0}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            <div className="card lg:col-span-2">
              <h3 className="text-lg font-bold text-brand-900 mb-2">Balance over time</h3>
              <PayoffChart plan={plan} debts={validDebts} />
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-brand-900 mb-2">Where your debt is</h3>
              <DebtPie debts={validDebts} />
            </div>
          </div>

          <div className="card mt-6">
            <h3 className="text-lg font-bold text-brand-900 mb-4">Payoff order</h3>
            <Timeline plan={plan} />
          </div>

          <div className="card mt-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-brand-900">Results table</h3>
              <button onClick={() => downloadPlan(validDebts, plan)} className="btn-secondary !py-2 !px-4 !text-base">
                ⬇ Download as Excel
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-brand-700 border-b border-brand-100">
                  <th className="py-2">#</th>
                  <th className="py-2">Debt</th>
                  <th className="py-2">Starting balance</th>
                  <th className="py-2">Interest paid</th>
                  <th className="py-2">Paid off</th>
                </tr>
              </thead>
              <tbody>
                {plan.order.map((id, i) => {
                  const res = plan.debts.find((d) => d.id === id)!;
                  const orig = validDebts.find((d) => d.id === id)!;
                  return (
                    <tr key={id} className="border-b border-brand-50">
                      <td className="py-3 font-semibold">{i + 1}</td>
                      <td className="py-3">{res.name || "(unnamed)"}</td>
                      <td className="py-3">{formatMoney(orig.balance)}</td>
                      <td className="py-3">{formatMoney(res.interestPaid)}</td>
                      <td className="py-3">Month {res.payoffMonth} ({formatMonths(res.payoffMonth)})</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
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
