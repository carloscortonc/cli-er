import "./cli.web.js";
import handleKey from "./key-handler.js";
import * as renderer from "./renderer.js";
import * as history from "./history.js";
import fs from "./fs.js";
import path from "./path.js";
import bash, { prompt } from "./bash";
import * as builtincmds from "./builtins";
import kernel, { Signal } from "./kernel";
import "./index.css";

const builtins = { history: history.spec, clear: renderer.clearSpec, ...builtincmds };
for (const c of Object.keys(builtins)) {
  builtins[c].builtin ??= true;
  window.CLI_COMMANDS[c] = builtins[c];
}

// Create handler for command actions
const blobSource = "export default (...args) => globalThis.CLI_ACTION_REF(...args);";
const blob = new Blob([blobSource], { type: "text/javascript" });
window.cliHandlerUrl = URL.createObjectURL(blob);
require("url").pathToFileURL = () => ({ href: cliHandlerUrl });

let [i, sp, o, oa, lm, sr, s] = ["input", "sprompt", "output", "output-after", "theme", "size-ref", "shell"].map((id) =>
  document.getElementById(id),
);
const hasOutputSelection = () => {
  const selection = window.getSelection();
  return !selection?.isCollapsed && (o.contains(selection.anchorNode) || o.contains(selection.focusNode));
};

// capture shell clicks to focus input, preserving selection
s.addEventListener("click", () => {
  if (hasOutputSelection()) return;
  i.focus({ preventScroll: true });
});
// re-focus input anytime a key is pressed
document.addEventListener(
  "keydown",
  (e) => {
    if (!hasOutputSelection() || e.ctrlKey || e.metaKey) return;
    i.focus({ preventScroll: true });
  },
  true,
);
lm.addEventListener("click", () =>
  document.body.classList[document.body.classList.contains("light") ? "remove" : "add"]("light"),
);
// Handle resize
const updateColumns = () => {
  const charW = sr.getBoundingClientRect().width;
  process.stdout.columns = Math.floor(o.clientWidth / charW);
};
updateColumns();
window.addEventListener("resize", updateColumns);

// Initialize FS
await fs
  .init({
    "/users/guest/README.md": "Welcome!",
    "package.json": '{ "name": "cli-er", "version": "alpha-web"}',
  })
  .catch(() => {});
require("fs").readFileSync = fs.readFileSync.bind(fs);
require("fs").readFile = fs.readFile.bind(fs);

// Initialize path
path.setCwd("/");

// Define `stdin.isTTY` as if kernel's fd=0's type is TTY
Object.defineProperty(process.stdin, "isTTY", {
  get() {
    return kernel.getFD(0)?.type === "TTY";
  },
});

// Setup initial env values
Object.assign(process.env, {
  SHELL: "cliersh",
  USER: "guest",
  PS1: `\e[0;32m\\u@\\H\e[0m:\e[0;34m\\w $\e[0m`,
});

// Method for updating bash prompt
const updatePrompt = () => {
  let p = prompt();
  if (window.CLI_PROMPT === p) return;
  window.CLI_PROMPT = renderer.parseColor(p);
  sp.innerHTML = window.CLI_PROMPT;
};
updatePrompt();
let executing = false;

handleKey(document, {
  Enter: () => {
    let inputValue = i.value;
    renderer.renderInput(inputValue);
    if (!inputValue) {
      return renderer.flushOutput();
    }
    history.add(inputValue);
    i.value = "";
    executing = true;
    bash.execute(inputValue).finally(() => {
      executing = false;
      updatePrompt();
      renderer.flushOutput();
    });
  },
  c: (e) => {
    if (!e.ctrlKey || hasOutputSelection()) return;
    kernel.kill(Signal.SIGINT);
    if (executing) {
      renderer.renderOutput("^C");
    } else {
      renderer.renderInput(i.value);
    }
    executing = false;
    i.value = "";
    renderer.flushOutput();
  },
  Tab: (e) => {
    e.preventDefault();
    const candidates = Object.keys(CLI_COMMANDS).filter((k) => k.startsWith(i.value));
    if (!candidates.length) return;
    if (candidates.length === 1) {
      i.value = candidates[0];
      return renderer.clearOutput(oa);
    }
    renderer.updateOutput(candidates.join("  "));
  },
  ArrowUp: (e) => {
    e.preventDefault();
    let p = history.previous();
    if (!p) return;
    renderer.updateInputValue(p);
  },
  ArrowDown: (e) => {
    e.preventDefault();
    let n = history.next();
    if (!n) return;
    renderer.updateInputValue(n);
  },
});

// Check query for command value
let q = new URLSearchParams(window.location.search).get("cmd") || "commands";
if (q) {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  await delay(500);
  for (let l of q.slice("")) {
    i.value += l;
    await delay(30);
  }
  await delay(200);
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
}
