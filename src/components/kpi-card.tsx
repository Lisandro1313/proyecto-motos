import type { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  value: string;
  change?: string;
  tone: "blue" | "green" | "violet" | "orange";
  icon: ReactNode;
};

const tones = {
  blue: "bg-blue-600 shadow-blue-200",
  green: "bg-emerald-500 shadow-emerald-200",
  violet: "bg-violet-600 shadow-violet-200",
  orange: "bg-orange-500 shadow-orange-200",
};

export function KpiCard({ title, value, change, tone, icon }: KpiCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`grid size-12 shrink-0 place-items-center rounded-lg text-white shadow-lg sm:size-14 ${tones[tone]}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 break-words text-xl font-semibold text-slate-950 sm:text-2xl">
            {value}
          </p>
          {change ? (
            <p className="mt-1 text-sm font-medium text-emerald-600">{change}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
