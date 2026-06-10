create extension if not exists "pgcrypto";

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  address text not null,
  manager text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dni text not null unique,
  phone text not null,
  email text not null,
  city text not null,
  status text not null default 'Nuevo',
  balance numeric(12, 2) not null default 0,
  next_due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.motorcycles (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid references public.branches(id) on delete set null,
  brand text not null,
  model text not null,
  category text not null,
  price numeric(12, 2) not null,
  cost numeric(12, 2) not null,
  stock integer not null default 0,
  status text not null default 'Disponible',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  motorcycle_id uuid not null references public.motorcycles(id),
  branch_id uuid references public.branches(id),
  price numeric(12, 2) not null,
  payment_method text not null,
  seller text not null,
  status text not null default 'Confirmada',
  sold_at timestamptz not null default now()
);

create table if not exists public.financing_contracts (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  customer_id uuid not null references public.customers(id),
  motorcycle_id uuid not null references public.motorcycles(id),
  total numeric(12, 2) not null,
  down_payment numeric(12, 2) not null,
  financed_amount numeric(12, 2) not null,
  installments integer not null,
  installment_amount numeric(12, 2) not null,
  paid_installments integer not null default 0,
  next_due_date date not null,
  status text not null default 'Activa',
  overdue_amount numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  financing_id uuid not null references public.financing_contracts(id) on delete cascade,
  amount numeric(12, 2) not null,
  installment_number integer not null,
  paid_at timestamptz not null default now(),
  payment_method text not null default 'Transferencia'
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  motorcycle_id uuid not null references public.motorcycles(id) on delete cascade,
  branch_id uuid references public.branches(id),
  movement_type text not null,
  quantity integer not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.branches enable row level security;
alter table public.customers enable row level security;
alter table public.motorcycles enable row level security;
alter table public.sales enable row level security;
alter table public.financing_contracts enable row level security;
alter table public.payments enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.profiles enable row level security;

create policy "Authenticated users can read branches"
  on public.branches for select to authenticated using (true);
create policy "Authenticated users can manage branches"
  on public.branches for all to authenticated using (true) with check (true);

create policy "Authenticated users can read customers"
  on public.customers for select to authenticated using (true);
create policy "Authenticated users can manage customers"
  on public.customers for all to authenticated using (true) with check (true);

create policy "Authenticated users can read motorcycles"
  on public.motorcycles for select to authenticated using (true);
create policy "Authenticated users can manage motorcycles"
  on public.motorcycles for all to authenticated using (true) with check (true);

create policy "Authenticated users can read sales"
  on public.sales for select to authenticated using (true);
create policy "Authenticated users can manage sales"
  on public.sales for all to authenticated using (true) with check (true);

create policy "Authenticated users can read financing"
  on public.financing_contracts for select to authenticated using (true);
create policy "Authenticated users can manage financing"
  on public.financing_contracts for all to authenticated using (true) with check (true);

create policy "Authenticated users can read payments"
  on public.payments for select to authenticated using (true);
create policy "Authenticated users can manage payments"
  on public.payments for all to authenticated using (true) with check (true);

create policy "Authenticated users can read inventory movements"
  on public.inventory_movements for select to authenticated using (true);
create policy "Authenticated users can manage inventory movements"
  on public.inventory_movements for all to authenticated using (true) with check (true);

create policy "Users can read their profile"
  on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users can update their profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

create index if not exists customers_dni_idx on public.customers(dni);
create index if not exists motorcycles_branch_id_idx on public.motorcycles(branch_id);
create index if not exists sales_sold_at_idx on public.sales(sold_at desc);
create index if not exists financing_next_due_date_idx
  on public.financing_contracts(next_due_date);
