export const clier = {
  definition: { cmd: { type: "string", positional: 0, description: "Name of the command", required: true } },
  cliOptions: { cliDescription: "Show clier-information about a command" },
  action: ({ cmd }) => {
    const cmdConfig = window.CLI_COMMANDS[cmd];
    if (!cmdConfig) {
      Cli.logger.error("No such command: ", cmd);
      return process.exit(1);
    }
    const format = (o) => JSON.stringify(o, null, 2).replace(/^/gm, " ".repeat(3));
    const info = "".concat(
      cmdConfig.source ? `Source: \e[4;30m${cmdConfig.source}\e[0m\n\n` : "",
      "DEFINITION:\n",
      format(cmdConfig.definition),
      "\n\nOPTIONS\n",
      format(cmdConfig.cliOptions),
    );
    process.stdout.write(info);
  },
};
