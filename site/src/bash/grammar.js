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
    Assignment = Keyword ~space "=" ~space Quoted
    Quoted = "\"" (InnerExpr | Expansion | QuotedText)* "\"" -- quoted
          | InnerExpr
          | Expansion
          | arg
    InnerExpr = "$(" OrStatement ")"
    Expansion = "$" (word | "?")
    QuotedText = #( scaped | ~("\"" | "\\") ~("$" word) ~("$(") any )+
    Keyword = ~"-" ~digit word
    arg = (word_char | "/" )+
    scaped = "\\" ("n" | "\"" | "\\" | "$")
    word = word_char+
    word_char = letter | digit | "-" | "." | "_" | ":" | "$"
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
  Expansion(_, k) {
    return { type: "expansion", args: [k.sourceString] };
  },
  Keyword(v) {
    return v.ast();
  },
  Quoted_quoted(_lq, s, _rq) {
    const args = s.children.map((c) => {
      let v = c.ast();
      // Spaces are lost in QuotedText when appearing after InnerExpr
      // As temporary workaround, include any preceding spaces into QuotedText value
      if (c.ctorName === "QuotedText") {
        let i = c.source.startIdx - 1;
        for (i; s.source.sourceString[i] == " "; i--);
        v = "".concat(" ".repeat(c.source.startIdx - 1 - i), v);
      }
      return v;
    });
    return { type: "quote", args };
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
