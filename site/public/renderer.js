let [i, o] = ["input", "output"].map((id) => document.getElementById(id));

export function renderInput(value) {
  const input = document.createElement("div");
  input.className = "input-wrapper";
  input.innerHTML = `$<span>${value}</span>`;
  o.appendChild(input);
}

export function updateInputValue(value) {
  i.value = value;
  i.setSelectionRange(value.length, value.length);
}

export function renderOutput(value, error) {
  const e = document.createElement("pre");
  e.innerText = value;
  error && (e.className = "error");
  o.appendChild(e);
}

export function clearOutput() {
  o.innerHTML = "";
}
