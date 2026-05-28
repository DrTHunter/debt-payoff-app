import * as XLSX from "xlsx";
import type { Debt, PlanResult } from "./snowball";

export function downloadTrackerTemplate() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Debts
  const debts = [
    ["Debt Name", "Balance", "Minimum Payment", "Interest Rate (%)", "Extra Payment", "Notes"],
    ["Store Card", 450, 25, 24.99, 0, "Smallest — knock out first!"],
    ["Credit Card", 1800, 45, 19.99, 0, ""],
    ["Car Loan", 8500, 220, 6.5, 0, ""],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(debts);
  ws1["!cols"] = [{ wch: 22 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws1, "My Debts");

  // Sheet 2: Monthly Tracker
  const tracker = [
    ["Date", "Debt Name", "Payment Amount", "Remaining Balance", "Paid Off? (Y/N)", "Notes"],
    ["", "", "", "", "", ""],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(tracker);
  ws2["!cols"] = [{ wch: 14 }, { wch: 22 }, { wch: 16 }, { wch: 20 }, { wch: 16 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Monthly Tracker");

  // Sheet 3: Wins
  const wins = [
    ["Date", "Win", "How I Feel"],
    ["", "Paid off Store Card 🎉", ""],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(wins);
  ws3["!cols"] = [{ wch: 14 }, { wch: 40 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws3, "My Wins");

  XLSX.writeFile(wb, "debt-snowball-tracker.xlsx");
}

export function downloadPlan(debts: Debt[], plan: PlanResult) {
  const wb = XLSX.utils.book_new();

  // Summary
  const summary = [
    ["My Debt Snowball Plan"],
    [],
    ["Total Months", plan.totalMonths],
    ["Total Interest Paid", plan.totalInterest],
    ["Total Paid", plan.totalPaid],
    [],
    ["Payoff Order"],
    ["#", "Debt", "Payoff Month", "Interest Paid"],
    ...plan.order.map((id, i) => {
      const d = plan.debts.find((x) => x.id === id)!;
      return [i + 1, d.name, d.payoffMonth, d.interestPaid];
    }),
  ];
  const wsS = XLSX.utils.aoa_to_sheet(summary);
  wsS["!cols"] = [{ wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsS, "Summary");

  // Month by month
  const header = ["Month", "Total Balance", "Total Paid", "Total Interest", ...debts.map((d) => d.name)];
  const rows = plan.months.map((m) => [
    m.month,
    +m.totalBalance.toFixed(2),
    +m.totalPaid.toFixed(2),
    +m.totalInterest.toFixed(2),
    ...debts.map((d) => m.perDebt[d.id] ?? 0),
  ]);
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  XLSX.utils.book_append_sheet(wb, ws, "Monthly Schedule");

  XLSX.writeFile(wb, "my-snowball-plan.xlsx");
}
