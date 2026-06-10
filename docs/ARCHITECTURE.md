# MotoCenter - Arquitectura

## Stack

- Frontend: Next.js App Router, TypeScript y Tailwind CSS.
- Deploy: Vercel.
- Base de datos: Supabase Postgres.
- Auth recomendada: Supabase Auth con usuarios internos de la agencia.
- Backend extra: no hace falta Render para este MVP.

## Módulos

- Dashboard: métricas generales, ventas mensuales, stock, ventas recientes y sucursales.
- Inventario: alta de motos, precio, costo, sucursal, imagen, stock y ajustes.
- Clientes: ficha comercial, DNI, contacto, saldo, estado y vencimiento.
- Ventas: registro de operación, vendedor, forma de pago y descuento de stock.
- Financiación: simulador de cuotas, contratos activos, mora y registro de pagos.
- Sucursales: performance por local, stock y ventas.
- Reportes: margen, mora, alertas de stock y ventas por vendedor.

## Supabase

1. Crear un proyecto en Supabase.
2. Abrir SQL Editor.
3. Ejecutar `supabase/schema.sql`.
4. Ejecutar `supabase/seed.sql` si querés datos iniciales.
5. Copiar `Project URL` y `anon public key`.
6. Crear `.env.local` desde `.env.example`.

Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Seguridad

El SQL deja Row Level Security activo y permite gestión solo a usuarios autenticados. Para producción conviene agregar pantalla de login, roles por vendedor/gerente y auditoría de cambios.

## Deploy

1. Subir el repo a GitHub.
2. Importarlo en Vercel.
3. Agregar las mismas variables de `.env.local`.
4. Deployar.

Render solo sería necesario si después se agrega un servicio externo pesado, por ejemplo integración con AFIP, facturación, webhooks complejos, jobs programados o scraping de listas de precios.
