import { EStatus, PrismaClient } from '@prisma/client';
import { SupabaseEnum } from '../src/lib/Enums';

const prisma = new PrismaClient();

async function onNewUser(columns: { [name: string]: string }) {
	// Remove the function if it already exists
	await prisma.$executeRawUnsafe(`
		DROP FUNCTION IF EXISTS public.onNewUser() CASCADE;
	`);

	// Insert a row into public.profile on new user in auth.users
	// -- set custom claim
	// PERFORM set_claim(new.id, 'role', columns.role);
	const query = `
	create or replace function public.onNewUser()
	returns trigger
	language plpgsql
	security definer set search_path = public
	as $$
	begin
	
	insert into public.profile (${Object.keys(columns).join(', ')})
	values (${Object.values(columns).join(', ')});
	
	update auth.users set raw_app_meta_data = raw_app_meta_data 
		|| json_build_object('role', ${columns.role})::jsonb where id = 'new.id';

	return new;
	end;
	$$;
	`;
	await prisma.$executeRawUnsafe(query)
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

	// new trigger to update custom claims if public.profile.role is updated
	// await prisma.$executeRawUnsafe(`
	// 	create trigger on_profile_role_updated
	// 		after update of role on public.profile
	// 		for each row execute procedure set_claim(new.id, 'role', new.role);
	// 	`).catch((e) => console.error(`🚨 there ${e}`));
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

async function makeNewBucket(name: string) {
	// https://supabase.com/docs/guides/storage/security/access-control
	// https://github.com/orgs/supabase/discussions/5786#discussioncomment-2291214
	const policies = {
		select: `
			create policy "select_equipment_image"
			on storage.objects for select
			to authenticated
			using (bucket_id = '${name}');`,
		insert: `
			create policy "insert_equipment_image"
			on storage.objects for insert
			to authenticated
			with check (bucket_id = '${name}');`,
		update: `
			create policy "update_equipment_image"
			on storage.objects for update
			to authenticated
			using (bucket_id = '${name}');`,
		delete: `
			create policy "delete_equipment_image"
			on storage.objects for delete
			to authenticated
			using (bucket_id = '${name}');`
	};

	// We don't want to delete the bucket if it already exists
	try {
		// Create a new bucket
		await prisma.$executeRawUnsafe(`
		insert into storage.buckets
		(id, name, public)
		values
		('${name}', '${name}', true);
	`);

		await prisma.$transaction(
			Object.values(policies).map((policy) => prisma.$executeRawUnsafe(policy))
		);
	} catch (e) {
		// console.log(e);
	}
}

async function seedEquipments() {
	const equipments = [
		{
			id: '_iPoLfl',
			name: 'Creality 3D Printer',
			model: 'CR-10 SE',
			image: 'e6G_5Bt.png',
			description:
				'The CR-10 from Creality is a workhorse of a printer. Able to work for long periods non-stop, it is more than capable of handling large prints requiring many hours of print time. Likewise, parts, upgrades, and materials for this printer are very cost-effective and readily available.',
			eCategoriesId: 'pw2mtah',
			imageFile: undefined
		},
		{
			id: 'cAZ0IdL',
			name: 'ENON',
			model: 'Inverter ARC Welding Machine',
			image: 'lYXj4np.jpg',
			description: `SMOOTH ARC: The core of any welding machine's performance is the quality of the welding arc it produces. With this welding machine, you can expect a remarkably smooth and stable arc. This is crucial for achieving clean, precise, and aesthetically pleasing welds.
			ADVANCED IGBT TECHNOLOGY: The welding industry has seen a significant shift towards IGBT (Insulated Gate Bipolar Transistor) technology due to its numerous advantages. This machine harnesses the power of advanced IGBT technology, ensuring stable and efficient welding performance.
			IMPRESSIVE POWER: With 8200W of power and a 220V input, this welding machine packs a punch. It provides the energy required for various welding tasks, whether you're working on thin materials or thicker pieces.
			WHAT'S IN THE BOX: Along with the welding machine, your purchase includes essential accessories to enhance your welding experience, including a brush for cleaning, a belt for easy transport, a protective welding mask, an electrode holder, and ground clamps.
			HOT START: Igniting the welding arc can sometimes be a challenge, especially in less than ideal conditions. The Hot Start function addresses this issue by providing a quick and easy ignition of the welding arc. This feature significantly reduces the risk of electrode sticking, ensuring a smooth start to your welding projects.`,
			eCategoriesId: 'bgwbjwd',
			imageFile: undefined
		}
	];

	const instances = [
		{
			name: 'CR-10 SE - 1',
			status: EStatus.available,
			cost: '0',
			description: '',
			equipmentId: '_iPoLfl'
		},
		{
			name: 'CR-10 SE - 2',
			status: EStatus.inUse,
			cost: '0',
			description: '',
			equipmentId: '_iPoLfl'
		},
		{
			name: 'CR-10 SE - 3',
			status: EStatus.broken,
			cost: '0',
			description: '',
			equipmentId: '_iPoLfl'
		},
		{
			name: 'ENON - 1',
			status: EStatus.available,
			cost: '0',
			description: '',
			equipmentId: 'cAZ0IdL'
		}
	];

	await prisma.equipment.createMany({
		data: equipments
	});

	await prisma.eInstance.createMany({
		data: instances
	});
}

async function main() {
	await prisma.eCategories.deleteMany({});
	await prisma.eCategories
		.createMany({
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
		})
		.then(() => console.log('✅ eCategories seeded'))
		.catch((e) => console.error(`🚨 ${e}`));

	await onNewUser({
		id: 'new.id',
		role: "'user'",
		isnew: 'true'
	})
		.then(() => console.log('✅ onNewUser trigger created'))
		.catch((e) => console.error(`🚨 ${e}`));

	await onDeleteUser()
		.then(() => console.log('✅ onDeleteUser trigger created'))
		.catch((e) => console.error(`🚨 ${e}`));

	await makeNewBucket(SupabaseEnum.BUCKET)
		.then(() => console.log('✅ Bucket created'))
		.catch((e) => console.error(`🚨 ${e}`));

	await seedEquipments()
		.then(() => console.log('✅ Equipments seeded'))
		.catch((e) => console.error(`🚨 ${e}`));
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
