export default {
  definition: {},
  cliOptions: { cliDescription: "List available commands", help: { hidden: true } },
  action: () => Cli.logger.log("Available commands: ", Object.keys(CLI_COMMANDS).join(", "), "\n"),
};
