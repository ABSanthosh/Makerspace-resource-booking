import { auth } from "$lib/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (Object.keys(locals).length === 0) return {};
  const session = await locals.auth.validate();
  if (session) throw redirect(302, "/dash");
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get("email")! as string;
    const password = formData.get("password")! as string;

    try {
      const user = await auth.createUser({
        key: {
          providerId: "email",
          providerUserId: email,
          password // hashed by Lucia
        },
        attributes: {
          email
        }
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {}
      });
      locals.auth.setSession(session); // set session cookie
    } catch (e) {
      console.log(e);
      return fail(500, {
        message: "An unknown error occurred"
      });
    }

    throw redirect(302, "/dash");
  }
};