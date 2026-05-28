export type Debt = {
  id: string;
  name: string;
  balance: number;
  minPayment: number;
  interestRate: number; // annual percent, e.g. 19.99
};

export type PayoffMonth = {
  month: number;
  totalBalance: number;
  totalPaid: number;
  totalInterest: number;
  perDebt: Record<string, number>; // remaining balance per debt id
  paidOffThisMonth: string[]; // debt ids
};

export type DebtResult = {
  id: string;
  name: string;
  payoffMonth: number;
  interestPaid: number;
};

export type PlanResult = {
  months: PayoffMonth[];
  debts: DebtResult[];
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  order: string[]; // debt ids in payoff order
};

export type Strategy = "snowball" | "avalanche";

const MAX_MONTHS = 600; // safety cap (50 years)

/**
 * Simulates monthly debt payoff.
 *  - Snowball: pay extra toward SMALLEST balance first.
 *  - Avalanche: pay extra toward HIGHEST interest rate first.
 *  - Minimum payments paid on all other debts.
 *  - When a debt is paid off, its min payment ALSO rolls into the snowball.
 */
export function simulate(
  debts: Debt[],
  extraPerMonth: number,
  strategy: Strategy = "snowball"
): PlanResult {
  // Clone working state
  const work = debts.map((d) => ({ ...d, remaining: d.balance, interestPaid: 0, payoffMonth: 0 }));
  const months: PayoffMonth[] = [];
  let month = 0;

  while (work.some((d) => d.remaining > 0.005) && month < MAX_MONTHS) {
    month++;

    // 1. Accrue interest for the month
    for (const d of work) {
      if (d.remaining <= 0) continue;
      const monthlyRate = d.interestRate / 100 / 12;
      const interest = d.remaining * monthlyRate;
      d.remaining += interest;
      d.interestPaid += interest;
    }

    // 2. Determine focus debt (snowball or avalanche)
    const active = work.filter((d) => d.remaining > 0);
    const ordered = [...active].sort((a, b) =>
      strategy === "snowball"
        ? a.balance - b.balance
        : b.interestRate - a.interestRate
    );
    const focus = ordered[0];

    // 3. Pool of money this month = sum of min payments still active + extra
    //    + rolled-over payments from already-paid debts
    const minPool = active.reduce((sum, d) => sum + d.minPayment, 0);
    const rolledFromPaid = debts.reduce((sum, d) => {
      const w = work.find((x) => x.id === d.id)!;
      return w.remaining <= 0 ? sum + d.minPayment : sum;
    }, 0);
    let pool = minPool + extraPerMonth + rolledFromPaid;

    // 4. Pay minimums first (capped at remaining)
    for (const d of active) {
      if (d.id === focus.id) continue;
      const pay = Math.min(d.minPayment, d.remaining);
      d.remaining -= pay;
      pool -= pay;
    }

    // 5. Throw the rest at the focus debt
    if (focus) {
      const pay = Math.min(pool, focus.remaining);
      focus.remaining -= pay;
      pool -= pay;
    }

    // 6. Cascade leftover (if focus was paid off mid-month) to next focus(es)
    while (pool > 0.005) {
      const next = work
        .filter((d) => d.remaining > 0.005)
        .sort((a, b) =>
          strategy === "snowball"
            ? a.balance - b.balance
            : b.interestRate - a.interestRate
        )[0];
      if (!next) break;
      const pay = Math.min(pool, next.remaining);
      next.remaining -= pay;
      pool -= pay;
    }

    // 7. Record month
    const paidOffThisMonth: string[] = [];
    for (const d of work) {
      if (d.remaining <= 0.005 && d.payoffMonth === 0) {
        d.payoffMonth = month;
        d.remaining = 0;
        paidOffThisMonth.push(d.id);
      }
    }

    months.push({
      month,
      totalBalance: work.reduce((s, d) => s + d.remaining, 0),
      totalPaid: debts.reduce((s, d) => {
        const w = work.find((x) => x.id === d.id)!;
        return s + (d.balance - w.remaining);
      }, 0),
      totalInterest: work.reduce((s, d) => s + d.interestPaid, 0),
      perDebt: Object.fromEntries(work.map((d) => [d.id, +d.remaining.toFixed(2)])),
      paidOffThisMonth,
    });
  }

  const debtResults: DebtResult[] = work.map((d) => ({
    id: d.id,
    name: d.name,
    payoffMonth: d.payoffMonth,
    interestPaid: +d.interestPaid.toFixed(2),
  }));

  const order = [...debtResults]
    .filter((d) => d.payoffMonth > 0)
    .sort((a, b) => a.payoffMonth - b.payoffMonth)
    .map((d) => d.id);

  const totalInterest = +debtResults.reduce((s, d) => s + d.interestPaid, 0).toFixed(2);
  const totalPaid = +(debts.reduce((s, d) => s + d.balance, 0) + totalInterest).toFixed(2);

  return {
    months,
    debts: debtResults,
    totalMonths: month,
    totalInterest,
    totalPaid,
    order,
  };
}

export function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function formatMonths(m: number): string {
  if (m <= 0) return "—";
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (y === 0) return `${mo} mo`;
  if (mo === 0) return `${y} yr`;
  return `${y} yr ${mo} mo`;
}
