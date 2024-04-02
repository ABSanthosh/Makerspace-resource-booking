import { getAllEventsPreview } from '$db/Events.db';
import type { LayoutServerLoad } from './$types';

// @ts-ignore
export const load: LayoutServerLoad = async () => {
	return {
		allEvents: await getAllEventsPreview()
	};
};
