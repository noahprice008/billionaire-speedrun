// Flattens the Vite/TanStack client output into `dist/` so a static host can
// serve `dist` directly. No-op inside the Lovable environment, where the
// server build output layout must stay untouched.
import { cp, rm, readdir, stat, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const isLovableEnv = process.env.LOVABLE_SANDBOX === "1" || !!process.env.SANDBOX;
if (isLovableEnv) {
  console.log("[static-build] Lovable environment detected — leaving dist/ layout as-is.");
  process.exit(0);
}

const root = process.cwd();
const dist = path.join(root, "dist");
const client = path.join(dist, "client");

if (!existsSync(client)) {
  if (!existsSync(path.join(dist, "index.html"))) {
    console.error("[static-build] No dist/client and no dist/index.html — build produced nothing.");
    process.exit(1);
  }
  console.log("[static-build] dist/ already flat.");
} else {
  const entries = await readdir(client);
  for (const entry of entries) {
    await rm(path.join(dist, entry), { recursive: true, force: true });
    await cp(path.join(client, entry), path.join(dist, entry), { recursive: true });
  }
  await rm(client, { recursive: true, force: true });
  await rm(path.join(dist, "server"), { recursive: true, force: true });
  await rm(path.join(dist, "_worker.js"), { recursive: true, force: true });
  console.log("[static-build] Flattened dist/client into dist/.");
}

const indexHtml = path.join(dist, "index.html");
const notFound = path.join(dist, "404.html");
if (existsSync(indexHtml)) {
  await writeFile(notFound, await readFile(indexHtml));
  console.log("[static-build] Wrote dist/404.html single-page fallback.");
}

const { size } = await stat(indexHtml);
console.log(`[static-build] dist/index.html ready (${size} bytes).`);
