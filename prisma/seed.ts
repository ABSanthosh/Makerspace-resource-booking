import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function onNewUser(columns: { [name: string]: string }) {
	// Remove the function if it already exists
	await prisma.$executeRawUnsafe(`
		DROP FUNCTION IF EXISTS public.onNewUser() CASCADE;
	`);

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
	`;
	await prisma.$executeRawUnsafe(query);

	// Remove the trigger if it already exists
	await prisma.$executeRawUnsafe(`
		DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
	`);

	// Add a trigger to the function every time a user is created
	await prisma.$executeRawUnsafe(`
		create trigger on_auth_user_created
			after insert on auth.users
			for each row execute procedure public.onNewUser();
		`);
}

async function onDeleteUser() {
	// Remove the function if it already exists
	await prisma.$executeRawUnsafe(`
		DROP FUNCTION IF EXISTS public.onDeleteUser() CASCADE;
	`);

	// Remove the trigger if it already exists
	await prisma.$executeRawUnsafe(`
		DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users CASCADE;
	`);

	// Insert a row into public.profile on new user in auth.users
	await prisma.$executeRawUnsafe(`
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
		`);

	// Add a trigger to the function every time a user is created
	await prisma.$executeRawUnsafe(`
		create trigger on_auth_user_deleted
			after delete on auth.users
			for each row execute procedure public.onDeleteUser();
		`);
}

async function main() {
	await prisma.eCategories.deleteMany({});
	const eCategoriesSeed = await prisma.eCategories.createMany({
		data: [
			{ id: 'pw2mtah', name: '3D Printer' },
			{ id: '384ieci', name: 'CNC (Laser cutter)' },
			{ id: 'bgwbjwd', name: 'Welding' },
			{ id: 'wec92q8', name: 'Hand power tools' },
			{ id: 'cpwp422', name: 'Hand tools' },
			{ id: '233g4pc', name: 'Design station' },
			{ id: 'zyyymkp', name: 'Testing equipment' },
			{ id: 'ex7r4z9', name: 'PCB design' },
			{ id: 'htbyq6g', name: 'Standalone power tools' }
		]
	});

	await onNewUser({
		id: 'new.id',
		role: "'user'",
		isnew: 'true'
	});

	await onDeleteUser();

	console.log({ eCategoriesSeed });
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
