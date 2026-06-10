import type { Currency } from "@/lib/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMoney(value: number, currency: Currency = "ARS") {
  if (currency === "USD") {
    return `US$ ${new Intl.NumberFormat("es-AR", {
      maximumFractionDigits: 0,
    }).format(value)}`;
  }

  return formatCurrency(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
