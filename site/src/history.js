window.CLI_HISTORY = [];
let historyStart = 0;
let hIndex = 0;

export function cmd(params) {
  if (params.c) {
    historyStart = CLI_HISTORY.length;
    return Cli.logger.log("History cleared");
  }
  let size = 20;
  params.n ||= size * -1;
  let start = Math.max(historyStart, params.n > 0 ? params.n - 1 : CLI_HISTORY.length + params.n - 1);
  let end = Math.min(CLI_HISTORY.length - 1, start + size);

  let output = CLI_HISTORY.slice(start, end)
    .map((curr, i) => "".concat((start + i + 1 - historyStart).toString().padStart(3, " "), "  ", curr))
    .join("\n");
  Cli.logger.log(output);
}

export const spec = {
  definition: {
    n: { type: "number", positional: 0, description: "Start at index n" },
    c: { type: "boolean", description: "Clear the history list" },
  },
  cliOptions: { cliDescription: "Command line history" },
  action: cmd,
};

export function add(value) {
  CLI_HISTORY.push(value);
  hIndex = CLI_HISTORY.length;
}

export function previous() {
  let v = CLI_HISTORY[--hIndex];
  hIndex = Math.max(0, hIndex);
  return v;
}

export function next() {
  let v = CLI_HISTORY[++hIndex];
  hIndex = Math.min(hIndex, CLI_HISTORY.length);
  return v;
}
