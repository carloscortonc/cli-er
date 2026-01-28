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
    Expr   = (Assignment spaces)* Keyword (spaces Quoted)* -- expr
           | Assignment
    Assignment = Keyword ~space "=" ~space (Quoted | InnerExpr)
    Keyword = ~"-" ~digit word
    Quoted = "\"" (InnerExpr | QuotedText)* "\"" -- quoted
          | arg
    InnerExpr = "$(" OrStatement ")"
    QuotedText = #( scaped | ~("\"" | "\\" | "$") any )+
    arg = (letter | digit | "-" | ".")+
    scaped = "\\" ("n" | "\"" | "\\" )
    word = (letter | "-" | "." | "_" )+
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
  Expr_expr(a, _s, cmd, _s2, t) {
    return { type: "cmd", cmd: cmd.ast(), args: t.ast().flat(), env: a.ast() };
  },
  Assignment(k, _, v) {
    return { type: "env", args: [k.ast(), v.ast()] };
  },
  Keyword(v) {
    return v.ast();
  },
  Quoted_quoted(_lq, s, _rq) {
    return { type: "quote", args: s.children.map((e) => e.ast()) };
  },
  QuotedText(q) {
    return q.children.map((c) => (c.ctorName !== "any" ? c.ast() : c.sourceString)).join("");
  },
  InnerExpr(_s, expr, _e) {
    return expr.ast();
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
