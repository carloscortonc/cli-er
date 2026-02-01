import { grammar, semantics } from "./grammar.js";
import ExecWorker from "./exec-worker?worker";
import { serialize } from "./serializer.js";
import * as renderer from "../renderer.js";
import kernel, { FileDescriptor } from "../kernel.js";
import FDStack from "./FDStack.js";
import fs from "../fs.js";
import run from "./cli-runner.js";

// Capture cli output, send it to the corresponding fd
process.stdout.write = (v) => kernel.getFD(1).write(v);
process.stderr.write = (v) => kernel.getFD(2).write(v);

const execWorker = new ExecWorker();

async function executeAst(node, opts = {}) {
  try {
    if (typeof node === "string") {
      return node;
    }
    if (node.type === "quote") {
      FDStack.push(1, new FileDescriptor("PIPE"));
      const args = [];
      for (const arg of node.args) {
        if (typeof arg === "string" || arg.type === "expansion") {
          args.push(await executeAst(arg));
          continue;
        }
        await executeAst(arg);
        // Remove trailing new-lines (https://www.gnu.org/software/bash/manual/bash.html#Command-Substitution-1)
        const buffer = kernel.getFD(1).flush().replace(/\n?$/, "");
        args.push(buffer);
      }
      FDStack.pop(1);
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
        return process.exit(1);
      }

      // Handle "builtins" that need access to internals (e.g. renderer), and would not otherwise work from web-worker
      if (cliSpec.builtin) {
        await run({ name: node.cmd, cliSpec, args });
        return process.exit(process.exitCode);
      }

      // Create and object containing required process properties for the worker
      const p = { env, stdout: { columns: process.stdout.columns }, stdin: { isTTY: process.stdin.isTTY } };

      return await new Promise((resolve) => {
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
      FDStack.push(1, new FileDescriptor("PIPE"));
      await executeAst(node.args[0], { flush: false });
      const pipe = FDStack.pop(1);
      FDStack.flush();

      // Write captured value (fd=1) into fd=0 (stdin)
      FDStack.push(0, pipe);
      await fs.writeFile(fs.getProcessFdPath(0), pipe.buffer);

      await executeAst(node.args[1], opts);

      // Remove fd=0 (stdin)
      FDStack.pop(0);
      await fs.deleteFile(fs.getProcessFdPath(0));
    }
  } finally {
    FDStack.flush();
  }
}

export default async function execute(input) {
  const r = grammar.match(input);
  if (!r.succeeded()) {
    // Render error directly
    renderer.renderOutput(r.message, { error: true });
  }
  const ast = semantics(r).ast();

  FDStack.init();

  return executeAst(ast);
}
