import type { SupabaseClient, Session } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export let SupaStore = writable<SupabaseClient>();

// These are exclusively for component. This is to avoid prop drilling.
export let SessionStore = writable<Session | null>();