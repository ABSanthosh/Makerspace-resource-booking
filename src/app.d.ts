// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '$lib/generated/supabase/types';
import type {
  SupabaseClient,
  Session as SupabaseSession,
  UserAppMetadata
} from '@supabase/supabase-js';

import '@supabase/supabase-js';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>;
      session: SupabaseSession | null;
      getSession(): Promise<SupabaseSession | null>;
    }
    interface PageData {
      supabase: SupabaseClient<Database>;
      session: SupabaseSession | null;
    }
    // interface PageState {}
    // interface Platform {}
  }

  namespace svelteHTML {
    interface HTMLAttributes<T> {
      'on:outclick'?: () => boolean;
    }
  }
}

// declare module '@supabase/supabase-js' {
// 	interface User {
// 		app_metadata: UserAppMetadata & {
// 			custom_claim: {
// 				role: string;
// 				isnew: boolean;
// 			};
// 		};
// 	}
// }

export {};
