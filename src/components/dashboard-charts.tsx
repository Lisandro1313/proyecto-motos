"use client";

import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { FinancingBreakdown, MonthlySale } from "@/lib/types";

export function SalesLineChart({ data }: { data: MonthlySale[] }) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={288} minWidth={0}>
        <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `$${Number(value) / 1000000}M`}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.10)",
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#salesFill)"
            dot={{ r: 4, strokeWidth: 2, fill: "#ffffff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FinancingDonut({ data }: { data: FinancingBreakdown[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height={192} minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={2}
            >
              {data.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-3xl font-semibold text-slate-950">{total}</p>
            <p className="text-xs font-medium text-slate-500">Total</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-slate-600">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-950">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
