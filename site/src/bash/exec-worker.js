import "../cli.web.js";
import { deserialize } from "./serializer.js";
import fs from "../fs.js";
import run from "./cli-runner.js";

// Send output to main thread
process.stdout.write = (value) => postMessage({ type: "output", stream: "stdout", value });
process.stderr.write = (value) => postMessage({ type: "output", stream: "stderr", value });

self.onmessage = async (e) => {
  const { name, cliSpec, args, process: p, cliHandlerUrl } = deserialize(e.data);

  // Merge incoming process-data into process object
  merge(process, p);

  // Setup handler url
  require("url").pathToFileURL = () => ({ href: cliHandlerUrl });
  // Setup fs bridge
  require("fs").readFileSync = fs.readFileSync.bind(fs);

  const cleanup = await fs.wwPrepareStdinHandle();

  await run({ name, cliSpec, args });

  cleanup();

  postMessage({ type: "exit", exitCode: process.exitCode });
};

function merge(target, source) {
  for (const k in source) {
    if (typeof source[k] === "object") {
      merge(target[k], source[k]);
    } else {
      target[k] = source[k];
    }
  }
}
