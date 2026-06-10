"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { Minus, Plus, Search } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/format";
import { useAgencyStore } from "@/hooks/use-agency-store";

const categories = ["Todas", "Street", "Cub", "Trail", "Deportiva"];

export function InventoryWorkspace() {
  const { data, totals, addMotorcycle, adjustMotorcycleStock } = useAgencyStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    addMotorcycle({
      brand: String(formData.get("brand") || ""),
      model: String(formData.get("model") || ""),
      category: String(formData.get("category") || "Street"),
      price: Number(formData.get("price") || 0),
      cost: Number(formData.get("cost") || 0),
      stock: Number(formData.get("stock") || 0),
      branch: String(formData.get("branch") || "Casa Central"),
      image: String(formData.get("image") || ""),
    });

    event.currentTarget.reset();
  }

  return (
    <div className="grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">
          Registrar moto
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Carga rápida para mantener stock y lista de precios.
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
                placeholder="Ej: Honda"
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
                placeholder="Ej: Wave 110"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Categoría
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

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Precio
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
                Costo
              </span>
              <input
                name="cost"
                required
                min="0"
                type="number"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="1320000"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Stock
              </span>
              <input
                name="stock"
                required
                min="0"
                type="number"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="10"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Imagen
            </span>
            <input
              name="image"
              type="url"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="size-4" />
            Agregar al inventario
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Unidades</p>
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
              {totals.stockTotal}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Valor de lista</p>
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
              {formatCurrency(
                data.motorcycles.reduce(
                  (total, motorcycle) =>
                    total + motorcycle.price * motorcycle.stock,
                  0,
                ),
              )}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Bajo stock</p>
            <p className="mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
              {
                data.motorcycles.filter((motorcycle) => motorcycle.stock <= 4)
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
                      {formatCurrency(motorcycle.price)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Margen
                    </p>
                    <p className="font-semibold text-emerald-600">
                      {formatCurrency(motorcycle.price - motorcycle.cost)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => adjustMotorcycleStock(motorcycle.id, -1)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    <Minus className="size-4" />
                    Restar
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustMotorcycleStock(motorcycle.id, 1)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    <Plus className="size-4" />
                    Sumar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Moto</th>
                  <th className="px-3 py-3 font-semibold">Categoría</th>
                  <th className="px-3 py-3 font-semibold">Sucursal</th>
                  <th className="px-3 py-3 font-semibold">Precio</th>
                  <th className="px-3 py-3 font-semibold">Margen</th>
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
                            ID {motorcycle.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {motorcycle.category}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {motorcycle.branch}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-950">
                      {formatCurrency(motorcycle.price)}
                    </td>
                    <td className="px-3 py-3 text-emerald-600">
                      {formatCurrency(motorcycle.price - motorcycle.cost)}
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
                          onClick={() => adjustMotorcycleStock(motorcycle.id, -1)}
                          className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          <Minus className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Sumar stock"
                          onClick={() => adjustMotorcycleStock(motorcycle.id, 1)}
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
