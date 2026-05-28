"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Debt, PlanResult } from "@/lib/snowball";

const palette = ["#319562", "#56b07f", "#22784e", "#8ccea7", "#ffb56e", "#1c6041", "#bce3ca"];

export default function PayoffChart({ plan, debts }: { plan: PlanResult; debts: Debt[] }) {
  const data = [
    {
      month: 0,
      ...Object.fromEntries(debts.map((d) => [d.name || d.id, d.balance])),
    },
    ...plan.months.map((m) => ({
      month: m.month,
      ...Object.fromEntries(debts.map((d) => [d.name || d.id, m.perDebt[d.id] ?? 0])),
    })),
  ];

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#dcf1e3" strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", offset: -2, fill: "#1c6041" }} stroke="#1c6041" />
          <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} stroke="#1c6041" />
          <Tooltip
            formatter={(value: number) => `$${Math.round(value).toLocaleString()}`}
            labelFormatter={(l) => `Month ${l}`}
            contentStyle={{ borderRadius: 12, border: "1px solid #bce3ca" }}
          />
          {debts.map((d, i) => (
            <Area
              key={d.id}
              type="monotone"
              dataKey={d.name || d.id}
              stackId="1"
              stroke={palette[i % palette.length]}
              fill={palette[i % palette.length]}
              fillOpacity={0.7}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
