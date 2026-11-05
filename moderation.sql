-- À coller dans Supabase → SQL Editor → Run
-- 1) Remplace TON-EMAIL@exemple.fr (5 fois) par l'adresse du compte admin que tu crées dans
--    Authentication → Users → Add user. Écris-la en minuscules.
-- 2) Seul ce compte pourra voir les photos en attente, les valider et les supprimer.

create policy "admin lit toutes les photos" on public.photos
  for select to authenticated
  using ((auth.jwt() ->> 'email') = 'TON-EMAIL@exemple.fr');

create policy "admin modifie les photos" on public.photos
  for update to authenticated
  using ((auth.jwt() ->> 'email') = 'TON-EMAIL@exemple.fr')
  with check ((auth.jwt() ->> 'email') = 'TON-EMAIL@exemple.fr');

create policy "admin supprime les photos" on public.photos
  for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'TON-EMAIL@exemple.fr');

create policy "admin lit le stockage" on storage.objects
  for select to authenticated
  using (bucket_id = 'photos' and (auth.jwt() ->> 'email') = 'TON-EMAIL@exemple.fr');

create policy "admin supprime du stockage" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (auth.jwt() ->> 'email') = 'TON-EMAIL@exemple.fr');
