import type { SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SupabaseEnum } from './Enums';

export async function isAdmin(supabase: SupabaseClient<any>, userId: string) {
	return (
		(await supabase.from('profile').select('*').eq('id', userId).single()).data
	);
}

export async function getUserProfile(supabase: SupabaseClient<any>, userId: string) {
	return (await supabase.from('profile').select('*').eq('id', userId).single()).data;
}

export function getStorageUrl(name: string) {
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${SupabaseEnum.BUCKET}/${name}`;
}
