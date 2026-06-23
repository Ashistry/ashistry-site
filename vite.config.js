import { defineConfig } from "vite";
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        barrel: "scripts/fishies/barrel.ts"
      },
      output: {
        dir: "scripts/fishies/dist",
        entryFileNames: "fishies.js",
      },
    },
  },
});