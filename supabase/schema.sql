-- Supabase schema for Snowball Coach
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.debts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name         text not null default 'New debt',
  balance      numeric(12, 2) not null default 0,
  min_payment  numeric(12, 2) not null default 0,
  interest_rate numeric(6, 3) not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists debts_user_id_idx on public.debts(user_id);

create table if not exists public.payment_history (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users(id) on delete cascade,
  debt_id           uuid not null references public.debts(id) on delete cascade,
  amount            numeric(12, 2) not null,
  remaining_balance numeric(12, 2) not null,
  paid_on           date not null default current_date,
  note              text,
  created_at        timestamptz not null default now()
);

create index if not exists payment_history_user_id_idx on public.payment_history(user_id);
create index if not exists payment_history_debt_id_idx on public.payment_history(debt_id);

-- Row Level Security
alter table public.debts enable row level security;
alter table public.payment_history enable row level security;

drop policy if exists "debts_select_own" on public.debts;
create policy "debts_select_own" on public.debts
  for select using (auth.uid() = user_id);

drop policy if exists "debts_insert_own" on public.debts;
create policy "debts_insert_own" on public.debts
  for insert with check (auth.uid() = user_id);

drop policy if exists "debts_update_own" on public.debts;
create policy "debts_update_own" on public.debts
  for update using (auth.uid() = user_id);

drop policy if exists "debts_delete_own" on public.debts;
create policy "debts_delete_own" on public.debts
  for delete using (auth.uid() = user_id);

drop policy if exists "ph_select_own" on public.payment_history;
create policy "ph_select_own" on public.payment_history
  for select using (auth.uid() = user_id);

drop policy if exists "ph_insert_own" on public.payment_history;
create policy "ph_insert_own" on public.payment_history
  for insert with check (auth.uid() = user_id);

drop policy if exists "ph_update_own" on public.payment_history;
create policy "ph_update_own" on public.payment_history
  for update using (auth.uid() = user_id);

drop policy if exists "ph_delete_own" on public.payment_history;
create policy "ph_delete_own" on public.payment_history
  for delete using (auth.uid() = user_id);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists debts_set_updated_at on public.debts;
create trigger debts_set_updated_at
  before update on public.debts
  for each row execute function public.set_updated_at();
