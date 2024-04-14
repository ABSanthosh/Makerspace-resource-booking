import nanoid from '$lib/nanoid';
import { SupabaseEnum } from '$lib/Enums';
import { EventZodSchema } from '$lib/schemas';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { getAllEvents, upsertEvent } from '$db/Events.db';
import { superValidate, withFiles } from 'sveltekit-superforms/server';

// @ts-ignore
export const load: PageServerLoad = async ({ locals }) => {
  const upsertEventForm = await superValidate(zod(EventZodSchema));
  const allEvents = await getAllEvents();
  if (Object.keys(locals).length === 0) return { upsertEventForm };

  return {
    upsertEventForm,
    allEvents
  };
};

export const actions: Actions = {
  upsertEvent: async ({ request, locals: { supabase, session } }) => {
    const upsertEventForm = await superValidate(request, zod(EventZodSchema));
    const imageFile = upsertEventForm.data.image as File;
    
    if (!upsertEventForm.valid) {
      return fail(400, withFiles({ upsertEventForm }));
    }
    
    if (typeof imageFile !== 'string') {
      if (upsertEventForm.data.id) {
        console.log(imageFile)
        const { data, error } = await supabase.storage
          .from(SupabaseEnum.EVENT)
          .update(imageFile.name, imageFile, {
            upsert: true,
            cacheControl: '0'
          });

        if (error) {
          console.log('error', error);
          return fail(400, withFiles({ upsertEventForm, error }));
        }

        upsertEventForm.data.image = data?.path ? data.path + '?cache=' + new Date().getTime() : '';
      } else {
        const { data, error } = await supabase.storage
          .from(SupabaseEnum.EVENT)
          .upload(`${nanoid()}.${imageFile.name.split('.').pop()}`, imageFile);
        if (error) {
          return fail(400, withFiles({ upsertEventForm }));
        }

        upsertEventForm.data.image = data.path;
      }
    }

    return withFiles({
      upsertEventForm,
      response: await upsertEvent({
        ...upsertEventForm.data,
        userId: session?.user.id!
      })
    });
  }
};
