-- Postcard app schema. Run once against your Neon Postgres database.

create table if not exists postcards (
  id text primary key,
  sender_name text not null default '',
  recipient_name text not null default '',
  sender_email text not null,
  recipient_email text not null,
  message text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists postcards_sender_idx on postcards (sender_email);
create index if not exists postcards_recipient_idx on postcards (recipient_email);

-- Run this against an already-existing database (one created before names were added):
-- alter table postcards add column if not exists sender_name text not null default '';
-- alter table postcards add column if not exists recipient_name text not null default '';
