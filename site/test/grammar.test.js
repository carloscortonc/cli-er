import assert from "node:assert";
import { grammar, semantics } from "../src/bash/grammar.js";

function assertResult(input, expectedAst) {
  const r = grammar.match(input);
  // Use `undefined` to represent a failed parse result
  let ast = undefined;
  try {
    ast = semantics(r).ast();
  } catch {}
  assert.deepEqual(ast, expectedAst);
}

// Command
assertResult("echo 1 2", { type: "cmd", cmd: "echo", args: ["1", "2"] });
// Logic OR
assertResult("echo 1 || echo 2", {
  type: "or",
  args: [
    { type: "cmd", cmd: "echo", args: ["1"] },
    { type: "cmd", cmd: "echo", args: ["2"] },
  ],
});
// Logic AND
assertResult("echo 1 && echo 2", {
  type: "and",
  args: [
    { type: "cmd", cmd: "echo", args: ["1"] },
    { type: "cmd", cmd: "echo", args: ["2"] },
  ],
});
// Pipe
assertResult("echo 1 | echo 2", {
  type: "pipe",
  args: [
    { type: "cmd", cmd: "echo", args: ["1"] },
    { type: "cmd", cmd: "echo", args: ["2"] },
  ],
});
// AND > OR
assertResult("echo 1 || echo 2 && echo 3", {
  type: "or",
  args: [
    { type: "cmd", cmd: "echo", args: ["1"] },
    {
      type: "and",
      args: [
        { type: "cmd", cmd: "echo", args: ["2"] },
        { type: "cmd", cmd: "echo", args: ["3"] },
      ],
    },
  ],
});
// Parenthesis
assertResult("(echo 1 || echo 2) && echo 3", {
  type: "and",
  args: [
    {
      type: "or",
      args: [
        { type: "cmd", cmd: "echo", args: ["1"] },
        { type: "cmd", cmd: "echo", args: ["2"] },
      ],
    },
    { type: "cmd", cmd: "echo", args: ["3"] },
  ],
});
// Quoted
assertResult('echo some value "some value"', {
  type: "cmd",
  cmd: "echo",
  args: ["some", "value", { type: "quote", args: ["some value"] }],
});
// Quoted with logic operators
assertResult('echo "some || value"', { type: "cmd", cmd: "echo", args: [{ type: "quote", args: ["some || value"] }] });
// Quoted with scape sequence
assertResult('echo "some \\" value"', { type: "cmd", cmd: "echo", args: [{ type: "quote", args: ['some " value'] }] });
// Quoted with unknown scape sequence (error)
assertResult('echo "some \\w value"', undefined);
// Quoted expr
assertResult('echo "1$(echo 2)"', {
  type: "cmd",
  cmd: "echo",
  args: [{ type: "quote", args: ["1", { type: "cmd", cmd: "echo", args: ["2"] }] }],
});
// Quoted complex expr
assertResult('echo "1$(echo 2 && echo 2)"', {
  type: "cmd",
  cmd: "echo",
  args: [
    {
      type: "quote",
      args: [
        "1",
        {
          type: "and",
          args: [
            { type: "cmd", cmd: "echo", args: ["2"] },
            { type: "cmd", cmd: "echo", args: ["2"] },
          ],
        },
      ],
    },
  ],
});
