import path from "../path";

// https://www.gnu.org/software/bash/manual/bash.html#Controlling-the-Prompt-1
export function prompt() {
  let template = process.env.PS1 || "";
  const r = { "\\u": process.env.USER, "\\w": path.getCwd() };
  for (const [k, v] of Object.entries(r)) {
    template = template.replace(k, v);
  }
  return template;
}
