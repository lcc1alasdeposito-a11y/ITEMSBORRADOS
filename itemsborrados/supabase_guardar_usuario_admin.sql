-- Ejecutar en Supabase SQL Editor.
-- Mantiene la tabla usuarios cerrada por RLS y permite guardar usuarios solo por RPC.

create or replace function public.guardar_usuario_admin(
  p_actor_id text,
  p_actor_pin_hash text,
  p_id text,
  p_nombre text,
  p_rol text,
  p_pin_hash text,
  p_activo boolean
)
returns public.usuarios
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor public.usuarios%rowtype;
  v_target public.usuarios%rowtype;
  v_saved public.usuarios%rowtype;
  v_pin text;
begin
  select *
    into v_actor
  from public.usuarios
  where id = p_actor_id
    and rol = 'admin'
    and activo = true
    and pin = p_actor_pin_hash
  limit 1;

  if not found then
    raise exception 'PIN de administrador incorrecto o usuario no autorizado'
      using errcode = '42501';
  end if;

  if coalesce(trim(p_id), '') = '' then
    raise exception 'ID de usuario requerido';
  end if;

  if coalesce(trim(p_nombre), '') = '' then
    raise exception 'Nombre de usuario requerido';
  end if;

  if p_rol not in ('admin', 'operario') then
    raise exception 'Rol no permitido';
  end if;

  select *
    into v_target
  from public.usuarios
  where id = p_id
  limit 1;

  if found and v_target.rol = 'admin' and v_target.id <> v_actor.id then
    raise exception 'No puedes editar a otro administrador'
      using errcode = '42501';
  end if;

  if p_rol = 'operario' then
    v_pin := '';
  elsif coalesce(p_pin_hash, '') <> '' then
    v_pin := p_pin_hash;
  elsif found and coalesce(v_target.pin, '') <> '' then
    v_pin := v_target.pin;
  else
    raise exception 'El PIN es obligatorio para Administrador';
  end if;

  insert into public.usuarios (id, nombre, rol, pin, activo)
  values (p_id, trim(p_nombre), p_rol, v_pin, coalesce(p_activo, true))
  on conflict (id) do update
    set nombre = excluded.nombre,
        rol = excluded.rol,
        pin = excluded.pin,
        activo = excluded.activo
  returning * into v_saved;

  return v_saved;
end;
$$;

revoke all on function public.guardar_usuario_admin(text, text, text, text, text, text, boolean) from public;
grant execute on function public.guardar_usuario_admin(text, text, text, text, text, text, boolean) to anon;

-- Recomendado: no exponer el hash del PIN en la lista de usuarios del frontend.
drop function if exists public.get_usuarios_publicos();

create or replace function public.get_usuarios_publicos()
returns table (
  id text,
  nombre text,
  rol text,
  activo boolean
)
language sql
security definer
set search_path = public
as $$
  select u.id, u.nombre, u.rol, u.activo
  from public.usuarios u
  order by u.nombre;
$$;

revoke all on function public.get_usuarios_publicos() from public;
grant execute on function public.get_usuarios_publicos() to anon;
