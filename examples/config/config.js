import Cli from "../../dist/index.js";

export const get = (params) => console.log("[GET]", params);
export const set = (params) => console.log("[SET]", params);

new Cli(
  {
    config: {
      kind: "namespace",
      description: "Manage configuration",
      default: "get",
      options: {
        get: {
          kind: "command",
          description: "Get configuration values",
          options: {
            key: {
              positional: 0,
              description: "Configuration key to get",
            },
          },
        },
        set: {
          kind: "command",
          description: "Update configuration values",
          options: {
            key: {
              positional: 0,
              description: "Configuration key to set",
              required: true,
            },
            value: {
              positional: 1,
              description: "Configuration value to set",
              required: true,
            },
          },
        },
      },
    },
  },
  { rootCommand: false },
).run();
