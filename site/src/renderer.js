let [s, i, sp, o, oa] = ["shell", "input", "sprompt", "output", "output-after"].map((id) =>
  document.getElementById(id),
);

const OUTPUT_ID = "exec";

export function renderInput(value) {
  const input = document.createElement("div");
  input.className = "input-wrapper";
  input.innerHTML = `$<span>${value}</span>`;
  sp.classList.add("executing");
  clearOutput(oa);
  o.appendChild(input);
}

export function updateInputValue(value) {
  i.value = value;
  i.setSelectionRange(value.length, value.length);
}

export function renderOutput(value, { error } = {}) {
  const r = document.querySelector(`#output>pre[data-id="${OUTPUT_ID}"]`) || undefined;
  const e = r || document.createElement("pre");
  e.innerText = e.innerText.concat(value);
  error && (e.className = "error");
  if (!r) {
    e.setAttribute("data-id", OUTPUT_ID);
    o.appendChild(e);
  }
  clearOutput(oa);
  s.scrollTop = s.scrollHeight;
}

export function flushOutput() {
  sp.classList.remove("executing");
  let e = document.querySelector(`#output>pre[data-id="${OUTPUT_ID}"]`);
  if (!e) return;
  e.removeAttribute("data-id");
}

export function updateOutput(value) {
  oa.innerText = value;
}

export function clearOutput(e = o) {
  e.innerHTML = "";
}

export const clearSpec = [
  {},
  { cliDescription: "Clear the terminal screen", help: { hidden: true } },
  () => clearOutput(),
];
