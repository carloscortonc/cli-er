export default class ExecWorker {
  postMessage(message) {
    const request = JSON.parse(message);
    const state = globalThis.__interpreterTest;
    const call = {
      name: request.name,
      args: request.args,
      env: request.process.env,
      stdin: request.stdin,
    };
    state.workerCalls.push(call);
    Promise.resolve(state.workerHandler(call)).then(({ stdout = "", stderr = "", exitCode = 0 } = {}) => {
      if (stdout) this.onmessage?.({ data: { type: "output", stream: "stdout", value: stdout } });
      if (stderr) this.onmessage?.({ data: { type: "output", stream: "stderr", value: stderr } });
      this.onmessage?.({ data: { type: "exit", exitCode } });
    });
  }
}
