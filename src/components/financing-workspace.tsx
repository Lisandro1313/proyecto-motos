"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckCircle2, CreditCard } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/context/auth-context";
import { formatCurrency, formatDate, formatMoney } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";

const plans = [3, 6, 12, 18];

export function FinancingWorkspace() {
  const { data, totals, registerPayment } = useAgencyStore();
  const { activeProfile } = useAuth();
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState("");
  const effectiveMotorcycleId =
    selectedMotorcycleId || data.motorcycles[0]?.id || "";
  const selectedMotorcycle = data.motorcycles.find(
    (motorcycle) => motorcycle.id === effectiveMotorcycleId,
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
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
            {totals.activeFinancings}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Capital financiado</p>
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
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
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
            {formatCurrency(totals.overdueTotal)}
          </p>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
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
              value={effectiveMotorcycleId}
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
                {formatMoney(selectedMotorcycle.price, selectedMotorcycle.currency)}
              </p>
              <p className="text-sm text-blue-700">Entrega sugerida 20%</p>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {selectedMotorcycle
              ? plans.map((installments) => {
                  const downPayment = Math.round(selectedMotorcycle.price * 0.2);
                  const financedAmount = selectedMotorcycle.price - downPayment;
                  const monthly =
                    selectedMotorcycle.cardInstallments?.[
                      installments as 3 | 6 | 12 | 18
                    ] || Math.round(financedAmount / installments);

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
                        {formatMoney(monthly, selectedMotorcycle.currency)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedMotorcycle.cardInstallments?.[
                          installments as 3 | 6 | 12 | 18
                        ]
                          ? "Cuota segun lista PDF"
                          : `Entrega ${formatMoney(
                              downPayment,
                              selectedMotorcycle.currency,
                            )}`}
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

          <div className="grid gap-3 md:hidden">
            {data.financings.map((financing) => {
              const progress =
                (financing.paidInstallments / financing.installments) * 100;

              return (
                <article
                  key={financing.id}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-950">
                        {financing.customerName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {financing.motorcycleModel}
                      </p>
                    </div>
                    <StatusBadge status={financing.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Cuota
                      </p>
                      <p className="font-semibold text-slate-950">
                        {formatCurrency(financing.installmentAmount)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Vence
                      </p>
                      <p className="font-semibold text-slate-950">
                        {formatDate(financing.nextDueDate)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Financiado
                      </p>
                      <p className="font-semibold text-slate-950">
                        {formatCurrency(financing.financedAmount)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Mora
                      </p>
                      <p className="font-semibold text-red-600">
                        {formatCurrency(financing.overdueAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Avance</span>
                      <span>
                        {financing.paidInstallments}/{financing.installments}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      registerPayment(financing.id, activeProfile || undefined)
                    }
                    disabled={financing.status === "Finalizada"}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <CheckCircle2 className="size-4" />
                    Registrar pago
                  </button>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
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
