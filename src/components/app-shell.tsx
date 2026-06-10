"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  Bike,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  ShoppingCart,
  UserRoundCog,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventario", label: "Inventario", icon: Bike },
  { href: "/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/financiacion", label: "Financiación", icon: CreditCard },
  { href: "/sucursales", label: "Sucursales", icon: Building2 },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/perfiles", label: "Perfiles", icon: UserRoundCog },
];

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "¡Bienvenido de vuelta!",
    subtitle: "Resumen comercial, stock, ventas y financiación del negocio.",
  },
  "/inventario": {
    title: "Inventario de motos",
    subtitle: "Alta de unidades, control de stock y precios de lista.",
  },
  "/ventas": {
    title: "Ventas",
    subtitle: "Registro de operaciones por trabajador y punto comercial.",
  },
  "/clientes": {
    title: "Clientes",
    subtitle: "Ficha comercial, contacto, estado de cuenta y vencimientos.",
  },
  "/financiacion": {
    title: "Financiación",
    subtitle: "Simulador, contratos activos, cuotas y pagos registrados.",
  },
  "/sucursales": {
    title: "Sucursales",
    subtitle: "Rendimiento, stock y ventas por punto comercial.",
  },
  "/reportes": {
    title: "Reportes",
    subtitle: "Indicadores de margen, mora, rotación y trabajo por perfil.",
  },
  "/perfiles": {
    title: "Perfiles de trabajo",
    subtitle: "Selección por PIN y administración de subperfiles.",
  },
};

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f4f7fb] px-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-lg bg-blue-600 text-white">
          <Bike className="size-6" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-950">
          Preparando MotoCenter
        </p>
        <p className="mt-1 text-sm text-slate-500">Validando sesión local...</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    ready,
    adminSession,
    activeProfile,
    clearActiveProfile,
    logout,
  } = useAuth();
  const isLoginRoute = pathname === "/login";
  const isProfilesRoute = pathname === "/perfiles";
  const isAuthRoute = isLoginRoute || isProfilesRoute;
  const currentPage = pageTitles[pathname] || pageTitles["/"];

  useEffect(() => {
    if (!ready) return;

    if (!adminSession && !isLoginRoute) {
      router.replace("/login");
      return;
    }

    if (adminSession && !activeProfile && !isProfilesRoute) {
      router.replace("/perfiles");
      return;
    }

    if (adminSession && activeProfile && isLoginRoute) {
      router.replace("/");
    }
  }, [
    ready,
    adminSession,
    activeProfile,
    isLoginRoute,
    isProfilesRoute,
    router,
  ]);

  const switchProfile = useCallback(() => {
    clearActiveProfile();
    setMobileOpen(false);
    router.push("/perfiles");
  }, [clearActiveProfile, router]);

  const closeSession = useCallback(() => {
    logout();
    setMobileOpen(false);
    router.push("/login");
  }, [logout, router]);

  const sidebar = useMemo(
    () => (
      <aside className="flex h-full w-72 flex-col border-r border-slate-900 bg-[#070b16] text-white">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="grid size-11 place-items-center rounded-lg bg-blue-600">
            <Bike className="size-6" />
          </div>
          <div>
            <p className="text-xl font-semibold">MotoCenter</p>
            <p className="text-xs uppercase text-slate-400">
              Agencia de motos
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4">
            <Image
              src="https://images.unsplash.com/photo-1558981001-5864b3250a69?auto=format&fit=crop&w=700&q=80"
              alt="Moto deportiva en exhibición"
              fill
              sizes="260px"
              className="object-cover opacity-35"
            />
            <div className="relative min-h-36">
              <p className="max-w-36 text-2xl font-semibold leading-8">
                Impulsamos tus sueños
              </p>
              <p className="mt-2 text-sm text-slate-200">MotoCenter</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div
              className="grid size-11 place-items-center rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: activeProfile?.color || "#2563eb" }}
            >
              {activeProfile?.name.slice(0, 2).toUpperCase() || "AD"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {activeProfile?.name || "Sin perfil activo"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {activeProfile?.role || adminSession?.email}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={switchProfile}
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={closeSession}
              className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-100"
            >
              Salir
            </button>
          </div>
        </div>
      </aside>
    ),
    [activeProfile, adminSession, closeSession, pathname, switchProfile],
  );

  if (!ready) return <LoadingScreen />;

  if (!adminSession && !isLoginRoute) return <LoadingScreen />;

  if (adminSession && !activeProfile && !isProfilesRoute) {
    return <LoadingScreen />;
  }

  if (isAuthRoute) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{sidebar}</div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/60 lg:hidden">
          <div className="h-full w-72">{sidebar}</div>
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-lg bg-white text-slate-950"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-20 items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Abrir menú"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold text-slate-950 sm:text-2xl">
                {currentPage.title}
              </h1>
              <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                {currentPage.subtitle}
              </p>
            </div>

            <div className="hidden min-w-72 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 xl:flex">
              <Search className="size-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Buscar motos, clientes, ventas..."
              />
            </div>

            <button
              type="button"
              onClick={switchProfile}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:inline-flex"
            >
              <UserRoundCog className="size-4" />
              {activeProfile?.name}
            </button>

            <button
              type="button"
              aria-label="Notificaciones"
              className="relative grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <Bell className="size-5" />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button
              type="button"
              aria-label="Mensajes"
              className="hidden size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 sm:grid"
            >
              <MessageSquare className="size-5" />
            </button>

            <button
              type="button"
              aria-label="Salir"
              onClick={closeSession}
              className="hidden size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:grid"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
