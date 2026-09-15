# Billionaire Speedrun

A free, frontend-only novelty simulator: fictional chips, rigged-in-your-favour
mini-games, and an absurdly opulent virtual luxury catalogue. Nothing is real —
no accounts, no real money, no purchases, no withdrawals. All progress is saved
in the visitor's own browser (`localStorage`).

## Architecture

- **Frontend only.** No SSR, no server functions, no API routes, no database,
  no authentication, no external service.
- Static single-page app: one `index.html` plus hashed assets.
- Build tool: Vite. UI: React + Tailwind CSS + shadcn/ui. Routing: TanStack
  Router (client-side).
- **External APIs expected: none.** If a leaderboard or cross-device sync is
  added later, that is the only feature that would require a backend, and it
  would need to be documented here.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm ci
npm run build
```

Output: `dist/` (contains `index.html`, `404.html` and `assets/`).

Preview the production build locally with single-page fallback:

```sh
npm run preview
```

## Configuration

Copy the example file and adjust if needed:

```sh
cp .env.example .env
```

Only browser-safe values belong there. Every `VITE_*` variable is compiled into
the public bundle — never put passwords, API keys or tokens in it.

- `VITE_BASE_PATH=/` — use `/` when the app is served from a domain or
  subdomain root. Use a sub-path with a trailing slash (e.g. `/speedrun/`) when
  it is served from a folder behind a reverse proxy.

## Deploy to a Hostinger VPS

Build locally, then upload the `dist` folder.

```sh
# 1. build on your machine
npm ci
npm run build

# 2. create the web root on the VPS (once)
ssh root@YOUR_SERVER_IP "mkdir -p /var/www/billionaire-speedrun"

# 3. upload
rsync -avz --delete dist/ root@YOUR_SERVER_IP:/var/www/billionaire-speedrun/

# 4. permissions (once)
ssh root@YOUR_SERVER_IP "chown -R www-data:www-data /var/www/billionaire-speedrun"
```

Alternative without rsync:

```sh
scp -r dist/* root@YOUR_SERVER_IP:/var/www/billionaire-speedrun/
```

### nginx configuration

The single-page fallback is required, otherwise refreshing `/vault` or
`/empire` returns 404.

```nginx
server {
    listen 80;
    server_name your-subdomain.example.com;

    root /var/www/billionaire-speedrun;
    index index.html;

    # Single-page app fallback — required for direct links and refreshes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Hashed assets can be cached forever
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Never cache the HTML shell
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;
}
```

Enable and reload:

```sh
ssh root@YOUR_SERVER_IP "nginx -t && systemctl reload nginx"
```

HTTPS via Let's Encrypt:

```sh
ssh root@YOUR_SERVER_IP "certbot --nginx -d your-subdomain.example.com"
```

### Behind a reverse proxy

If another nginx/Traefik layer proxies to this site at a sub-path, set
`VITE_BASE_PATH=/that-path/` before building and serve the files from that
location. At a domain or subdomain root keep `VITE_BASE_PATH=/`.

### Apache (`.htaccess`) alternative

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Verifying the deployment

1. Open the site root.
2. Navigate to the Vault and Empire tabs.
3. Hard-refresh (Ctrl/Cmd+Shift+R) on each URL — the page must load, not go
   blank or 404.
4. Open an unknown URL such as `/nope` — the in-app 404 screen should appear.

## Security notes

- No credentials, tokens or private keys exist in this repository.
- `.env` is git-ignored; only `.env.example` is committed.
- Nothing is transmitted anywhere: game state never leaves the browser.

## Disclaimer

Billionaire Speedrun is a free novelty simulator. All currency, prices and
exchange rates are fictional and for entertainment only. There are no real
wagers, purchases, deposits or withdrawals, and it is not affiliated with any
real casino or luxury brand.
