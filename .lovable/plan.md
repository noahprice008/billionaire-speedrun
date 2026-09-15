# Static VPS deployment review (Hostinger)

## Verdict up front

The app itself is already 100% browser-only: no backend calls, no logins, no
database, no keys. All game logic, currency and language tables, and saved
progress live in the browser. So the *app* is ready. The *build* is not: the
current build produces a small server bundle alongside the browser files,
because the framework this project uses (TanStack Start) is server-rendered by
default. Switching it to a pure static build is possible and is the main piece
of work.

## Already done

- No accounts, no payments, no external API, no secrets anywhere in the code.
- Nothing hard-codes localhost or a port; the dev server address is injected
  only while developing.
- `npm install`, `npm run build`, `npm run preview` scripts already exist and work.
- The build already writes into a `dist` folder.
- Routes are plain pages (`/`, `/vault`, `/empire`) with no server-only data
  loading, so nothing breaks when rendering moves fully to the browser.
- There are no environment variables in use at all, so nothing sensitive can
  leak into the built files.

## Easy

- Add `.env.example` (it will be nearly empty by design — documented as
  "no configuration required"; optional keys only for the base path).
- Add a `README.md` with the exact copy-paste install / build / upload commands
  plus the reverse-proxy config needed on the VPS.
- Add a friendly in-app "page not found" screen for unknown URLs.
- Confirm the disclaimer/footer text is unchanged by any of this.

## Needs real work

- **Turning off server rendering.** The build must be switched to single-page
  mode so it emits one `index.html` plus static files and no server bundle.
  This also means the current server-side error wrapper is no longer used in
  production.
- **Output exactly in `dist`.** Today the static files land in a `dist/client`
  subfolder. The build script needs a step that leaves the browser files
  directly in `dist`.

## Problems / honest caveats

- **"Relative asset paths" is a trap for this kind of app.** With truly relative
  paths, refreshing `/vault` makes the browser look for files under `/vault/...`
  and the page goes blank. The reliable setup is: absolute paths from the site
  root (`/`) when hosted on its own subdomain, or a configured sub-path when
  served from a folder. I'll make the base path configurable in
  `.env.example` and default it to `/`, and document both cases.
- **Refresh-on-any-route only works if the web server cooperates.** No frontend
  change can fix this alone — nginx must fall back to `index.html`. That config
  goes in the README; I'll verify locally with the preview server, but the final
  check has to happen on your VPS.
- **Lovable's own preview/publish keeps needing the server build.** I'll gate the
  change so the static output is what you get locally and on the VPS, while the
  Lovable preview keeps working. If instead you want a hard, one-way switch to
  static only, say so — the preview here may then behave differently from the
  live site.
- **Nothing in the app requires an external service today**, so the README will
  simply state that no API is expected. If you later add a leaderboard, that
  becomes the one thing needing a backend.

## Technical notes

- `vite.config.ts`: enable `tanstackStart.spa` with prerender of the shell and
  disable the nitro server build for non-Lovable builds; keep the existing
  Lovable config wrapper intact.
- `package.json`: `build` runs the Vite build then moves `dist/client/*` up into
  `dist`; `preview` serves `dist` with SPA fallback.
- Add `src/routes/$.tsx` (catch-all) rendering a themed 404 with a link home,
  and keep `notFoundComponent` behaviour consistent.
- `README.md`: `npm ci` / `npm run build` / upload `dist` via `scp` or `rsync`,
  plus an nginx `location / { try_files $uri $uri/ /index.html; }` block and a
  caching header snippet for `/assets`.
- `.env.example`: `VITE_BASE_PATH=/` with a comment, and an explicit note that
  no secrets belong in this file.
- Verification: production build, serve `dist` with a fallback-enabled static
  server, load `/`, `/vault`, `/empire` and hard-refresh each; confirm no blank
  page and no console errors.
