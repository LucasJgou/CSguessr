-- À coller dans Supabase → SQL Editor → Run

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lat double precision not null check (lat between 48.69 and 48.73),
  lng double precision not null check (lng between 2.14 and 2.20),
  path text not null,
  approved boolean not null default false
);

alter table public.photos enable row level security;

-- Tout le monde lit uniquement les photos validées
create policy "lecture des photos validees" on public.photos
  for select to anon using (approved = true);

-- Tout le monde peut proposer une photo, mais jamais déjà validée
create policy "proposition de photo" on public.photos
  for insert to anon with check (approved = false);

-- Dossier de stockage public en lecture, 1,5 Mo max, JPEG uniquement
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 1500000, array['image/jpeg']);

create policy "envoi de photo" on storage.objects
  for insert to anon with check (bucket_id = 'photos');
