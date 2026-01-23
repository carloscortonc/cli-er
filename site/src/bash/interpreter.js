import { grammar, semantics } from "./grammar.js";

async function executeAst(node) {
  if (node.type === "cmd") {
    const cliSpec = CLI_COMMANDS[node.cmd];
    console.log(`[execute::cmd] ${node.cmd} args=${JSON.stringify(node.args)}`);
    if (!cliSpec) {
      process.stderr.write(`cliersh: command not found: "${node.cmd}"`);
      return process.exit(1);
    }
    window.CLI_ACTION_REF = cliSpec[2];
    //TODO capture output into FD[1], capture error into FD[2]
    const c = new Cli(cliSpec[0], { ...cliSpec[1], cliName: node.cmd });
    // Update default help template
    c.options.help.template =
      cliSpec[1].help?.template || "{usage}\n{description}\n{namespaces}\n{commands}\n{options}";

    await c.run(node.args);
    if (typeof process.exitCode !== "number") process.exitCode = 0;
  }
  if (node.type === "and") {
    for (const child of node.args) {
      await executeAst(child);
      if (process.exitCode !== 0) break;
    }
  }
  if (node.type === "or") {
    for (const child of node.args) {
      await executeAst(child);
      if (process.exitCode === 0) break;
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
