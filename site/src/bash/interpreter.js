import { grammar, semantics } from "./grammar.js";
import ExecWorker from "./exec-worker?worker";
import { serialize } from "./serializer.js";
import * as renderer from "../renderer.js";
import kernel, { FileDescriptor } from "../kernel";
import FDStack from "./FDStack.js";
import fs from "../fs.js";
import pathmodule from "../path.js";
import run from "./cli-runner.js";
import { F_MODE } from "../kernel/permission.js";

// Capture cli output, send it to the corresponding fd
process.stdout.write = (v) => kernel.getFD(1).write(v);
process.stderr.write = (v) => kernel.getFD(2).write(v);

let execWorker;

const instantiateWorker = () => {
  execWorker = new ExecWorker();
  kernel.registerProcess(execWorker);
};
instantiateWorker();

class Bash {
  variables = {};
  functions = {};

  async execute(input, env = process.env) {
    const r = grammar.match(input);
    if (!r.succeeded()) {
      // Render error directly
      renderer.renderOutput(r.message, { error: true });
    }
    const ast = semantics(r).ast();

    return this.#executeProgram(ast, env);
  }

  async #executeProgram(program, env) {
    for (const s of program) {
      FDStack.init();
      await this.executeAst(s, env);
      FDStack.cleanup();
    }
  }

  async executeAst(node, env = process.env) {
    try {
      if (typeof node === "string") {
        return node;
      }
      if (node.type === "substitution") {
        FDStack.push(1, new FileDescriptor("PIPE"));
        try {
          await this.executeAst(node.value, env);
          // Remove trailing new-lines (https://www.gnu.org/software/bash/manual/bash.html#Command-Substitution-1)
          return kernel.getFD(1).flush().replace(/\n?$/, "");
        } finally {
          FDStack.pop(1);
        }
      }
      if (node.type === "quote") {
        const args = [];
        for (const arg of node.args) {
          args.push(await this.executeAst(arg, env));
        }
        return args.join("");
      }
      if (node.type === "array") {
        const a = [];
        for (const e of node.args) {
          a.push(await this.executeAst(e, env));
        }
        return a;
      }
      if (node.type === "export") {
        const key = await this.executeAst(node.value, env);
        env[key] = this.variables[key];
      }
      if (node.type === "var") {
        const [name, value] = node.args;
        const r = [name, await this.executeAst(value, env)];
        if (node.cmd === true) {
          return r;
        }
        this.variables[r[0]] = r[1];
        // return variable name
        return r[0];
      }
      if (node.type === "expansion") {
        const v = node.args[0];
        // https://www.gnu.org/software/bash/manual/bash.html#Special-Parameters-1
        if (v === "0") return this.variables["0"] || env.SHELL;
        if (v == "?") return process.lastExitCode.toString();
        if (v == "$") return kernel.getpid();
        return this.variables[v] ?? env[v];
      }
      if (node.type === "cmd") {
        const args = [];
        // Process arguments
        for (const arg of node.args) {
          const av = await this.executeAst(arg, env);
          av !== undefined && args.push(...(Array.isArray(av) ? av : [av]));
        }
        const newenv = { ...env };
        // Process environment variables
        for (const e of node.env) {
          const [k, v] = await this.executeAst({ ...e, cmd: true }, newenv);
          newenv[k] = v;
        }
        console.log(`[execute::cmd] ${node.cmd} args=${JSON.stringify(args)} env=${JSON.stringify(newenv)}`);

        // Check for function definition
        if (this.functions[node.cmd]) {
          // Provide variables ($1, $2, ...)
          const prevArgs = Object.fromEntries(Object.entries(this.variables).filter(([key]) => /^\d+$/.test(key)));
          for (const key of Object.keys(prevArgs)) {
            delete this.variables[key];
          }
          this.variables["0"] = node.cmd;
          for (let i = 0; i < args.length; i++) {
            this.variables[i + 1] = args[i];
          }
          try {
            await this.#executeProgram(this.functions[node.cmd], newenv);
          } finally {
            for (const key of Object.keys(this.variables).filter((key) => /^\d+$/.test(key))) {
              delete this.variables[key];
            }
            Object.assign(this.variables, prevArgs);
          }
          return process.exit(process.exitCode);
        }

        // Check for executable file
        const fp = pathmodule.resolve(pathmodule.getCwd(), node.cmd);
        const file = await fs.info(fp);
        if (file && file.metadata?.p & F_MODE.EXECUTE) {
          const content = await fs.readFile(fp);
          return this.execute(content, newenv);
        }

        const cliSpec = CLI_COMMANDS[node.cmd];
        if (!cliSpec) {
          process.stderr.write(`cliersh: command not found: "${node.cmd}"\n`);
          return process.exit(-1);
        }

        const stdin = kernel.getFD(0)?.type === "PIPE" ? kernel.getFD(0).buffer : "";

        // Handle "builtins" that need access to internals (e.g. renderer), and would not otherwise work from web-worker
        if (cliSpec.builtin) {
          fs.setStdin(stdin);
          try {
            await run({ name: node.cmd, cliSpec, args });
          } finally {
            fs.setStdin("");
          }
          return process.exit(process.exitCode);
        }

        // Create and object containing required process properties for the worker
        const p = { env: newenv, stdout: { columns: process.stdout.columns }, stdin: { isTTY: process.stdin.isTTY } };

        return await new Promise((resolve, reject) => {
          execWorker.postMessage(serialize({ name: node.cmd, cliSpec, args, process: p, cliHandlerUrl, stdin }));

          execWorker.onmessage = ({ data }) => {
            if (data.type === "output") {
              process[data.stream].write(data.value);
            } else if (data.type === "exit") {
              process.exit(data.exitCode);
              data.exitCode === 130 ? (instantiateWorker(), reject({ code: "SIGINT" })) : resolve();
            }
          };
        });
      }
      if (node.type === "and") {
        for (const child of node.args) {
          await this.executeAst(child, env);
          if (process.lastExitCode !== 0) break;
        }
      }
      if (node.type === "or") {
        for (const child of node.args) {
          await this.executeAst(child, env);
          if (process.lastExitCode === 0) break;
        }
      }
      if (node.type === "pipe") {
        FDStack.push(1, new FileDescriptor("PIPE"));
        await this.executeAst(node.args[0], env);
        const pipe = FDStack.pop(1);
        await FDStack.flush();

        // Write captured value (fd=1) into fd=0 (stdin)
        FDStack.push(0, pipe);

        await this.executeAst(node.args[1], env);

        // Remove fd=0 (stdin)
        FDStack.pop(0);
      }
      if (node.type === "redirect") {
        const [{ op, value }, expr] = node.args;
        await fs.writeFile(value, "", { concat: op === ">>" && (await fs.info(value)) });
        FDStack.push(1, new FileDescriptor("FILE", { name: value }));
        await this.executeAst(expr, env);
        await FDStack.flush();
        FDStack.pop(1);
      }
      if (node.type === "function") {
        const [fname, fdef] = node.args;
        return (this.functions[fname] = fdef);
      }
    } finally {
      await FDStack.flush();
    }
  }
}

const bash = new Bash();

export default bash;
