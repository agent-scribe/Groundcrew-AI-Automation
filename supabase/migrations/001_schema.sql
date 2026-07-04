-- Groundcrew schema (PRD §5 adaptation)
-- Run this in the Supabase SQL editor to bootstrap the database.

-- ────────────────────────────────────────────
-- 1. Orgs
-- ────────────────────────────────────────────
create table if not exists public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'free' check (plan in ('free','pro','enterprise')),
  created_at timestamptz not null default now()
);

alter table public.orgs enable row level security;

create policy "Org members can read their org"
  on public.orgs for select
  using (
    id in (
      select org_id from public.org_members where user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────
-- 2. Org members
-- ────────────────────────────────────────────
create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique(org_id, user_id)
);

alter table public.org_members enable row level security;

create policy "Members can see co-members"
  on public.org_members for select
  using (
    org_id in (
      select org_id from public.org_members where user_id = auth.uid()
    )
  );

create policy "Owners can manage members"
  on public.org_members for all
  using (
    org_id in (
      select org_id from public.org_members where user_id = auth.uid() and role = 'owner'
    )
  );

-- ────────────────────────────────────────────
-- 3. Projects (one per SOW upload)
-- ────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  name text not null,
  client_name text not null default '',
  client_email text not null default '',
  status text not null default 'runway'
    check (status in ('runway','review','cleared','pushed','portal_active','complete')),
  sow_storage_path text,
  portal_token text not null default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Org members can CRUD projects"
  on public.projects for all
  using (
    org_id in (
      select org_id from public.org_members where user_id = auth.uid()
    )
  );

-- Portal visitors can read their project by token (anon)
create policy "Portal access by token"
  on public.projects for select
  using (true);  -- token-gated at app level

-- ────────────────────────────────────────────
-- 4. Extractions
-- ────────────────────────────────────────────
create table if not exists public.extractions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  pass smallint not null check (pass in (1,2)),
  raw_json jsonb not null default '{}',
  item_count int not null default 0,
  verified_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.extractions enable row level security;

create policy "Org members can manage extractions"
  on public.extractions for all
  using (
    project_id in (
      select id from public.projects where org_id in (
        select org_id from public.org_members where user_id = auth.uid()
      )
    )
  );

-- ────────────────────────────────────────────
-- 5. Extraction items (individual line items from SOW)
-- ────────────────────────────────────────────
create table if not exists public.extraction_items (
  id uuid primary key default gen_random_uuid(),
  extraction_id uuid not null references public.extractions(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  category text not null default '',
  cite_id text,
  page int,
  status text not null default 'verified'
    check (status in ('verified','needs_review','waived')),
  waive_reason text,
  pushed_task_id text,
  created_at timestamptz not null default now()
);

alter table public.extraction_items enable row level security;

create policy "Org members can manage extraction items"
  on public.extraction_items for all
  using (
    project_id in (
      select id from public.projects where org_id in (
        select org_id from public.org_members where user_id = auth.uid()
      )
    )
  );

-- ────────────────────────────────────────────
-- 6. Portal checklist
-- ────────────────────────────────────────────
create table if not exists public.portal_checklist (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  step text not null,
  label text not null,
  done boolean not null default false,
  done_at timestamptz
);

alter table public.portal_checklist enable row level security;

-- Portal visitors (anon) can read + update checklist for their project
create policy "Portal checklist access"
  on public.portal_checklist for all
  using (true);  -- token-gated at app level

-- ────────────────────────────────────────────
-- 7. Chase events (email/slack audit trail)
-- ────────────────────────────────────────────
create table if not exists public.chase_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  channel text not null default 'email' check (channel in ('email','slack')),
  subject text not null,
  sent_at timestamptz not null default now()
);

alter table public.chase_events enable row level security;

create policy "Org members can view chase events"
  on public.chase_events for select
  using (
    project_id in (
      select id from public.projects where org_id in (
        select org_id from public.org_members where user_id = auth.uid()
      )
    )
  );

-- ────────────────────────────────────────────
-- 8. Storage bucket for SOW uploads
-- ────────────────────────────────────────────
insert into storage.buckets (id, name, public) 
  values ('sow-uploads', 'sow-uploads', false)
  on conflict do nothing;

create policy "Authenticated users can upload SOWs"
  on storage.objects for insert
  with check (bucket_id = 'sow-uploads' and auth.role() = 'authenticated');

create policy "Org members can read SOW files"
  on storage.objects for select
  using (bucket_id = 'sow-uploads' and auth.role() = 'authenticated');

-- ────────────────────────────────────────────
-- 9. Auto-update updated_at trigger
-- ────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- ────────────────────────────────────────────
-- 10. Auto-create org on first sign-up (convenience)
-- ────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
begin
  insert into public.orgs (name, slug)
    values (
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      replace(new.id::text, '-', '')
    )
    returning id into new_org_id;

  insert into public.org_members (org_id, user_id, role)
    values (new_org_id, new.id, 'owner');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
