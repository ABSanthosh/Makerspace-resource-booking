import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (Object.keys(locals).length === 0) return {};
  const session = await locals.auth.validate();
  console.log(session);
  if (!session) throw redirect(302, "/login");
  return {
    userId: session.user.userId,
    email: session.user.email
  };
};