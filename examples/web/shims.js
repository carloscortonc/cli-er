let noop = () => {};
window.process = {
  argv: [],
  stdout: { columns: window.CLI_COLUMNS || 50, write: console.log },
  stderr: { write: console.log },
  cwd: () => "",
  env: {},
  exit: noop,
};
var require = require || {};
Object.assign(require, { main: {} });
Object.assign(require.main, { filename: "$" });
