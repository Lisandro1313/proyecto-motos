# MotoCenter - Arquitectura

## Stack

- Frontend: Next.js App Router, TypeScript y Tailwind CSS.
- Deploy: Vercel.
- Base de datos futura: Supabase Postgres.
- Auth futura: Supabase Auth o Clerk.
- Backend extra: no hace falta Render para este MVP.

## Modulos

- Dashboard: metricas generales, ventas mensuales, stock, ventas recientes y sucursales.
- Inventario: alta de motos, precio, costo, sucursal, imagen, stock y ajustes.
- Clientes: ficha comercial, DNI, contacto, saldo, estado y vencimiento.
- Ventas: registro de operacion por perfil activo, forma de pago y descuento de stock.
- Financiacion: simulador de cuotas, contratos activos, mora y registro de pagos.
- Sucursales: performance por local, stock y ventas.
- Reportes: margen, mora, alertas de stock, trabajo por perfil y bitacora.
- Login: acceso administrador por correo y contrasena.
- Perfiles: seleccion de trabajador por PIN, inicio de turno y alta de subperfiles.

## Flujo de acceso

1. El administrador ingresa por `/login`.
2. La app redirige a `/perfiles`.
3. Un trabajador elige su perfil e ingresa PIN.
4. El panel queda habilitado con ese perfil activo.
5. Las ventas y cobros se registran con ese trabajador.

## Supabase

1. Crear un proyecto en Supabase.
2. Abrir SQL Editor.
3. Ejecutar `supabase/schema.sql`.
4. Ejecutar `supabase/seed.sql` si queres datos iniciales.
5. Copiar `Project URL` y `anon public key`.
6. Crear `.env.local` desde `.env.example`.

Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Seguridad

El login actual es local/mock para validar experiencia en produccion sin bloquear el avance. La version real debe llevar administrador y subperfiles a Supabase Auth mas tablas internas para perfiles, PIN hasheado, turnos y bitacora.

El SQL deja Row Level Security activo y permite gestion solo a usuarios autenticados. Para produccion conviene reforzar roles por vendedor/gerente y auditoria de cambios.

## Deploy

1. Subir el repo a GitHub.
2. Importarlo en Vercel.
3. Agregar las mismas variables de `.env.local`.
4. Deployar.

Render solo seria necesario si despues se agrega un servicio externo pesado, por ejemplo integracion con AFIP, facturacion, webhooks complejos, jobs programados o scraping de listas de precios.
