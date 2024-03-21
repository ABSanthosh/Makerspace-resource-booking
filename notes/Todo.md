## Short run ToDo

- [ ] Add trigger to delete manual from bucket when deleted from database
- [ ] remove already booked slots from the times list
- [ ] Add modal for booking details
- [ ] Rework booking system to handle cart and booking properly

## Long run ToDo

- [ ] Convert isDeleted to SecondaryStatus enum with values: deleted, disabled, enabled with default value enabled so that we can delete the ones with no dependents
- [ ] Add types to seed.ts
- [ ] replace fluent library with [custom component](https://svelte.dev/repl/f391b3186f804fb0bb0931e73388553a?version=3.46.4)
- [ ] refactor FancyTable to CrispTable

## Completed Short run ToDo

- [x] new model to hold availability of each instance
- [x] custom time for each instance
- [x] Move instances from pane to table inside the equipment table
  - [x] refactor add/edit action to single upsert action in +page.server.ts
- [x] fix admin CMS button submission
- [x] Add manuals to equipment page
- [x] Add videos to equipment page
- [x] add video upload to admin page
- [x] footer in pane is still showing when the slot for footer is empty
- [x] Test deleting single manual
- [x] Add dropdown in admin equipment page to edit or delete equipment
- [x] search and do "// TODO: change to use v2 of superForms", https://superforms.rocks/get-started#populate-form-from-database
- [x] make readme
- [x] Change general profile to type specific profile fields
- [ ] Add cart contents to cart page(responsive)
  - [x] UI
  - [ ] Functionality
- [x] add condition to check if user is signed in and not admin before adding to cart
- [x] category editing option in admin page
- [x] custom claim updating from profile table is replacing instead of modifying
- [x] Add user profile page to fill before changing is_new to false and give access to other pages

## Completed Long run ToDo / Technical debt

- [x] gmail like editor for equipment description(just put the same tiptap editor)
- [x] Fix: When closing panes like equipment or categories, sometimes the new row just stays in the table
- [x] Adding and deleting equipment is not working. Need to do it individually. Eg. If new instances are added, need to create it instead of upserting it and if deleted, need to delete. If it is edited, need to update it instead of upserting it.
- [x] Change equipment schema
- [x] Add equipment category
- [x] Add multiple types
- [x] [User dashboard with editing](https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit?language=ts)
- [x] Hook up new equipment schema to frontend
- [x] Error in nested instances loop not binding
- [x] try to refactor new and edit equipment pane into one
- [x] make time sheet
- [x] return to equipment page if manually opened a wrong equipment id
- [x] image upload in equipment
- [x] add error handling for equipment image upload9
- [x] clear form on closing pane(new and edit equipment)
- [x] seed data for inserting equipment data
- [x] (urgent) replace admin type from profile to custom claim
- [x] disabled buttons on panes if the forms are not filled properly. Maybe look into tainted property from superforms
- [x] protected route redirect in client side
- [x] Input
  - [x] Refactor input to FancyInput css
  - [x] Refactor all lableInput components to use CrispInput style
