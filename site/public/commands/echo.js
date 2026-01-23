export default [
  { args: { type: "string", positional: true } },
  { help: { hidden: true } },
  ({ args }) => args && Cli.logger.log(args.join(" "), "\n"),
];
