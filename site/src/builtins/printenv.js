export const printenv = {
  definition: { name: { type: "string", positional: 0 } },
  cliOptions: { help: { template: "Usage: printenv [name]" } },
  action: ({ name }) => {
    if (name) {
      return process.env[name] ? process.stdout.write(process.env[name]) : undefined;
    }
    const env = Object.entries(process.env)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    process.stdout.write(env);
  },
};
