export default {
  definition: { args: { type: "string", positional: true, stdin: true } },
  cliOptions: { help: { hidden: true } },
  action: ({ args }) => args && Cli.logger.log(args.join(" ")),
};
