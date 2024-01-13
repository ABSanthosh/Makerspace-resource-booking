import type { SupabaseClient } from '@supabase/supabase-js';


export async function isAdmin(supabase: SupabaseClient<any>, userId: string) {
  return (await supabase.from('profile').select('*').eq('id', userId).single()).data?.role === 'admin';
}

export async function getUserProfile(supabase: SupabaseClient<any>, userId: string) {
  return (await supabase.from('profile').select('*').eq('id', userId).single()).data;
}

