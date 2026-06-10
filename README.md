# MotoCenter

Sistema de gestión para agencia de motos: stock, clientes, ventas, financiación, sucursales y reportes.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.

## Variables

Copiá `.env.example` a `.env.local` y completá las credenciales de Supabase cuando el proyecto exista.

## Base de datos

Los scripts están en:

- `supabase/schema.sql`
- `supabase/seed.sql`

## Deploy

El proyecto está preparado para Vercel. No necesita Render en esta etapa porque Next.js y Supabase cubren frontend, server runtime, base de datos y auth.
