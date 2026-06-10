"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";

export function CustomersWorkspace() {
  const { data, totals, addCustomer } = useAgencyStore();
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    return data.customers.filter((customer) =>
      `${customer.name} ${customer.dni} ${customer.phone} ${customer.city}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [data.customers, query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    addCustomer({
      name: String(formData.get("name") || ""),
      dni: String(formData.get("dni") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      city: String(formData.get("city") || ""),
    });

    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">
          Registrar cliente
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Nombre completo
            </span>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Ej: Sofía Benítez"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                DNI
              </span>
              <input
                name="dni"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="38.123.456"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Teléfono
              </span>
              <input
                name="phone"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="+54 9 351..."
              />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="cliente@email.com"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Ciudad
            </span>
            <input
              name="city"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Córdoba"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="size-4" />
            Agregar cliente
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Clientes</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950">
              {totals.customersTotal}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Saldo abierto</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950">
              {formatCurrency(
                data.customers.reduce(
                  (total, customer) => total + customer.balance,
                  0,
                ),
              )}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">En mora</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950">
              {
                data.customers.filter((customer) => customer.status === "Mora")
                  .length
              }
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Registro de clientes
              </h2>
              <p className="text-sm text-slate-500">
                {filteredCustomers.length} fichas comerciales
              </p>
            </div>
            <div className="flex min-w-72 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <Search className="size-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full text-sm outline-none"
                placeholder="Buscar cliente, DNI o ciudad"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Cliente</th>
                  <th className="px-3 py-3 font-semibold">Contacto</th>
                  <th className="px-3 py-3 font-semibold">Ciudad</th>
                  <th className="px-3 py-3 font-semibold">Alta</th>
                  <th className="px-3 py-3 font-semibold">Saldo</th>
                  <th className="px-3 py-3 font-semibold">Vencimiento</th>
                  <th className="px-3 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-slate-100">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                          {initials(customer.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">
                            {customer.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            DNI {customer.dni}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-slate-700">
                        {customer.phone}
                      </p>
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{customer.city}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatDate(customer.joinedAt)}
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-950">
                      {formatCurrency(customer.balance)}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {customer.nextDueDate
                        ? formatDate(customer.nextDueDate)
                        : "-"}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={customer.status} />
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
