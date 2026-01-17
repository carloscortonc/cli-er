export default [
  {},
  { cliDescription: "List available commands" },
  () => {
    Cli.logger.log("Available commands: ", Object.keys(CLI_COMMANDS).join(", "));
  },
];
