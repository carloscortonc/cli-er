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
assertResult("echo 1 2", { type: "cmd", cmd: "echo", args: ["1", "2"], env: [] });
// Logic OR
assertResult("echo 1 || echo 2", {
  type: "or",
  args: [
    { type: "cmd", cmd: "echo", args: ["1"], env: [] },
    { type: "cmd", cmd: "echo", args: ["2"], env: [] },
  ],
});
// Logic AND
assertResult("echo 1 && echo 2", {
  type: "and",
  args: [
    { type: "cmd", cmd: "echo", args: ["1"], env: [] },
    { type: "cmd", cmd: "echo", args: ["2"], env: [] },
  ],
});
// Pipe
assertResult("echo 1 | echo 2", {
  type: "pipe",
  args: [
    { type: "cmd", cmd: "echo", args: ["1"], env: [] },
    { type: "cmd", cmd: "echo", args: ["2"], env: [] },
  ],
});
// AND > OR
assertResult("echo 1 || echo 2 && echo 3", {
  type: "or",
  args: [
    { type: "cmd", cmd: "echo", args: ["1"], env: [] },
    {
      type: "and",
      args: [
        { type: "cmd", cmd: "echo", args: ["2"], env: [] },
        { type: "cmd", cmd: "echo", args: ["3"], env: [] },
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
        { type: "cmd", cmd: "echo", args: ["1"], env: [] },
        { type: "cmd", cmd: "echo", args: ["2"], env: [] },
      ],
    },
    { type: "cmd", cmd: "echo", args: ["3"], env: [] },
  ],
});
// Quoted
assertResult('echo some value "some value"', {
  type: "cmd",
  cmd: "echo",
  args: ["some", "value", { type: "quote", args: ["some value"] }],
  env: [],
});
// Quoted with logic operators
assertResult('echo "some || value"', {
  type: "cmd",
  cmd: "echo",
  args: [{ type: "quote", args: ["some || value"] }],
  env: [],
});
// Quoted with scape sequence
assertResult('echo "some \\" value"', {
  type: "cmd",
  cmd: "echo",
  args: [{ type: "quote", args: ['some " value'] }],
  env: [],
});
// Quoted with unknown scape sequence (error)
assertResult('echo "some \\w value"', undefined);
// Quoted expr
assertResult('echo "1$(echo 2)"', {
  type: "cmd",
  cmd: "echo",
  args: [{ type: "quote", args: ["1", { type: "cmd", cmd: "echo", args: ["2"], env: [] }] }],
  env: [],
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
            { type: "cmd", cmd: "echo", args: ["2"], env: [] },
            { type: "cmd", cmd: "echo", args: ["2"], env: [] },
          ],
        },
      ],
    },
  ],
  env: [],
});
// Quoted without quotes
assertResult("echo $(echo 1)", {
  type: "cmd",
  cmd: "echo",
  args: [{ type: "cmd", cmd: "echo", args: ["1"], env: [] }],
  env: [],
});
// Assignment
assertResult("test=1", {
  type: "env",
  args: ["test", "1"],
});
// Assigment with complex expr
assertResult("test=$(echo 1)", {
  type: "env",
  args: ["test", { type: "cmd", cmd: "echo", args: ["1"], env: [] }],
});
// Assigment with quoted expr
assertResult('test="1 $(echo 1)"', {
  type: "env",
  args: ["test", { type: "quote", args: ["1 ", { type: "cmd", cmd: "echo", args: ["1"], env: [] }] }],
});
// Assignment within command
assertResult("test=1 echo 1", {
  type: "cmd",
  cmd: "echo",
  args: ["1"],
  env: [{ type: "env", args: ["test", "1"] }],
});
// Expansion
assertResult("echo $e", {
  type: "cmd",
  cmd: "echo",
  args: [{ type: "expansion", args: ["e"] }],
  env: [],
});
// Expansion - empty
assertResult("echo $", {
  type: "cmd",
  cmd: "echo",
  args: [{ type: "expansion", args: [""] }],
  env: [],
});
// Expansion inside quotes
assertResult('echo "one and $e"', {
  type: "cmd",
  cmd: "echo",
  args: [{ type: "quote", args: ["one and ", { type: "expansion", args: ["e"] }] }],
  env: [],
});
