import { getEventById } from '$db/Events.db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// @ts-ignore
export const load: PageServerLoad = async ({ params }) => {
	const event = await getEventById(params.eID);

	if (!event) {
		throw redirect(307, '/events');
	}

	return {
		event
	};
};
