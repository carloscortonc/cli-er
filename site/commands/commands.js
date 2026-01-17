export default [
  {},
  { cliDescription: "List available commands" },
  (p) => {
    Cli.logger.log("[Command::action]", p);
  },
];
