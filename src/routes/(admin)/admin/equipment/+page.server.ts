import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { EZodSchema } from '$lib/schemas';
import { getAllEquipment, getECategories } from '$db/Equipment.db';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
  const newEquipmentForm = await superValidate(EZodSchema);
  const editEquipmentForm = await superValidate(EZodSchema);
  const allEquipment = await getAllEquipment();
  const eCategories = await getECategories();
  if (Object.keys(locals).length === 0) return { newEquipmentForm };

  return {
    newEquipmentForm,
    editEquipmentForm,
    allEquipment,
    eCategories
  };
};
