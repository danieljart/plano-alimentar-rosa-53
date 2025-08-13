-- Meal planning tables for Gemini-generated plans
-- 1) meal_plans: root per user per week
create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  week_start date not null,
  total_kcal integer not null,
  gosta_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start)
);

alter table public.meal_plans enable row level security;

-- 2) meal_plan_days: 0..6 within a plan
create table if not exists public.meal_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.meal_plans(id) on delete cascade,
  day_index smallint not null check (day_index between 0 and 6),
  date date,
  total_kcal integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(plan_id, day_index)
);

alter table public.meal_plan_days enable row level security;

-- 3) meals: per day, named meal with time
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.meal_plan_days(id) on delete cascade,
  name text not null,
  time text not null,
  calories integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_meals_day_id on public.meals(day_id);

alter table public.meals enable row level security;

-- 4) meal_items: items within a meal with computed nutrition
create table if not exists public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  food_id text not null,
  food_name text not null,
  category text,
  unit text,
  quantity numeric(10,2),         -- e.g., units/fatias/colheres
  quantity_g numeric(10,2),       -- grams/ml when applicable
  calories numeric(10,2) not null,
  protein_g numeric(10,2) not null,
  carbs_g numeric(10,2) not null,
  fat_g numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_meal_items_meal_id on public.meal_items(meal_id);

alter table public.meal_items enable row level security;

-- Updated_at triggers
create trigger trg_meal_plans_updated
before update on public.meal_plans
for each row execute function public.update_updated_at_column();

create trigger trg_meal_plan_days_updated
before update on public.meal_plan_days
for each row execute function public.update_updated_at_column();

create trigger trg_meals_updated
before update on public.meals
for each row execute function public.update_updated_at_column();

create trigger trg_meal_items_updated
before update on public.meal_items
for each row execute function public.update_updated_at_column();

-- RLS Policies
-- meal_plans: owner or admin
create policy if not exists "Users manage own meal_plans"
  on public.meal_plans
  for all
  using (user_id = auth.uid() or has_role(auth.uid(), 'admin'))
  with check (user_id = auth.uid() or has_role(auth.uid(), 'admin'));

-- meal_plan_days reference meal_plans
create policy if not exists "Users read/write own plan days"
  on public.meal_plan_days
  for all
  using (exists (
    select 1 from public.meal_plans p
    where p.id = plan_id and (p.user_id = auth.uid() or has_role(auth.uid(), 'admin'))
  ))
  with check (exists (
    select 1 from public.meal_plans p
    where p.id = plan_id and (p.user_id = auth.uid() or has_role(auth.uid(), 'admin'))
  ));

-- meals reference days -> plans
create policy if not exists "Users read/write own meals"
  on public.meals
  for all
  using (exists (
    select 1
    from public.meal_plan_days d
    join public.meal_plans p on p.id = d.plan_id
    where d.id = day_id and (p.user_id = auth.uid() or has_role(auth.uid(), 'admin'))
  ))
  with check (exists (
    select 1
    from public.meal_plan_days d
    join public.meal_plans p on p.id = d.plan_id
    where d.id = day_id and (p.user_id = auth.uid() or has_role(auth.uid(), 'admin'))
  ));

-- meal_items reference meals -> days -> plans
create policy if not exists "Users read/write own meal items"
  on public.meal_items
  for all
  using (exists (
    select 1
    from public.meals m
    join public.meal_plan_days d on d.id = m.day_id
    join public.meal_plans p on p.id = d.plan_id
    where m.id = meal_id and (p.user_id = auth.uid() or has_role(auth.uid(), 'admin'))
  ))
  with check (exists (
    select 1
    from public.meals m
    join public.meal_plan_days d on d.id = m.day_id
    join public.meal_plans p on p.id = d.plan_id
    where m.id = meal_id and (p.user_id = auth.uid() or has_role(auth.uid(), 'admin'))
  ));
