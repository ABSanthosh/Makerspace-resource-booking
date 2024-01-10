import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'
import { createBrowserClient, parse } from '@supabase/ssr'
import { browser } from '$app/environment'

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends('supabase:auth')

  const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: { fetch },
    cookies: {
      get(key) {
        if (!browser) return JSON.stringify(data.session)
        return parse(document.cookie)[key]
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return { supabase, session }
}