# Plan de migración de datos

## Objetivo

Pasar los datos actuales de la agencia al sistema sin perder trazabilidad de stock, clientes, ventas, cuotas y perfiles.

## Archivos ideales desde Drive

- `motos` o `inventario`: marca, modelo, categoría, precio, costo, stock, sucursal, estado.
- `clientes`: nombre, DNI, teléfono, email, ciudad, saldo, vencimiento, estado.
- `ventas`: fecha, cliente, moto, precio, forma de pago, sucursal, vendedor.
- `financiaciones`: cliente, moto, total, entrega, monto financiado, cuotas, cuotas pagas, próximo vencimiento, mora.
- `usuarios`: nombre, rol, sucursal, PIN inicial o identificador.
- `sucursales`: nombre, dirección, ciudad, gerente.

## Primer paso disponible ahora

En `Reportes > Mantenimiento de datos` se puede:

- Descargar un backup JSON del estado actual.
- Importar un backup JSON compatible.
- Restaurar los datos base.

## Paso siguiente

Cuando llegue el Drive, conviene revisar columnas reales, limpiar duplicados por DNI/modelo, mapear vendedores a perfiles y generar un importador específico para esos archivos.
