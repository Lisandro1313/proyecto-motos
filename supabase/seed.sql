insert into public.branches (id, name, city, address, manager)
values
  ('11111111-1111-4111-8111-111111111111', 'Casa Central', 'Buenos Aires', 'Av. Corrientes 1420', 'Daniel Morales'),
  ('22222222-2222-4222-8222-222222222222', 'Sucursal Norte', 'Córdoba', 'Rafael Núñez 3880', 'Valeria Flores'),
  ('33333333-3333-4333-8333-333333333333', 'Sucursal Oeste', 'Mendoza', 'San Martín 720', 'Pablo Acosta')
on conflict (id) do nothing;

insert into public.motorcycles
  (id, branch_id, brand, model, category, price, cost, stock, status, image_url)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-1111-4111-8111-111111111111', 'Motomel', 'Blitz 110 Full', 'Street', 1730000, 1320000, 14, 'Disponible', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '22222222-2222-4222-8222-222222222222', 'Gilera', 'Smash 110', 'Street', 1800000, 1390000, 12, 'Disponible', 'https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '11111111-1111-4111-8111-111111111111', 'Honda', 'Dax 70', 'Cub', 2250000, 1790000, 6, 'Disponible', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=900&q=80'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', '11111111-1111-4111-8111-111111111111', 'Kove', '525X', 'Trail', 13967000, 11250000, 2, 'Últimas unidades', 'https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=900&q=80')
on conflict (id) do nothing;

insert into public.customers
  (id, name, dni, phone, email, city, status, balance, next_due_date)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Juan Silva', '31.428.902', '+54 9 351 611-2040', 'juan.silva@email.com', 'Córdoba', 'Al día', 0, null),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'María Rodríguez', '28.884.710', '+54 9 351 590-1122', 'maria.rodriguez@email.com', 'Villa Allende', 'Activo', 343116, '2026-06-20'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'Agustín Cortez', '34.122.334', '+54 9 351 700-9081', 'agustin.cortez@email.com', 'Córdoba', 'Mora', 392132, '2026-06-06')
on conflict (id) do nothing;

insert into public.sales
  (id, customer_id, motorcycle_id, branch_id, price, payment_method, seller, status, sold_at)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-1111-4111-8111-111111111111', 1730000, 'Contado', 'Camila Ríos', 'Confirmada', '2026-05-31 10:00:00-03'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '22222222-2222-4222-8222-222222222222', 1800000, 'Financiación', 'Matías Torres', 'Confirmada', '2026-05-30 11:30:00-03')
on conflict (id) do nothing;

insert into public.financing_contracts
  (id, sale_id, customer_id, motorcycle_id, total, down_payment, financed_amount, installments, installment_amount, paid_installments, next_due_date, status, overdue_amount)
values
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 1800000, 360000, 1440000, 6, 240000, 2, '2026-06-20', 'Activa', 0)
on conflict (id) do nothing;
