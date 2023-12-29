import { auth } from "$lib/lucia";
import { LuciaError } from "lucia";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad, Actions } from "./$types";

const loginForm = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const load: PageServerLoad = async ({ locals }) => {
  const form = await superValidate(loginForm)
  if (Object.keys(locals).length === 0) return { form };

  const session = await locals.auth.validate();
  if (session) throw redirect(302, "/dash");

  return { form };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, loginForm);
    console.log(form)
    if (!form.valid) {
      return fail(400, { form });
    }

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
        message: "An unknown error occurred",
        form
      });
    }

    throw redirect(302, "/dash");
  }
};