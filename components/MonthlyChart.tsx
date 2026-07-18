"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type MonthRow = { month: string; revenue: number; expenses: number };

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function MonthlyChart({ data }: { data: MonthRow[] }) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--color-muted)]">
        Log a few entries and your monthly comparison shows up here.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--color-line)" />
        <XAxis
          dataKey="month"
          tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "#7a7566" }}
          axisLine={{ stroke: "var(--color-line)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontFamily: "var(--font-mono)", fontSize: 11, fill: "#7a7566" }}
          axisLine={false}
          tickLine={false}
          width={60}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          formatter={(value: number) => formatMoney(value)}
          contentStyle={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            border: "1px solid var(--color-line)",
            borderRadius: 4,
          }}
        />
        <Bar dataKey="revenue" name="Revenue" fill="#3f7d52" radius={[2, 2, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="#b5482f" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
