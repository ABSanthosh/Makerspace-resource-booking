import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../../(protected)/dash/$types";
import { UserCategory } from "@prisma/client";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (Object.keys(locals).length === 0) return {};
  const session = await locals.auth.validate();
  if (!session) throw redirect(302, "/login");
  if(session.user.userCategory !== UserCategory.admin) throw redirect(302, "/dash");
  return {
    userId: session.user.userId,
    email: session.user.email
  };
};