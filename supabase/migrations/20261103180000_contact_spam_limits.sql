-- Contact form flood protection, enforced in the database so it can't be bypassed by calling the API directly.
-- Limits: 3 messages per email address in 10 minutes, 30 messages in total per hour,
-- and no messages packed with links (a common spam pattern).

create or replace function public.limit_contact_messages()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.messages
      where lower(email) = lower(new.email) and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'Too many messages from this email address. Please try again later.' using errcode = 'P0001';
  end if;

  if (select count(*) from public.messages where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'Too many messages right now. Please try again later.' using errcode = 'P0001';
  end if;

  if (select count(*) from regexp_matches(new.message, 'https?://', 'g')) > 3 then
    raise exception 'Messages with many links are blocked as spam.' using errcode = 'P0001';
  end if;

  new.email := lower(trim(new.email));
  new.name := trim(new.name);
  return new;
end;
$$;

drop trigger if exists trg_limit_contact_messages on public.messages;
create trigger trg_limit_contact_messages
  before insert on public.messages
  for each row execute function public.limit_contact_messages();
