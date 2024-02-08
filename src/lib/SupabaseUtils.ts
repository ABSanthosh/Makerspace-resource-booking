import type { Session } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SupabaseEnum } from './Enums';
import { Role } from '@prisma/client';

export function getCustomClaim(session: Session | null): {
	role: Role;
	isNew: boolean;
} {
	return (
		(session && session.user.app_metadata.custom_claims) || {
			role: Role.user,
			isNew: false
		}
	);
}

export function getStorageUrl(name: string) {
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${SupabaseEnum.BUCKET}/${name}`;
}
