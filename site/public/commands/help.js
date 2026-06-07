export default {
  definition: {},
  cliOptions: { cliDescription: "Display help", help: { hidden: true } },
  action: () => Cli.logger.log("This is a sandboxed environment to test cli-definitions"),
};
