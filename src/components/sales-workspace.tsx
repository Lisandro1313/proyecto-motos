"use client";

import { FormEvent, useMemo, useState } from "react";
import { BadgeDollarSign, Plus, Search } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/context/auth-context";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";
import type { PaymentMethod } from "@/lib/types";

const paymentMethods: PaymentMethod[] = [
  "Contado",
  "Transferencia",
  "Tarjeta",
  "Financiación",
];

export function SalesWorkspace() {
  const { data, totals, registerSale } = useAgencyStore();
  const { activeProfile } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState(
    data.motorcycles[0]?.id || "",
  );

  const selectedMotorcycle = data.motorcycles.find(
    (motorcycle) => motorcycle.id === selectedMotorcycleId,
  );

  const filteredSales = useMemo(() => {
    return data.sales.filter((sale) =>
      `${sale.customerName} ${sale.motorcycleModel} ${sale.branch} ${sale.seller}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [data.sales, query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeProfile) return;

    const formData = new FormData(event.currentTarget);

    registerSale({
      customerId: String(formData.get("customerId") || ""),
      motorcycleId: String(formData.get("motorcycleId") || ""),
      branch: String(formData.get("branch") || "Casa Central"),
      paymentMethod: String(formData.get("paymentMethod") || "Contado") as PaymentMethod,
      seller: activeProfile.name,
      sellerId: activeProfile.id,
    });

    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">
          Registrar venta
        </h2>
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase text-blue-700">
            Perfil activo
          </p>
          <p className="mt-1 font-semibold text-blue-950">
            {activeProfile?.name}
          </p>
          <p className="text-sm text-blue-700">
            {activeProfile?.role} · {activeProfile?.branch}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Cliente
            </span>
            <select
              name="customerId"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {data.customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} · DNI {customer.dni}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Moto
            </span>
            <select
              name="motorcycleId"
              required
              value={selectedMotorcycleId}
              onChange={(event) => setSelectedMotorcycleId(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {data.motorcycles.map((motorcycle) => (
                <option
                  key={motorcycle.id}
                  value={motorcycle.id}
                  disabled={motorcycle.stock <= 0}
                >
                  {motorcycle.brand} {motorcycle.model} · {motorcycle.stock} u.
                </option>
              ))}
            </select>
          </label>

          {selectedMotorcycle ? (
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-950">
                {selectedMotorcycle.brand} {selectedMotorcycle.model}
              </p>
              <p className="mt-1 text-2xl font-semibold text-blue-950">
                {formatCurrency(selectedMotorcycle.price)}
              </p>
              <p className="text-sm text-blue-700">
                Stock disponible: {selectedMotorcycle.stock}
              </p>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Medio de pago
              </span>
              <select
                name="paymentMethod"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method}>{method}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Sucursal
              </span>
              <select
                name="branch"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {data.branches.map((branch) => (
                  <option key={branch.id}>{branch.name}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="size-4" />
            Confirmar venta
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Facturación</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950">
              {formatCurrency(totals.salesTotal)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Operaciones</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950">
              {data.sales.length}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Ticket promedio</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950">
              {formatCurrency(
                data.sales.length ? totals.salesTotal / data.sales.length : 0,
              )}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Historial de ventas
              </h2>
              <p className="text-sm text-slate-500">
                {filteredSales.length} operaciones registradas
              </p>
            </div>
            <div className="flex min-w-72 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <Search className="size-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full text-sm outline-none"
                placeholder="Buscar cliente, moto o vendedor"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Cliente</th>
                  <th className="px-3 py-3 font-semibold">Moto</th>
                  <th className="px-3 py-3 font-semibold">Fecha</th>
                  <th className="px-3 py-3 font-semibold">Pago</th>
                  <th className="px-3 py-3 font-semibold">Sucursal</th>
                  <th className="px-3 py-3 font-semibold">Vendedor</th>
                  <th className="px-3 py-3 font-semibold">Importe</th>
                  <th className="px-3 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-slate-100">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                          {initials(sale.customerName)}
                        </div>
                        <p className="font-semibold text-slate-950">
                          {sale.customerName}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {sale.motorcycleModel}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatDate(sale.date)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        <BadgeDollarSign className="size-3.5" />
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{sale.branch}</td>
                    <td className="px-3 py-3 text-slate-600">{sale.seller}</td>
                    <td className="px-3 py-3 font-semibold text-emerald-600">
                      {formatCurrency(sale.price)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={sale.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
