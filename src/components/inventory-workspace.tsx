"use client";

import Image from "next/image";
import { type ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Minus, Plus, Save, Search } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/context/auth-context";
import { useAgencyStore } from "@/hooks/use-agency-store";
import { readFileAsDataUrl } from "@/lib/file-utils";
import { formatMoney } from "@/lib/format";
import type { Currency } from "@/lib/types";

const categories = ["Todas", "Cub", "Street", "Trail", "Deportiva"];
const currencies: Currency[] = ["ARS", "USD"];

export function InventoryWorkspace() {
  const {
    data,
    totals,
    addMotorcycle,
    adjustMotorcycleStock,
    receiveMotorcycleStock,
    updateMotorcyclePricing,
  } = useAgencyStore();
  const { activeProfile } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [newImage, setNewImage] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
  const [managedMotorcycleId, setManagedMotorcycleId] = useState(
    data.motorcycles[0]?.id || "",
  );

  const managedMotorcycle =
    data.motorcycles.find((motorcycle) => motorcycle.id === managedMotorcycleId) ||
    data.motorcycles[0];

  const filteredMotorcycles = useMemo(() => {
    return data.motorcycles.filter((motorcycle) => {
      const matchesQuery = `${motorcycle.brand} ${motorcycle.model} ${motorcycle.branch}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory =
        category === "Todas" || motorcycle.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, data.motorcycles, query]);

  async function handleImageFile(
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
  ) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setter(await readFileAsDataUrl(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageUrl = String(formData.get("image") || "");

    addMotorcycle({
      brand: String(formData.get("brand") || ""),
      model: String(formData.get("model") || ""),
      category: String(formData.get("category") || "Cub"),
      price: Number(formData.get("price") || 0),
      currency: String(formData.get("currency") || "ARS") as Currency,
      cost: Number(formData.get("cost") || 0),
      stock: Number(formData.get("stock") || 0),
      branch: String(formData.get("branch") || "RE Motos"),
      image: newImage || imageUrl,
      notes: String(formData.get("notes") || ""),
    });

    setNewImage("");
    event.currentTarget.reset();
  }

  function handleReceiptSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!managedMotorcycle) return;

    const formData = new FormData(event.currentTarget);
    const quantity = Number(formData.get("quantity") || 0);
    const currency = String(
      formData.get("currency") || managedMotorcycle.currency,
    ) as Currency;
    const cost = Number(formData.get("cost") || 0);
    const price = Number(formData.get("price") || managedMotorcycle.price);
    const note = String(formData.get("note") || "");

    if (quantity > 0) {
      receiveMotorcycleStock({
        motorcycleId: managedMotorcycle.id,
        quantity,
        cost,
        price,
        currency,
        image: receiptImage,
        note,
        worker: activeProfile || undefined,
      });
    } else {
      updateMotorcyclePricing({
        motorcycleId: managedMotorcycle.id,
        price,
        cost,
        currency,
        note,
        worker: activeProfile || undefined,
      });
    }

    setReceiptImage("");
    event.currentTarget.reset();
  }

  return (
    <div className="grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
      <section className="space-y-4">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Registrar moto
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Alta productiva con precio, costo, moneda y foto.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Marca
                </span>
                <input
                  name="brand"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Ej: Motomel"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Modelo
                </span>
                <input
                  name="model"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Ej: Blitz base 110"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Categoria
                </span>
                <select
                  name="category"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {categories.slice(1).map((item) => (
                    <option key={item}>{item}</option>
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

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Moneda
                </span>
                <select
                  name="currency"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {currencies.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Stock inicial
                </span>
                <input
                  name="stock"
                  required
                  min="0"
                  type="number"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="1"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Precio lista
                </span>
                <input
                  name="price"
                  required
                  min="0"
                  type="number"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="1730000"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Costo compra
                </span>
                <input
                  name="cost"
                  required
                  min="0"
                  type="number"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Foto de la moto
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageFile(event, setNewImage)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
              />
              {newImage ? (
                <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={newImage}
                    alt="Vista previa"
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                URL de imagen alternativa
              </span>
              <input
                name="image"
                type="url"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Nota
              </span>
              <input
                name="notes"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="Color, condicion, observaciones"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3f6f4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#345f41]"
            >
              <Plus className="size-4" />
              Agregar al inventario
            </button>
          </form>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Ingreso y precios
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Registra compras, subas de costo y nuevo precio de lista.
          </p>

          <form
            key={managedMotorcycle?.id || "receipt"}
            onSubmit={handleReceiptSubmit}
            className="mt-5 space-y-4"
          >
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Modelo
              </span>
              <select
                value={managedMotorcycle?.id || ""}
                onChange={(event) => setManagedMotorcycleId(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {data.motorcycles.map((motorcycle) => (
                  <option key={motorcycle.id} value={motorcycle.id}>
                    {motorcycle.brand} {motorcycle.model}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Ingreso unidades
                </span>
                <input
                  name="quantity"
                  min="0"
                  type="number"
                  defaultValue="0"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Moneda
                </span>
                <select
                  name="currency"
                  defaultValue={managedMotorcycle?.currency || "ARS"}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {currencies.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Nuevo costo
                </span>
                <input
                  name="cost"
                  min="0"
                  type="number"
                  defaultValue={managedMotorcycle?.cost || 0}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Nuevo precio
                </span>
                <input
                  name="price"
                  min="0"
                  type="number"
                  defaultValue={managedMotorcycle?.price || 0}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Nueva foto
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageFile(event, setReceiptImage)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Motivo
              </span>
              <input
                name="note"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="Ingreso, aumento proveedor, correccion"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Save className="size-4" />
              Guardar movimiento
            </button>
          </form>
        </article>
      </section>

      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Unidades</p>
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
              {totals.stockTotal}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Lista ARS</p>
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
              {formatMoney(totals.stockValueArs)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Lista USD</p>
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
              {formatMoney(totals.stockValueUsd, "USD")}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Bajo stock</p>
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
              {
                data.motorcycles.filter((motorcycle) => motorcycle.stock <= 2)
                  .length
              }
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Stock actual
              </h2>
              <p className="text-sm text-slate-500">
                {filteredMotorcycles.length} modelos encontrados
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 sm:min-w-64">
                <Search className="size-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full text-sm outline-none"
                  placeholder="Buscar modelo o sucursal"
                />
              </div>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 sm:w-auto"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 md:hidden">
            {filteredMotorcycles.map((motorcycle) => (
              <article
                key={motorcycle.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={motorcycle.image}
                      alt={`${motorcycle.brand} ${motorcycle.model}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-950">
                      {motorcycle.brand} {motorcycle.model}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {motorcycle.category} · {motorcycle.branch}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={motorcycle.status} />
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        Stock {motorcycle.stock}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Precio
                    </p>
                    <p className="font-semibold text-slate-950">
                      {formatMoney(motorcycle.price, motorcycle.currency)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Costo
                    </p>
                    <p className="font-semibold text-emerald-600">
                      {formatMoney(motorcycle.cost, motorcycle.currency)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      adjustMotorcycleStock(motorcycle.id, -1, activeProfile || undefined)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    <Minus className="size-4" />
                    Restar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      adjustMotorcycleStock(motorcycle.id, 1, activeProfile || undefined)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3f6f4d] px-3 py-2 text-sm font-semibold text-white"
                  >
                    <Plus className="size-4" />
                    Sumar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Moto</th>
                  <th className="px-3 py-3 font-semibold">Categoria</th>
                  <th className="px-3 py-3 font-semibold">Precio</th>
                  <th className="px-3 py-3 font-semibold">Costo</th>
                  <th className="px-3 py-3 font-semibold">Tarjetas</th>
                  <th className="px-3 py-3 font-semibold">Stock</th>
                  <th className="px-3 py-3 font-semibold">Estado</th>
                  <th className="px-3 py-3 font-semibold">Ajustar</th>
                </tr>
              </thead>
              <tbody>
                {filteredMotorcycles.map((motorcycle) => (
                  <tr key={motorcycle.id} className="border-b border-slate-100">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            src={motorcycle.image}
                            alt={`${motorcycle.brand} ${motorcycle.model}`}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">
                            {motorcycle.brand} {motorcycle.model}
                          </p>
                          <p className="text-xs text-slate-500">
                            {motorcycle.branch}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {motorcycle.category}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-950">
                      {formatMoney(motorcycle.price, motorcycle.currency)}
                    </td>
                    <td className="px-3 py-3 text-emerald-600">
                      {formatMoney(motorcycle.cost, motorcycle.currency)}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">
                      <div className="grid gap-1">
                        {[3, 6, 12, 18].map((installments) => {
                          const value =
                            motorcycle.cardInstallments?.[
                              installments as 3 | 6 | 12 | 18
                            ];
                          return value ? (
                            <span key={installments}>
                              {installments}:{" "}
                              {formatMoney(value, motorcycle.currency)}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-950">
                      {motorcycle.stock}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={motorcycle.status} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Restar stock"
                          onClick={() =>
                            adjustMotorcycleStock(
                              motorcycle.id,
                              -1,
                              activeProfile || undefined,
                            )
                          }
                          className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          <Minus className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Sumar stock"
                          onClick={() =>
                            adjustMotorcycleStock(
                              motorcycle.id,
                              1,
                              activeProfile || undefined,
                            )
                          }
                          className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
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
