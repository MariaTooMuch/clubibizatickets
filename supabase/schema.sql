-- Club Ibiza Tickets — Ambassador Tracking & Dashboard schema
-- Target: Supabase (Postgres + Row Level Security + Supabase Auth)
-- Run this in the Supabase SQL editor on a fresh project.

create extension if not exists "pgcrypto";

-- ============================================================
-- AMBASSADORS
-- ============================================================
create table ambassadors (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,                    -- 'BELLA01', 'MARIA02', ...
  auth_user_id uuid references auth.users(id),   -- Supabase Auth account for her private dashboard login
  display_name text not null,                    -- 'Bella'
  public_title text,                              -- 'Ibiza Insider'
  page_slug text unique not null,                 -- 'bella' -> /ambassadors/bella/
  photo_url text,
  instagram_url text,
  whatsapp_number text,                           -- '34625884284'
  bio text,
  commission_per_ticket numeric(10,2) not null default 1.00,
  status text not null default 'active' check (status in ('active','paused','inactive')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- ATTRIBUTION SESSIONS  (one row per visitor per 30-day attribution window)
-- ============================================================
create table attribution_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,                       -- random id stored in the visitor's browser (localStorage), not personal data
  ambassador_id uuid not null references ambassadors(id),
  entry_page text not null,                       -- '/ambassadors/bella/', '/?ref=BELLA01#unvrs', ...
  referral_source text,                            -- document.referrer host, or 'direct'
  device_category text,                             -- 'mobile' | 'desktop' | 'tablet'
  language text,                                    -- 'en' | 'pt' | 'es'
  first_touch_at timestamptz not null default now(),
  expires_at timestamptz not null,                  -- first_touch_at + 30 days
  unique (visitor_id, ambassador_id)
);
create index on attribution_sessions (ambassador_id);
create index on attribution_sessions (expires_at);

-- ============================================================
-- CLICK EVENTS  (every tracked interaction)
-- ============================================================
create table click_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references attribution_sessions(id),
  ambassador_id uuid not null references ambassadors(id),
  event_type text not null check (event_type in (
    'page_view','internal_nav','ticket_click','boat_click','activity_click',
    'drinks_click','vip_enquiry_click','club_click','more_clubs_click'
  )),
  product_category text,                            -- 'club' | 'boat_party' | 'cruise' | 'formentera' | 'ferry' | 'watersports' | 'activity' | 'drinks' | 'vip'
  venue text,                                        -- 'UNVRS' | 'Hi Ibiza' | 'Ushuaia Ibiza' | 'Chinois Ibiza' | ...
  event_name text,                                   -- 'Anyma - AEDEN', 'Pukka Up Boat Party', ...
  destination_url text,
  language text,
  device_category text,
  occurred_at timestamptz not null default now()
);
create index on click_events (ambassador_id, occurred_at);
create index on click_events (event_type);
create index on click_events (venue);

-- ============================================================
-- VIP ENQUIRIES
-- ============================================================
create table vip_enquiries (
  id uuid primary key default gen_random_uuid(),
  ambassador_id uuid not null references ambassadors(id),
  session_id uuid references attribution_sessions(id),
  venue text not null check (venue in ('UNVRS','Hi Ibiza','Ushuaia Ibiza')),
  preferred_date text,
  guests int,
  customer_name text,
  customer_contact text,                             -- only stored if the customer explicitly submitted it via the form
  consent_given boolean not null default true,        -- customer submitted the form themselves = implicit consent to be contacted about the enquiry
  enquiry_status text not null default 'new' check (enquiry_status in ('new','contacted','quoted','closed')),
  reservation_status text not null default 'pending' check (reservation_status in ('pending','confirmed','declined','cancelled')),
  commission_status text not null default 'not_applicable' check (commission_status in ('not_applicable','pending','confirmed','paid')),
  created_at timestamptz not null default now()
);
create index on vip_enquiries (ambassador_id);
create index on vip_enquiries (venue);

-- Per-venue VIP table targets, tracked separately per venue (not per ambassador, not combined)
create table vip_venue_targets (
  venue text primary key check (venue in ('UNVRS','Hi Ibiza','Ushuaia Ibiza')),
  target_count int not null default 10,
  confirmed_count int not null default 0,
  period_label text default 'current season',
  updated_at timestamptz not null default now()
);
insert into vip_venue_targets (venue, target_count, confirmed_count) values
  ('UNVRS', 10, 0), ('Hi Ibiza', 10, 0), ('Ushuaia Ibiza', 10, 0);

-- ============================================================
-- CONFIRMED SALES  (manual reconciliation from ClubTickets reports — never auto-created from clicks)
-- ============================================================
create table confirmed_sales (
  id uuid primary key default gen_random_uuid(),
  ambassador_id uuid not null references ambassadors(id),
  sale_date date not null,
  venue text not null,
  event_name text not null,
  ticket_quantity int not null check (ticket_quantity > 0),
  commission_per_ticket numeric(10,2) not null,
  commission_total numeric(10,2) generated always as (ticket_quantity * commission_per_ticket) stored,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','refunded','paid')),
  internal_note text,
  created_by uuid references auth.users(id),          -- admin who entered it
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on confirmed_sales (ambassador_id, status);

-- ============================================================
-- PAYOUTS  (batched commission payments to an ambassador)
-- ============================================================
create table payouts (
  id uuid primary key default gen_random_uuid(),
  ambassador_id uuid not null references ambassadors(id),
  period_start date not null,
  period_end date not null,
  total_amount numeric(10,2) not null,
  status text not null default 'owed' check (status in ('owed','approved','paid')),
  paid_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);
create index on payouts (ambassador_id);

-- ============================================================
-- ADMIN ROLE  (which auth.users are allowed into /admin/ambassadors/)
-- ============================================================
create table admin_users (
  auth_user_id uuid primary key references auth.users(id),
  full_name text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table ambassadors enable row level security;
alter table attribution_sessions enable row level security;
alter table click_events enable row level security;
alter table vip_enquiries enable row level security;
alter table vip_venue_targets enable row level security;
alter table confirmed_sales enable row level security;
alter table payouts enable row level security;
alter table admin_users enable row level security;

create or replace function is_admin() returns boolean
language sql security definer stable as $$
  select exists (select 1 from admin_users where auth_user_id = auth.uid());
$$;

create or replace function my_ambassador_id() returns uuid
language sql security definer stable as $$
  select id from ambassadors where auth_user_id = auth.uid();
$$;

-- Public (anon) can INSERT click/attribution/VIP rows from the site (write-only, no read)
create policy "anon can insert attribution" on attribution_sessions for insert to anon with check (true);
create policy "anon can insert clicks" on click_events for insert to anon with check (true);
create policy "anon can insert vip enquiries" on vip_enquiries for insert to anon with check (true);

-- Ambassadors can read only their own data
create policy "ambassador reads own sessions" on attribution_sessions for select using (ambassador_id = my_ambassador_id() or is_admin());
create policy "ambassador reads own clicks" on click_events for select using (ambassador_id = my_ambassador_id() or is_admin());
create policy "ambassador reads own vip" on vip_enquiries for select using (ambassador_id = my_ambassador_id() or is_admin());
create policy "ambassador reads own sales" on confirmed_sales for select using (ambassador_id = my_ambassador_id() or is_admin());
create policy "ambassador reads own payouts" on payouts for select using (ambassador_id = my_ambassador_id() or is_admin());
create policy "ambassador reads own profile" on ambassadors for select using (auth_user_id = auth.uid() or is_admin());

-- Only admins can write reconciliation data
create policy "admin manages sales" on confirmed_sales for all using (is_admin()) with check (is_admin());
create policy "admin manages payouts" on payouts for all using (is_admin()) with check (is_admin());
create policy "admin manages ambassadors" on ambassadors for all using (is_admin()) with check (is_admin());
create policy "admin manages vip targets" on vip_venue_targets for all using (is_admin()) with check (is_admin());
create policy "admin reads vip targets" on vip_venue_targets for select using (true);
create policy "admin manages vip status" on vip_enquiries for update using (is_admin()) with check (is_admin());

-- Seed Bella
insert into ambassadors (code, display_name, public_title, page_slug, instagram_url, whatsapp_number, commission_per_ticket, status)
values ('BELLA01', 'Bella', 'Ibiza Insider', 'bella', 'https://www.instagram.com/icalderone/', '34625884284', 1.00, 'active');
