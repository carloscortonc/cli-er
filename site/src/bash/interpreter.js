import { grammar, semantics } from "./grammar.js";
import ExecWorker from "./exec-worker?worker";
import { serialize } from "./serializer.js";
import * as renderer from "../renderer.js";
import kernel from "../kernel.js";
import fs from "../fs.js";
import run from "./cli-runner.js";

const execWorker = new ExecWorker();

/** Read from `opts.fds` and clear them. Render `opts.render` */
const flush = async (opts = { fds: [1, 2], render: [1, 2] }) => {
  const o = await Promise.all(opts.fds.map((fd) => fs.readFile(fs.getProcessFdPath(fd)).then((v) => [fd, v]))).then(
    (o) => o.reduce((acc, [fd, v]) => ((acc[fd] = v), acc), {}),
  );
  // Empty contents
  await Promise.all(opts.fds.map((fd) => fs.writeFile(fs.getProcessFdPath(fd), "")));
  for (const r of opts.render || []) {
    renderer.renderOutput(o[r], { error: r == 2 });
  }
  return o;
};

async function executeAst(node, opts = {}) {
  if (typeof node === "string") {
    return node;
  }
  if (node.type === "quote") {
    const args = [];
    for (const arg of node.args) {
      if (typeof arg === "string" || arg.type === "expansion") {
        args.push(await executeAst(arg));
        continue;
      }
      await executeAst(arg, { flush: false });
      const { 1: o } = await flush({ fds: [1] });
      args.push(o);
    }
    return args.join("");
  }
  if (node.type === "env") {
    const arg1 = node.args[1];
    // Wrap value with "quoted" node-type to reuse logic for capturing output
    const v = typeof arg1 !== "string" && arg1.type !== "quote" ? { type: "quote", args: [arg1] } : arg1;
    const r = [node.args[0], await executeAst(v, opts)];
    if (node.cmd === true) {
      return r;
    }
    process.env[r[0]] = r[1];
  }
  if (node.type === "expansion") {
    const v = node.args[0];
    // https://www.gnu.org/software/bash/manual/bash.html#Special-Parameters-1
    if (v === "0") return process.env.SHELL;
    if (v == "?") return process.lastExitCode.toString();
    if (v == "$") return kernel.getpid();
    return process.env[v];
  }
  if (node.type === "cmd") {
    const cliSpec = CLI_COMMANDS[node.cmd];
    const args = [];
    // Process arguments
    for (const arg of node.args) {
      let av = await executeAst(arg, opts);
      av !== undefined && args.push(av);
    }
    const env = { ...process.env };
    // Process environment variables
    for (const e of node.env) {
      const [k, v] = await executeAst({ ...e, cmd: true }, opts);
      env[k] = v;
    }
    console.log(`[execute::cmd] ${node.cmd} args=${JSON.stringify(args)} env=${JSON.stringify(env)}`);

    if (!cliSpec) {
      process.stderr.write(`cliersh: command not found: "${node.cmd}"\n`);
      opts.flush !== false && (await flush());
      return process.exit(1);
    }

    // Handle "builtins" that need access to internals (e.g. renderer), and would not otherwise work from web-worker
    if (cliSpec.builtin) {
      await run({ name: node.cmd, cliSpec, args });
      opts.flush !== false && (await flush());
      return process.exit(process.exitCode);
    }

    // Create and object containing required process properties for the worker
    const p = { env, stdout: { columns: process.stdout.columns }, stdin: { isTTY: process.stdin.isTTY } };

    await new Promise((resolve) => {
      execWorker.postMessage(serialize({ name: node.cmd, cliSpec, args, process: p, cliHandlerUrl }));

      execWorker.onmessage = ({ data }) => {
        if (data.type === "output") {
          process[data.stream].write(data.value);
        } else if (data.type === "exit") {
          process.exit(data.exitCode);
          resolve();
        }
      };
    });
    opts.flush !== false && (await flush());
    return;
  }
  if (node.type === "and") {
    for (const child of node.args) {
      await executeAst(child, opts);
      if (process.lastExitCode !== 0) break;
    }
  }
  if (node.type === "or") {
    for (const child of node.args) {
      await executeAst(child, opts);
      if (process.lastExitCode === 0) break;
    }
  }
  if (node.type === "pipe") {
    await executeAst(node.args[0], { flush: false });
    // Flush both stdout & stderr, only render stderr
    const { 1: o } = await flush({ fds: [1, 2], render: [2] });
    // Write captured value into fd=0 (stdin)
    await fs.writeFile(fs.getProcessFdPath(0), o);
    process.stdin.isTTY = false;
    await executeAst(node.args[1], opts);
    // Empty fd=0 (stdin)
    await fs.writeFile(fs.getProcessFdPath(0), "");
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
