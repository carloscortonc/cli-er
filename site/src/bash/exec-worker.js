import "../cli.web.js";
import { deserialize } from "./serializer.js";
import run from "./cli-runner.js";

// Send output to main thread
process.stdout.write = (value) => postMessage({ type: "output", stream: "stdout", value });
process.stderr.write = (value) => postMessage({ type: "output", stream: "stderr", value });

self.onmessage = async (e) => {
  const { name, cliSpec, args, env, cliHandlerUrl } = deserialize(e.data);
  // Setup handler url
  require("url").pathToFileURL = () => ({ href: cliHandlerUrl });
  // Copy env values
  process.env = env;

  await run({ name, cliSpec, args });

  postMessage({ type: "exit", exitCode: process.exitCode });
};
