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
import { useEffect, useState } from "react";

type MonthRow = { month: string; revenue: number; expenses: number };

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function MonthlyChart({ data }: { data: MonthRow[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--color-muted)]">
        Log a few entries and your monthly comparison shows up here.
      </p>
    );
  }

  const chartHeight = isMobile ? 200 : 280;
  const yAxisWidth = isMobile ? 45 : 60;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={data} barGap={4} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-line)" />
        <XAxis
          dataKey="month"
          tick={{ fontFamily: "var(--font-mono)", fontSize: isMobile ? 10 : 12, fill: "#7a7566" }}
          axisLine={{ stroke: "var(--color-line)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontFamily: "var(--font-mono)", fontSize: isMobile ? 9 : 11, fill: "#7a7566" }}
          axisLine={false}
          tickLine={false}
          width={yAxisWidth}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          formatter={(value: number) => formatMoney(value)}
          contentStyle={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
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
