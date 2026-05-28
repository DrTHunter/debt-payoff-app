"use client";
import { formatMonths } from "@/lib/snowball";
import type { PlanResult } from "@/lib/snowball";

export default function Timeline({ plan }: { plan: PlanResult }) {
  const items = plan.order.map((id) => plan.debts.find((d) => d.id === id)!);
  const max = plan.totalMonths || 1;

  return (
    <ol className="space-y-4">
      {items.map((d, i) => {
        const pct = (d.payoffMonth / max) * 100;
        return (
          <li key={d.id}>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="font-semibold text-brand-900">{d.name || "Debt"}</span>
              <span className="ml-auto text-sm text-brand-700">
                Paid off in {formatMonths(d.payoffMonth)}
              </span>
            </div>
            <div className="h-3 rounded-full bg-brand-50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-600"
                style={{ width: `${Math.max(pct, 4)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
