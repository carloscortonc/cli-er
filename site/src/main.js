import handleKey from "./key-handler.js";
import * as renderer from "./renderer.js";
import * as history from "./history.js";
import execute from "./bash/interpreter.js";
import "./cli.web.js";
import "./index.css";

const builtins = { history: history.spec, clear: renderer.clearSpec };
for (const c of Object.keys(builtins)) {
  window.CLI_COMMANDS[c] = builtins[c];
}

// Create handler for command actions
const blobSource = "export default (...args) => window.CLI_ACTION_REF(...args);";
const blob = new Blob([blobSource], { type: "text/javascript" });
const url = URL.createObjectURL(blob);
require("url").pathToFileURL = () => ({ href: url });

let [i, o, oa] = ["input", "output", "output-after"].map((id) => document.getElementById(id));
document.addEventListener("click", () => i.focus());
o.addEventListener("click", (e) => e.stopPropagation());

// Capture cli output
const r = (...args) => renderer.renderOutput(...args);
process.stdout.write = (v) => r(v);
process.stderr.write = (v) => r(v, { error: true });

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
    /* const [cmd, ...args] = i.value.split(" ");
    if (!cmd) return;

    const cliSpec = CLI_COMMANDS[cmd];
    if (!cliSpec) {
      return process.stderr.write(`Command not found: "${cmd}"`);
    }

    window.CLI_ACTION_REF = cliSpec[2];
    new Cli(cliSpec[0], { ...cliSpec[1], cliName: cmd }).run(args); */
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
