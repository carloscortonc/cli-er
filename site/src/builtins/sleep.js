export const sleep = {
  definition: { seconds: { type: "number", positional: 0, required: true, description: "number of seconds to sleep" } },
  cliOptions: {},
  action: async ({ seconds }) => new Promise((resolve) => setTimeout(resolve, seconds * 1000)),
  builtin: false, // Mark it as `false` so it will be executed inside web-worker (cancellable)
};
