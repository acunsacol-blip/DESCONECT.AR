-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- OWNERS TABLE
create table owners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  status text check (status in ('active', 'suspended')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROPERTIES TABLE
create table properties (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references owners(id) not null,
  title text not null,
  description text,
  price numeric,
  youtube_id text,
  location text,
  images text[], -- Array of image URLs
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BLOCKED DATES TABLE
create table blocked_dates (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(property_id, date)
);

-- RLS POLICIES
-- We are keeping it simple: Public read access, Admin write access (handled via service role or backend/middleware check usually, but for Supabase client usage we might need policies)

alter table owners enable row level security;
alter table properties enable row level security;
alter table blocked_dates enable row level security;

-- Public Read Policies
create policy "Public owners are viewable by everyone" on owners for select using (true);
create policy "Public properties are viewable by everyone" on properties for select using (true);
create policy "Public blocked dates are viewable by everyone" on blocked_dates for select using (true);

-- Admin Write Policies (Ideally, we'd use a role key or check for a specific auth user, but for this simplified "hardcoded admin" approach, we will rely on serverside usage with Service Role Key for writing, or we can open it up if we are not assuming Authenticated Supabase User. 
-- However, since the prompt asks for a "hardcoded admin" login that uses a simple password, this likely doesn't map 1:1 to Supabase Auth Users.
-- Recommendation: We will use the Service Role Key on the server-side (Server Actions) to bypass RLS for writes. 
-- For client-side reads (if any), the above policies allow it.
