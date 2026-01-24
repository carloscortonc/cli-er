export default {
  definition: { args: { type: "string", positional: true } },
  cliOptions: { help: { hidden: true } },
  action: ({ args }) => args && Cli.logger.log(args.join(" "), "\n"),
};
