import { grammar, semantics } from "./grammar.js";
import ExecWorker from "./exec-worker?worker";
import { serialize } from "./serializer.js";
import run from "./cli-runner.js";

const execWorker = new ExecWorker();

const capture = () => {
  const ow = process.stdout.write;
  let buffer = "";
  process.stdout.write = (v) => (buffer += v);

  return () => {
    process.stdout.write = ow;
    return buffer;
  };
};

async function executeAst(node) {
  if (typeof node === "string") {
    return node;
  }
  if (node.type === "quote") {
    const args = [];
    for (const arg of node.args) {
      if (typeof arg === "string") {
        args.push(arg);
        continue;
      }
      const free = capture();
      await executeAst(arg);
      args.push(free());
    }
    return args.join("");
  }
  if (node.type === "env") {
    const arg1 = node.args[1];
    // Wrap value with "quoted" node-type to reuse logic for capturing output
    const v = typeof arg1 !== "string" && arg1.type !== "quote" ? { type: "quote", args: [arg1] } : arg1;
    const r = [node.args[0], await executeAst(v)];
    if (node.cmd === true) {
      return r;
    }
    process.env[r[0]] = r[1];
  }
  if (node.type === "expansion") {
    const v = node.args[0];
    // https://www.gnu.org/software/bash/manual/bash.html#Special-Parameters-1
    return process.env[v];
  }
  if (node.type === "cmd") {
    const cliSpec = CLI_COMMANDS[node.cmd];
    const args = [];
    // Process arguments
    for (const arg of node.args) {
      let av = await executeAst(arg);
      av !== undefined && args.push(av);
    }
    const env = { ...process.env };
    // Process environment variables
    for (const e of node.env) {
      const [k, v] = await executeAst({ ...e, cmd: true });
      env[k] = v;
    }
    console.log(`[execute::cmd] ${node.cmd} args=${JSON.stringify(args)} env=${JSON.stringify(env)}`);

    if (!cliSpec) {
      process.stderr.write(`cliersh: command not found: "${node.cmd}"\n`);
      return process.exit(1);
    }

    // Handle "builtins" that need access to internals (e.g. renderer), and would not otherwise work from web-worker
    if (cliSpec.builtin) {
      await run({ name: node.cmd, cliSpec, args });
      return process.exit(process.exitCode);
    }

    return new Promise((resolve) => {
      execWorker.postMessage(serialize({ name: node.cmd, cliSpec, args, env, cliHandlerUrl }));

      execWorker.onmessage = ({ data }) => {
        if (data.type === "output") {
          process[data.stream].write(data.value);
        } else if (data.type === "exit") {
          process.exit(data.exitCode);
          resolve();
        }
      };
    });
  }
  if (node.type === "and") {
    for (const child of node.args) {
      await executeAst(child);
      if (process.lastExitCode !== 0) break;
    }
  }
  if (node.type === "or") {
    for (const child of node.args) {
      await executeAst(child);
      if (process.lastExitCode === 0) break;
    }
  }
  if (node.type === "pipe") {
    await executeAst(node.args[0]);
    //TODO store otuput (FD[1]) in FD[0]
    process.stdin.isTTY = false;
    await executeAst(node.args[1]);
    process.stdin.isTTY = true;
  }
}

export default async function execute(input) {
  const r = grammar.match(input);
  if (!r.succeeded()) {
    process.stderr.write(r.message);
  }
  const ast = semantics(r).ast();
  return executeAst(ast);
}
