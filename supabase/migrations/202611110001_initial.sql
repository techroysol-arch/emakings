-- Apply once in the Supabase SQL editor, or with `supabase db push`.
create extension if not exists pgcrypto;

create table public.profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (length(display_name)<=100),
 created_at timestamptz not null default now()
);
create table public.relationships (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (length(name) between 1 and 100),
 category text not null check (length(category) between 1 and 60),
 interests text not null default '' check (length(interests)<=1000),
 notes text not null default '' check (length(notes)<=2000),
 important_date date,
 occasion text not null default '' check (length(occasion)<=100),
 created_at timestamptz not null default now()
);
create table public.reminders (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (length(title) between 1 and 150),
 date date not null,
 time text not null check(time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
 description text not null default '' check(length(description)<=1000),
 completed boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.ai_generations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 occasion text not null check(length(occasion)<=150),
 category text not null check(length(category)<=100),
 result jsonb not null,
 created_at timestamptz not null default now()
);
create table public.user_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check(length(display_name)<=100),
 save_generations boolean not null default true,
 created_at timestamptz not null default now()
);
create table public.waitlist_subscribers (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(name) between 1 and 100),
 email text unique not null check(length(email)<=254),
 created_at timestamptz not null default now()
);
create table public.rate_limit_buckets (
 key text primary key,
 count integer not null default 1,
 reset_at timestamptz not null
);

create index relationships_user_created on public.relationships(user_id,created_at desc);
create index reminders_user_date on public.reminders(user_id,date);
create index ai_generations_user_created on public.ai_generations(user_id,created_at desc);
create index rate_limit_expiry on public.rate_limit_buckets(reset_at);

alter table public.profiles enable row level security;
alter table public.relationships enable row level security;
alter table public.reminders enable row level security;
alter table public.ai_generations enable row level security;
alter table public.user_preferences enable row level security;
alter table public.waitlist_subscribers enable row level security;
alter table public.rate_limit_buckets enable row level security;

create policy own_profiles on public.profiles for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_relationships on public.relationships for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_reminders on public.reminders for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_preferences on public.user_preferences for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy read_own_generations on public.ai_generations for select to authenticated using ((select auth.uid())=user_id);
create policy insert_own_generations on public.ai_generations for insert to authenticated with check ((select auth.uid())=user_id);
create policy delete_own_generations on public.ai_generations for delete to authenticated using ((select auth.uid())=user_id);
-- Waitlist and rate limits intentionally have no public policies. Server service role only.
revoke all on public.waitlist_subscribers, public.rate_limit_buckets from anon, authenticated;
grant select,insert,update,delete on public.profiles, public.relationships, public.reminders, public.user_preferences to authenticated;
grant select,insert,delete on public.ai_generations to authenticated;

create or replace function public.initialize_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(user_id,display_name) values(new.id,left(coalesce(new.raw_user_meta_data->>'display_name',''),100));
 insert into public.user_preferences(user_id,display_name) values(new.id,left(coalesce(new.raw_user_meta_data->>'display_name',''),100));
 return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.initialize_user();

-- One atomic upsert prevents concurrent invocations bypassing the limit.
create or replace function public.consume_rate_limit(bucket_key text,max_requests integer,window_seconds integer)
returns boolean language plpgsql security definer set search_path='' as $$
declare current_count integer;
begin
 if max_requests<1 or window_seconds<1 then return false; end if;
 delete from public.rate_limit_buckets where reset_at<now()-interval '1 day';
 insert into public.rate_limit_buckets as bucket(key,count,reset_at)
 values(bucket_key,1,now()+make_interval(secs=>window_seconds))
 on conflict(key) do update set
 count=case when bucket.reset_at<=now() then 1 else bucket.count+1 end,
 reset_at=case when bucket.reset_at<=now() then now()+make_interval(secs=>window_seconds) else bucket.reset_at end
 returning count into current_count;
 return current_count<=max_requests;
end;
$$;
revoke all on function public.consume_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer,integer) to service_role;
revoke all on function public.initialize_user() from public,anon,authenticated;
