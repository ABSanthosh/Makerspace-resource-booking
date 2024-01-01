import { auth } from "$lib/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { registerSchema } from "$lib/schemas";
import { superValidate } from "sveltekit-superforms/server";
import { UserCategory } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  const form = await superValidate(registerSchema)
  if (Object.keys(locals).length === 0) return { form };

  const session = await locals.auth.validate();
  if (session) throw redirect(302, "/dash");

  return { form };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    console.log("form");
    const form = await superValidate(request, registerSchema);
    if (!form.valid) {
      return fail(400, { form });
    }
    try {
      const user = await auth.createUser({
        key: {
          providerId: "email",
          providerUserId: form.data.email,
          password: form.data.password
        },
        attributes: {
          userCategory: form.data.userCategory,
          firstName: form.data.firstName,
          lastName: form.data.lastName,
          orgName: form.data.orgName,
          department: form.data.department,
          userId: form.data.userId,
          mobile: form.data.mobile,
          school: form.data.school,
          email: form.data.email
        }
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {}
      });
      locals.auth.setSession(session); // set session cookie
      if(session.user.userCategory === UserCategory.admin) throw redirect(302, "/admin");
    } catch (e) {
      console.log(e);
      return fail(500, {
        message: "An unknown error occurred"
      });
    }


    throw redirect(302, "/dash");
  }
};