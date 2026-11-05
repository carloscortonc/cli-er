const mocks = {
  "./exec-worker?worker": "./mocks/exec-worker.js",
  "../renderer.js": "./mocks/renderer.js",
  "../kernel.js": "../src/kernel/index.js",
  "../fs.js": "./mocks/fs.js",
  "./cli-runner.js": "./mocks/cli-runner.js",
  "./fd.js": "../src/kernel/fd.js",
  "./signal.js": "../src/kernel/signal.js",
};

export async function resolve(specifier, context, nextResolve) {
  const mock = mocks[specifier];
  if (mock) return { url: new URL(mock, import.meta.url).href, shortCircuit: true };
  return nextResolve(specifier, context);
}
