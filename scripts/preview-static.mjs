// Minimal static server with single-page fallback, mirroring the nginx config
// used in production. No dependencies. Usage: node scripts/preview-static.mjs
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";

const dist = path.join(process.cwd(), "dist");
const port = Number(process.env.PORT || 4173);
const base = (process.env.VITE_BASE_PATH || "/").replace(/\/+$/, "");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

if (!existsSync(path.join(dist, "index.html"))) {
  console.error("dist/index.html not found — run `npm run build` first.");
  process.exit(1);
}

createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (base && pathname.startsWith(base)) pathname = pathname.slice(base.length) || "/";

  let file = path.join(dist, path.normalize(pathname).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(dist)) file = path.join(dist, "index.html");
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  // Single-page fallback: unknown paths serve the app shell.
  if (!existsSync(file)) file = path.join(dist, "index.html");

  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`Serving dist/ with SPA fallback at http://localhost:${port}${base || "/"}`);
});
