## SvelteKit Data Flow
Sveltekit has both frontend and backend so its important to know where we're running what code. This is a high level overview of the data flow in a SvelteKit app.

### Backend
-> `hooks.server.ts`  
-> `+layout.server.ts (load)`  
-> `+page.server.ts (load)`  
-> `+layout.ts (load)`  
-> `+page.ts (load)`  
-> `+layout.svelte`  
-> `+page.svelte`  

### Frontend
-> `app.html`  
-> `+layout.ts (load)`  
-> `+page.ts (load)`  
-> `+layout.svelte`  
-> `+page.svelte`  

This is just a very rough idea of the files that gets called when a request is made. To learn more about the flow, check out [Joy of Code](https://joyofcode.xyz/sveltekit-data-flow).

To understand the APIs, take a glance at the Sveltekit docs:
1) [Routing](https://kit.svelte.dev/docs/routing)
2) [Advanced Routing](https://kit.svelte.dev/docs/advanced-routing) (Needed to understand why routes are grouped in a certain way with some folders named with parentheses)
3) Loading data, Form Actions and State management

## Auth

### How it works
Supabase handles all the auth for us.([Learn more](https://supabase.com/docs/guides/auth#how-it-works))  
-> A user signs up. Supabase creates a new user in the `auth.users` table.  
-> Supabase returns a new JWT, which contains the user's UUID.  
-> Every request to your database also sends the JWT.  
-> Postgres inspects the JWT to determine the user making the request.  
-> The user's UID can be used in policies to restrict access to rows.  

### Flow
-> [`hooks.server.ts`](/src/hooks.server.ts) is the entry point for all requests. On every request, we make a server client and sets up all session data. In the same file, we add a middleware to check if the user is authenticated to handle protected routes. Using sveltekit's `sequence` function, we chain the middleware to the supabase client.  
-> [`+layout.ts (load)`](/src/routes/+layout.ts) is run on both client and server. Data returned from `load` function is available in the `+layout.svelte` file. To make it available in all the pages, we store it in [Svelte Stores](https://kit.svelte.dev/docs/state-management#using-stores-with-context). (TODO: Actually can be improved using context API).

After this, all routes are handled appropriately. If a route is protected and the user is not authenticated, they are redirected to the home page from `hooks.server.ts`.

## User Management
### New user
When new user signs up, after supabase does its thing, we do our things to bind the users with the rest of the app data. This comes through triggers and functions. All this are added to db in the seeding process.
2306
#### Triggers
- `on_auth_user_created`  
When a new user is created, supabase adds the user to the `auth.users` table but we cannot add additional data to the table directly. So, we use a trigger to add the user to our `public.profile` table. 

_Note: But we do add few metadata to the `auth.users` table like `role` and `isnew`. These are called Custom Claims Unfortunately, I couldn't get a trigger to work for this(I spent 6 days, 8-10 hours each) and no one on the internet seems to know why. So, when the user first signs in, we check if the metadata has the `custom_claims` key set([here](/src/hooks.server.ts#L35)) and call [`initCustomClaim`](/src/db/User.db.ts#L4) to set the custom claims._

#### What are custom claims?
Custom Claims are special attributes attached to a user that you can use to control access to portions of your application.  
This is returned in the JWT and can be used to restrict access to certain parts of the app. This is a better approach because we are not hitting the database on every page to check if the user has access to a certain page or not. Instead, we are piggypacking on the JWT that is sent with every request, made by supabase.  
[Learn more](https://github.com/supabase-community/supabase-custom-claims?tab=readme-ov-file)

- `on_profile_updated`  
Maybe we might have to change the user's role or any other custom claim, in the future. This trigger will update the `auth.users` table with the new data when it is changed in `public.profile` table.

- `on_auth_user_deleted`
When a user is deleted, we also delete the user from the `public.profile` table.