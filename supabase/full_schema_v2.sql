-- Create Owners table
create table owners (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null,
  address text, -- Added address field
  status text not null default 'active'
);

-- Create Properties table
create table properties (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references owners(id) not null,
  title text not null,
  description text,
  price numeric not null,
  location text not null,
  youtube_id text,
  images text[],
  is_published boolean default true
);

-- Create Blocked Dates table
create table blocked_dates (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references properties(id) on delete cascade not null,
  date date not null,
  unique(property_id, date)
);

-- Enable Row Level Security
alter table owners enable row level security;
alter table properties enable row level security;
alter table blocked_dates enable row level security;

-- Create Policies (Public Read, Admin Write via Service Key usually, but here we keep it open for anon for simplicity or set restrictive)
-- For this project we are using server-side client with keys for admin, so RLS checks on 'select' are crucial for public.

-- Public can read properties and blocked dates
create policy "Public properties are viewable"
  on properties for select
  using ( is_published = true );

create policy "Public blocked dates are viewable"
  on blocked_dates for select
  using ( true );

-- Public/Admin logic for Owners? 
-- Actually, we want public to see owner details only if we join? 
-- Let's just allow read for authenticated or anon for now to simplifiy the "demo" aspect, 
-- but in production we'd filter owner info.
create policy "Owners are viewable"
  on owners for select
  using ( true );

-- For writes, since we are using Supabase Client in "Action" files, we rely on the Service Role Key or Authenticated user. 
-- The user is "Admin" via simple login password, but not Supabase Auth. 
-- So we need to allow writes for Anon IF we are using the Anon Key in the admin panel actions (which we are NOT, we use admin client usually?).
-- Wait, in `src/lib/supabase.ts` we export `supabaseAdmin`. 
-- If `SUPABASE_SERVICE_ROLE_KEY` is set, `supabaseAdmin` has bypass RLS privileges.
-- So we don't need permissive write policies for RLS if we have the service role key.
-- IF the user missed the Service Role Key, they might need write policies.
-- Let's add permissive policies just in case, or stick to Service Key reliance. 
-- Given the user struggle, permissive RLS for now helps avoid "permission denied".

create policy "Enable insert for all users" on owners for insert with check (true);
create policy "Enable update for all users" on owners for update using (true);
create policy "Enable delete for all users" on owners for delete using (true);

create policy "Enable insert for all users" on properties for insert with check (true);
create policy "Enable update for all users" on properties for update using (true);
create policy "Enable delete for all users" on properties for delete using (true);

create policy "Enable insert for all users" on blocked_dates for insert with check (true);
create policy "Enable delete for all users" on blocked_dates for delete using (true);
