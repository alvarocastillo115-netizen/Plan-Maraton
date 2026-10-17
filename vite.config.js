import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: funciona igual en GitHub Pages (/repo/), Netlify o abriendo dist/ en local
export default defineConfig({
  plugins: [react()],
  base: "./",
  test: { environment: "node" },
});
