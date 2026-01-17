// Read dist/index.html and replace base ref
const fs = require("fs");
const path = require("path");
const { name } = require(path.join(__dirname, "..", "..", "package.json"));

const location = path.join(__dirname, "..", "dist", "index.html");
const value = fs.readFileSync(location, "utf-8").replace("<!-- base-inject -->", `<base href="/${name}/" />`);
fs.writeFileSync(location, value);
