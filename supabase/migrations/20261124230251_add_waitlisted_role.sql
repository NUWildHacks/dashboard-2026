-- Waitlist: when the event is full, registration saves the person with the 'Waitlisted' role
-- instead of rejecting them. Admins move people off the waitlist by changing the role.

-- 1. Allow the 'Waitlisted' role. The init migration made the role check without a name, so find
--    it by its definition instead of trusting the generated name.
do $$
declare
  v_name text;
begin
  for v_name in
    select conname
    from pg_constraint
    where conrelid = 'public.users'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.users drop constraint %I', v_name);
  end loop;
end;
$$;

alter table public.users
  add constraint users_role_check
  check (role in ('Participant', 'Waitlisted', 'Admin', 'Judge', 'Judge/Mentor'));

-- 2. Register a participant, or put them on the waitlist when the event is full. A lock makes the
--    capacity check and the write one step, so parallel registrations cannot pass max_participants.
--    Only 'Participant' rows count toward the limit. p_row holds users columns (validated by the
--    app). Returns 'registered', 'waitlisted', or 'role_conflict'.
create or replace function public.register_participant(p_row jsonb, p_precreated_id text, p_max_participants integer)
returns text
language plpgsql security definer set search_path = public as $$
declare
  v_id text := p_row ->> 'id';
  v_own_role text;
  v_precreated_role text;
  v_count bigint;
  v_outcome text := 'registered';
  v_columns text;
  v_updates text;
begin
  perform pg_advisory_xact_lock(hashtext('register_participant'));

  select role into v_own_role from public.users where id = v_id;
  if p_precreated_id is not null then
    select role into v_precreated_role from public.users where id = p_precreated_id;
  end if;

  -- Never turn an admin, judge, mentor, or waitlisted user into a participant.
  if coalesce(v_own_role, 'Participant') <> 'Participant'
     or coalesce(v_precreated_role, 'Participant') <> 'Participant' then
    return 'role_conflict';
  end if;

  -- People who already hold a participant row (their own or a pre-created one) keep their place.
  -- Everyone else goes on the waitlist when the event is full.
  if v_own_role is null and v_precreated_role is null then
    select count(*) into v_count from public.users where role = 'Participant';
    if v_count >= p_max_participants then
      p_row := jsonb_set(p_row, '{role}', to_jsonb('Waitlisted'::text));
      v_outcome := 'waitlisted';
    end if;
  end if;

  select string_agg(quote_ident(k), ', '),
         string_agg(format('%1$I = excluded.%1$I', k), ', ') filter (where k <> 'id')
  into v_columns, v_updates
  from jsonb_object_keys(p_row) as k;

  execute format(
    'insert into public.users (%1$s) select %1$s from jsonb_populate_record(null::public.users, $1) '
    'on conflict (id) do update set %2$s',
    v_columns, v_updates
  ) using p_row;

  if p_precreated_id is not null and p_precreated_id <> v_id then
    delete from public.users where id = p_precreated_id;
  end if;

  return v_outcome;
end;
$$;

revoke execute on function public.register_participant(jsonb, text, integer) from public, anon, authenticated;
