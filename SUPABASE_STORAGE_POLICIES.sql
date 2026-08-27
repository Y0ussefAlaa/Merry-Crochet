insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public product image uploads" on storage.objects;
create policy "Public product image uploads"
on storage.objects for insert
to anon, authenticated
with check (
  bucket_id = 'images'
  and name like 'products/%'
);

drop policy if exists "Public product image deletes" on storage.objects;
create policy "Public product image deletes"
on storage.objects for delete
to anon, authenticated
using (
  bucket_id = 'images'
  and name like 'products/%'
);
