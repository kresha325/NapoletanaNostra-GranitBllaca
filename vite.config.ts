import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


const isProd = process.env.NODE_ENV === "production";
const port = 4100;
const basePath = isProd ? "/NapoletanaNostra-GranitBllaca/" : "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    // ...Replit plugins removed
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "docs"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("react") ||
            id.includes("scheduler") ||
            id.includes("wouter")
          ) {
            return "react-vendor";
          }

          if (id.includes("@radix-ui")) {
            return "radix-vendor";
          }

          if (
            id.includes("framer-motion") ||
            id.includes("lucide-react") ||
            id.includes("react-icons")
          ) {
            return "ui-vendor";
          }

          if (id.includes("@tanstack")) {
            return "query-vendor";
          }

          return "vendor";
        },
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
