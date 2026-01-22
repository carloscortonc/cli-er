import * as ohm from "ohm-js";

export const grammar = ohm.grammar(String.raw`
  Shell {
    Statement = OrStatement
    OrStatement = OrStatement ("||" AndStatement)*  -- or
                | AndStatement
    AndStatement = AndStatement ("&&" PipeStatement)* -- and
                | PipeStatement
    PipeStatement = PipeStatement ("|" Paren)* -- pipe
                | Paren
    Paren      = "(" OrStatement ")" -- paren
                | Expr
    Expr   = keyword (spaces Arg)+ -- args
           | keyword -- alone
    Arg = "-"* Value
    Value = keyword | number
    keyword = ~"-" ~number (letter | "-" | ".")+
    number = digit+
  }
`);

export const semantics = grammar.createSemantics().addOperation("ast", {
  OrStatement_or(a, _, b) {
    return { type: "or", args: [a.ast(), ...b.ast()] };
  },
  AndStatement_and(a, _, b) {
    return { type: "and", args: [a.ast(), ...b.ast()] };
  },
  PipeStatement_pipe(a, _, b) {
    return { type: "pipe", args: [a.ast(), ...b.ast()] };
  },
  Paren_paren(_, e, __) {
    return e.ast();
  },
  Expr_args(cmd, _, t) {
    return { type: "cmd", cmd: cmd.ast(), args: t.ast() };
  },
  Expr_alone(cmd) {
    return { type: "cmd", cmd: cmd.ast(), args: [] };
  },
  Arg(f, w) {
    return "".concat(f.sourceString, w.sourceString);
  },
  Value(v) {
    return v.ast();
  },
  keyword(w) {
    return w.sourceString;
  },
  _iter(...children) {
    return children.map((c) => c.ast());
  },
  _terminal() {
    return "";
  },
});
