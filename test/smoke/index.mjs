import Cli from "../../dist/index.js";
import url from "url";

export default () => {
  console.log("[ESM] Invoked cli");
}

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  new Cli({
    debug: {}
  }).run();
}