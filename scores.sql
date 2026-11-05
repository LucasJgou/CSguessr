-- À coller dans Supabase → SQL Editor → Run (en plus de setup.sql)

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  pseudo text not null check (char_length(pseudo) between 1 and 16),
  score integer not null check (score between 0 and 25000)   -- 5 manches x 5000 points
);

create index scores_score_idx on public.scores (score desc);

alter table public.scores enable row level security;

-- Tout le monde peut lire le classement
create policy "lecture des scores" on public.scores
  for select to anon using (true);

-- Tout le monde peut ajouter un score (pseudo et score bornés par les contraintes ci-dessus)
create policy "ajout de score" on public.scores
  for insert to anon with check (true);
