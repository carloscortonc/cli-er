import { grammar, semantics } from "./grammar.js";
import ExecWorker from "./exec-worker?worker";
import { serialize } from "./serializer.js";
import run from "./cli-runner.js";

const execWorker = new ExecWorker();

async function executeAst(node) {
  if (node.type === "cmd") {
    const cliSpec = CLI_COMMANDS[node.cmd];
    console.log(`[execute::cmd] ${node.cmd} args=${JSON.stringify(node.args)}`);

    if (!cliSpec) {
      process.stderr.write(`cliersh: command not found: "${node.cmd}"\n`);
      return process.exit(1);
    }

    // Handle "builtins" that need access to internals (e.g. renderer), and would not otherwise work from web-worker
    if (cliSpec.builtin) {
      await run({ name: node.cmd, cliSpec, args: node.args });
      return process.exit(process.exitCode);
    }

    return new Promise((resolve) => {
      execWorker.postMessage(serialize({ name: node.cmd, cliSpec, args: node.args, env: process.env, cliHandlerUrl }));

      execWorker.onmessage = ({ data }) => {
        if (data.type === "output") {
          process[data.stream].write(data.value);
        } else if (data.type === "exit") {
          process.exit(data.exitCode);
          resolve();
        }
      };
    });
    window.CLI_ACTION_REF = cliSpec.action;
    //TODO capture output into FD[1], capture error into FD[2]
    const c = new Cli(cliSpec.definition || {}, { ...cliSpec.cliOptions, cliName: node.cmd });
    // Update default help template
    c.options.help.template =
      cliSpec.cliOptions.help?.template || "{usage}\n{description}\n{namespaces}\n{commands}\n{options}";

    // Reset exitCode before executing command
    process.exitCode = 0;
    await c.run(node.args);
    process.exit(process.exitCode);
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
