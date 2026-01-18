-- 1. Asegurarse de que el bucket de properties exista y SEA PÚBLICO
insert into storage.buckets (id, name, public)
values ('properties', 'properties', true)
on conflict (id) do update set public = true;

-- 2. Eliminar políticas existentes para evitar duplicados
drop policy if exists "Allow all uploads to properties" on storage.objects;
drop policy if exists "Allow public read from properties" on storage.objects;
drop policy if exists "Allow update and delete for properties" on storage.objects;
drop policy if exists "Allow delete for properties" on storage.objects;

-- 3. Crear política para permitir subidas (para el servidor/admin)
create policy "Allow all uploads to properties"
on storage.objects for insert
with check ( bucket_id = 'properties' );

-- 4. Crear política para permitir LECTURA PÚBLICA (CRUCIAL para que se vean las fotos)
create policy "Allow public read from properties"
on storage.objects for select
using ( bucket_id = 'properties' );

-- 5. Permitir gestión (opcional)
create policy "Allow manage properties"
on storage.objects for all
using ( bucket_id = 'properties' );
