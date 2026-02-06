let [s, i, sp, o, oa] = ["shell", "input", "sprompt", "output", "output-after"].map((id) =>
  document.getElementById(id),
);

const OUTPUT_ID = "exec";

export function renderInput(value) {
  const input = document.createElement("div");
  input.className = "input-wrapper";
  input.innerHTML = `<span>${window.CLI_PROMPT}</span><span>${value}</span>`;
  sp.classList.add("executing");
  clearOutput(oa);
  o.appendChild(input);
}

export function updateInputValue(value) {
  i.value = value;
  i.setSelectionRange(value.length, value.length);
}

function createElement(tag, props) {
  let e = document.createElement(tag);
  for (let p in props) {
    e[p] = props[p];
  }
  return e;
}

export const parseColor = (v) => {
  return v.replaceAll(
    /\e\[(?:(?<id1>\d)?;)?(?<id2>\d{2,})m(?<v>.+?)(?<!\\)\e\[0m/g,
    '<span class="color-$<id2> color-mode-$<id1>">$<v></span>',
  );
};

export const scapeColor = (v) => v.replace(/\e\[0m/g, "\\$&");

export function renderOutput(value, { error } = {}) {
  const r = document.querySelector(`#output>pre[data-id="${OUTPUT_ID}"]`) || undefined;
  const e = r || document.createElement("pre");
  if (error) {
    const l = createElement("span", { innerHTML: value, ...(error && { className: "error" }) });
    e.appendChild(l);
  } else {
    const l = parseColor(value, error);
    e.insertAdjacentHTML("beforeend", l);
  }
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

export const clearSpec = {
  definition: {},
  cliOptions: { cliDescription: "Clear the terminal screen", help: { hidden: true } },
  action: () => clearOutput(),
};
