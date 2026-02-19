-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  preferences jsonb default '{"theme": "system", "daily_energy_reset_time": "04:00"}'::jsonb
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Handle new user signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tasks Table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  effort int check (effort between 1 and 10) default 5,
  due_date timestamptz,
  category text check (category in ('Personal', 'Digital', 'Relationships', 'Professional', 'Misc')) default 'Misc',
  recurrence_type text check (recurrence_type in ('none', 'daily', 'weekly', 'monthly', 'custom')) default 'none',
  recurrence_value jsonb,
  is_completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  project_id uuid, -- foreign key to projects if added
  tags text[] default array[]::text[]
);

alter table public.tasks enable row level security;
create policy "Users can CRUD own tasks" on public.tasks for all using (auth.uid() = user_id);

-- Energy Logs Table
create table public.energy_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null, -- YYYY-MM-DD
  level int check (level between 1 and 10) not null,
  notes text,
  timestamp timestamptz default now(),
  unique(user_id, date) -- One log per day per user
);

alter table public.energy_logs enable row level security;
create policy "Users can CRUD own energy logs" on public.energy_logs for all using (auth.uid() = user_id);
