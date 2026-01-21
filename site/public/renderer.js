let [s, i, o, oa] = ["shell", "input", "output", "output-after"].map((id) => document.getElementById(id));

export function renderInput(value) {
  const input = document.createElement("div");
  input.className = "input-wrapper";
  input.innerHTML = `$<span>${value}</span>`;
  clearOutput(oa);
  o.appendChild(input);
}

export function updateInputValue(value) {
  i.value = value;
  i.setSelectionRange(value.length, value.length);
}

export function renderOutput(value, { error } = {}) {
  const e = document.createElement("pre");
  e.innerText = value;
  error && (e.className = "error");
  o.appendChild(e);
  clearOutput(oa);
  s.scrollTop = s.scrollHeight;
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
