import path from "../path";
import kernel from "../kernel";

// https://www.gnu.org/software/bash/manual/bash.html#Controlling-the-Prompt-1
export function prompt() {
  let template = process.env.PS1 || "";
  let h = kernel.gethostname();
  const r = {
    "\\u": process.env.USER,
    "\\w": path.getCwd(),
    "\\h": h.slice(0, h.indexOf(".")),
    "\\H": h,
  };
  for (const [k, v] of Object.entries(r)) {
    template = template.replace(k, v);
  }
  return template;
}
