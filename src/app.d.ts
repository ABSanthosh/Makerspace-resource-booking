// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '$lib/generated/supabase/types';
import type { SupabaseClient, Session as SupabaseSession } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<SupabaseSession | null>;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			session: SupabaseSession | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
