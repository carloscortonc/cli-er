import fs from "./fs.js";

export default async function run({ name, cliSpec, args }) {
  const state = globalThis.__interpreterTest;
  const call = { name, cliSpec, args, stdin: fs.stdin };
  state.builtinCalls.push(call);
  return state.builtinHandler(call);
}
