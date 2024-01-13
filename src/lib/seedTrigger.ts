import postgres from 'postgres';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL_POSTGRES;

if (!dbUrl) {
	throw new Error("Couldn't find db url");
}

const sql = postgres(dbUrl);

async function onNewUser(columns: {
	[name: string]: string;
}) {
	// Remove the function if it already exists
	await sql`
		DROP FUNCTION IF EXISTS public.onNewUser() CASCADE;
	`;

	// Insert a row into public.profile on new user in auth.users
	const query = `
	create or replace function public.onNewUser()
	returns trigger
	language plpgsql
	security definer set search_path = public
	as $$
	begin
		insert into public.profile (${Object.keys(columns).join(', ')})
		values (${Object.values(columns).join(', ')});
		return new;
	end;
	$$;
	`
	await sql.unsafe(query)

	// Remove the trigger if it already exists
	await sql`
		DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
	`;

	// Add a trigger to the function every time a user is created
	await sql`
		create trigger on_auth_user_created
			after insert on auth.users
			for each row execute procedure public.onNewUser();
		`;

}

async function onDeleteUser() {
	// Remove the function if it already exists
	await sql`
		DROP FUNCTION IF EXISTS public.onDeleteUser() CASCADE;
	`;

	// Remove the trigger if it already exists
	await sql`
		DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users CASCADE;
	`;

	// Insert a row into public.profile on new user in auth.users
	await sql`
		create or replace function public.onDeleteUser()
		returns trigger
		language plpgsql
		security definer set search_path = public
		as $$
		begin
			delete from public.profile where id = old.id;
			return old;
		end;
		$$;
		`;

	// Add a trigger to the function every time a user is created
	await sql`
		create trigger on_auth_user_deleted
			after delete on auth.users
			for each row execute procedure public.onDeleteUser();
		`;
}

(async () => {
	await onNewUser({
		id: 'new.id',
		role: "'user'",
		isnew: 'true'
	})

	await onDeleteUser();
	sql.end();
	console.log('Triggers created');
})()

// Ref:
// https://dev.to/mihaiandrei97/implementing-supabase-auth-in-next13-with-prisma-172i
// https://supabase.com/docs/guides/auth/managing-user-data#creating-user-tables