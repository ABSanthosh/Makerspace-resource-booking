import type { Session } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SupabaseEnum } from './Enums';
import { UserRole } from '@prisma/client';

export function getCustomClaim(session: Session | null): {
  role: UserRole;
  isnew: boolean;
  is_blacklisted: boolean;
} {
  return (
    (session && session.user.app_metadata.custom_claims) || {
      role: UserRole.user,
      isnew: false,
      is_blacklisted: false
    }
  );
}

export function getStorageUrl(bucket: SupabaseEnum, name: string) {
  return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${name}`;
}
