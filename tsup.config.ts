import { defineConfig } from "tsup";

export default defineConfig({
  target: "es6",
  splitting: false,
  sourcemap: false,
  minify: true,
  clean: true,
  dts: true,
  esbuildOptions: (options) => {
    options.footer = {
      //Got this workaround for default export from this issue: https://github.com/egoist/tsup/issues/572
      js: "module.exports = module.exports.default;",
    };
  },
  entry: ["src/index.ts"],
});
