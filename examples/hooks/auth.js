import Cli from "../../dist/index.js";

new Cli(
  {
    status: {
      kind: "command",
      description: "Get auth information",
      action: async () => {
        Cli.logger.log("status: action\n");
      },
    },
  },
  {
    rootCommand: false,
    hooks: {
      afterParse: (ctx) => {
        Cli.logger.log(`\x1b[1;34m[auth-cli] info loc=[${ctx.location.join(",")}]\x1b[0m\n`);
      },
      beforeExecute: () => {
        if (!process.env.EXAMPLE_AUTH_TOKEN) {
          throw new Error("Missing token `EXAMPLE_AUTH_TOKEN`");
        }
      },
      afterExecute: (ctx) => {
        if (ctx.error) {
          Cli.logger.log(`\x1b[0;31m[auth-cli] error loc=[${ctx.location.join(">")}] ${ctx.error.stack}\x1b[0m\n`);
        }
      },
    },
  },
).run();
