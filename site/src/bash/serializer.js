// Inspired by jsonfn, while waiting for this to get merged: https://github.com/vkiryukhin/jsonfn/pull/25
const functionPrefix = "__fn__ ";

export function serialize(data) {
  return JSON.stringify(data, (_, v) => {
    if (typeof v === "function") {
      return functionPrefix.concat(v.toString());
    }
    return v;
  });
}

export function deserialize(data) {
  return JSON.parse(data, (_, v) => {
    if (typeof v === "string" && v.startsWith(functionPrefix)) {
      return eval(v.slice(functionPrefix.length));
    }
    return v;
  });
}
