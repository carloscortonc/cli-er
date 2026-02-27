export default {
  definition: {
    build: {
      description: "Run webpack",
      action: (params) => process.stdout.write("[webpack:build] ".concat(JSON.stringify(params.options))),
      options: {
        config: {
          description: "Provide path to a webpack configuration file",
          default: "./webpack.config.js",
        },
        configName: {
          aliases: ["config-name"],
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
  cliOptions: { cliName: "webpack", rootCommand: "build" },
};
