# MotoCenter

Sistema de gestión para agencia de motos: stock, clientes, ventas, financiación, sucursales y reportes.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.

## Acceso demo

Administrador:

- Correo: `admin@motocenter.com`
- Contraseña: `MotoCenter2026`

PINs iniciales:

- Administrador: `0000`
- Camila Ríos: `1234`
- Matías Torres: `2468`
- Nicolás Vega: `9876`

Este login es mock local para probar el flujo. La versión productiva real debe conectar Supabase Auth o un proveedor como Clerk.

## Variables

Copiá `.env.example` a `.env.local` y completá las credenciales de Supabase cuando el proyecto exista.

## Base de datos

Los scripts están en:

- `supabase/schema.sql`
- `supabase/seed.sql`

## Mantenimiento

Desde `Reportes > Mantenimiento de datos` se puede descargar un backup JSON, importar un backup compatible y restaurar datos base.

Para migrar la información real desde Drive, ver `docs/DATA_MIGRATION.md`.

## Experiencia

La app incluye una pantalla de carga temática de motos entre secciones, con tips de taller y mensajes rotativos.

## Deploy

El proyecto está preparado para Vercel. No necesita Render en esta etapa porque Next.js y Supabase cubren frontend, server runtime, base de datos y auth.
