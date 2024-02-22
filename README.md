## Short run ToDo
- [ ] Add dropdown in admin equipment page to edit or delete equipment
- [ ] search and do "// TODO: change to use v2 of superForms", https://superforms.rocks/get-started#populate-form-from-database

## Long run ToDo
- [ ] Convert isDeleted to SecondaryStatus enum with values: deleted, disabled, enabled with default value enabled so that we can delete the ones with no dependents

## Completed Short run ToDo

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

### Schema discussion

<details>
<summary>Equipment</summary>
For each equipment

- *Generic Name eg: 3d printer
- *make and model
- *description
- *image
- videos

For each item

- *name
- *description
- *cost
- manuals
- status: operational, down-for-maintenance, out-of-service

Equipment categories (as editable)

- 3d printer
- CNC (laser cutter)
- welding
- Hand power tools
- hand tools
- Design station
- testing eqquipment
- PCB design
- standalone Power tools
</details>

<details>
<summary>Material</summary>

Electronic repository (loanables)

- *quantity
- *make and model
- *loaned quantity
- *image
- description

Material repository (consumables)

- *name
- *quantity
- *dimensions
  - *type: length, area, volume, breadths
  - *value
  - *unit: need the list of possible units
- description
</details>

<details>
<summary>User profile</summary>
- name
- mobile
- departments
- branch
- roll num
- email
- year
- clubs they are part of

</details>

### To setup auth in prod

1. Add `http://127.0.0.1:54321/auth/v1/callback` to google console to Authorised redirect URIs
2. Add `http://localhost:5173/` in `site_url` to `config.toml`

### [To see errors in supabase db](https://github.com/supabase/cli/issues/271#issuecomment-1661981609)

```
docker logs -f supabase_db_makerspace
```

### Misc

[To manually set time in nixos](https://discourse.nixos.org/t/manually-set-date-and-time-on-nixos/13016)

```
sudo systemctl stop systemd-timesyncd.service
```

To see supabase status

```
supabase status
```

### Bookmarklet to convert hex to decimal for google icons page

```js
javascript: (() => {
	const hexContainer = document.querySelector(
		'#mat-tab-content-0-0 > div > div > icons-side-nav-links > div > figure:nth-child(4) > div > gf-code-snippet > div > div.code-snippet__content > div'
	);
	const copyButton = document.querySelector(
		'#mat-tab-content-0-0 > div > div > icons-side-nav-links > div > figure:nth-child(4) > div > gf-code-snippet > div > div.code-snippet__copy-button > copy-button > button'
	);
	const hexVal = hexContainer.innerText;
	hexContainer.innerText = parseInt(hexVal, 16);
	copyButton.onclick = () => {
		navigator.clipboard.writeText(parseInt(hexVal, 16));
	};
})();
```
