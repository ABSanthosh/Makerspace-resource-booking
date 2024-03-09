## Short run ToDo
- [ ] Add manuals to equipment page
- [ ] Add videos to equipment page
- [ ] fix admin CMS button submission

## Long run ToDo
- [ ] Convert isDeleted to SecondaryStatus enum with values: deleted, disabled, enabled with default value enabled so that we can delete the ones with no dependents
- [ ] gmail like editor for equipment description

## Completed Short run ToDo
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
- [ ] Adding and deleting equipment is not working. Need to do it individually. Eg. If new instances are added, need to create it instead of upserting it and if deleted, need to delete. If it is edited, need to update it instead of upserting it.
- [x] add error handling for equipment image upload9
- [x] clear form on closing pane(new and edit equipment)
- [x] seed data for inserting equipment data
- [x] (urgent) replace admin type from profile to custom claim
- [ ] remove already booked slots from the times list
- [x] disabled buttons on panes if the forms are not filled properly. Maybe look into tainted property from superforms
- [x] protected route redirect in client side
- [x] Input
  - [x] Refactor input to FancyInput css
  - [x] Refactor all lableInput components to use CrispInput style