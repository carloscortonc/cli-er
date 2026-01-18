export default [
  {},
  { cliDescription: "Display help", help: { hidden: true } },
  () => Cli.logger.log("This is a sandboxed environment to test cli-definitions"),
];
