import * as ohm from "ohm-js";

export const grammar = ohm.grammar(String.raw`
  Shell {
    space := " " | "\t"
    Program = Item (separator Item)* separator?
    Item = FunctionDef | Export | OrStatement 
    FunctionDef = "function"? Keyword "(" ")" "{" Program "}"  -- parens
                | "function" Keyword "{" Program "}"              -- noParens
    OrStatement = OrStatement ("||" AndStatement)*  -- or
                | AndStatement
    AndStatement = AndStatement ("&&" PipeStatement)* -- and
                | PipeStatement
    PipeStatement = PipeStatement ("|" Redir)* -- pipe
                | Redir
    Redir = Paren Redirect -- redir
          | Paren
    Paren      = "(" OrStatement ")" -- paren
                | Expr
    Expr   = (Assignment spaces)* Keyword (spaces Quoted)* -- expr
           | Assignment
    Export = "export" (Assignment | Keyword)
    Assignment = Keyword ~space "=" ~space AssignmentValue
    AssignmentValue = "(" Quoted+ ")" -- arr
            | Quoted
    Redirect = (">" ~">" | ">>") arg
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
    word_char = letter | digit | "-" | "+" | "." | "_" | ":" | "$"
    separator = ";" | "\n"
  }
`);

export const semantics = grammar.createSemantics().addOperation("ast", {
  Program(a, _, b, _trailingSeparator) {
    return [a.ast(), ...b.children.map((c) => c.ast())];
  },
  FunctionDef_parens(f, k, op, cp, ob, s, cb) {
    return { type: "function", args: [k.ast(), s.ast()] };
  },
  FunctionDef_noParens(f, k, ob, s, cb) {
    return { type: "function", args: [k.ast(), s.ast()] };
  },
  OrStatement_or(a, _, b) {
    return { type: "or", args: [a.ast(), ...b.ast()] };
  },
  AndStatement_and(a, _, b) {
    return { type: "and", args: [a.ast(), ...b.ast()] };
  },
  PipeStatement_pipe(a, _, b) {
    return { type: "pipe", args: [a.ast(), ...b.ast()] };
  },
  Redir_redir(e, r) {
    return { type: "redirect", args: [r.ast(), e.ast()] };
  },
  Paren_paren(_, e, __) {
    return e.ast();
  },
  Expr_expr(a, _s, cmd, _s2, t) {
    return { type: "cmd", cmd: cmd.ast(), args: t.ast().flat(), env: a.ast() };
  },
  Export(a, v) {
    return { type: "export", value: v.ast() };
  },
  Assignment(k, _, v) {
    return { type: "var", args: [k.ast(), v.ast()] };
  },
  AssignmentValue_arr(lp, v, rp) {
    return { type: "array", args: v.children.map((c) => c.ast()) };
  },
  // https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Redirections-1
  Redirect(op, v) {
    return { op: op.sourceString, value: v.ast() };
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
