// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Static-only build for self-hosting (Hostinger VPS, nginx, any static host).
// Inside the Lovable environment the normal server build is kept so preview
// and publish keep working; everywhere else `npm run build` produces a plain
// single-page app in `dist/`.
const isLovableEnv = process.env["LOVABLE_SANDBOX"] === "1" || !!process.env["SANDBOX"];
const staticBuild = !isLovableEnv;

// Where the app is served from. "/" for a domain/subdomain root, or a
// sub-path like "/speedrun/" when served from a folder behind a proxy.
const basePath = process.env["VITE_BASE_PATH"] || "/";

export default defineConfig({
  ...(staticBuild ? { vite: { base: basePath } } : {}),
  ...(staticBuild ? { nitro: false as const } : {}),
  tanstackStart: staticBuild
    ? {
        // No SSR, no server functions: prerender the shell once and let the
        // browser router take over.
        spa: {
          enabled: true,
          prerender: { enabled: true, outputPath: "/index.html", crawlLinks: false },
        },
      }
    : {
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        // nitro/vite builds from this
        server: { entry: "server" },
      },
});
