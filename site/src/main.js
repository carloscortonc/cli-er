import handleKey from "./key-handler.js";
import * as renderer from "./renderer.js";
import * as history from "./history.js";
import fs from "./fs.js";
import execute from "./bash/interpreter.js";
import * as builtincmds from "./builtins";
import kernel from "./kernel.js";
import "./cli.web.js";
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

let [i, o, oa, lm] = ["input", "output", "output-after", "theme"].map((id) => document.getElementById(id));
document.addEventListener("click", () => i.focus());
o.addEventListener("click", (e) => e.stopPropagation());
lm.addEventListener("click", () =>
  document.body.classList[document.body.classList.contains("light") ? "remove" : "add"]("light"),
);

// Initialize FS
await fs.init({ "/README.md": "Hello" });
require("fs").readFileSync = fs.readFileSync.bind(fs);

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
});

handleKey(i, {
  Enter: () => {
    let inputValue = i.value;
    if (!inputValue) return;
    history.add(inputValue);
    renderer.renderInput(inputValue);
    i.value = "";
    execute(inputValue).finally(() => {
      renderer.flushOutput();
    });
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
