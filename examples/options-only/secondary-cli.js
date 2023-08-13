const Cli = require("cli-er");

module.exports = ({ debug }) => {
  console.log(`DEBUG mode is ${debug ? "ENABLED" : "DISABLED"}`);
};

if (require.main === module) {
  new Cli(
    {
      debug: {
        aliases: ["d", "debug"],
        type: "boolean",
        negatable: true,
        description: "Enable debug logs",
        default: false,
      },
    },
    { cliName: "secondary-cli" },
  ).run();
}
