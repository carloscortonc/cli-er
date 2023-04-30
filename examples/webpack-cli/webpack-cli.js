import Cli from "cli-er";

new Cli(
  {
    build: {
      description: "Run webpack",
      action: console.log,
      options: {
        config: {
          description: "Provide path to a webpack configuration file",
          default: "./webpack.config.js",
        },
        configName: {
          aliases: ["--config-name"],
          description: "Name of the configuration to use",
        },
        stats: {
          description: "Stats options object or preset name",
        },
      },
    },
    serve: {
      kind: "command",
      description: "Run the webpack dev server",
    },
  },
  { rootCommand: "build" },
).run();
