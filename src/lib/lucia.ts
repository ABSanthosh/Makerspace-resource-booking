import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { prisma } from "@lucia-auth/adapter-prisma";
import { db } from "$lib/prisma";

export const auth = lucia({
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
  adapter: prisma(db),
	getUserAttributes(databaseUser) {
		return {
			id: databaseUser.id,
			email: databaseUser.email,
			userCategory: databaseUser.userCategory,
		};
	},
});

export type Auth = typeof auth;