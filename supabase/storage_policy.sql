-- 1. Asegurarse de que el bucket de properties exista
insert into storage.buckets (id, name, public)
values ('properties', 'properties', true)
on conflict (id) do nothing;

-- 2. Eliminar políticas existentes para evitar duplicados
drop policy if exists "Permitir subida pública a admin" on storage.objects;
drop policy if exists "Permitir lectura pública de propiedades" on storage.objects;

-- 3. Crear política para permitir subidas (esto ayuda si la Service Key falla)
-- Nota: En producción deberías restringir esto, pero para solucionar tu error ahora:
create policy "Allow all uploads to properties"
on storage.objects for insert
with check ( bucket_id = 'properties' );

-- 4. Crear política para permitir lectura pública
create policy "Allow public read from properties"
on storage.objects for select
using ( bucket_id = 'properties' );

-- 5. Permitir actualizaciones y borrado (opcional)
create policy "Allow update and delete for properties"
on storage.objects for update
using ( bucket_id = 'properties' );

create policy "Allow delete for properties"
on storage.objects for delete
using ( bucket_id = 'properties' );
