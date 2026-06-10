"use client";

import { AlertTriangle, BarChart3, RefreshCcw, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";

export function ReportsWorkspace() {
  const { data, totals, resetData } = useAgencyStore();
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

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ventas</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {formatCurrency(totals.salesTotal)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Margen bruto</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {formatCurrency(grossMargin)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Mora</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {formatCurrency(totals.overdueTotal)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Stock crítico</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
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
