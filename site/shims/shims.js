globalThis.require = undefined;
globalThis.process = {
  argv: [],
  stdout: { columns: globalThis.CLI_COLUMNS || 50, write: console.log },
  stdin: { isTTY: true },
  stderr: { write: console.log },
  cwd: () => "",
  env: {},
  exitCode: 0,
  exit: (c = 0) => ((process.exitCode = c), (process.lastExitCode = c)),
};
