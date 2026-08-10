import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/argus-security-validation-docs/",
  publicDir: "public",
  build: {
    outDir: "pages-dist",
    emptyOutDir: true,
  },
});
