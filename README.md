# RE Motos

Sistema de gestion para RE Motos: stock, clientes, ventas, financiacion, sucursales, reportes e instalacion como app.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Acceso inicial

Administrador:

- Correo: `admin@remotos.com`
- Contrasena: `REMotos2026`

Perfiles productivos:

- Administrador: PIN `1234`
- Manuel: PIN `1234`
- Valentin: PIN `1234`

Cada perfil puede cambiar su PIN y cargar su foto desde la pantalla de perfiles.

## Produccion

La app queda preparada para Vercel como PWA instalable. Los datos se guardan localmente en el navegador y se pueden respaldar/importar desde `Reportes > Mantenimiento de datos`.

Stock inicial cargado desde la lista de precios de RE Motos del 10/06/2026. Los modelos en dolares se guardan como `USD` para no mezclarlos con totales en pesos.

## Pendiente recomendado

Para operacion multi-dispositivo real, migrar persistencia a Supabase:

- Auth real para administrador.
- Tabla de perfiles con PIN hasheado.
- Tabla de motos, clientes, ventas, financiaciones y bitacora.
- Storage para fotos de perfiles y motos.
