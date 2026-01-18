export default [
  {},
  { cliDescription: "List available commands", help: { hidden: true } },
  () => {
    Cli.logger.log("Available commands: ", Object.keys(CLI_COMMANDS).join(", "));
  },
];
