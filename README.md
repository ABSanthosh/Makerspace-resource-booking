# Makerspace Resource management

Content and resource management for SNIoE makerspace

## Notes

1. [Todo](/notes/todo.md)
2. [Meeting notes](/notes/meeting-notes.md)
3. [Data flow](/notes/data-flow.md)

## Development Setup

1. Fork and clone the repo
2. Install dependencies

```sh
yarn
#or
npm install
```

3. Install supabase cli: [ref](https://supabase.com/docs/guides/cli/getting-started)

```sh
yarn add -D supabase
#or
npm install supabase --save-dev
```

4. Install [Docker Desktop](https://docs.docker.com/desktop/)

5. Start supabase </br>
   All the config for the local supabase dev environment is in [`config.toml`](/supabase/config.toml). We are basically self hosting the supabase server in a docker container.

```sh
supabase start
```

6. Seed the database </br>
   Apart from [`prisma.schema`](/prisma/schema.prisma), we also have a seed file [`seed.ts`](/prisma/seed.ts) to seed the database with some triggers, functions and data for testing.

```sh
yarn db # check package.json for the script
# or
npm run db
```

7. Start the dev server

```sh
yarn dev
# or
npm run dev
```

8. Restart supabase  
   Sometimes, the supabase server might crash. In that case, you can restart the server using the following command.

```sh
yarn sb-restart
# or
npm run sb-restart
```

We need to run `supabase stop` with `--backup` flag to persist the data in the container.

### To see supabase status

```
supabase status
```

### [To see errors in supabase db](https://github.com/supabase/cli/issues/271#issuecomment-1661981609)

```
docker logs -f <type of container>
```

Postgres database container: `supabase_db_makerspace` </br>
Postgres config container: `supabase_config_makerspace` </br>
Storage directory container: `supabase_storage_makerspace` </br>
Functions cache container: `supabase_edge_runtime_makerspace` </br>
Inbucket emails container: `supabase_inbucket_makerspace` </br>

## Misc

### To setup auth in for local dev

1. Add `http://127.0.0.1:54321/auth/v1/callback` to google console to Authorised redirect URIs
2. Add `http://localhost:5173/` in `site_url` to `config.toml`

Ref: [Google OAuth](https://supabase.com/docs/guides/auth/auth-deep-dive/auth-google-oauth)

### [To manually set time in nixos](https://discourse.nixos.org/t/manually-set-date-and-time-on-nixos/13016)

```
sudo systemctl stop systemd-timesyncd.service
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
