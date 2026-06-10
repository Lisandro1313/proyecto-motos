"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Bike,
  CreditCard,
  DollarSign,
  MapPin,
  ShoppingBag,
  Users,
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";

const SalesLineChart = dynamic(
  () =>
    import("@/components/dashboard-charts").then(
      (module) => module.SalesLineChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-72 rounded-lg bg-slate-50" />,
  },
);

const FinancingDonut = dynamic(
  () =>
    import("@/components/dashboard-charts").then(
      (module) => module.FinancingDonut,
    ),
  {
    ssr: false,
    loading: () => <div className="h-48 rounded-lg bg-slate-50" />,
  },
);

const financingOptions = [3, 6, 12, 18];

export function DashboardHome() {
  const { data, totals } = useAgencyStore();
  const featuredMotorcycles = data.motorcycles.slice(0, 4);
  const simulatorMotorcycle = data.motorcycles[0];
  const recentSales = data.sales.slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Ventas del mes"
          value={formatCurrency(totals.salesTotal)}
          change="↑ 18,6% vs. mayo"
          tone="blue"
          icon={<ShoppingBag className="size-6" />}
        />
        <KpiCard
          title="Motos en stock"
          value={String(totals.stockTotal)}
          change="↑ 6 unidades"
          tone="green"
          icon={<Bike className="size-6" />}
        />
        <KpiCard
          title="Clientes nuevos"
          value={String(totals.customersTotal)}
          change="↑ 12,5% vs. mayo"
          tone="violet"
          icon={<Users className="size-6" />}
        />
        <KpiCard
          title="Financiaciones activas"
          value={String(totals.activeFinancings)}
          change="↑ 9,2% vs. mayo"
          tone="orange"
          icon={<CreditCard className="size-6" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.85fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Ventas mensuales
              </h2>
              <p className="text-sm text-slate-500">Últimos 6 meses</p>
            </div>
            <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Este año
            </span>
          </div>
          <SalesLineChart data={data.monthlySales} />
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Financiaciones activas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Distribución por plan de cuotas
          </p>
          <div className="mt-4">
            <FinancingDonut data={data.financingBreakdown} />
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-950">
              Simulador de financiación
            </h2>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-blue-950">
                  {simulatorMotorcycle.brand} {simulatorMotorcycle.model}
                </p>
                <p className="text-sm text-blue-700">
                  Precio de lista actualizado
                </p>
              </div>
              <p className="text-lg font-semibold text-blue-950">
                {formatCurrency(simulatorMotorcycle.price)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {financingOptions.map((installments) => {
              const monthly = Math.round(
                simulatorMotorcycle.price / installments,
              );

              return (
                <div
                  key={installments}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <p className="text-xs font-semibold text-blue-600">
                    Tarjeta {installments}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-950">
                    {formatCurrency(monthly)}
                  </p>
                  <p className="text-xs text-slate-500">por mes</p>
                </div>
              );
            })}
          </div>

          <Link
            href="/financiacion"
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Ver planes de financiación
          </Link>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">
              Inventario de motos
            </h2>
            <Link
              href="/inventario"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Ver todo
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Modelo</th>
                  <th className="px-3 py-3 font-semibold">Categoría</th>
                  <th className="px-3 py-3 font-semibold">Precio</th>
                  <th className="px-3 py-3 font-semibold">Stock</th>
                  <th className="px-3 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.motorcycles.slice(0, 8).map((motorcycle) => (
                  <tr key={motorcycle.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-950">
                      {motorcycle.brand} {motorcycle.model}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {motorcycle.category}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatCurrency(motorcycle.price)}
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-950">
                      {motorcycle.stock}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={motorcycle.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Motos destacadas
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {featuredMotorcycles.map((motorcycle) => (
              <div
                key={motorcycle.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={motorcycle.image}
                    alt={`${motorcycle.brand} ${motorcycle.model}`}
                    fill
                    sizes="(min-width: 1280px) 260px, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 font-semibold text-slate-950">
                  {motorcycle.brand} {motorcycle.model}
                </p>
                <p className="text-sm font-medium text-slate-600">
                  {formatCurrency(motorcycle.price)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">
              Ventas recientes
            </h2>
            <Link
              href="/ventas"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                    {initials(sale.customerName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">
                      {sale.customerName}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {sale.motorcycleModel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">
                    {formatCurrency(sale.price)}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(sale.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">Sucursales</h2>
            <Link
              href="/sucursales"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Ver todas
            </Link>
          </div>

          <div className="relative mb-4 h-32 overflow-hidden rounded-lg bg-slate-100">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#dbeafe_1px,transparent_1px),linear-gradient(#dbeafe_1px,transparent_1px)] bg-[size:42px_42px]" />
            {data.branches.map((branch, index) => (
              <div
                key={branch.id}
                className="absolute"
                style={{
                  left: `${20 + index * 28}%`,
                  top: `${34 + (index % 2) * 22}%`,
                }}
              >
                <MapPin className="size-8 fill-blue-600 text-blue-600" />
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {data.branches.map((branch) => (
              <div key={branch.id} className="rounded-lg bg-slate-50 p-4">
                <p className="font-semibold text-blue-700">{branch.name}</p>
                <p className="text-sm text-slate-500">{branch.city}</p>
                <p className="mt-3 text-xs font-semibold uppercase text-slate-400">
                  Ventas hoy
                </p>
                <p className="text-lg font-semibold text-slate-950">
                  {formatCurrency(branch.todaySales)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <button
        type="button"
        onClick={() => alert("Datos guardados localmente. Con Supabase activo, este botón puede sincronizar la base.")}
        className="fixed bottom-5 right-5 hidden items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl hover:bg-slate-800 lg:inline-flex"
      >
        <DollarSign className="size-4" />
        Cierre del día
      </button>
    </div>
  );
}
