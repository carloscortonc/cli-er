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
    Expr   = Keyword (spaces Quoted)+ -- args
           | Keyword -- alone
    Keyword = ~"-" ~digit word
    Quoted = "\"" #(quotedChar)* "\"" -- quoted
          | arg
    quotedChar = scaped | ~"\"" ~"\\" any
    arg = (letter | digit | "-" | ".")+
    scaped = "\\" ("n" | "\"" | "\\" )
    word = (letter | "-" | ".")+
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
  Keyword(v) {
    return v.ast();
  },
  Quoted_quoted(_lq, s, _rq) {
    return s.children.reduce((acc, e) => acc.concat(e.ast()), "");
  },
  quotedChar(q) {
    return q.ctorName == "scaped" ? q.ast() : q.sourceString;
  },
  arg(a) {
    return a.sourceString;
  },
  scaped(_s, l) {
    return l.sourceString;
  },
  word(w) {
    return w.sourceString;
  },
  _iter(...children) {
    return children.map((c) => c.ast());
  },
  _terminal() {
    return "";
  },
});
