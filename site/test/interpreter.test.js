import assert from "node:assert/strict";
import { after, afterEach, beforeEach, test } from "node:test";

const state = (globalThis.__interpreterTest = {
  builtinCalls: [],
  builtinHandler: () => {},
  workerCalls: [],
  workerHandler: () => ({}),
});
const originalProcess = {
  exit: process.exit,
  exitCode: process.exitCode,
  lastExitCode: process.lastExitCode,
  stderrWrite: process.stderr.write,
  stdoutWrite: process.stdout.write,
};
let importCount = 0;

beforeEach(() => {
  state.builtinCalls.length = 0;
  state.builtinHandler = () => {};
  state.workerCalls.length = 0;
  state.workerHandler = () => ({});
  globalThis.CLI_COMMANDS = {};
  globalThis.cliHandlerUrl = "test://handler";
  process.exit = (code = 0) => {
    process.exitCode = code;
    process.lastExitCode = code;
  };
  process.exitCode = 0;
  process.lastExitCode = 0;
});

afterEach(() => {
  process.stderr.write = originalProcess.stderrWrite;
  process.stdout.write = originalProcess.stdoutWrite;
});

after(() => {
  process.exit = originalProcess.exit;
  process.exitCode = originalProcess.exitCode;
  process.lastExitCode = originalProcess.lastExitCode;
  delete globalThis.CLI_COMMANDS;
  delete globalThis.cliHandlerUrl;
  delete globalThis.__interpreterTest;
});

async function loadBash(commands, workerHandler = () => ({})) {
  globalThis.CLI_COMMANDS = commands;
  state.workerHandler = workerHandler;
  return (await import(`../src/bash/interpreter.js?test=${importCount++}`)).default;
}

test("dispatches parsed arguments and command-local environment to a worker", async () => {
  const bash = await loadBash({ record: {} });
  const env = { BASE: "base" };

  await bash.execute('value=one; local=value record "$value"', env);

  assert.deepEqual(state.workerCalls, [
    { name: "record", args: ["one"], env: { BASE: "base", local: "value" }, stdin: "" },
  ]);
  assert.deepEqual(env, { BASE: "base" });
});

test("dispatches builtins to the runner with pipeline stdin", async () => {
  const builtin = { builtin: true };
  const bash = await loadBash({ emit: {}, record: builtin }, ({ name }) => (name === "emit" ? { stdout: "one" } : {}));

  await bash.execute("emit | record value", {});

  assert.deepEqual(state.workerCalls, [{ name: "emit", args: [], env: {}, stdin: "" }]);
  assert.deepEqual(state.builtinCalls, [{ name: "record", cliSpec: builtin, args: ["value"], stdin: "one" }]);
});

test("short-circuits logical operators", async () => {
  const bash = await loadBash({ fail: {}, skipped: {}, fallback: {} }, ({ name }) => ({
    exitCode: name === "fail" ? 1 : 0,
  }));

  await bash.execute("fail && skipped || fallback", {});

  assert.deepEqual(
    state.workerCalls.map(({ name }) => name),
    ["fail", "fallback"],
  );
});

test("trims command-substitution output inside quotes", async () => {
  const bash = await loadBash({ emit: {}, record: {} }, ({ name, args }) =>
    name === "emit" ? { stdout: `${args[0]}\n` } : {},
  );

  await bash.execute('record "$(emit one)"', {});

  assert.deepEqual(state.workerCalls, [
    { name: "emit", args: ["one"], env: {}, stdin: "" },
    { name: "record", args: ["one"], env: {}, stdin: "" },
  ]);
});

test("sets positional arguments for shell functions", async () => {
  const bash = await loadBash({ record: {} });

  await bash.execute('function show() { record "$1"; }; show hello', {});

  assert.deepEqual(state.workerCalls, [{ name: "record", args: ["hello"], env: {}, stdin: "" }]);
});

test("runs every pipeline stage with prior stdout as stdin", async () => {
  const bash = await loadBash({ first: {}, second: {}, third: {} }, ({ name, stdin }) => {
    if (name === "first") return { stdout: "one" };
    if (name === "second") return { stdout: `${stdin}-two` };
    return { stdout: `${stdin}-three` };
  });

  await bash.execute("first | second | third", {});

  assert.deepEqual(state.workerCalls, [
    { name: "first", args: [], env: {}, stdin: "" },
    { name: "second", args: [], env: {}, stdin: "one" },
    { name: "third", args: [], env: {}, stdin: "one-two" },
  ]);
});
