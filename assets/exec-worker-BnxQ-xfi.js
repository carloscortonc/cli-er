require = (/* @__PURE__ */ (function() {
  function r(e, n, t) {
    function o(i2, f) {
      if (!n[i2]) {
        if (!e[i2]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i2, true);
          if (u) return u(i2, true);
          var a = new Error("Cannot find module '" + i2 + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i2] = { exports: {} };
        e[i2][0].call(p.exports, function(r2) {
          var n2 = e[i2][1][r2];
          return o(n2 || r2);
        }, p, p.exports, r, e, n, t);
      }
      return n[i2].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
  }
  return r;
})())({ 1: [function(require2, module, exports$1) {
  var tt = Object.create;
  var Y = Object.defineProperty, nt = Object.defineProperties, it = Object.getOwnPropertyDescriptor, ot = Object.getOwnPropertyDescriptors, st = Object.getOwnPropertyNames, ee = Object.getOwnPropertySymbols, rt = Object.getPrototypeOf, le = Object.prototype.hasOwnProperty, Te = Object.prototype.propertyIsEnumerable;
  var ve = (e, t, n) => t in e ? Y(e, t, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: n
  }) : e[t] = n, E = (e, t) => {
    for (var n in t || (t = {})) le.call(t, n) && ve(e, n, t[n]);
    if (ee) for (var n of ee(t)) Te.call(t, n) && ve(e, n, t[n]);
    return e;
  }, T = (e, t) => nt(e, ot(t));
  var F = (e, t) => {
    var n = {};
    for (var i in e) le.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (e != null && ee) for (var i of ee(e)) t.indexOf(i) < 0 && Te.call(e, i) && (n[i] = e[i]);
    return n;
  };
  var at = (e, t) => {
    for (var n in t) Y(e, n, {
      get: t[n],
      enumerable: true
    });
  }, Ce = (e, t, n, i) => {
    if (t && typeof t == "object" || typeof t == "function") for (let o of st(t)) !le.call(e, o) && o !== n && Y(e, o, {
      get: () => t[o],
      enumerable: !(i = it(t, o)) || i.enumerable
    });
    return e;
  };
  var w = (e, t, n) => (n = e != null ? tt(rt(e)) : {}, Ce(!e || !e.__esModule ? Y(n, "default", {
    value: e,
    enumerable: true
  }) : n, e)), ct = (e) => Ce(Y({}, "__esModule", {
    value: true
  }), e);
  var N = (e, t, n) => new Promise((i, o) => {
    var r = (s) => {
      try {
        a(n.next(s));
      } catch (l) {
        o(l);
      }
    }, c = (s) => {
      try {
        a(n.throw(s));
      } catch (l) {
        o(l);
      }
    }, a = (s) => s.done ? i(s.value) : Promise.resolve(s.value).then(r, c);
    a((n = n.apply(e, t)).next());
  });
  var ht = {};
  at(ht, {
    default: () => g
  });
  module.exports = ct(ht);
  var W = w(require2("path")), Qe = w(require2("fs"));
  var U = w(require2("path")), Oe = w(require2("fs")), He = w(require2("url"));
  var G = w(require2("path")), ne = w(require2("fs"));
  var z = "CLIER_DEBUG", J = () => {
    var e;
    return !["false", "0", "", void 0].includes((e = process.env[z]) == null ? void 0 : e.toLowerCase());
  };
  var R = class {
    constructor(t) {
      this.namespace = t;
    }
    log(t) {
    }
  }, pe = class extends R {
    log(t) {
      console.error(`${this.namespace} ${t}`);
    }
  }, ue = class extends R {
    log(t, n) {
      console.error(`[${this.namespace}::${n}] ${t}`), n === "WARN" && (process.exitCode = 1);
    }
  }, B = class {
    constructor(t) {
      this.strategy = t.enabled ? new t.strategy(t.namespace) : new R(t.namespace);
      let n = this;
      this.log = function(i) {
        n.strategy.log(...arguments);
      }, Object.assign(this.log, {
        enabled: t.enabled
      });
    }
  }, D = new B({
    namespace: "CLIER",
    enabled: J(),
    strategy: ue
  }).log, De = (e) => {
    let t = process.env.DEBUG ? process.env.DEBUG === "*" ? true : process.env.DEBUG.split(",").some((i) => i === e || e.startsWith(i.slice(0, i.length - 1)) && i.endsWith("*")) : false;
    return new B({
      namespace: e,
      enabled: t,
      strategy: pe
    }).log;
  };
  var I = (e) => {
    var n, i;
    if (((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) === "Map") {
      let o = /* @__PURE__ */ new Map();
      for (let [r, c] of e.entries()) o.set(r, I(c));
      return o;
    }
    if (((i = e == null ? void 0 : e.constructor) == null ? void 0 : i.name) === "Set") {
      let o = /* @__PURE__ */ new Set();
      for (let r of [...e]) o.add(I(r));
      return o;
    }
    if (Array.isArray(e)) return e.map(I);
    if (!Me(e)) return e;
    let t = {};
    for (let o of Object.keys(e)) Object.assign(t, {
      [o]: I(e[o])
    });
    return t;
  }, te = class {
    constructor() {
      return this.maxLengths = {}, this;
    }
    process(t, n) {
      return this.maxLengths[t] = Math.max(...n.map((i) => i.length)), this;
    }
    format(t, n, i = 0) {
      return n.padEnd(this.maxLengths[t] + i, " ");
    }
  };
  function Ae(e, t) {
    var p;
    let {
      start: n,
      rightMargin: i = 2,
      indent: o = 1
    } = t, r = process.stdout.columns, c = r - n - i;
    if (!r || c <= 0) return e.concat(`
`);
    let a = e, s = 0, l = [];
    for (; a.length > c; ) {
      let O = ((p = /.+[ ]/.exec(a.slice(0, c))) == null ? void 0 : p[0]) || (s = 1, a.slice(0, c - 1).concat("-"));
      l.push(O), a = a.slice(O.length - s), s = 0;
    }
    return l.push(a), l.join(`
${" ".repeat(n + o)}`).concat(`
`);
  }
  var Se = (e, t = '"') => "".concat(t, e, t), j = (e) => {
    e && g.logger.error(e, `
`), process.exit(1);
  };
  function Me(e) {
    return typeof e == "object" && e !== null && e.constructor === Object;
  }
  function fe(e, ...t) {
    for (let n in e) {
      if (Me(e[n])) {
        fe(e[n], ...t.map((i) => i[n]));
        continue;
      }
      Object.assign(e, ...t.reduce((i, o = {}) => [...i, o[n] !== void 0 ? {
        [n]: o[n]
      } : {}], []));
    }
    for (let n of t) for (let i in n) i in e || (e[i] = n[i]);
  }
  function me(e, t) {
    let n = (e == null ? void 0 : e.split(new RegExp(`(?!^)${G.default.sep == "\\" ? G.default.sep.repeat(2) : G.default.sep}`))) || [];
    for (let i = n.length; i > 0; i--) for (let o of t) {
      let r = G.default.join(...n.slice(0, i), o);
      if (ne.default.existsSync(r)) return r;
    }
  }
  function $e(e) {
    let t = me(e, ["package.json"]);
    if (t) try {
      return JSON.parse(ne.default.readFileSync(t, "utf-8"));
    } catch (n) {
    }
  }
  function _e() {
    return N(this, null, function* () {
      let e = G.default.join(__dirname, "..", "package.json");
      try {
        return JSON.parse(yield ne.default.promises.readFile(e, "utf-8")).version;
      } catch (t) {
        return;
      }
    });
  }
  var de = class extends R {
    constructor() {
      super(...arguments);
      this.list = /* @__PURE__ */ new Set();
      this.log = (n) => {
        if (n.condition === false) return;
        let i = `<${n.property}> is deprecated`.concat(n.version ? ` and will be removed in ${n.version}` : "", n.alternative ? `. Use <${n.alternative}> instead` : "", n.description ? ". ".concat(n.description) : "");
        this.list.has(i) || (this.list.add(i), D(i, "WARN"));
      };
    }
  }, H = new B({
    namespace: "CLIER",
    enabled: J(),
    strategy: de
  }).log;
  var Ie = w(require2("fs"));
  var ie = (e, t) => {
    if (!t.enum) return;
    let i = (Array.isArray(e) ? e : [e]).find((r) => !t.enum.includes(r)), o = () => t.enum.join(" | ");
    return i ? g.formatMessage("option_wrong_value", {
      option: t.key,
      expected: Se(o(), "'"),
      found: i.toString()
    }) : void 0;
  };
  function se({
    value: e,
    current: t,
    option: n,
    truePositional: i
  }) {
    let o = n.type, r = {
      value: void 0,
      next: void 0,
      error: e === void 0 && n.kind === "option" ? g.formatMessage("option_missing_value", {
        type: o,
        option: n.key
      }) : void 0
    }, c = g.formatMessage("option_wrong_value", {
      option: n.key,
      expected: `<${o}>`,
      found: e
    }), a = e === "-" && n.stdin && !process.stdin.isTTY ? Ie.default.readFileSync(0, "utf-8").trim() : e, l = {
      string: () => ({
        value: a,
        error: r.error || ie([a], n)
      }),
      boolean: () => ({
        value: ["true", void 0].includes(a) || i && a !== "false",
        next: ["true", "false"].includes(a) ? 1 : 0,
        error: void 0
      }),
      list: () => {
        let p = (t || []).concat(a == null ? void 0 : a.split(","));
        return {
          value: p,
          error: r.error || ie(p, n)
        };
      },
      number: () => {
        let p = parseInt(a);
        return {
          value: p,
          error: a && isNaN(p) ? c : r.error || ie([p], n)
        };
      },
      float: () => {
        let p = parseFloat(a);
        return {
          value: p,
          error: a && isNaN(p) ? c : r.error || ie([p], n)
        };
      }
    }[o]();
    return E(E({}, r), l);
  }
  function ge(e) {
    if (!J()) return;
    let t = (s) => s.map((l) => l.key).join(","), n = e.map((s) => s.positional), i, o;
    (i = n.find((s, l) => n.indexOf(s) !== (o = l))) && D(`Duplicated Option.positional value <${i}> in option ${e[o].key}`, "WARN");
    let r = e.filter((s) => typeof s.positional == "number"), c = r.map((s) => s.positional);
    if (!c.length) return;
    let a = 0;
    c.some((s) => ![0, -1].includes(s) && c.indexOf(s > 0 ? a = s - 1 : a = s + 1) < 0) && D(`Missing correlative positional value <${a}> in options: ${t(r)}`, "WARN");
  }
  var lt = (e, t) => {
    let n = Object.values(t).reduce((o, r) => o.concat(r.aliases), []), i = (o) => new RegExp(`^(?<alias>${o})${Z(o) ? "" : "="}(?<value>.+)`);
    return e.reduce((o, r) => {
      var a;
      let c = n.find((s) => i(s).test(r));
      if (c) {
        let {
          alias: s,
          value: l
        } = (a = i(c).exec(r)) == null ? void 0 : a.groups;
        return o.concat([s, l]);
      }
      return o.concat([r]);
    }, []);
  }, pt = (e, t) => {
    let n = Object.values(t).reduce((o, r) => {
      var a, s;
      let c;
      return r.kind === "option" && r.type === "boolean" && ((s = c = (a = r.aliases) == null ? void 0 : a.filter(Z)) == null ? void 0 : s.length) > 0 ? o.concat(c.map((l) => l.replace(/^-/, ""))) : o;
    }, []), i = new RegExp(`^-(?<flags>[${n.join("")}]+)$`);
    return e.reduce((o, r) => {
      var a;
      if (i.test(r)) {
        let {
          flags: s
        } = (a = i.exec(r)) == null ? void 0 : a.groups;
        return o.concat(s.split("").map((l) => "-".concat(l)));
      }
      return o.concat([r]);
    }, []);
  }, ut = (e, t) => [pt, lt].reduce((n, i) => i(n, t), e), je = ut;
  function dt(e, t) {
    let n = {}, i = (r, c) => {
      let a = `${r}:${c}`;
      if (n[a] !== void 0) return n[a];
      let s = o(r, c);
      return n[a] = s, s;
    };
    function o(r, c) {
      let [a, s] = r.length > c.length ? [r, c] : [c, r];
      return s.length === 0 ? a.length : a[0] === s[0] ? i(a.slice(1), s.slice(1)) : 1 + Math.min(i(a.slice(1), s), i(a, s.slice(1)), i(a.slice(1), s.slice(1)));
    }
    return o(e, t);
  }
  function Le(e, t) {
    return t.map((n) => ({
      distance: dt(e, n),
      value: n
    })).reduce((n, i) => i.distance < n.distance ? i : n, {
      distance: 1 / 0
    });
  }
  function re(n) {
    return N(this, arguments, function* ({
      definition: e,
      cliOptions: t
    }) {
      let i = (p = 1) => " ".repeat(2 * p), o = (p, O) => Object.values(p.options || {}).filter(O || (() => true)).reduce((P, f) => P.concat(...f.aliases.filter((m) => !Z(m))), []).join(","), r = [], c = [], a = (p, O = "") => {
        if (!p) return;
        let P = o({
          options: p
        }, (f) => f.kind === "option");
        c.push(`"o_${O}=${P}"`);
        for (let f of Object.values(p)) {
          let m = o(f, (y) => ["namespace", "command"].includes(y.kind));
          f.kind === "namespace" && r.push(`"${f.key}=${m}"`), a(f.options, f.key);
        }
      };
      a(e);
      let s = (p) => [""].concat(...p).join(`
${i(2)}`).concat(`
${i(1)}`), l = Object.entries({
        cliName: t.cliName,
        cliVersion: t.cliVersion,
        clierVersion: yield _e(),
        date: ft("YYYY-MM-DD HH:mm"),
        command: t.completion.command,
        nestings: s(r),
        optionsByLocation: s(c)
      }).reduce((p, [O, P]) => p.replace(new RegExp(`{{${O}}}`, "g"), P), mt);
      process.stdout.write(l);
    });
  }
  var ft = (e) => {
    let t = /* @__PURE__ */ new Date();
    return [{
      m: "getFullYear",
      n: "YYYY",
      p: 4
    }, {
      m: "getMonth",
      n: "MM",
      o: 1
    }, {
      m: "getDate",
      n: "DD"
    }, {
      m: "getHours",
      n: "HH"
    }, {
      m: "getMinutes",
      n: "mm"
    }].map((n) => E({
      p: 2,
      o: 0
    }, n)).map(({
      m: n,
      p: i,
      n: o,
      o: r
    }) => ({
      v: (t[n]() + r).toString().padStart(i, "0"),
      n: o
    })).reduce((n, {
      v: i,
      n: o
    }) => n.replace(new RegExp(o), i), e);
  }, mt = `#!/usr/bin/env bash
# Bash completion script for {{cliName}}
# This file is automatically generated by running \`{{cliName}} {{command}}\`.
# Created with cli-er@{{clierVersion}} on {{date}}

function indirect(){
  if [[ -z $ZSH_VERSION ]]; then
    echo \${!1}
  else
    echo \${(P)1}
  fi
}
_{{cliName}}() {
  # declare nestings
  local nestings=({{nestings}})
  # declare options by location ("o_" represents root)
  local opts_by_location=({{optionsByLocation}})
  # Calculate keys for all available commands/namespaces
  local all_locations=($(echo "\${opts_by_location[@]:1}" | sed 's/o_\\([^=]*\\)=[^ ]*/\\1/g'))
  # initialize top-level definitions
  local top_defs=("\${nestings[@]%%=*}")

  for d in "\${nestings[@]}";do declare "$d";done
  for o in "\${opts_by_location[@]}";do declare "$o";done

  # Obtain the location by removing the cli-name from the list of words
  local location=("\${COMP_WORDS[@]:1:$COMP_CWORD-1}")
  # Initialize options with global values
  local opts=($(echo "\${o_}" | tr "," "\\n"))
  local initialized=false includeopts=false
  while [ \${#location[@]} -gt 0 ]; do
    local curr="\${location[@]:0:1}"
    local ocurr="o_$curr"
    # Check for valid command/namespace
    if [[ " \${top_defs[@]} " =~ " \${curr} " ]] && [[ " \${all_locations[@]} " =~ " \${curr} " ]]; then
      top_defs=($(echo "$(indirect $curr)" | tr "," "\\n"))
      location=(\${location[@]:1})
      opts+=($(echo "$(indirect $ocurr)" | tr "," "\\n"))
      initialized=true
      # Check if element is a command to include options
      [[ ! " \${nestings[@]%%=*} " =~ " \${curr} " ]] && includeopts=true || includeopts=false
    else
      # if not valid location was found, empty the list
      [[ $initialized != true ]] && top_defs=()
      break
    fi
  done

  # Include options into top_defs
  [[ $includeopts == true ]] && top_defs+=("\${opts[@]}")
  COMPREPLY=($(compgen -W "\${top_defs[*]}" -- $2))
}

complete -F _{{cliName}} {{cliName}}
`;
  var Ke = () => require2.main !== void 0;
  function ae() {
    return Oe.default.realpathSync(Ke() ? require2.main.filename : process.argv[1]);
  }
  function Ve() {
    return U.default.dirname(ae());
  }
  function Fe(e) {
    return e.kind === "namespace" || !e.rawAliases ? [e.key] : e.kind === "command" ? e.rawAliases : e.rawAliases.map((t) => t.startsWith("-") ? (H({
      property: "Option.aliases with dashes",
      description: `Aliases should be specified without dashes (${e.key})`
    }), t) : (t.length > 1 ? "--" : "-").concat(t));
  }
  var Z = (e) => /^-\w$/.test(e);
  function Be(e, t) {
    t.completion.enabled && (e[t.completion.command] = {
      action: () => re({
        definition: e,
        cliOptions: t
      }),
      hidden: true
    });
    let s = t.help, {
      autoInclude: n,
      template: i
    } = s, o = F(s, ["autoInclude", "template"]);
    n && (e.help = o);
    let l = t.version, {
      autoInclude: r
    } = l, c = F(l, ["autoInclude"]);
    r && (e.version = c);
    let a = {
      positional: [],
      location: []
    };
    for (let p in e) ye(p, e, a);
    return ge(a.positional), e;
  }
  var he = (e) => e.kind === "command" || typeof e.action == "function" || e.options !== void 0 && !Object.values(e.options).some(he);
  function ye(e, t, n) {
    var c, a;
    let i = t[e];
    i.kind || (i.kind = Object.values(i.options || {}).some(he) ? "namespace" : he(i) ? "command" : "option");
    let o = T(E({}, n), {
      positional: []
    });
    if (i.kind === "option") if (i.positional === true ? i.type = "list" : i.type || (i.type = "string"), ![void 0, false].includes(i.positional) && n.positional.push(i), i.aliases = i.aliases || [e], i.type === "boolean" && i.negatable === true && (c = i.aliases) != null && c.some((s) => !s.startsWith("-") && s.length > 1)) {
      let s = e.concat("Negated");
      t[s] = {
        kind: "option",
        type: "boolean",
        aliases: i.aliases.filter((l) => !l.startsWith("-") && l.length > 1).reduce((l, p) => [...l, ...["no", "no-"].map((O) => O.concat(p))], []),
        parser: (l) => {
          let p = se(l);
          return T(E({}, p), {
            value: !p.value
          });
        },
        hidden: true,
        key: e
      }, ye(s, t, o);
    } else i.type === "boolean" && i.negatable === true && (i.negatable = false, D(`Boolean option <${e}> will be included without negated aliases. To change this, provide long aliases without dashes`, "WARN"));
    i.key || (i.key = e), i.rawAliases = i.aliases, i.aliases = Fe(i);
    let r = n.location.length > 0 ? n.location.join(".").concat(".") : "";
    i.description = g.formatMessage(r.concat(e, ".description"), {}) || i.description, H({
      property: "Command.type",
      condition: i.kind === "command" && i.type !== void 0,
      description: "Create inside a new option with `positional: 0` instead"
    }), H({
      property: "Option.value",
      condition: typeof i.value == "function",
      version: "0.12.0",
      alternative: "Option.parser"
    });
    for (let s in (a = i.options) != null ? a : {}) ye(s, i.options, Object.assign(o, {
      location: n.location.concat(e)
    }));
    ge(o.positional);
  }
  function Ee(e) {
    var S;
    let {
      args: t,
      definition: n,
      cliOptions: i
    } = e, o = {
      location: [],
      options: Object.assign({
        _: []
      }, e.initial),
      errors: [],
      rawLocation: []
    }, r = {}, c = t, a = (u) => {
      if (u.kind === "namespace") return;
      let [h, ...k] = u.aliases;
      r[h] = u, k.forEach((b) => {
        r[b] = h;
      });
    }, s = n, l = false, p = [];
    e: for (let u = 0; u < t.length; u++) {
      let h = t[u];
      if (h === "--") {
        o.options.__ = t.slice(u + 1);
        let b = t.length - c.length;
        c = c.slice(0, u - (b - 1) - 1);
        break e;
      } else if (l) continue;
      let k = Object.entries(s != null ? s : {}).sort(([b, v2]) => v2.kind === "option" ? -1 : 1);
      for (let b = 0; b < k.length; b++) {
        let [v2, M] = k[b];
        if (M.kind === "option") {
          p.push(...M.aliases);
          continue;
        }
        if (!((S = M.aliases) != null && S.includes(h))) {
          if (b < k.length - 1) continue;
          if (!p.includes(h) && (!i.rootCommand || o.location.length > 0)) {
            let $ = Re({
              target: h,
              kind: ["namespace", "command"],
              definition: n,
              rawLocation: o.rawLocation,
              cliOptions: i
            }), L = "".concat(g.formatMessage("command_not_found", {
              command: h
            }), g.formatMessage("parse-arguments.suggestion", {
              suggestion: $
            }));
            o.errors.push(L);
          }
          break e;
        }
        if (M.kind === "command") {
          M.type === void 0 && (c = c.slice(1)), o.location.push(v2), o.rawLocation.push(v2), l = true;
          break;
        }
        c = c.slice(1), o.location.push(v2), o.rawLocation.push(v2);
        let V = s[v2].default, _2 = Object.values(s[v2].options || {}).filter(($) => $.kind === "command").flatMap(($) => $.aliases);
        V && !_2.includes(c[0]) ? (o.location.push(V), s = s[v2].options[V].options || {}) : s = s[v2].options || {};
        break;
      }
    }
    let O = o.location.length === 0 && typeof i.rootCommand == "string" ? [i.rootCommand] : o.location, P = Q(n, O, i), f = O.length > 0 ? E({
      "": P
    }, P.options) : n;
    Object.values(f).forEach(a);
    let m = Object.values(f).reduce((u, v2) => {
      var M = v2, {
        positional: h,
        kind: k
      } = M, b = F(M, ["positional", "kind"]);
      return k === "option" && (h === true || typeof h == "number") && (u[h.toString()] = b), u;
    }, {}), y;
    ((k) => (k.TRUE = "1", k.FALSE = "0"))(y || (y = {}));
    let d = false, x = false, C = je(c, f);
    for (let u = 0; u < C.length; u++) {
      let h = C[u], k = C[u + 1], b = typeof r[h] == "string" ? r[h] : h, v2 = m[u] || (x ? m[u - C.length] : void 0);
      d || (d = v2 && r.hasOwnProperty(b));
      let M = false, V = (d ? void 0 : v2) || (M = true, m.true), [_2, $] = r.hasOwnProperty(b) ? [r[b], "0"] : [V, V ? "1" : "0"];
      if (x || (x = M && $ === "1"), _2 !== void 0) {
        let L = _2.key, X = {
          0: k,
          1: h
        }, Pe = Object.entries(X).some(([Xe, et]) => Xe === $ && r.hasOwnProperty(et)) ? void 0 : X[$], q = (typeof _2.parser == "function" ? _2.parser : se)({
          value: Pe,
          current: o.options[L],
          option: T(E({}, _2), {
            key: $ === "1" ? _2.key : h
          }),
          truePositional: !!m.true,
          format: () => H({
            property: "Option.parser::format",
            alternative: "Cli.formatMessage"
          })
        });
        q.error ? o.errors.push(q.error) : o.options[L] = q.value, u += q.next !== void 0 ? q.next : Pe !== void 0 ? 1 : 0, u -= $ === "1" ? 1 : 0;
      } else {
        o.options._.push(h);
        let L = Re({
          target: h,
          kind: ["option"],
          rawLocation: o.location,
          definition: n,
          cliOptions: i,
          maxDistance: 3
        }), X = "".concat(g.formatMessage("option_not_found", {
          option: h
        }), L ? g.formatMessage("parse-arguments.suggestion", {
          suggestion: L
        }) : "");
        o.errors.push(X);
      }
    }
    return Object.values(f).some((u) => {
      if (u.default !== void 0 && o.options[u.key] === void 0 && (o.options[u.key] = u.default), u.required && o.options[u.key] === void 0) return o.errors.push(g.formatMessage("option_required", {
        option: u.key
      })), true;
    }), Object.values(f).some((u) => {
      if (!u.requires || o.options[u.key] === void 0) return false;
      let k = (typeof u.requires == "function" ? u.requires(o.options[u.key]) : u.requires).filter((b) => o.options[b] === void 0).map((b) => "".concat(u.key, "->", b));
      if (k.length > 0) return o.errors.push(g.formatMessage("option_missing_dependencies", {
        option: u.key,
        dependencies: k.join(", ")
      })), true;
    }), Object.values(r).filter((u) => typeof u != "string" && typeof u.value == "function").forEach((u) => {
      let h = u.key;
      o.options[h] = u.value(o.options[h], E({}, o.options));
    }), o;
  }
  function Ge(i, o) {
    return N(this, arguments, function* ({
      location: e,
      options: t
    }, n) {
      let r = n.baseLocation;
      if (!r) return j(g.formatMessage("execute.base-location-error"));
      let c = U.default.parse(ae()), a = e.length === 1 ? [n.commandsPath].concat(e) : e;
      D(`[run:executeScript] Parameters: ${JSON.stringify({
        location: a,
        options: t
      })}`, "TRACE");
      let s = [".", ...a].reduce((p, O, P, f) => {
        let m = f.length - 1 - P, y = m === f.length - 1, d = [];
        return d.push(U.default.join(...a.slice(0, m), "index")), m > 0 ? d.push(U.default.join(...a.slice(0, m))) : d.push(c.name), d.forEach((x) => {
          p.push({
            path: x,
            default: y
          });
        }), p;
      }, []).map((p) => T(E({}, p), {
        path: U.default.join(r, p.path.concat(c.ext))
      }));
      D(`[run:executeScript] List of candidates: ${JSON.stringify(s)}`, "TRACE");
      let l = s.find((p) => Oe.default.existsSync(p.path));
      if (!l) return D(s.reduce((p, O) => "".concat(p, "  ", O.path, `
`), `There was a problem finding the script to run. Considered paths were:
`), "WARN"), j();
      D(`[run:executeScript] Selected candidate: ${JSON.stringify(l)}`, "TRACE");
      try {
        let p;
        Ke() ? p = require2(l.path) : p = yield import(He.default.pathToFileURL(l.path).href);
        let O = l.default ? p.default || p : p[e[e.length - 1]];
        return typeof O != "function" && j(g.formatMessage("execute.handler-not-found", {
          path: l.path
        })), O(t);
      } catch (p) {
        j(g.formatMessage("execute.execution-error", {
          path: l.path,
          error: p.message
        }));
      }
    });
  }
  var Ue = ((r) => (r.USAGE = "usage", r.DESCRIPTION = "description", r.NAMESPACES = "namespaces", r.COMMANDS = "commands", r.OPTIONS = "options", r))(Ue || {});
  function xe(e, t, n) {
    var y;
    let i = t, o = Q(e, i, n), r = e, c = {};
    if (i.length > 0) {
      if (o && ["namespace", "command"].includes(o.kind)) {
        let d = o.aliases && o.aliases.length > 1 ? " ".concat(g.formatMessage("generate-help.aliases", {
          aliases: o.aliases.slice(1).join(", ")
        })) : "";
        c.description = (y = o.description) == null ? void 0 : y.concat(d, `
`), r = o.options;
      } else g.logger.log(`
${g.formatMessage("generate-help.scope-not-found", {
        scope: i.join(" > ")
      })}
`), i = [];
    } else n.cliDescription && (c.description = n.cliDescription.concat(`
`));
    let {
      existingKinds: a,
      hasOptions: s,
      positionalOptions: l
    } = Object.values(r || {}).filter((d) => !d.hidden).reduce((d, x) => {
      let {
        kind: C,
        positional: S,
        required: u,
        key: h
      } = x;
      if (C === "option") {
        let k = ["help", "version"].some((v2) => v2 === h && n[v2].autoInclude), b = S === true || typeof S == "number";
        d.hasOptions || (d.hasOptions = !k && !b), b && d.positionalOptions.push({
          index: S,
          key: h,
          required: u
        });
      } else d.existingKinds.indexOf(C) < 0 && d.existingKinds.push(C);
      return d;
    }, {
      existingKinds: [],
      hasOptions: false,
      positionalOptions: []
    }), p = (d) => d.sort((x) => x === "namespace" ? -1 : 1).join("|").toUpperCase(), O = (d) => {
      let x = new Map(d.map((u) => [u.index, u])), C = [...x.keys()].filter((u) => typeof u == "number" && u >= 0).sort((u, h) => u - h), S = [...x.keys()].filter((u) => typeof u == "number" && u < 0).sort((u, h) => u - h);
      return (x.has(true) ? [...C, true, ...S] : [...C, ...S]).map((u) => {
        let h = u === true ? "..." : "", k = x.get(u);
        return k.required ? `<${k.key}${h}>` : `[${k.key}${h}]`;
      }).join(" ");
    }, P = `${g.formatMessage("generate-help.usage")}:  ${n.cliName}`, f = [P, i.slice(0, -1).join(" "), o != null && o.aliases ? o.aliases[0] : i.slice(-1)[0]].filter((d) => d).join(" "), m = l.some((d) => typeof d.index == "number" && d.index < 0);
    c.usage = (o == null ? void 0 : o.kind) === "command" && o.usage ? P.concat(" ", o.usage) : [f, p(a), (o == null ? void 0 : o.kind) === "command" && o.type !== void 0 ? `<${o.type}>` : "", s && m ? g.formatMessage("generate-help.has-options") : "", O(l), s && !m ? g.formatMessage("generate-help.has-options") : ""].filter((d) => d).join(" ").concat(`
`), gt(r, n, c);
  }
  function gt(e = {}, t, n = {}) {
    let i = new te(), o = 2, r = (f) => {
      let m = f.rawAliases;
      return f.negatable && (m = m.map((y) => y.length === 1 ? y : "(no)".concat(y))), Fe(T(E({}, f), {
        rawAliases: m
      })).join(", ");
    }, c = (f) => {
      let m = (d) => d && ` (${d})`, y = (d) => JSON.stringify(d, null, 1).split(/\n\s?/).map((x, C, S) => S.length > 1 && ![0, 1, S.length - 1].includes(C) ? " ".concat(x) : x).join("");
      return m([Array.isArray(f.enum) ? g.formatMessage("generate-help.option-enum", {
        enum: y(f.enum)
      }) : "", f.default !== void 0 ? g.formatMessage("generate-help.option-default", {
        default: y(f.default)
      }) : ""].filter((d) => d).join(", "));
    }, a = (f, m, y) => {
      let d = [" ".repeat(y), m.format("name", f.name, 2)].join("");
      return [d, Ae([f.description || "-", c(f)].join(""), {
        start: d.length
      })].join("");
    }, s = {
      namespaces: [],
      commands: [],
      options: []
    }, {
      elementSections: l,
      formattedNames: p
    } = Object.values(e).filter(({
      hidden: f
    }) => f !== true).reduce((f, m) => {
      let d = {
        namespace: "namespaces",
        command: "commands",
        option: "options"
      }[m.kind], x = r(m), C = T(E({}, m), {
        name: x
      });
      return f.formattedNames.push(x), f.elementSections[d].push(C), f;
    }, {
      elementSections: s,
      formattedNames: []
    });
    i.process("name", p), Object.entries(l).filter(([f, m]) => m.length > 0).forEach(([f, m]) => {
      let d = `${g.formatMessage(`generate-help.${f}-title`)}:
`;
      m.forEach((x) => {
        d += a(x, i, o);
      }), n[f] = d;
    }), Object.values(Ue).forEach((f) => {
      n[f] || (n[f] = void 0);
    });
    let O = (f) => `{${f}}`, P = Object.entries(n).reduce((f, [m, y]) => {
      let d = new RegExp(`${O(m)}${y ? "" : `
*`}`);
      return f.replace(d, y || "");
    }, t.help.template);
    g.logger.log(P);
  }
  function Q(e, t, n) {
    let i = I(e), o = {}, r = (s) => Object.entries(s).filter(([l, {
      kind: p
    }]) => p === "option").reduce((l, [p, O]) => T(E({}, l), {
      [p]: O
    }), {}), c = (s = {}) => Object.entries(o).filter(([l]) => !Object.keys(s).includes(l)).reduce((l, [p, O]) => T(E({}, l), {
      [p]: O
    }), s), a = t[0] === n.commandsPath ? t.slice(1) : t;
    for (let s = 0; s < a.length; s++) {
      let l = a[s];
      if (o = c(r(i)), s === a.length - 1) {
        i = i[l];
        break;
      } else if (i.hasOwnProperty(l) && ["namespace", "command"].includes(i[l].kind)) i = i[l].options;
      else return;
    }
    return a.length > 0 && i && (i.options = c(i.options)), i;
  }
  function be(e) {
    let {
      cliName: t,
      cliVersion: n
    } = e;
    g.logger.log(g.formatMessage("generate-version.template", {
      cliName: t,
      cliVersion: n
    }));
  }
  function Re(e) {
    let t = e.definition;
    e.rawLocation.length > 0 && (t = Q(e.definition, e.rawLocation, e.cliOptions).options);
    let n = Object.values(t || {}).filter((r) => e.kind.includes(r.kind)).reduce((r, c) => [...r, ...c.aliases], []), {
      value: i,
      distance: o
    } = Le(e.target, n);
    return !e.maxDistance || o <= e.maxDistance ? i : void 0;
  }
  var We = {
    command_not_found: 'Command "{command}" not found',
    option_not_found: 'Unknown option "{option}"',
    option_wrong_value: 'Wrong value for option "{option}". Expected {expected} but found "{found}"',
    option_missing_value: 'Missing value of type <{type}> for option "{option}"',
    option_required: 'Missing required option "{option}"',
    option_missing_dependencies: 'Missing dependencies for option "{option}": {dependencies}'
  }, ce = class {
    static test(t, n) {
      return new RegExp(n.replace(/\{\w+\}/g, `[a-zA-Z-0-9/\\., "'|]+`)).test(t);
    }
    static analize(t) {
      var n;
      if (t) return (n = Object.entries(g.messages).find(([i, o]) => this.test(t, o))) == null ? void 0 : n[0];
    }
  };
  var K = class {
  };
  K.log = (...t) => {
    process.stdout.write("".concat(t.join("")));
  }, K.error = (...t) => {
    process.stderr.write("ERROR ".concat(t.join("")));
  };
  var qe = {
    "execute.base-location-error": "There was a problem finding base script location",
    "execute.handler-not-found": "Could not find handler for command in {path}",
    "execute.execution-error": "There was a problem executing the script ({path}: {error})",
    "generate-help.scope-not-found": "Unable to find the specified scope ({scope})",
    "generate-help.usage": "Usage",
    "generate-help.aliases": "(aliases: {aliases})",
    "generate-help.has-options": "[OPTIONS]",
    "generate-help.option-default": "default: {default}",
    "generate-help.option-enum": "allowed: {enum}",
    "generate-help.namespaces-title": "Namespaces",
    "generate-help.commands-title": "Commands",
    "generate-help.options-title": "Options",
    "generate-version.template": `  {cliName} version: {cliVersion}
`,
    "parse-arguments.suggestion": '. Did you mean "{suggestion}" ?',
    "help.description": "Display global help, or scoped to a namespace/command",
    "version.description": "Display version"
  };
  function Ye(e, ...t) {
    return Object.entries(t[0] || {}).reduce((n, [i, o]) => n.replace(new RegExp(`{${i}}`, "g"), o), g.messages[e]);
  }
  var ze = (e) => Object.assign(e, {
    kind: "command"
  }), Je = (e) => Object.assign(e, {
    kind: "namespace"
  });
  var ke = class {
    constructor() {
      this.hooks = {};
      this.hookData = {};
    }
    register(t, n) {
      var i;
      for (let o of Object.keys(n)) (i = this.hooks)[o] || (i[o] = []), this.hooks[o].push({
        name: t,
        fn: n[o]
      });
    }
    execute(o, r) {
      return N(this, arguments, function* (t, n, i = {}) {
        let c = this.hooks[t];
        if (!c || !c.length) return;
        i.executed || (i.executed = []);
        let a = i.reverse ? [...c].reverse() : c, s = i.exclude ? a.filter((l) => !i.exclude.includes(l.name)) : a;
        for (let l of s) {
          i.executed.push(l.name), D(`[${String(l.name)}::${t}]`, "TRACE");
          try {
            yield l.fn(T(E({}, n), {
              data: this.hookData
            }));
          } catch (p) {
            if (i.captureError) {
              D(`[${String(l.name)}::${t}::error] `.concat(String(p)), "TRACE");
              continue;
            }
            throw p;
          }
        }
      });
    }
    get(t) {
      return this.hooks[t] || [];
    }
  }, Ze = ke;
  var A = class A2 {
    constructor(t, n = {}) {
      this.hooksManager = new Ze();
      var c;
      let i = Ve(), o = $e(i) || {};
      Object.assign(A2.logger, n.logger || {}), Object.assign(A2.messages, E({}, n.messages || {})), this.options = {
        baseLocation: i,
        baseScriptLocation: i,
        commandsPath: "commands",
        errors: {
          onGenerateHelp: ["command_not_found"],
          onExecuteCommand: ["command_not_found", "option_wrong_value", "option_required", "option_missing_value", "option_missing_dependencies", "option_not_found"]
        },
        help: {
          autoInclude: true,
          type: "boolean",
          aliases: ["h", "help"],
          description: A2.formatMessage("help.description"),
          template: `
{usage}
{description}
{namespaces}
{commands}
{options}
`
        },
        version: {
          autoInclude: true,
          type: "boolean",
          aliases: ["v", "version"],
          description: A2.formatMessage("version.description"),
          hidden: true
        },
        rootCommand: true,
        cliName: o.name || W.default.parse(ae()).name,
        cliVersion: o.version || "-",
        cliDescription: o.description || "",
        hooks: {},
        plugins: [],
        debug: false,
        completion: {
          enabled: true,
          command: "generate-completions"
        },
        configFile: void 0,
        envPrefix: void 0
      };
      let r = E({}, process.env[z] ? {
        debug: !["false", "0", "", void 0].includes((c = process.env[z]) == null ? void 0 : c.toLowerCase())
      } : {});
      return fe(this.options, n, r), n.baseScriptLocation && (this.options.baseLocation = this.options.baseScriptLocation, H({
        property: "CliOptions.baseScriptLocation",
        alternative: "CliOptions.baseLocation"
      })), W.default.isAbsolute(this.options.baseLocation) || (this.options.baseLocation = W.default.resolve(i, this.options.baseLocation)), W.default.isAbsolute(this.options.commandsPath) && (this.options.commandsPath = W.default.relative(this.options.baseLocation, this.options.commandsPath) || "."), process.env[z] = this.options.debug ? "1" : "", this.definition = I(t), this.definition = Be(this.definition, this.options), this;
    }
    init() {
      return N(this, null, function* () {
        return this.ensureInit();
      });
    }
    ensureInit() {
      return N(this, null, function* () {
        return this.initPromise ? this.initPromise : (this.initPromise = N(this, null, function* () {
          for (let t of this.options.plugins.filter((n) => n.init)) yield t.init(this);
          this.hooksManager.register(/* @__PURE__ */ Symbol("global"), this.options.hooks);
          for (let t of this.options.plugins) this.hooksManager.register(t.name || /* @__PURE__ */ Symbol(), t.hooks || {});
        }), this.initPromise);
      });
    }
    parse(t) {
      let n = Ee({
        args: t,
        definition: this.definition,
        cliOptions: this.options
      });
      return delete n.rawLocation, n;
    }
    run(t) {
      return N(this, null, function* () {
        yield this.ensureInit();
        let n = Array.isArray(t) ? t : process.argv.slice(2);
        yield this.hooksManager.execute("beforeParse", {
          args: n
        });
        let f = Ee({
          args: n,
          definition: this.definition,
          cliOptions: this.options,
          initial: E(E({}, this.configContent()), this.envContent())
        }), {
          rawLocation: i
        } = f, o = F(f, ["rawLocation"]);
        yield this.hooksManager.execute("afterParse", o);
        let r = o.location.length === 0 && typeof this.options.rootCommand == "string" ? [this.options.rootCommand] : o.location, c = Q(this.definition, r, this.options), a = o.errors.map((m) => ({
          type: ce.analize(m),
          e: m
        })).filter(({
          e: m
        }) => m);
        if (this.options.version.autoInclude && o.options.version) return be(this.options);
        if (this.options.version.autoInclude && delete o.options.version, this.options.help.autoInclude && (o.options.help || this.options.rootCommand === false && o.location.length === 0 || c.kind === "namespace")) {
          let m = this.options.errors.onGenerateHelp, y = a.filter((d) => m.includes(d.type)).sort((d, x) => m.indexOf(d.type) - m.indexOf(x.type));
          return y.length > 0 && A2.logger.error(y[0].e, `
`), xe(this.definition, i, this.options);
        } else this.options.help.autoInclude && delete o.options.help;
        let s = this.options.errors.onExecuteCommand, l = a.filter((m) => s.includes(m.type)).sort((m, y) => s.indexOf(m.type) - s.indexOf(y.type));
        if (l.length > 0) return j(l[0].e);
        let p = typeof c.action == "function" ? c.action : Ge, O = T(E({}, o), {
          location: r
        }), P = {
          executed: []
        };
        try {
          yield this.hooksManager.execute("beforeExecute", O, P), yield p(T(E({}, o), {
            location: r
          }), this.options);
        } catch (m) {
          try {
            let y = this.hooksManager.get("beforeExecute").map((x) => x.name), d = y == null ? void 0 : y.filter((x) => !P.executed.includes(x));
            yield this.hooksManager.execute("afterExecute", T(E({}, O), {
              error: m
            }), Object.assign(P, {
              reverse: true,
              captureError: true,
              exclude: d,
              executed: []
            }));
          } catch (y) {
          }
          return j(m.message || m);
        }
        yield this.hooksManager.execute("afterExecute", O, {
          reverse: true,
          captureError: true
        });
      });
    }
    help(t = []) {
      xe(this.definition, t, this.options);
    }
    version() {
      be(this.options);
    }
    configContent() {
      if (!this.options.configFile || this.options.configFile.names.length === 0) return;
      let t = me(process.cwd(), this.options.configFile.names);
      if (t) try {
        let n = Qe.default.readFileSync(t, "utf-8");
        return (this.options.configFile.parse || ((i) => JSON.parse(i)))(n, t);
      } catch (n) {
      }
    }
    envContent() {
      let t = this.options.envPrefix;
      if (t) return Object.entries(process.env).filter(([n]) => n.startsWith(t)).reduce((n, [i, o]) => T(E({}, n), {
        [i.replace(new RegExp("^".concat(t)), "").toLowerCase()]: o
      }), {});
    }
    completions() {
      re({
        definition: this.definition,
        cliOptions: this.options
      });
    }
  };
  A.logger = K, A.messages = E(E({}, We), qe), A.formatMessage = Ye, A.defineCommand = ze, A.defineNamespace = Je, A.debug = De;
  var g = A;
  module.exports = module.exports.default;
}, { "fs": "fs", "path": 3, "url": "url" }], 2: [function(require2, module, exports$1) {
  require2("./shims/shims.js");
  var _index = _interopRequireDefault(require2("../dist/index.js"));
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  globalThis.Cli = _index.default;
}, { "../dist/index.js": 1, "./shims/shims.js": 4 }], 3: [function(require2, module, exports$1) {
  function assertPath(path2) {
    if (typeof path2 !== "string") {
      throw new TypeError("Path must be a string. Received " + JSON.stringify(path2));
    }
  }
  function normalizeStringPosix(path2, allowAboveRoot) {
    var res = "";
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var code;
    for (var i = 0; i <= path2.length; ++i) {
      if (i < path2.length)
        code = path2.charCodeAt(i);
      else if (code === 47)
        break;
      else
        code = 47;
      if (code === 47) {
        if (lastSlash === i - 1 || dots === 1) ;
        else if (lastSlash !== i - 1 && dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
            if (res.length > 2) {
              var lastSlashIndex = res.lastIndexOf("/");
              if (lastSlashIndex !== res.length - 1) {
                if (lastSlashIndex === -1) {
                  res = "";
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                }
                lastSlash = i;
                dots = 0;
                continue;
              }
            } else if (res.length === 2 || res.length === 1) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            if (res.length > 0)
              res += "/..";
            else
              res = "..";
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0)
            res += "/" + path2.slice(lastSlash + 1, i);
          else
            res = path2.slice(lastSlash + 1, i);
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (code === 46 && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  function _format(sep, pathObject) {
    var dir = pathObject.dir || pathObject.root;
    var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) {
      return base;
    }
    if (dir === pathObject.root) {
      return dir + base;
    }
    return dir + sep + base;
  }
  var posix = {
    // path.resolve([from ...], to)
    resolve: function resolve() {
      var resolvedPath = "";
      var resolvedAbsolute = false;
      var cwd;
      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path2;
        if (i >= 0)
          path2 = arguments[i];
        else {
          if (cwd === void 0)
            cwd = process.cwd();
          path2 = cwd;
        }
        assertPath(path2);
        if (path2.length === 0) {
          continue;
        }
        resolvedPath = path2 + "/" + resolvedPath;
        resolvedAbsolute = path2.charCodeAt(0) === 47;
      }
      resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
      if (resolvedAbsolute) {
        if (resolvedPath.length > 0)
          return "/" + resolvedPath;
        else
          return "/";
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return ".";
      }
    },
    normalize: function normalize(path2) {
      assertPath(path2);
      if (path2.length === 0) return ".";
      var isAbsolute = path2.charCodeAt(0) === 47;
      var trailingSeparator = path2.charCodeAt(path2.length - 1) === 47;
      path2 = normalizeStringPosix(path2, !isAbsolute);
      if (path2.length === 0 && !isAbsolute) path2 = ".";
      if (path2.length > 0 && trailingSeparator) path2 += "/";
      if (isAbsolute) return "/" + path2;
      return path2;
    },
    isAbsolute: function isAbsolute(path2) {
      assertPath(path2);
      return path2.length > 0 && path2.charCodeAt(0) === 47;
    },
    join: function join() {
      if (arguments.length === 0)
        return ".";
      var joined;
      for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i];
        assertPath(arg);
        if (arg.length > 0) {
          if (joined === void 0)
            joined = arg;
          else
            joined += "/" + arg;
        }
      }
      if (joined === void 0)
        return ".";
      return posix.normalize(joined);
    },
    relative: function relative(from, to) {
      assertPath(from);
      assertPath(to);
      if (from === to) return "";
      from = posix.resolve(from);
      to = posix.resolve(to);
      if (from === to) return "";
      var fromStart = 1;
      for (; fromStart < from.length; ++fromStart) {
        if (from.charCodeAt(fromStart) !== 47)
          break;
      }
      var fromEnd = from.length;
      var fromLen = fromEnd - fromStart;
      var toStart = 1;
      for (; toStart < to.length; ++toStart) {
        if (to.charCodeAt(toStart) !== 47)
          break;
      }
      var toEnd = to.length;
      var toLen = toEnd - toStart;
      var length = fromLen < toLen ? fromLen : toLen;
      var lastCommonSep = -1;
      var i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (to.charCodeAt(toStart + i) === 47) {
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (from.charCodeAt(fromStart + i) === 47) {
              lastCommonSep = i;
            } else if (i === 0) {
              lastCommonSep = 0;
            }
          }
          break;
        }
        var fromCode = from.charCodeAt(fromStart + i);
        var toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode)
          break;
        else if (fromCode === 47)
          lastCommonSep = i;
      }
      var out = "";
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === 47) {
          if (out.length === 0)
            out += "..";
          else
            out += "/..";
        }
      }
      if (out.length > 0)
        return out + to.slice(toStart + lastCommonSep);
      else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47)
          ++toStart;
        return to.slice(toStart);
      }
    },
    _makeLong: function _makeLong(path2) {
      return path2;
    },
    dirname: function dirname(path2) {
      assertPath(path2);
      if (path2.length === 0) return ".";
      var code = path2.charCodeAt(0);
      var hasRoot = code === 47;
      var end = -1;
      var matchedSlash = true;
      for (var i = path2.length - 1; i >= 1; --i) {
        code = path2.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          matchedSlash = false;
        }
      }
      if (end === -1) return hasRoot ? "/" : ".";
      if (hasRoot && end === 1) return "//";
      return path2.slice(0, end);
    },
    basename: function basename(path2, ext) {
      if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
      assertPath(path2);
      var start = 0;
      var end = -1;
      var matchedSlash = true;
      var i;
      if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
        if (ext.length === path2.length && ext === path2) return "";
        var extIdx = ext.length - 1;
        var firstNonSlashEnd = -1;
        for (i = path2.length - 1; i >= 0; --i) {
          var code = path2.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  end = i;
                }
              } else {
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path2.length;
        return path2.slice(start, end);
      } else {
        for (i = path2.length - 1; i >= 0; --i) {
          if (path2.charCodeAt(i) === 47) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) return "";
        return path2.slice(start, end);
      }
    },
    extname: function extname(path2) {
      assertPath(path2);
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      var preDotState = 0;
      for (var i = path2.length - 1; i >= 0; --i) {
        var code = path2.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === 46) {
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path2.slice(startDot, end);
    },
    format: function format(pathObject) {
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
      }
      return _format("/", pathObject);
    },
    parse: function parse(path2) {
      assertPath(path2);
      var ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path2.length === 0) return ret;
      var code = path2.charCodeAt(0);
      var isAbsolute = code === 47;
      var start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      var i = path2.length - 1;
      var preDotState = 0;
      for (; i >= start; --i) {
        code = path2.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === 46) {
          if (startDot === -1) startDot = i;
          else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute) ret.base = ret.name = path2.slice(1, end);
          else ret.base = ret.name = path2.slice(startPart, end);
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path2.slice(1, startDot);
          ret.base = path2.slice(1, end);
        } else {
          ret.name = path2.slice(startPart, startDot);
          ret.base = path2.slice(startPart, end);
        }
        ret.ext = path2.slice(startDot, end);
      }
      if (startPart > 0) ret.dir = path2.slice(0, startPart - 1);
      else if (isAbsolute) ret.dir = "/";
      return ret;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  posix.posix = posix;
  module.exports = posix;
}, {}], 4: [function(require2, module, exports$1) {
  globalThis.require = void 0;
  globalThis.process = {
    argv: [],
    stdout: { columns: globalThis.CLI_COLUMNS || 50, write: console.log },
    stdin: { isTTY: true },
    stderr: { write: console.log },
    cwd: () => "",
    env: {},
    exitCode: 0,
    lastExitCode: 0,
    exit: (c = 0) => (process.exitCode = c, process.lastExitCode = c)
  };
  globalThis.__dirname = "clier";
}, {}], "fs": [function(require2, module, exports$1) {
  module.exports = {
    readFileSync: () => "",
    existsSync: () => true,
    realpathSync: () => ""
  };
}, {}], "url": [function(require2, module, exports$1) {
  module.exports = {
    pathToFileURL: () => ({ href: "" })
  };
}, {}] }, {}, [2]);
const functionPrefix = "__fn__ ";
function deserialize(data) {
  return JSON.parse(data, (_, v) => {
    if (typeof v === "string" && v.startsWith(functionPrefix)) {
      return eval(v.slice(functionPrefix.length));
    }
    return v;
  });
}
class Path {
  cwd = "/";
  getCwd() {
    return this.cwd;
  }
  async setCwd(path2) {
    this.cwd = path2 || "/";
  }
  resolve(...parts) {
    const base = parts[0].replace(/\/*$/, "/");
    return parts.slice(1).reduce((acc, p) => new URL(p, acc), new URL("https://_" + base)).pathname.replace(/\/*$/, "") || "/";
  }
  relative(from, to) {
    const r = this.resolve(from, to);
    const parts = [from, r].map((e) => e.split("/").filter(Boolean));
    const i = parts[1].findIndex((e, index) => e !== parts[0][index]) ?? parts[0].length - 1;
    const base = i > parts[0].length - 1 ? ["."] : Array.from({ length: parts[0].length - i }, () => "..");
    return base.concat(parts[1].slice(i)).join("/");
  }
  basename(path2) {
    if (path2 === "/") return "/";
    return /[^\/]+$/.exec(path2)?.[0];
  }
}
const path = new Path();
const databaseName = "cliersh";
const storeName = "entries";
class FileSystem {
  database = null;
  stdin = "";
  // Pending write operation
  wp = Promise.resolve();
  #path(path2) {
    return "/".concat(path2.split("/").filter(Boolean).join("/")) || "/";
  }
  async #db() {
    if (this.database) return this.database;
    this.database = await new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: "path" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.database;
  }
  async #read(method, value) {
    const database = await this.#db();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName).objectStore(storeName)[method](value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async #entries() {
    return this.#read("getAll");
  }
  async #entry(path2) {
    return this.#read("get", this.#path(path2));
  }
  async #write(method, value) {
    const database = await this.#db();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite");
      transaction.objectStore(storeName)[method](value);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }
  async #put(entry) {
    const existing = await this.#entry(entry.path);
    return this.#write("put", { ...existing, ...entry });
  }
  async #delete(path2) {
    return this.#write("delete", this.#path(path2));
  }
  async #ensureDirectories(path2) {
    const parts = this.#path(path2).split("/").filter(Boolean);
    parts.pop();
    for (let index = 1; index <= parts.length; index++) {
      const directory = "/".concat(parts.slice(0, index).join("/"));
      const entry = await this.#entry(directory);
      if (entry?.type === "file") throw new Error(`${directory} is not a directory`);
      if (!entry) await this.#put({ path: directory, type: "directory", metadata: { d: (/* @__PURE__ */ new Date()).getTime() } });
    }
  }
  async #directoryExists(path2) {
    const directory = this.#path(path2);
    if (directory === "/") return true;
    if ((await this.#entry(directory))?.type === "directory") return true;
    return (await this.#entries()).some((entry) => entry.path.startsWith(`${directory}/`));
  }
  /** Default file metadata */
  #metadata(m) {
    return { d: (/* @__PURE__ */ new Date()).getTime(), u: "clier", p: 3, ...m };
  }
  #enqueue(operation) {
    const pending = this.wp.then(operation);
    this.wp = pending.catch(() => {
    });
    return pending;
  }
  async updateMetadata(path2, metadata) {
    return this.#enqueue(async () => {
      await this.#put({ path: path2, type: "file", metadata });
    });
  }
  async writeFile(path2, content, opts = {}) {
    return this.#enqueue(async () => {
      const file = this.#path(path2);
      const existing = opts.concat ? await this.#entry(file) : void 0;
      await this.#ensureDirectories(file);
      await this.#put({
        path: file,
        type: "file",
        content: `${opts.concat ? existing?.content || "" : ""}${content}`,
        metadata: { ...existing?.metadata, d: (/* @__PURE__ */ new Date()).getTime() }
      });
    });
  }
  async readFile(path2) {
    await this.wp;
    const entry = await this.#entry(path2);
    if (entry?.type !== "file") throw new Error(`No such file: ${path2}`);
    return entry.content;
  }
  async deleteFile(path2) {
    return this.#enqueue(() => this.#delete(path2));
  }
  async createDir(path2, create) {
    const directory = this.#path(path2);
    return this.#enqueue(async () => {
      const parts = directory.split("/").filter(Boolean);
      for (let index = 1; index <= parts.length; index++) {
        const target = "/".concat(parts.slice(0, index).join("/"));
        const entry = await this.#entry(target);
        if (entry?.type === "file") throw new Error(`${target} is not a directory`);
        if (entry || await this.#directoryExists(target)) continue;
        if (!create && index !== parts.length) throw new Error(`No such directory: ${target}`);
        await this.#put({ path: target, type: "directory", metadata: { d: (/* @__PURE__ */ new Date()).getTime() } });
      }
    });
  }
  async info(path$1) {
    const target = this.#path(path$1);
    if (target === "/") return { type: "directory", name: target, metadata: {} };
    const entry = await this.#entry(target);
    if (entry) {
      return {
        type: entry.type,
        name: path.basename(target),
        metadata: this.#metadata(entry.metadata),
        size: entry.type === "file" ? new TextEncoder().encode(entry.content || "").length : 0
      };
    }
    if (await this.#directoryExists(target)) return { type: "directory", name: path.basename(target) };
  }
  readFileSync(pathOrFd) {
    return pathOrFd === 0 ? this.stdin : "";
  }
  setStdin(content) {
    this.stdin = content || "";
  }
  async readDir(path2) {
    await this.wp;
    const directory = this.#path(path2);
    if (!await this.#directoryExists(directory)) throw new Error(`No such directory: ${directory}`);
    const prefix = directory === "/" ? "/" : `${directory}/`;
    const result = /* @__PURE__ */ new Map();
    for (const entry of await this.#entries()) {
      if (!entry.path.startsWith(prefix) || entry.path === directory) continue;
      const [name, ...remaining] = entry.path.slice(prefix.length).split("/");
      result.set(name, {
        name,
        type: remaining.length ? "directory" : entry.type,
        metadata: this.#metadata(entry.metadata),
        size: entry.type === "file" ? new TextEncoder().encode(entry.content || "").length : 0
      });
    }
    return [...result.values()];
  }
  async init(fileMap) {
    return this.#enqueue(async () => {
      for (const [path2, content] of Object.entries(fileMap)) {
        const file = this.#path(path2);
        if (await this.#entry(file)) continue;
        await this.#ensureDirectories(file);
        await this.#put({ path: file, type: "file", content, metadata: {} });
      }
    });
  }
}
const fs = new FileSystem();
async function run({ name, cliSpec, args }) {
  if (cliSpec.builtin !== void 0 && cliSpec.cliOptions?.help?.hidden === void 0) {
    cliSpec.cliOptions.help = { ...cliSpec.cliOptions.help, hidden: true };
  }
  const c = new Cli(cliSpec.definition || {}, {
    logger: { error: (...m) => process.stderr.write("".concat(name, ": ", m.join(""))) },
    ...cliSpec.cliOptions,
    cliName: name,
    cliVersion: "0.1.0"
  });
  c.options.help.template = cliSpec.cliOptions.help?.template || "{usage}\n{description}\n{namespaces}\n{commands}\n{options}";
  globalThis.CLI_ACTION_REF = cliSpec.action || (() => process.stderr.write("Not implemented\n"));
  process.exitCode = 0;
  return c.run(args);
}
process.stdout.write = (value) => postMessage({ type: "output", stream: "stdout", value });
process.stderr.write = (value) => postMessage({ type: "output", stream: "stderr", value });
self.onmessage = async (e) => {
  const data2 = deserialize(e.data);
  if (data2.type === "signal") {
    postMessage({ type: "exit", exitCode: 128 + data2.value });
    return self.close();
  }
  const { name, cliSpec, args, process: p, cliHandlerUrl, stdin } = data2;
  merge(process, p);
  require("url").pathToFileURL = () => ({ href: cliHandlerUrl });
  require("fs").readFileSync = fs.readFileSync.bind(fs);
  fs.setStdin(stdin);
  try {
    await run({ name, cliSpec, args });
  } finally {
    fs.setStdin("");
  }
  postMessage({ type: "exit", exitCode: process.exitCode });
};
function merge(target, source) {
  for (const k in source) {
    if (typeof source[k] === "object") {
      merge(target[k], source[k]);
    } else {
      target[k] = source[k];
    }
  }
}
