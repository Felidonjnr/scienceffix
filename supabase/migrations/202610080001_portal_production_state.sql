-- ScienceFix Personal Tutorial production persistence
-- Stores the server-side portal state in Supabase so Vercel instances share one database.

create table if not exists public.sciencefix_portal_state (
  id text primary key default 'singleton',
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.sciencefix_portal_state enable row level security;

-- No client-side access. The ScienceFix server uses the Supabase service-role key.
drop policy if exists "sciencefix_portal_state_no_client_access" on public.sciencefix_portal_state;
create policy "sciencefix_portal_state_no_client_access"
  on public.sciencefix_portal_state
  for all
  using (false)
  with check (false);

create index if not exists idx_sciencefix_portal_state_updated
  on public.sciencefix_portal_state (updated_at desc);
