import { auth } from "$lib/lucia";
import { LuciaError } from "lucia";
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
      // find user by key and validate password
      const key = await auth.useKey(
        "email",
        email,
        password
      );
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {}
      });
      locals.auth.setSession(session); // set session cookie
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        // user does not exist or invalid password
        return fail(400, {
          message: "Incorrect email or password"
        });
      }
      console.log(e);
      return fail(500, {
        message: "An unknown error occurred"
      });
    }

    throw redirect(302, "/dash");
  }
};