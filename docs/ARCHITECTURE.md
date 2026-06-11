# RE Motos - Arquitectura

## Stack

- Frontend: Next.js App Router, TypeScript y Tailwind CSS.
- Deploy: Vercel.
- Persistencia: Firebase Firestore (datos compartidos en vivo) + Firebase Auth (login admin).
- Sincronizacion en tiempo real entre dispositivos via onSnapshot.
- Fotos de motos: pendiente (fase 2: Cloudinary o Firebase Storage/Blaze).

## Modulos

- Dashboard: metricas reales desde ventas, stock y financiacion.
- Inventario: alta de motos, foto, moneda, precio, costo, ingreso de unidades y auditoria de cambios.
- Clientes: ficha comercial y estado de cuenta.
- Ventas: registro por perfil activo y descuento automatico de stock.
- Financiacion: simulador por planes y cobros de cuotas.
- Reportes: margen, mora, alertas, trabajo por perfil, bitacora y backup/importacion.
- Login: acceso administrador mock local.
- Perfiles: Administrador, Manuel y Valentin, con PIN y foto editables.

## Flujo de acceso

1. El administrador ingresa por `/login`.
2. La app redirige a `/perfiles`.
3. Un trabajador elige su perfil e ingresa PIN.
4. El panel queda habilitado con ese perfil activo.
5. Las ventas, cobros, ingresos de stock y cambios de precio quedan registrados en bitacora.

## Datos productivos iniciales

- Marca: RE Motos.
- Logo: `public/re-motos-logo.jpeg`.
- Lista de precios: importada desde el PDF entregado el 10/06/2026.
- Perfiles: Administrador, Manuel y Valentin, todos con PIN inicial `1234`.
- Ventas, clientes y financiaciones: base limpia, sin datos demo.

## Deploy

1. Subir el repo a GitHub.
2. Importarlo en Vercel.
3. Deployar.
4. En cada dispositivo, usar el boton `Instalar aplicacion`.

## Seguridad

- Login admin: Firebase Auth (email/password real).
- Datos: Firestore con reglas que exigen sesion iniciada (`request.auth != null`).
- Perfiles de trabajo (PIN) y bitacora viven en Firestore, compartidos entre dispositivos.
- Pendiente/mejora: PIN hasheado y reglas por rol mas finas si se suman mas usuarios.
