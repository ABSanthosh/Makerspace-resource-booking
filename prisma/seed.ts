import { EStatus, Prisma, PrismaClient } from '@prisma/client';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseEnum } from '../src/lib/Enums';
import fs from 'fs';

const prisma = new PrismaClient();
const supabase = createBrowserClient(
	process.env.PUBLIC_SUPABASE_URL!,
	process.env.PUBLIC_SUPABASE_ANON_KEY!
);

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
			CREATE POLICY "select_${name}"
			ON storage.objects FOR SELECT
			TO authenticated
			USING ( bucket_id = '${name}');`,
		insert: `
			CREATE POLICY "insert_${name}"
			ON storage.objects FOR INSERT
			TO authenticated
			WITH CHECK (bucket_id = '${name}');`,
		update: `
			CREATE POLICY "update_${name}"
			ON storage.objects FOR UPDATE
			TO authenticated
			USING (bucket_id = '${name}');`,
		delete: `
			CREATE POLICY "delete_${name}"
			ON storage.objects FOR DELETE
			TO authenticated
			USING (bucket_id = '${name}');`,
		seed:
			// Doc: needed only in development to let seed.ts upload images
			process.env.NODE_ENV === 'production'
				? ''
				: `
			CREATE POLICY "seed_${name}"
			ON storage.objects FOR INSERT
			TO anon
			WITH CHECK (bucket_id = '${name}');`
	};

	// We don't want to delete the bucket if it already exists
	try {
		// Create a new bucket: https://supabase.com/docs/guides/storage/buckets/creating-buckets?language=sql
		await prisma.$executeRawUnsafe(`
		INSERT INTO storage.buckets (id, name, public)
		VALUES ('${name}', '${name}', true);`);
	} catch (e) {}

	try {
		await prisma.$transaction([
			...Object.values(policies).map((policy) => prisma.$executeRawUnsafe(policy))
		]);
	} catch (e) {
		console.error(e);
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
			eCategoriesId: 'pw2mtah'
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
			eCategoriesId: 'bgwbjwd'
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

	await supabase.storage
		.from(SupabaseEnum.EQUIPMENT)
		.upload('e6G_5Bt.png', fs.readFileSync('prisma/seed/e6G_5Bt.png'));

	await supabase.storage
		.from(SupabaseEnum.EQUIPMENT)
		.upload('lYXj4np.jpg', fs.readFileSync('prisma/seed/lYXj4np.jpg'));

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
		hero: "<h1>Welcome to SNIoE Makerspace!</h1><p>Welcome to SNIoE's Makerspace, an embodiment of our commitment to STEAM education and innovation. Here, we offer a dynamic collaborative environment fostering interdisciplinary and project creation.<br><br>Our Makerspace is equipped with cutting-edge, user-friendly tools and state-of-the-art technologies, ensuring accessibility and affordability. It serves as a hub for world-class research test-beds, facilitating the creation of quality publications.<br><br>As a one-stop destination, our space fuels solutions in sustainability, green energy, intelligent building, robotics, networks, and AI. Additionally, we provide comprehensive training and workshops, ensuring efficient and safe utilization of tools and machines.</p>",
		hours: [
			{
				to: '5:00 PM',
				day: 'Monday',
				from: '8:00 AM'
			},
			{
				to: '5:00 PM',
				day: 'Tuesday',
				from: '8:00 AM'
			},
			{
				to: '5:00 PM',
				day: 'Wednesday',
				from: '8:00 AM'
			},
			{
				to: '5:00 PM',
				day: 'Thursday',
				from: '8:00 AM'
			}
		],
		location:
			'<h1>Location and Contact</h1><p>A004, A-block, Ground floor, Shiv Nadar University, Greater Noida, Uttar Pradesh 203207</p><p></p><h2>General Queries?</h2><ul><li><p>Phone</p><ul><li><p>Reception: +91 (120)2663811</p></li><li><p>General: +91 (120)2663811</p></li></ul></li><li><p>Email</p><ul><li><p>Jhon Doe: jhon.doe@gmail.com</p></li><li><p>Jhon Dhree: jhon.dhree@gmail.com</p></li></ul></li></ul>'
	};
	// `# Location & ContactA004, A-block, Ground floor, Shiv Nadar University, Greater Noida, Uttar Pradesh 203207\n\n# General Enquiries\n**Reception:** +91 (120)2663811\n**Email:**: [Jhon Doe](mailto:jhon.doe@gmail.com)\n\n`
	await prisma.contentManagement.create({
		data: {
			pathname: '/',
			name: 'Home',
			data: content
		}
	});
}

async function seedVideos() {
	await prisma.video.createMany({
		data: [
			{
				equipmentId: '_iPoLfl',
				video: 'https://youtu.be/GvMaw-cEFR4?si=Oc_R3bUNP-zsge96'
			},
			{
				equipmentId: '_iPoLfl',
				video: 'https://www.youtube.com/watch?v=VQMXBjj7waQ'
			}
		]
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
		type: "'STUDENT'",
		type_data: "'{}'"
	})
		.then(() => console.log('✅ onNewUser trigger created'))
		.catch((e) => console.error(`🚨 ${e}`));
	await onDeleteUser()
		.then(() => console.log('✅ onDeleteUser trigger created'))
		.catch((e) => console.error(`🚨 ${e}`));
	await makeNewBucket(SupabaseEnum.EQUIPMENT)
		.then(() => console.log('✅ Equipments Bucket created'))
		.catch((e) => console.error(`🚨 ${e}`));
	await makeNewBucket(SupabaseEnum.MANUAL)
		.then(() => console.log('✅ Manuals Bucket created'))
		.catch((e) => console.error(`🚨 ${e}`));
	await seedEquipments()
		.then(() => console.log('✅ Equipments seeded'))
		.catch((e) => console.error(`🚨 ${e}`));
	await seedContentManagement()
		.then(() => console.log('✅ Content Management seeded'))
		.catch((e) => console.error(`🚨 CMS Error`));
	await seedVideos()
		.then(() => console.log('✅ Videos seeded'))
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
