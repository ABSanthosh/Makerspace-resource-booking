import { EStatus, Prisma, PrismaClient } from '@prisma/client';
import { SupabaseEnum } from '../src/lib/Enums';

const prisma = new PrismaClient();

const queries = {
	onNewUser: [
		Prisma.sql`
			-- When a new user signs up, insert a row into public.profile 
			-- and set the user's custom claims
			CREATE or REPLACE TRIGGER on_auth_user_created
				AFTER INSERT ON auth.users
				FOR EACH ROW EXECUTE PROCEDURE onNewUser();
		`,
		Prisma.sql`
			-- When public.profile.{isnew|role} is updated, update the user's custom claims
			CREATE or REPLACE FUNCTION on_user_profile_update()
			RETURNS trigger
			LANGUAGE plpgsql
			SECURITY DEFINER SET search_path = public
			AS $$
			BEGIN
				UPDATE auth.users
				SET raw_app_meta_data = jsonb_set(
					COALESCE(raw_app_meta_data, '{}'::jsonb),
					'{custom_claims}',
					json_build_object('role', NEW.role, 'isnew', NEW.isnew)::jsonb,
					true
				) WHERE id = NEW.id;
				RETURN NEW;
			END;
			$$;
		`,
		Prisma.sql`
			CREATE or REPLACE TRIGGER on_profile_updated
				AFTER UPDATE OF isnew, role ON public.profile
				FOR EACH ROW
				WHEN (OLD.isnew IS DISTINCT FROM NEW.isnew
				OR OLD.role IS DISTINCT FROM NEW.role)
				EXECUTE PROCEDURE public.on_user_profile_update();
		`
	],
	onDeleteUser: [
		Prisma.sql`
			-- When a user is deleted, delete the corresponding row in public.profile
			CREATE or REPLACE FUNCTION onDeleteUser()
			RETURNS trigger
			LANGUAGE plpgsql
			SECURITY DEFINER SET search_path = public
			AS $$
			BEGIN
				DELETE FROM public.profile WHERE id = old.id;
				RETURN old;
			END;
			$$;
		`,
		Prisma.sql`
			-- When a user is deleted, delete the corresponding row in public.profile
			CREATE or REPLACE TRIGGER on_auth_user_deleted
				AFTER DELETE ON auth.users
				FOR EACH ROW EXECUTE PROCEDURE onDeleteUser();
		`
	]
};

async function onNewUser(columns: { [name: string]: string }) {
	const query = `
		CREATE or REPLACE FUNCTION onNewUser()
		RETURNS trigger
		LANGUAGE plpgsql
		SECURITY DEFINER SET search_path = public
		AS $$
		BEGIN
		
		INSERT INTO public.profile (${Object.keys(columns).join(', ')})
		VALUES (${Object.values(columns).join(', ')});
		
		-- update default data from auth.users
		UPDATE public.profile SET 
			name = COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
			mobile = COALESCE(new.phone, ''),
			email = COALESCE(new.email, '')
			WHERE id = new.id;
			
		RETURN NEW;
		END;
		$$;
	`;

	await prisma.$transaction([
		prisma.$executeRawUnsafe(query),
		...queries.onNewUser.map((query) => prisma.$executeRaw(query))
	]);
}

async function onDeleteUser() {
	await prisma.$transaction(queries.onDeleteUser.map((query) => prisma.$executeRaw(query)));
}

async function makeNewBucket(name: string) {
	// https://supabase.com/docs/guides/storage/security/access-control
	// https://github.com/orgs/supabase/discussions/5786#discussioncomment-2291214
	const policies = {
		select: `
			CREATE POLICY "select_equipment_image"
			ON storage.objects FOR SELECT
			TO authenticated
			USING ( bucket_id = '${name}');`,
		insert: `
			CREATE POLICY "insert_equipment_image"
			ON storage.objects FOR INSERT
			TO authenticated
			WITH CHECK (bucket_id = '${name}');`,
		update: `
			CREATE POLICY "update_equipment_image"
			ON storage.objects FOR UPDATE
			TO authenticated
			USING (bucket_id = '${name}');`,
		delete: `
			CREATE POLICY "delete_equipment_image"
			ON storage.objects FOR DELETE
			TO authenticated
			USING (bucket_id = '${name}');`
	};

	// We don't want to delete the bucket if it already exists
	try {
		// Create a new bucket: https://supabase.com/docs/guides/storage/buckets/creating-buckets?language=sql
		await prisma.$transaction([
			prisma.$executeRawUnsafe(`
			INSERT INTO storage.buckets (id, name, public)
			VALUES ('${name}', '${name}', true);`),
			...Object.values(policies).map((policy) => prisma.$executeRawUnsafe(policy))
		]);
	} catch (e) {}
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

	await prisma.$transaction([
		prisma.equipment.createMany({
			data: equipments
		}),
		prisma.eInstance.createMany({
			data: instances
		})
	]);
}

async function seedCategories() {
	const categories = [
		{ id: 'pw2mtah', name: '3D Printer' },
		{ id: '384ieci', name: 'CNC (Laser cutter)' },
		{ id: 'bgwbjwd', name: 'Welding' },
		{ id: 'wec92q8', name: 'Hand power tools' },
		{ id: 'cpwp422', name: 'Hand tools' },
		{ id: '233g4pc', name: 'Design station' },
		{ id: 'zyyymkp', name: 'Testing equipment' },
		{ id: 'ex7r4z9', name: 'PCB design' },
		{ id: 'htbyq6g', name: 'Standalone power tools' }
	];

	await prisma.$transaction([
		prisma.eCategories.deleteMany(),
		prisma.eCategories.createMany({
			data: categories
		})
	]);
}

async function seedContentManagement() {
	const content = {
		header: {
			logo: '',
			snuLogo: ''
		},
		hero: {
			header: 'Welcome to SNIoE Makerspace!',
			description: `Welcome to SNIoE's Makerspace, an embodiment of our commitment to STEAM education and innovation. Here, we offer a dynamic collaborative environment fostering interdisciplinary research and project creation.\n\n\n Our Makerspace is equipped with cutting-edge, user-friendly tools and state-of-the-art technologies, ensuring accessibility and affordability. It serves as a hub for world-class research test-beds, facilitating the creation of quality publications.\n\n\n As a one-stop destination, our space fuels solutions in sustainability, green energy, intelligent building, robotics, networks, and AI. Additionally, we provide comprehensive training and workshops, ensuring efficient and safe utilization of tools and machines.`
		},
		hours: [
			{
				day: 'Monday',
				from: '8:00 AM',
				to: '5:00 PM'
			},
			{
				day: 'Tuesday',
				from: '8:00 AM',
				to: '5:00 PM'
			},
			{
				day: 'Wednesday',
				from: '8:00 AM',
				to: '5:00 PM'
			},
			{
				day: 'Thursday',
				from: '8:00 AM',
				to: '5:00 PM'
			}
		],
		location: `# Location & ContactA004, A-block, Ground floor, Shiv Nadar University, Greater Noida, Uttar Pradesh 203207\n\n# General Enquiries\n**Reception:** +91 (120)2663811\n**Email:**: [Jhon Doe](mailto:jhon.doe@gmail.com)\n\n`
	};
	// {
	// 	header: 'Location & Contact',
	// 	location:
	// 		'A004, A-block, Ground floor, Shiv Nadar University, Greater Noida, Uttar Pradesh 203207',
	// 	phone: [
	// 		{
	// 			role: 'Reception',
	// 			number: '+91 (120)2663811'
	// 		}
	// 	],
	// 	email: [
	// 		{
	// 			role: 'General',
	// 			address: 'jhon.doe@gmail.com',
	// 			name: 'Jhon Doe'
	// 		}
	// 	]
	// }
	await prisma.contentManagement.create({
		data: {
			path: '/',
			data: content
		}
	});
}

async function main() {
	await seedCategories()
		.then(() => console.log('✅ eCategories seeded'))
		.catch((e) => console.error(`🚨 ${e}`));

	// Values are passed without quotes and postgresql only considers
	// single quotes as quotes and double quotes as identifiers.
	// Postgres converts all uppercase identifiers to lowercase.
	await onNewUser({
		id: 'new.id',
		role: "'user'",
		isnew: 'true',
		name: "''",
		mobile: "''",
		email: "''",
		department: "''",
		branch: "''",
		userid: "''",
		year: 'null',
		clubs: "'[]'"
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

	await seedContentManagement()
		.then(() => console.log('✅ Content Management seeded'))
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
