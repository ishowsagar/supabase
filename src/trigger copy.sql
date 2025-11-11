--   When someone signs up → Supabase creates user in auth.users ,
-- → This trigger automatically creates their profile in user_profiles table! 🎯
-- todo create a trigger function that automatically creates user profile when someone signs up

--! STEP 1: Define the trigger function (what happens when user signs up?)
create function public.handle_new_user()
returns trigger -- * this function returns a trigger type (special PostgreSQL function)
language plpgsql -- * using PostgreSQL procedural language
security definer -- *! runs with the privileges of the user who created the function (secure!)
set search_path = '' -- * prevents SQL injection by resetting search path
as $$ 
begin
  -- * automatically insert new user data into user_profiles table
  -- ? when does this run? --> whenever a new user is created in auth.users table
  insert into public.user_profiles (id, name, account_type) -- columns to populate
  values (
    new.id, -- *! 'new' = the newly inserted row from auth.users
    new.raw_user_meta_data ->> 'name', -- * extract 'name' from JSON metadata (text)
    new.raw_user_meta_data ->> 'account_type' -- * extract 'account_type' from JSON
  );
  return new; -- *! return the new row that triggered this function
end;
$$;

-- todo create the trigger that watches for new users and fires the function

--! STEP 2: Create the trigger (when should this function run?)
create trigger on_auth_user_created -- ? trigger name for easy identification
  after insert on auth.users -- *! fires AFTER a new user is inserted into auth.users table
  for each row -- * runs once for every single new user row
  execute procedure public.handle_new_user(); -- * calls our function above to create profile
