import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

// @ts-ignore
export const load: LayoutServerLoad = ({ url }) => {
  if (url.pathname === '/dash/orders') {
    redirect(308, '/dash/orders/cart')
  }
}