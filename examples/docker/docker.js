const Cli = require("cli-er");

new Cli(
  {
    builder: {
      kind: "namespace",
      description: "Manage builds",
      options: {
        build: {
          kind: "command",
          description: "Build an image from a Dockerfile",
          options: {
            addHost: {
              aliases: ["--add-host"],
              type: "list",
              description: "Add a custom host-to-IP mapping (host:ip)",
            },
            buildArg: {
              aliases: ["--build-arg"],
              type: "list",
              description: "Set build-time variables",
            },
            cacheFrom: {
              aliases: ["--cache-from"],
              type: "list",
              description: "Images to consider as cache sources",
            },
            disableContentTrust: {
              aliases: ["--disable-content-trust"],
              type: "boolean",
              default: true,
              description: "Skip image verification",
            },
            file: {
              aliases: ["-f", "--file"],
              description: "Name of the Dockerfile (Default is 'PATH/Dockerfile')",
            },
            iidfile: {
              description: "Write the image ID to the file",
            },
            isolation: {
              description: "Container isolation technology",
            },
            label: {
              type: "list",
              description: "Set metadata for an image",
            },
            network: {
              default: "default",
              description: "Set the networking mode for the RUN instructions during build",
            },
            noCache: {
              aliases: ["--no-cache"],
              type: "boolean",
              description: "Do not use cache when building the image",
            },
            output: {
              aliases: ["-o", "--output"],
              description: "Output destination (format: type=local,dest=path)",
            },
            platform: {
              description: "Set platform if server is multi-platform capable",
            },
            progress: {
              default: "auto",
              description: "Set type of progress output (auto, plain, tty). Use plain to show container output",
            },
            pull: {
              type: "boolean",
              description: "Always attempt to pull a newer version of the image",
            },
            quiet: {
              aliases: ["-q", "--quiet"],
              type: "boolean",
              description: "Suppress the build output and print image ID on success",
            },
            secret: {
              description: "Secret file to expose to the build (only if BuildKit enabled)",
            },
            ssh: {
              description: "SSH agent socket or keys to expose to the build (only if BuildKit enabled)",
            },
            tag: {
              aliases: ["-t", "--tag"],
              type: "list",
              description: "Name and optionally a tag in the 'name:tag' format",
            },
            target: {
              description: "Set the target build stage to build",
            },
          },
        },
        prune: {
          kind: "command",
          description: "Remove build cache",
          options: {
            all: {
              aliases: ["-a", "--all"],
              type: "boolean",
              description: "Remove all unused build cache, not just dangling ones",
            },
            filter: {
              description: "Provide filter values (e.g. 'until=24h')",
            },
            force: {
              aliases: ["-f", "--force"],
              type: "boolean",
              description: "Do not prompt for confirmation",
            },
            keepStorage: {
              aliases: ["--keep-storage"],
              type: "number",
              description: "Amount of disk space to keep for cache",
            },
          },
        },
      },
    },
  },
  {
    rootCommand: false,
    help: {
      template:
        "\n{usage}\n{description}\n{namespaces}\n{commands}\n{options}\nRun 'docker COMMAND --help' for more information on a command.\n\nTo get more help with docker, check out our guides at https://docs.docker.com/go/guides/\n",
    },
    logger: {
      error: (...message) => process.stderr.write("\x1b[31mERROR ".concat(message.join(" "), "\x1b[0m")),
    },
  }
).run();
