import { defineConfig } from "vite";

export default {
  build: {
    minify: false,
    modulePreload: { polyfill: false },
    outDir: "dist",
  },
  define: process.env.NODE_ENV === "production" && {
    // Avoid replacing "process.env" references
    "process.env": "process.env",
  },
  worker: {
    format: "es",
  },
};
