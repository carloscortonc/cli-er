// Create a new Cli instance and run it with the provided arguments
export default async function run({ name, cliSpec, args }) {
  const c = new Cli(cliSpec.definition || {}, { ...cliSpec.cliOptions, cliName: name });
  // Update default help template
  c.options.help.template =
    cliSpec.cliOptions.help?.template || "{usage}\n{description}\n{namespaces}\n{commands}\n{options}";

  // Setup handler callback
  globalThis.CLI_ACTION_REF = cliSpec.action || (() => process.stderr.write("Not implemented\n"));

  // Reset exitCode before executing command
  process.exitCode = 0;

  return c.run(args);
}
