"use client";

import { AlertTriangle, BarChart3, RefreshCcw, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { formatCurrency } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";

export function ReportsWorkspace() {
  const { data, totals, resetData } = useAgencyStore();
  const { profiles } = useAuth();
  const grossMargin = data.sales.reduce((total, sale) => {
    const motorcycle = data.motorcycles.find(
      (candidate) => candidate.id === sale.motorcycleId,
    );
    const cost = motorcycle?.cost || sale.price * 0.76;
    return total + sale.price - cost;
  }, 0);

  const lowStock = data.motorcycles.filter(
    (motorcycle) => motorcycle.stock <= 4,
  );
  const overdueFinancings = data.financings.filter(
    (financing) => financing.status === "En mora",
  );

  const sellerPerformance = data.sales.reduce<Record<string, number>>(
    (report, sale) => {
      report[sale.seller] = (report[sale.seller] || 0) + sale.price;
      return report;
    },
    {},
  );
  const profilePerformance = profiles.map((profile) => {
    const profileSales = data.sales.filter(
      (sale) => sale.sellerId === profile.id || sale.seller === profile.name,
    );
    const profileActivity = data.activityLog.filter(
      (event) => event.workerId === profile.id || event.workerName === profile.name,
    );

    return {
      profile,
      salesCount: profileSales.length,
      revenue: profileSales.reduce((total, sale) => total + sale.price, 0),
      activityCount: profileActivity.length,
    };
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ventas</p>
          <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
            {formatCurrency(totals.salesTotal)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Margen bruto</p>
          <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
            {formatCurrency(grossMargin)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Mora</p>
          <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
            {formatCurrency(totals.overdueTotal)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Stock crítico</p>
          <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
            {lowStock.length}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-950">
              Alertas de stock
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {lowStock.map((motorcycle) => (
              <div
                key={motorcycle.id}
                className="rounded-lg border border-slate-100 p-3"
              >
                <p className="font-semibold text-slate-950">
                  {motorcycle.brand} {motorcycle.model}
                </p>
                <p className="text-sm text-slate-500">
                  {motorcycle.branch} · {motorcycle.stock} unidades
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-950">
              Ventas por vendedor
            </h2>
          </div>
          <div className="mt-4 space-y-4">
            {Object.entries(sellerPerformance).map(([seller, total]) => (
              <div key={seller}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{seller}</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(total)}
                  </p>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(100, (total / totals.salesTotal) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-slate-950">
              Financiamiento
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {overdueFinancings.length ? (
              overdueFinancings.map((financing) => (
                <div
                  key={financing.id}
                  className="rounded-lg border border-red-100 bg-red-50 p-3"
                >
                  <p className="font-semibold text-red-950">
                    {financing.customerName}
                  </p>
                  <p className="text-sm text-red-700">
                    Mora {formatCurrency(financing.overdueAmount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="font-semibold text-emerald-950">
                  No hay contratos en mora
                </p>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_0.9fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-950">
              Trabajo por perfil
            </h2>
          </div>
          <div className="mt-4 grid gap-3 md:hidden">
            {profilePerformance.map(({ profile, salesCount, revenue, activityCount }) => (
              <div
                key={profile.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="grid size-10 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: profile.color }}
                  >
                    {profile.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-950">
                      {profile.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {profile.role} · {profile.branch}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Ventas
                    </p>
                    <p className="font-semibold text-slate-950">{salesCount}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Total
                    </p>
                    <p className="font-semibold text-emerald-600">
                      {formatCurrency(revenue)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Eventos
                    </p>
                    <p className="font-semibold text-slate-950">
                      {activityCount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Perfil</th>
                  <th className="px-3 py-3 font-semibold">Rol</th>
                  <th className="px-3 py-3 font-semibold">Ventas</th>
                  <th className="px-3 py-3 font-semibold">Facturado</th>
                  <th className="px-3 py-3 font-semibold">Actividad</th>
                </tr>
              </thead>
              <tbody>
                {profilePerformance.map(({ profile, salesCount, revenue, activityCount }) => (
                  <tr key={profile.id} className="border-b border-slate-100">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="grid size-9 place-items-center rounded-lg text-xs font-bold text-white"
                          style={{ backgroundColor: profile.color }}
                        >
                          {profile.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">
                            {profile.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {profile.branch}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{profile.role}</td>
                    <td className="px-3 py-3 font-semibold text-slate-950">
                      {salesCount}
                    </td>
                    <td className="px-3 py-3 font-semibold text-emerald-600">
                      {formatCurrency(revenue)}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {activityCount} eventos
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Bitácora reciente
          </h2>
          <div className="mt-4 space-y-3">
            {data.activityLog.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-slate-100 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {event.workerName || "Sistema"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {event.description}
                    </p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase text-slate-600">
                    {event.type}
                  </span>
                </div>
                {event.amount ? (
                  <p className="mt-2 text-sm font-semibold text-emerald-600">
                    {formatCurrency(event.amount)}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Datos de demostración
            </h2>
            <p className="text-sm text-slate-500">
              Última actualización: {new Date(data.lastUpdated).toLocaleString("es-AR")}
            </p>
          </div>
          <button
            type="button"
            onClick={resetData}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCcw className="size-4" />
            Restaurar demo
          </button>
        </div>
      </section>
    </div>
  );
}
