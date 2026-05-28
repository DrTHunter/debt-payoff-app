"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Debt } from "@/lib/snowball";

const palette = ["#319562", "#56b07f", "#22784e", "#8ccea7", "#ffb56e", "#1c6041", "#bce3ca"];

export default function DebtPie({ debts }: { debts: Debt[] }) {
  const data = debts.map((d) => ({ name: d.name || "Debt", value: d.balance }));

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label={(e) => e.name}>
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `$${Math.round(v).toLocaleString()}`} contentStyle={{ borderRadius: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
