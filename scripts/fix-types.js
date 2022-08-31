/* The currently generated definition file by tsup (index.d.ts) is not working on plain js files.
  Apparently, the generated syntax `export { Cli as default }` is not compatible. After some research (https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html#default-exports),
  the solution appears to be replacing this export with `export = Cli`.
  This post-build modification/workaround is the intent of this script
*/

const path = require("path");
const fs = require("fs");

const fileLocation = path.resolve(path.join(__dirname, "..", "dist", "index.d.ts"));
let currentDts = fs.readFileSync(fileLocation).toString();
const newDts = currentDts.replace("export { Cli as default };", "export = Cli;");
fs.writeFileSync(fileLocation, newDts);