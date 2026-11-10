import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  resolve: { alias: { "@": resolve("src") } },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true, routeTreeFileHeader: [] }),
    react(),
    tailwindcss(),
  ],
});
