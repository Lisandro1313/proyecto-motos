"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckCircle2, CreditCard } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/context/auth-context";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";

const plans = [3, 6, 12, 18];

export function FinancingWorkspace() {
  const { data, totals, registerPayment } = useAgencyStore();
  const { activeProfile } = useAuth();
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState(
    data.motorcycles[0]?.id || "",
  );
  const selectedMotorcycle = data.motorcycles.find(
    (motorcycle) => motorcycle.id === selectedMotorcycleId,
  );

  const activeFinancings = useMemo(
    () =>
      data.financings.filter((financing) => financing.status !== "Finalizada"),
    [data.financings],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Contratos activos</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {totals.activeFinancings}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Capital financiado</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {formatCurrency(
              activeFinancings.reduce(
                (total, financing) => total + financing.financedAmount,
                0,
              ),
            )}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Mora pendiente</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {formatCurrency(totals.overdueTotal)}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Calculator className="size-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-950">
              Simulador de cuotas
            </h2>
          </div>

          <label className="mt-5 block space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Moto
            </span>
            <select
              value={selectedMotorcycleId}
              onChange={(event) => setSelectedMotorcycleId(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {data.motorcycles.map((motorcycle) => (
                <option key={motorcycle.id} value={motorcycle.id}>
                  {motorcycle.brand} {motorcycle.model}
                </option>
              ))}
            </select>
          </label>

          {selectedMotorcycle ? (
            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-950">
                {selectedMotorcycle.brand} {selectedMotorcycle.model}
              </p>
              <p className="mt-1 text-2xl font-semibold text-blue-950">
                {formatCurrency(selectedMotorcycle.price)}
              </p>
              <p className="text-sm text-blue-700">Entrega sugerida 20%</p>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {selectedMotorcycle
              ? plans.map((installments) => {
                  const downPayment = Math.round(selectedMotorcycle.price * 0.2);
                  const financedAmount = selectedMotorcycle.price - downPayment;
                  const monthly = Math.round(financedAmount / installments);

                  return (
                    <div
                      key={installments}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-blue-700">
                          Plan {installments} cuotas
                        </p>
                        <CreditCard className="size-4 text-blue-600" />
                      </div>
                      <p className="mt-2 text-xl font-semibold text-slate-950">
                        {formatCurrency(monthly)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Entrega {formatCurrency(downPayment)}
                      </p>
                    </div>
                  );
                })
              : null}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Contratos de financiación
              </h2>
              <p className="text-sm text-slate-500">
                {data.financings.length} contratos registrados
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Cliente</th>
                  <th className="px-3 py-3 font-semibold">Moto</th>
                  <th className="px-3 py-3 font-semibold">Financiado</th>
                  <th className="px-3 py-3 font-semibold">Cuota</th>
                  <th className="px-3 py-3 font-semibold">Avance</th>
                  <th className="px-3 py-3 font-semibold">Vence</th>
                  <th className="px-3 py-3 font-semibold">Mora</th>
                  <th className="px-3 py-3 font-semibold">Últ. cobro</th>
                  <th className="px-3 py-3 font-semibold">Estado</th>
                  <th className="px-3 py-3 font-semibold">Pago</th>
                </tr>
              </thead>
              <tbody>
                {data.financings.map((financing) => {
                  const progress =
                    (financing.paidInstallments / financing.installments) * 100;

                  return (
                    <tr key={financing.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 font-semibold text-slate-950">
                        {financing.customerName}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {financing.motorcycleModel}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {formatCurrency(financing.financedAmount)}
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-950">
                        {formatCurrency(financing.installmentAmount)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex min-w-36 items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-500">
                            {financing.paidInstallments}/
                            {financing.installments}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {formatDate(financing.nextDueDate)}
                      </td>
                      <td className="px-3 py-3 font-semibold text-red-600">
                        {formatCurrency(financing.overdueAmount)}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {financing.lastPaymentBy || "-"}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={financing.status} />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            registerPayment(financing.id, activeProfile || undefined)
                          }
                          disabled={financing.status === "Finalizada"}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <CheckCircle2 className="size-4" />
                          Registrar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
