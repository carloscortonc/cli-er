import { grammar, semantics } from "./grammar.js";

async function executeAst(node) {
  let r;
  if (node.type === "cmd") {
    const cliSpec = CLI_COMMANDS[node.cmd];
    console.log("[execute::cmd] args:", JSON.stringify(node.args));
    if (!cliSpec) {
      process.stderr.write(`Command not found: "${node.cmd}"`);
      return false;
    }
    window.CLI_ACTION_REF = cliSpec[2];
    return await new Cli(cliSpec[0], { ...cliSpec[1], cliName: node.cmd }).run(node.args);
  }
  if (node.type === "and") {
    for (const child of node.args) {
      if (!(r = await executeAst(child))) return false;
    }
    return r;
  }
  if (node.type === "or") {
    for (const child of node.args) {
      if ((r = await executeAst(child))) return r;
    }
    return false;
  }
  if (node.type === "pipe") {
    const nextInput = await execute(node.args[0]);
    process.env.PIPED = nextInput;
    // set nextInput into process.env
    return await executeAst(node.args[1]);
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
