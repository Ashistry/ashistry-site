import { defineConfig } from "vite";

export default defineConfig({
    build: {
        sourcemap: true,
        rollupOptions: {
            input: "scripts/fishies/fish.ts",
            output: {
                dir: "scripts/fishies/dist",
            },
        },
    },
});