import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// https://github.com/supabase-community/supabase-custom-claims

export async function InstallCustomClaims() {
	await prisma
		.$executeRawUnsafe(
			`
    CREATE OR REPLACE FUNCTION is_claims_admin() RETURNS "bool"
    LANGUAGE "plpgsql" 
    AS $$
    BEGIN
      IF session_user = 'authenticator' THEN
        --------------------------------------------
        -- To disallow any authenticated app users
        -- from editing claims, delete the following
        -- block of code and replace it with:
        -- RETURN FALSE;
        --------------------------------------------
        IF extract(epoch from now()) > coalesce((current_setting('request.jwt.claims', true)::jsonb)->>'exp', '0')::numeric THEN
          return false; -- jwt expired
        END IF;
        If current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role' THEN
          RETURN true; -- service role users have admin rights
        END IF;
        IF coalesce((current_setting('request.jwt.claims', true)::jsonb)->'app_metadata'->'claims_admin', 'false')::bool THEN
          return true; -- user has claims_admin set to true
        ELSE
          return false; -- user does NOT have claims_admin set to true
        END IF;
        --------------------------------------------
        -- End of block 
        --------------------------------------------
      ELSE -- not a user session, probably being called from a trigger or something
        return true;
      END IF;
    END;
    $$;
  `
		)
		.then(() => console.log('is_claims_admin() function created'))
		.catch((e) => console.error('is_claims_admin() function failed', e));

	await prisma
		.$executeRawUnsafe(
			`
    CREATE OR REPLACE FUNCTION get_my_claims() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
    select 
      coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb -> 'app_metadata', '{}'::jsonb)::jsonb
    $$;
  `
		)
		.then(() => console.log('get_my_claims() function created'))
		.catch((e) => console.error('get_my_claims() function failed', e));

	await prisma
		.$executeRawUnsafe(
			`
    CREATE OR REPLACE FUNCTION get_my_claim(claim TEXT) RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
    select 
      coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb -> 'app_metadata' -> claim, null)
    $$;
  `
		)
		.then(() => console.log('get_my_claim() function created'))
		.catch((e) => console.error('get_my_claim() function failed', e));

	await prisma
		.$executeRawUnsafe(
			`
    CREATE OR REPLACE FUNCTION get_claims(uid uuid) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER SET search_path = public
    AS $$
    DECLARE retval jsonb;
    BEGIN
      IF NOT is_claims_admin() THEN
          RETURN '{"error":"access denied"}'::jsonb;
      ELSE
        select raw_app_meta_data from auth.users into retval where id = uid::uuid;
        return retval;
      END IF;
    END;
    $$;
  `
		)
		.then(() => console.log('get_claims() function created'))
		.catch((e) => console.error('get_claims() function failed', e));

	await prisma
		.$executeRawUnsafe(
			`CREATE OR REPLACE FUNCTION get_claim(uid uuid, claim text) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER SET search_path = public
    AS $$
    DECLARE retval jsonb;
    BEGIN
      IF NOT is_claims_admin() THEN
          RETURN '{"error":"access denied"}'::jsonb;
      ELSE
        select coalesce(raw_app_meta_data->claim, null) from auth.users into retval where id = uid::uuid;
        return retval;
      END IF;
    END;
    $$;
  `
		)
		.then(() => console.log('get_claim() function created'))
		.catch((e) => console.error('get_claim() function failed', e));

	await prisma
		.$executeRawUnsafe(
			`
    CREATE OR REPLACE FUNCTION set_claim(uid uuid, claim text, value jsonb) RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER SET search_path = public
    AS $$
    BEGIN
      IF NOT is_claims_admin() THEN
          RETURN 'error: access denied';
      ELSE        
        update auth.users set raw_app_meta_data = 
          raw_app_meta_data || 
            json_build_object(claim, value)::jsonb where id = uid;
        return 'OK';
      END IF;
    END;
    $$;
  `
		)
		.then(() => console.log('set_claim() function created'))
		.catch((e) => console.error('set_claim() function failed', e));

	await prisma
		.$executeRawUnsafe(
			`
      CREATE OR REPLACE FUNCTION delete_claim(uid uuid, claim text) RETURNS "text"
      LANGUAGE "plpgsql" SECURITY DEFINER SET search_path = public
      AS $$
      BEGIN
      IF NOT is_claims_admin() THEN
          RETURN 'error: access denied';
      ELSE        
        update auth.users set raw_app_meta_data = 
          raw_app_meta_data - claim where id = uid;
        return 'OK';
      END IF;
      END;
      $$;
    `
		)
		.then(() => console.log('delete_claim() function created'))
		.catch((e) => console.error('delete_claim() function failed', e));
}

export async function UninstallCustomClaims() {
	await prisma
		.$executeRawUnsafe(`DROP FUNCTION get_my_claims;`)
		.then(() => console.log('get_my_claims() function dropped'))
		.catch((e) => console.error('get_my_claims() function failed', e));

	await prisma
		.$executeRawUnsafe(`DROP FUNCTION get_my_claim;`)
		.then(() => console.log('get_my_claim() function dropped'))
		.catch((e) => console.error('get_my_claim() function failed', e));

	await prisma
		.$executeRawUnsafe(`DROP FUNCTION get_claims;`)
		.then(() => console.log('get_claims() function dropped'))
		.catch((e) => console.error('get_claims() function failed', e));

	await prisma
		.$executeRawUnsafe(`DROP FUNCTION set_claim;`)
		.then(() => console.log('set_claim() function dropped'))
		.catch((e) => console.error('set_claim() function failed', e));

	await prisma
		.$executeRawUnsafe(`DROP FUNCTION delete_claim;`)
		.then(() => console.log('delete_claim() function dropped'))
		.catch((e) => console.error('delete_claim() function failed', e));

	await prisma
		.$executeRawUnsafe(`DROP FUNCTION is_claims_admin;`)
		.then(() => console.log('is_claims_admin() function dropped'))
		.catch((e) => console.error('is_claims_admin() function failed', e));
}
