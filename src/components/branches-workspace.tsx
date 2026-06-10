"use client";

import { Building2, MapPin, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";

export function BranchesWorkspace() {
  const { data } = useAgencyStore();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {data.branches.map((branch, index) => (
          <article
            key={branch.id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid size-12 place-items-center rounded-lg bg-blue-50 text-blue-700">
                <Building2 className="size-6" />
              </div>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                #{index + 1}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              {branch.name}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-4" />
              {branch.address}, {branch.city}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Stock
                </p>
                <p className="text-xl font-semibold text-slate-950">
                  {branch.stock}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Hoy
                </p>
                <p className="text-xl font-semibold text-slate-950">
                  {formatCurrency(branch.todaySales)}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 p-3">
              <p className="text-sm text-slate-500">Gerente</p>
              <p className="font-semibold text-slate-950">{branch.manager}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_0.85fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Performance mensual
          </h2>
          <div className="mt-5 grid gap-3 md:hidden">
            {data.branches.map((branch) => (
              <div
                key={branch.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {branch.name}
                    </p>
                    <p className="text-sm text-slate-500">{branch.city}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <TrendingUp className="size-3.5" />
                    +8,4%
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Stock
                    </p>
                    <p className="font-semibold text-slate-950">
                      {branch.stock}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Mes
                    </p>
                    <p className="font-semibold text-slate-950">
                      {formatCurrency(branch.monthlySales)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Sucursal</th>
                  <th className="px-3 py-3 font-semibold">Ciudad</th>
                  <th className="px-3 py-3 font-semibold">Stock</th>
                  <th className="px-3 py-3 font-semibold">Ventas mes</th>
                  <th className="px-3 py-3 font-semibold">Ventas hoy</th>
                  <th className="px-3 py-3 font-semibold">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {data.branches.map((branch) => (
                  <tr key={branch.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-semibold text-slate-950">
                      {branch.name}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{branch.city}</td>
                    <td className="px-3 py-3 text-slate-600">{branch.stock}</td>
                    <td className="px-3 py-3 font-semibold text-slate-950">
                      {formatCurrency(branch.monthlySales)}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatCurrency(branch.todaySales)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <TrendingUp className="size-3.5" />
                        +8,4%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Mapa operativo
          </h2>
          <div className="relative mt-5 h-64 overflow-hidden rounded-lg bg-slate-100 sm:h-80 lg:h-96">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#dbeafe_1px,transparent_1px),linear-gradient(#dbeafe_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_34%,#bfdbfe_0,transparent_18%),radial-gradient(circle_at_72%_56%,#fed7aa_0,transparent_18%),radial-gradient(circle_at_46%_72%,#bbf7d0_0,transparent_16%)]" />
            {data.branches.map((branch, index) => (
              <div
                key={branch.id}
                className="absolute rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-sm"
                style={{
                  left: `${12 + index * 28}%`,
                  top: `${24 + (index % 2) * 24}%`,
                }}
              >
                <p className="text-xs font-semibold text-blue-700">
                  {branch.name}
                </p>
                <p className="text-xs text-slate-500">{branch.city}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
