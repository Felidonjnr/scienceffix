create table if not exists public.science_restart_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  age_range text,
  previous_background text,
  desired_pathway text,
  science_status text,
  biggest_challenge text,
  last_studied_science text,
  employment_status text,
  preferred_schedule text,
  target_year text default '2027',
  wants_founding_cohort boolean default true,
  willingness_to_pay text,
  source text,
  notes text
);

create index if not exists science_restart_leads_created_at_idx
  on public.science_restart_leads (created_at desc);

create index if not exists science_restart_leads_pathway_idx
  on public.science_restart_leads (desired_pathway);

alter table public.science_restart_leads enable row level security;

-- No public SELECT/INSERT policy is created.
-- The server writes through the Supabase service-role key only.
