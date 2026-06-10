type StatusBadgeProps = {
  status: string;
};

const variants: Record<string, string> = {
  Disponible: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Pocas unidades": "bg-amber-50 text-amber-700 ring-amber-200",
  "Últimas unidades": "bg-red-50 text-red-700 ring-red-200",
  Reservada: "bg-blue-50 text-blue-700 ring-blue-200",
  "Sin stock": "bg-slate-100 text-slate-600 ring-slate-200",
  Activo: "bg-blue-50 text-blue-700 ring-blue-200",
  "Al día": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Mora: "bg-red-50 text-red-700 ring-red-200",
  Nuevo: "bg-violet-50 text-violet-700 ring-violet-200",
  Confirmada: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Pendiente: "bg-amber-50 text-amber-700 ring-amber-200",
  Cancelada: "bg-slate-100 text-slate-600 ring-slate-200",
  Activa: "bg-blue-50 text-blue-700 ring-blue-200",
  "En mora": "bg-red-50 text-red-700 ring-red-200",
  Finalizada: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        variants[status] || "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}
