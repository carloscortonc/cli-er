import browserify from "browserify";

const b = browserify({
  entries: ["cli.js"],
  insertGlobalVars: {
    __filename: undefined,
    __dirname: undefined,
    Buffer: undefined,
    global: undefined,
    process: undefined,
  },
});

// plugin: esmify
b.plugin("esmify");

// requires with aliases
b.require("./shims/fs.js", { expose: "fs" });
b.require("./shims/url.js", { expose: "url" });

// bundle output
b.bundle().pipe(process.stdout);
