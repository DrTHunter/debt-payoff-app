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

  // Always compute the other method for comparison
  const otherStrategy: Strategy = strategy === "snowball" ? "avalanche" : "snowball";
  const otherPlan = useMemo(
    () => simulate(validDebts, extra, otherStrategy),
    [validDebts, extra, otherStrategy]
  );

  const planNoExtra = useMemo(
    () => simulate(validDebts, 0, strategy),
    [validDebts, strategy]
  );

  const monthsSaved = planNoExtra.totalMonths - plan.totalMonths;
  const interestSaved = +(planNoExtra.totalInterest - plan.totalInterest).toFixed(2);

  const totalPrincipal = validDebts.reduce((s, d) => s + d.balance, 0);

  const interestDiff = +(plan.totalInterest - otherPlan.totalInterest).toFixed(2);
  const monthsDiff = plan.totalMonths - otherPlan.totalMonths;

  const strategyLabel = strategy === "snowball" ? "Snowball" : "Avalanche";
  const otherLabel = otherStrategy === "snowball" ? "Snowball" : "Avalanche";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900">
          Your Debt Payoff Plan
        </h1>
        <p className="text-brand-800/80 mt-2">
          Enter your debts below. Switch between Snowball and Avalanche to compare. Nothing is saved unless you sign in.
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
            <label className="label">Payoff strategy</label>
            <select
              className="input"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as Strategy)}
            >
              <option value="snowball">❄️ Debt Snowball — smallest balance first</option>
              <option value="avalanche">🏔️ Debt Avalanche — highest interest rate first</option>
            </select>
            <p className="text-xs text-brand-700/70 mt-1">
              {strategy === "snowball"
                ? "Snowball: pay minimums on all debts, attack the smallest balance first."
                : "Avalanche: pay minimums on all debts, attack the highest rate first — saves the most interest."}
            </p>
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
          {/* Main stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Stat label="Debt free in" value={formatMonths(plan.totalMonths)} highlight />
            <Stat label="Total interest paid" value={formatMoney(plan.totalInterest)} />
            <Stat label="Total principal paid" value={formatMoney(totalPrincipal)} />
            <Stat
              label="Saved with extra"
              value={
                extra > 0
                  ? `${formatMonths(monthsSaved)} · ${formatMoney(interestSaved)}`
                  : "Add extra ↑"
              }
              highlight={extra > 0}
            />
          </div>

          {/* Total paid breakdown */}
          <div className="card mt-4">
            <h3 className="text-lg font-bold text-brand-900 mb-4">Payment breakdown — {strategyLabel}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-brand-50 rounded-xl p-4">
                <p className="text-sm text-brand-700 font-semibold">Total principal</p>
                <p className="text-2xl font-extrabold text-brand-900 mt-1">{formatMoney(totalPrincipal)}</p>
                <p className="text-xs text-brand-700/60 mt-1">The actual debt you owe</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm text-red-700 font-semibold">Total interest paid</p>
                <p className="text-2xl font-extrabold text-red-700 mt-1">{formatMoney(plan.totalInterest)}</p>
                <p className="text-xs text-red-600/60 mt-1">Cost of carrying debt</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-700 font-semibold">Grand total paid</p>
                <p className="text-2xl font-extrabold text-green-800 mt-1">{formatMoney(plan.totalPaid)}</p>
                <p className="text-xs text-green-700/60 mt-1">Principal + interest</p>
              </div>
            </div>
          </div>

          {/* Method comparison banner */}
          <div className="card mt-4 border-2 border-amber-200 bg-amber-50">
            <h3 className="text-lg font-bold text-brand-900 mb-3">
              How does {strategyLabel} compare to {otherLabel}?
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-700 font-semibold mb-1">Interest difference</p>
                {interestDiff === 0 ? (
                  <p className="text-brand-900">Both methods cost the same in interest.</p>
                ) : interestDiff > 0 ? (
                  <p className="text-brand-900">
                    Switching to <strong>{otherLabel}</strong> would save you{" "}
                    <span className="text-green-700 font-extrabold">{formatMoney(interestDiff)}</span> in interest.
                  </p>
                ) : (
                  <p className="text-brand-900">
                    {strategyLabel} saves you{" "}
                    <span className="text-green-700 font-extrabold">{formatMoney(Math.abs(interestDiff))}</span> in interest vs. {otherLabel}.
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-brand-700 font-semibold mb-1">Time difference</p>
                {monthsDiff === 0 ? (
                  <p className="text-brand-900">Both methods finish in the same number of months.</p>
                ) : monthsDiff > 0 ? (
                  <p className="text-brand-900">
                    {otherLabel} finishes{" "}
                    <span className="text-green-700 font-extrabold">{formatMonths(Math.abs(monthsDiff))}</span> sooner.
                  </p>
                ) : (
                  <p className="text-brand-900">
                    {strategyLabel} finishes{" "}
                    <span className="text-green-700 font-extrabold">{formatMonths(Math.abs(monthsDiff))}</span> sooner than {otherLabel}.
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setStrategy(otherStrategy)}
              className="mt-4 text-sm font-semibold text-brand-700 underline hover:text-brand-900"
            >
              Switch to {otherLabel} →
            </button>
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
            <h3 className="text-lg font-bold text-brand-900 mb-4">Payoff order — {strategyLabel}</h3>
            <Timeline plan={plan} />
          </div>

          <div className="card mt-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-brand-900">Results table — {strategyLabel}</h3>
              <button onClick={() => downloadPlan(validDebts, plan)} className="btn-secondary !py-2 !px-4 !text-base">
                ⬇ Download as Excel
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-brand-700 border-b border-brand-100">
                  <th className="py-2">#</th>
                  <th className="py-2">Debt</th>
                  <th className="py-2">Principal</th>
                  <th className="py-2">Interest paid</th>
                  <th className="py-2">Total paid</th>
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
                      <td className="py-3 text-red-600">{formatMoney(res.interestPaid)}</td>
                      <td className="py-3 font-semibold">{formatMoney(orig.balance + res.interestPaid)}</td>
                      <td className="py-3">Month {res.payoffMonth} ({formatMonths(res.payoffMonth)})</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-brand-200">
                <tr>
                  <td className="py-3 font-bold" colSpan={2}>Totals</td>
                  <td className="py-3 font-bold">{formatMoney(totalPrincipal)}</td>
                  <td className="py-3 font-bold text-red-600">{formatMoney(plan.totalInterest)}</td>
                  <td className="py-3 font-bold">{formatMoney(plan.totalPaid)}</td>
                  <td className="py-3 font-bold">{formatMonths(plan.totalMonths)}</td>
                </tr>
              </tfoot>
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