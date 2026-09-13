-- Postcard app schema. Run once against your Neon Postgres database.

create table if not exists postcards (
  id text primary key,
  sender_email text not null,
  recipient_email text not null,
  message text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists postcards_sender_idx on postcards (sender_email);
create index if not exists postcards_recipient_idx on postcards (recipient_email);
