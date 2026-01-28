export default {
  build: {
    minify: false,
    modulePreload: { polyfill: false },
  },
  define: {
    // Avoid replacing "process.env" references
    "process.env": "process.env",
  },
};
