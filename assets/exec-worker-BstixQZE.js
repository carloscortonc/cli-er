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
  var ve = (e, n, t) => n in e ? Y(e, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: t
  }) : e[n] = t, E = (e, n) => {
    for (var t in n || (n = {})) le.call(n, t) && ve(e, t, n[t]);
    if (ee) for (var t of ee(n)) Te.call(n, t) && ve(e, t, n[t]);
    return e;
  }, T = (e, n) => nt(e, ot(n));
  var F = (e, n) => {
    var t = {};
    for (var i in e) le.call(e, i) && n.indexOf(i) < 0 && (t[i] = e[i]);
    if (e != null && ee) for (var i of ee(e)) n.indexOf(i) < 0 && Te.call(e, i) && (t[i] = e[i]);
    return t;
  };
  var at = (e, n) => {
    for (var t in n) Y(e, t, {
      get: n[t],
      enumerable: true
    });
  }, Ce = (e, n, t, i) => {
    if (n && typeof n == "object" || typeof n == "function") for (let o of st(n)) !le.call(e, o) && o !== t && Y(e, o, {
      get: () => n[o],
      enumerable: !(i = it(n, o)) || i.enumerable
    });
    return e;
  };
  var w = (e, n, t) => (t = e != null ? tt(rt(e)) : {}, Ce(!e || !e.__esModule ? Y(t, "default", {
    value: e,
    enumerable: true
  }) : t, e)), ct = (e) => Ce(Y({}, "__esModule", {
    value: true
  }), e);
  var $ = (e, n, t) => new Promise((i, o) => {
    var r = (s) => {
      try {
        c(t.next(s));
      } catch (a) {
        o(a);
      }
    }, l = (s) => {
      try {
        c(t.throw(s));
      } catch (a) {
        o(a);
      }
    }, c = (s) => s.done ? i(s.value) : Promise.resolve(s.value).then(r, l);
    c((t = t.apply(e, n)).next());
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
    constructor(n) {
      this.namespace = n;
    }
    log(n) {
    }
  }, pe = class extends R {
    log(n) {
      console.error(`${this.namespace} ${n}`);
    }
  }, ue = class extends R {
    log(n, t) {
      console.error(`[${this.namespace}::${t}] ${n}`), t === "WARN" && (process.exitCode = 1);
    }
  }, B = class {
    constructor(n) {
      this.strategy = n.enabled ? new n.strategy(n.namespace) : new R(n.namespace);
      let t = this;
      this.log = function(i) {
        t.strategy.log(...arguments);
      }, Object.assign(this.log, {
        enabled: n.enabled
      });
    }
  }, D = new B({
    namespace: "CLIER",
    enabled: J(),
    strategy: ue
  }).log, De = (e) => {
    let n = process.env.DEBUG ? process.env.DEBUG === "*" ? true : process.env.DEBUG.split(",").some((i) => i === e || e.startsWith(i.slice(0, i.length - 1)) && i.endsWith("*")) : false;
    return new B({
      namespace: e,
      enabled: n,
      strategy: pe
    }).log;
  };
  var I = (e) => {
    var t, i;
    if (((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.name) === "Map") {
      let o = /* @__PURE__ */ new Map();
      for (let [r, l] of e.entries()) o.set(r, I(l));
      return o;
    }
    if (((i = e == null ? void 0 : e.constructor) == null ? void 0 : i.name) === "Set") {
      let o = /* @__PURE__ */ new Set();
      for (let r of [...e]) o.add(I(r));
      return o;
    }
    if (Array.isArray(e)) return e.map(I);
    if (!Me(e)) return e;
    let n = {};
    for (let o of Object.keys(e)) Object.assign(n, {
      [o]: I(e[o])
    });
    return n;
  }, te = class {
    constructor() {
      return this.maxLengths = {}, this;
    }
    process(n, t) {
      return this.maxLengths[n] = Math.max(...t.map((i) => i.length)), this;
    }
    format(n, t, i = 0) {
      return t.padEnd(this.maxLengths[n] + i, " ");
    }
  };
  function Ae(e, n) {
    var p;
    let {
      start: t,
      rightMargin: i = 2,
      indent: o = 1
    } = n, r = process.stdout.columns, l = r - t - i;
    if (!r || l <= 0) return e.concat(`
`);
    let c = e, s = 0, a = [];
    for (; c.length > l; ) {
      let y = ((p = /.+[ ]/.exec(c.slice(0, l))) == null ? void 0 : p[0]) || (s = 1, c.slice(0, l - 1).concat("-"));
      a.push(y), c = c.slice(y.length - s), s = 0;
    }
    return a.push(c), a.join(`
${" ".repeat(t + o)}`).concat(`
`);
  }
  var Se = (e, n = '"') => "".concat(n, e, n), j = (e) => {
    e && g.logger.error(e, `
`), process.exit(1);
  };
  function Me(e) {
    return typeof e == "object" && e !== null && e.constructor === Object;
  }
  function fe(e, ...n) {
    for (let t in e) {
      if (Me(e[t])) {
        fe(e[t], ...n.map((i) => i[t]));
        continue;
      }
      Object.assign(e, ...n.reduce((i, o = {}) => [...i, o[t] !== void 0 ? {
        [t]: o[t]
      } : {}], []));
    }
    for (let t of n) for (let i in t) i in e || (e[i] = t[i]);
  }
  function me(e, n) {
    let t = (e == null ? void 0 : e.split(new RegExp(`(?!^)${G.default.sep == "\\" ? G.default.sep.repeat(2) : G.default.sep}`))) || [];
    for (let i = t.length; i > 0; i--) for (let o of n) {
      let r = G.default.join(...t.slice(0, i), o);
      if (ne.default.existsSync(r)) return r;
    }
  }
  function $e(e) {
    let n = me(e, ["package.json"]);
    if (n) try {
      return JSON.parse(ne.default.readFileSync(n, "utf-8"));
    } catch (t) {
    }
  }
  function _e() {
    let e = G.default.join(__dirname, "..", "package.json");
    try {
      return JSON.parse(ne.default.readFileSync(e, "utf-8")).version;
    } catch (n) {
      return;
    }
  }
  var de = class extends R {
    constructor() {
      super(...arguments);
      this.list = /* @__PURE__ */ new Set();
      this.log = (t) => {
        if (t.condition === false) return;
        let i = `<${t.property}> is deprecated`.concat(t.version ? ` and will be removed in ${t.version}` : "", t.alternative ? `. Use <${t.alternative}> instead` : "", t.description ? ". ".concat(t.description) : "");
        this.list.has(i) || (this.list.add(i), D(i, "WARN"));
      };
    }
  }, H = new B({
    namespace: "CLIER",
    enabled: J(),
    strategy: de
  }).log;
  var Ie = w(require2("fs"));
  var ie = (e, n) => {
    if (!n.enum) return;
    let i = (Array.isArray(e) ? e : [e]).find((r) => !n.enum.includes(r)), o = () => n.enum.join(" | ");
    return i ? g.formatMessage("option_wrong_value", {
      option: n.key,
      expected: Se(o(), "'"),
      found: i.toString()
    }) : void 0;
  };
  function se({
    value: e,
    current: n,
    option: t,
    truePositional: i
  }) {
    let o = t.type, r = {
      value: void 0,
      next: void 0,
      error: e === void 0 && t.kind === "option" ? g.formatMessage("option_missing_value", {
        type: o,
        option: t.key
      }) : void 0
    }, l = g.formatMessage("option_wrong_value", {
      option: t.key,
      expected: `<${o}>`,
      found: e
    }), c = e === "-" && t.stdin && !process.stdin.isTTY ? Ie.default.readFileSync(0, "utf-8").trim() : e, a = {
      string: () => ({
        value: c,
        error: r.error || ie([c], t)
      }),
      boolean: () => ({
        value: ["true", void 0].includes(c) || i && c !== "false",
        next: ["true", "false"].includes(c) ? 1 : 0,
        error: void 0
      }),
      list: () => {
        let p = (n || []).concat(c == null ? void 0 : c.split(","));
        return {
          value: p,
          error: r.error || ie(p, t)
        };
      },
      number: () => {
        let p = parseInt(c);
        return {
          value: p,
          error: c && isNaN(p) ? l : r.error || ie([p], t)
        };
      },
      float: () => {
        let p = parseFloat(c);
        return {
          value: p,
          error: c && isNaN(p) ? l : r.error || ie([p], t)
        };
      }
    }[o]();
    return E(E({}, r), a);
  }
  function ge(e) {
    if (!J()) return;
    let n = (s) => s.map((a) => a.key).join(","), t = e.map((s) => s.positional), i, o;
    (i = t.find((s, a) => t.indexOf(s) !== (o = a))) && D(`Duplicated Option.positional value <${i}> in option ${e[o].key}`, "WARN");
    let r = e.filter((s) => typeof s.positional == "number"), l = r.map((s) => s.positional);
    if (!l.length) return;
    let c = 0;
    l.some((s) => ![0, -1].includes(s) && l.indexOf(s > 0 ? c = s - 1 : c = s + 1) < 0) && D(`Missing correlative positional value <${c}> in options: ${n(r)}`, "WARN");
  }
  var lt = (e, n) => {
    let t = Object.values(n).reduce((o, r) => o.concat(r.aliases), []), i = (o) => new RegExp(`^(?<alias>${o})${Z(o) ? "" : "="}(?<value>.+)`);
    return e.reduce((o, r) => {
      var c;
      let l = t.find((s) => i(s).test(r));
      if (l) {
        let {
          alias: s,
          value: a
        } = (c = i(l).exec(r)) == null ? void 0 : c.groups;
        return o.concat([s, a]);
      }
      return o.concat([r]);
    }, []);
  }, pt = (e, n) => {
    let t = Object.values(n).reduce((o, r) => {
      var c, s;
      let l;
      return r.kind === "option" && r.type === "boolean" && ((s = l = (c = r.aliases) == null ? void 0 : c.filter(Z)) == null ? void 0 : s.length) > 0 ? o.concat(l.map((a) => a.replace(/^-/, ""))) : o;
    }, []), i = new RegExp(`^-(?<flags>[${t.join("")}]+)$`);
    return e.reduce((o, r) => {
      var c;
      if (i.test(r)) {
        let {
          flags: s
        } = (c = i.exec(r)) == null ? void 0 : c.groups;
        return o.concat(s.split("").map((a) => "-".concat(a)));
      }
      return o.concat([r]);
    }, []);
  }, ut = (e, n) => [pt, lt].reduce((t, i) => i(t, n), e), je = ut;
  function dt(e, n) {
    let t = {}, i = (r, l) => {
      let c = `${r}:${l}`;
      if (t[c] !== void 0) return t[c];
      let s = o(r, l);
      return t[c] = s, s;
    };
    function o(r, l) {
      let [c, s] = r.length > l.length ? [r, l] : [l, r];
      return s.length === 0 ? c.length : c[0] === s[0] ? i(c.slice(1), s.slice(1)) : 1 + Math.min(i(c.slice(1), s), i(c, s.slice(1)), i(c.slice(1), s.slice(1)));
    }
    return o(e, n);
  }
  function Le(e, n) {
    return n.map((t) => ({
      distance: dt(e, t),
      value: t
    })).reduce((t, i) => i.distance < t.distance ? i : t, {
      distance: 1 / 0
    });
  }
  function re({
    definition: e,
    cliOptions: n
  }) {
    let t = (a = 1) => " ".repeat(2 * a), i = (a, p) => Object.values(a.options || {}).filter(p || (() => true)).reduce((y, b) => y.concat(...b.aliases.filter((m) => !Z(m))), []).join(","), o = [], r = [], l = (a, p = "") => {
      if (!a) return;
      let y = i({
        options: a
      }, (b) => b.kind === "option");
      r.push(`"o_${p}=${y}"`);
      for (let b of Object.values(a)) {
        let m = i(b, (f) => ["namespace", "command"].includes(f.kind));
        b.kind === "namespace" && o.push(`"${b.key}=${m}"`), l(b.options, b.key);
      }
    };
    l(e);
    let c = (a) => [""].concat(...a).join(`
${t(2)}`).concat(`
${t(1)}`), s = Object.entries({
      cliName: n.cliName,
      cliVersion: n.cliVersion,
      clierVersion: _e(),
      date: ft("YYYY-MM-DD HH:mm"),
      command: n.completion.command,
      nestings: c(o),
      optionsByLocation: c(r)
    }).reduce((a, [p, y]) => a.replace(new RegExp(`{{${p}}}`, "g"), y), mt);
    process.stdout.write(s);
  }
  var ft = (e) => {
    let n = /* @__PURE__ */ new Date();
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
    }].map((t) => E({
      p: 2,
      o: 0
    }, t)).map(({
      m: t,
      p: i,
      n: o,
      o: r
    }) => ({
      v: (n[t]() + r).toString().padStart(i, "0"),
      n: o
    })).reduce((t, {
      v: i,
      n: o
    }) => t.replace(new RegExp(o), i), e);
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
    return e.kind === "namespace" || !e.rawAliases ? [e.key] : e.kind === "command" ? [e.key].concat(e.rawAliases) : e.rawAliases.map((n) => n.startsWith("-") ? (H({
      property: "Option.aliases with dashes",
      description: "Aliases should be specified without dashes"
    }), n) : (n.length > 1 ? "--" : "-").concat(n));
  }
  var Z = (e) => /^-\w$/.test(e);
  function Be(e, n) {
    n.completion.enabled && (e[n.completion.command] = {
      action: () => re({
        definition: e,
        cliOptions: n
      }),
      hidden: true
    });
    let s = n.help, {
      autoInclude: t,
      template: i
    } = s, o = F(s, ["autoInclude", "template"]);
    t && (e.help = o);
    let a = n.version, {
      autoInclude: r
    } = a, l = F(a, ["autoInclude"]);
    r && (e.version = l);
    let c = {
      positional: [],
      location: []
    };
    for (let p in e) ye(p, e, c);
    return ge(c.positional), e;
  }
  var he = (e) => e.kind === "command" || typeof e.action == "function" || e.options !== void 0 && !Object.values(e.options).some(he);
  function ye(e, n, t) {
    var l, c;
    let i = n[e];
    i.kind || (i.kind = Object.values(i.options || {}).some(he) ? "namespace" : he(i) ? "command" : "option");
    let o = T(E({}, t), {
      positional: []
    });
    if (i.kind === "option") if (i.positional === true ? i.type = "list" : i.type || (i.type = "string"), ![void 0, false].includes(i.positional) && t.positional.push(i), i.aliases = i.aliases || [e], i.type === "boolean" && i.negatable === true && (l = i.aliases) != null && l.some((s) => !s.startsWith("-") && s.length > 1)) {
      let s = e.concat("Negated");
      n[s] = {
        kind: "option",
        type: "boolean",
        aliases: i.aliases.filter((a) => !a.startsWith("-") && a.length > 1).reduce((a, p) => [...a, ...["no", "no-"].map((y) => y.concat(p))], []),
        parser: (a) => {
          let p = se(a);
          return T(E({}, p), {
            value: !p.value
          });
        },
        hidden: true,
        key: e
      }, ye(s, n, o);
    } else i.type === "boolean" && i.negatable === true && (i.negatable = false, D(`Boolean option <${e}> will be included without negated aliases. To change this, provide long aliases without dashes`, "WARN"));
    i.key || (i.key = e), i.rawAliases = i.aliases, i.aliases = Fe(i);
    let r = t.location.length > 0 ? t.location.join(".").concat(".") : "";
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
    for (let s in (c = i.options) != null ? c : {}) ye(s, i.options, Object.assign(o, {
      location: t.location.concat(e)
    }));
    ge(o.positional);
  }
  function Ee(e) {
    var A;
    let {
      args: n,
      definition: t,
      cliOptions: i
    } = e, o = {
      location: [],
      options: Object.assign({
        _: []
      }, e.initial),
      errors: [],
      rawLocation: []
    }, r = {}, l = n, c = (u) => {
      if (u.kind === "namespace") return;
      let [h, ...P] = u.aliases;
      r[h] = u, P.forEach((k) => {
        r[k] = h;
      });
    }, s = t, a = false, p = [];
    e: for (let u = 0; u < n.length; u++) {
      let h = n[u];
      if (h === "--") {
        o.options.__ = n.slice(u + 1);
        let k = n.length - l.length;
        l = l.slice(0, u - (k - 1) - 1);
        break e;
      } else if (a) continue;
      let P = Object.entries(s != null ? s : {}).sort(([k, v2]) => v2.kind === "option" ? -1 : 1);
      for (let k = 0; k < P.length; k++) {
        let [v2, S] = P[k];
        if (S.kind === "option") {
          p.push(...S.aliases);
          continue;
        }
        if (!((A = S.aliases) != null && A.includes(h))) {
          if (k < P.length - 1) continue;
          if (!p.includes(h) && (!i.rootCommand || o.location.length > 0)) {
            let M = Re({
              target: h,
              kind: ["namespace", "command"],
              definition: t,
              rawLocation: o.rawLocation,
              cliOptions: i
            }), L = "".concat(g.formatMessage("command_not_found", {
              command: h
            }), g.formatMessage("parse-arguments.suggestion", {
              suggestion: M
            }));
            o.errors.push(L);
          }
          break e;
        }
        if (S.kind === "command") {
          S.type === void 0 && (l = l.slice(1)), o.location.push(v2), o.rawLocation.push(v2), a = true;
          break;
        }
        l = l.slice(1), o.location.push(v2), o.rawLocation.push(v2);
        let V = s[v2].default, _2 = Object.values(s[v2].options || {}).filter((M) => M.kind === "command").map((M) => M.key);
        V && !_2.includes(l[0]) ? (o.location.push(V), s = s[v2].options[V].options || {}) : s = s[v2].options || {};
        break;
      }
    }
    let y = o.location.length === 0 && typeof i.rootCommand == "string" ? [i.rootCommand] : o.location, b = Q(t, y, i), m = y.length > 0 ? E({
      "": b
    }, b.options) : t;
    Object.values(m).forEach(c);
    let f = Object.values(m).reduce((u, v2) => {
      var S = v2, {
        positional: h,
        kind: P
      } = S, k = F(S, ["positional", "kind"]);
      return P === "option" && (h === true || typeof h == "number") && (u[h.toString()] = k), u;
    }, {}), O;
    ((P) => (P.TRUE = "1", P.FALSE = "0"))(O || (O = {}));
    let d = false, x = false, C = je(l, m);
    for (let u = 0; u < C.length; u++) {
      let h = C[u], P = C[u + 1], k = typeof r[h] == "string" ? r[h] : h, v2 = f[u] || (x ? f[u - C.length] : void 0);
      d || (d = v2 && r.hasOwnProperty(k));
      let S = false, V = (d ? void 0 : v2) || (S = true, f.true), [_2, M] = r.hasOwnProperty(k) ? [r[k], "0"] : [V, V ? "1" : "0"];
      if (x || (x = S && M === "1"), _2 !== void 0) {
        let L = _2.key, X = {
          0: P,
          1: h
        }, Pe = Object.entries(X).some(([Xe, et]) => Xe === M && r.hasOwnProperty(et)) ? void 0 : X[M], q = (typeof _2.parser == "function" ? _2.parser : se)({
          value: Pe,
          current: o.options[L],
          option: T(E({}, _2), {
            key: M === "1" ? _2.key : h
          }),
          truePositional: !!f.true,
          format: () => H({
            property: "Option.parser::format",
            alternative: "Cli.formatMessage"
          })
        });
        q.error ? o.errors.push(q.error) : o.options[L] = q.value, u += q.next !== void 0 ? q.next : Pe !== void 0 ? 1 : 0, u -= M === "1" ? 1 : 0;
      } else {
        o.options._.push(h);
        let L = Re({
          target: h,
          kind: ["option"],
          rawLocation: o.location,
          definition: t,
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
    return Object.values(m).some((u) => {
      if (u.default !== void 0 && o.options[u.key] === void 0 && (o.options[u.key] = u.default), u.required && o.options[u.key] === void 0) return o.errors.push(g.formatMessage("option_required", {
        option: u.key
      })), true;
    }), Object.values(m).some((u) => {
      if (!u.requires || o.options[u.key] === void 0) return false;
      let P = (typeof u.requires == "function" ? u.requires(o.options[u.key]) : u.requires).filter((k) => o.options[k] === void 0).map((k) => "".concat(u.key, "->", k));
      if (P.length > 0) return o.errors.push(g.formatMessage("option_missing_dependencies", {
        option: u.key,
        dependencies: P.join(", ")
      })), true;
    }), Object.values(r).filter((u) => typeof u != "string" && typeof u.value == "function").forEach((u) => {
      let h = u.key;
      o.options[h] = u.value(o.options[h], E({}, o.options));
    }), o;
  }
  function Ge(i, o) {
    return $(this, arguments, function* ({
      location: e,
      options: n
    }, t) {
      let r = t.baseLocation;
      if (!r) return j(g.formatMessage("execute.base-location-error"));
      let l = U.default.parse(ae()), c = e.length === 1 ? [t.commandsPath].concat(e) : e;
      D(`[run:executeScript] Parameters: ${JSON.stringify({
        location: c,
        options: n
      })}`, "TRACE");
      let s = [".", ...c].reduce((p, y, b, m) => {
        let f = m.length - 1 - b, O = f === m.length - 1, d = [];
        return d.push(U.default.join(...c.slice(0, f), "index")), f > 0 ? d.push(U.default.join(...c.slice(0, f))) : d.push(l.name), d.forEach((x) => {
          p.push({
            path: x,
            default: O
          });
        }), p;
      }, []).map((p) => T(E({}, p), {
        path: U.default.join(r, p.path.concat(l.ext))
      }));
      D(`[run:executeScript] List of candidates: ${JSON.stringify(s)}`, "TRACE");
      let a = s.find((p) => Oe.default.existsSync(p.path));
      if (!a) return D(s.reduce((p, y) => "".concat(p, "  ", y.path, `
`), `There was a problem finding the script to run. Considered paths were:
`), "WARN"), j();
      D(`[run:executeScript] Selected candidate: ${JSON.stringify(a)}`, "TRACE");
      try {
        let p;
        Ke() ? p = require2(a.path) : p = yield import(He.default.pathToFileURL(a.path).href);
        let y = a.default ? p.default || p : p[e[e.length - 1]];
        return typeof y != "function" && j(g.formatMessage("execute.handler-not-found", {
          path: a.path
        })), y(n);
      } catch (p) {
        j(g.formatMessage("execute.execution-error", {
          path: a.path,
          error: p.message
        }));
      }
    });
  }
  var Ue = ((r) => (r.USAGE = "usage", r.DESCRIPTION = "description", r.NAMESPACES = "namespaces", r.COMMANDS = "commands", r.OPTIONS = "options", r))(Ue || {});
  function xe(e, n, t) {
    var O;
    let i = n, o = Q(e, i, t), r = e, l = {};
    i.length > 0 ? o && ["namespace", "command"].includes(o.kind) ? (l.description = (O = o.description) == null ? void 0 : O.concat(`
`), r = o.options) : (g.logger.log(`
${g.formatMessage("generate-help.scope-not-found", {
      scope: i.join(" > ")
    })}
`), i = []) : t.cliDescription && (l.description = t.cliDescription.concat(`
`));
    let {
      existingKinds: c,
      hasOptions: s,
      positionalOptions: a
    } = Object.values(r || {}).filter((d) => !d.hidden).reduce((d, x) => {
      let {
        kind: C,
        positional: A,
        required: u,
        key: h
      } = x;
      if (C === "option") {
        let P = ["help", "version"].some((v2) => v2 === h && t[v2].autoInclude), k = A === true || typeof A == "number";
        d.hasOptions || (d.hasOptions = !P && !k), k && d.positionalOptions.push({
          index: A,
          key: h,
          required: u
        });
      } else d.existingKinds.indexOf(C) < 0 && d.existingKinds.push(C);
      return d;
    }, {
      existingKinds: [],
      hasOptions: false,
      positionalOptions: []
    }), p = (d) => d.sort((x) => x === "namespace" ? -1 : 1).join("|").toUpperCase(), y = (d) => {
      let x = new Map(d.map((u) => [u.index, u])), C = [...x.keys()].filter((u) => typeof u == "number" && u >= 0).sort((u, h) => u - h), A = [...x.keys()].filter((u) => typeof u == "number" && u < 0).sort((u, h) => u - h);
      return (x.has(true) ? [...C, true, ...A] : [...C, ...A]).map((u) => {
        let h = u === true ? "..." : "", P = x.get(u);
        return P.required ? `<${P.key}${h}>` : `[${P.key}${h}]`;
      }).join(" ");
    }, b = `${g.formatMessage("generate-help.usage")}:  ${t.cliName}`, m = [b, i.join(" ")].filter((d) => d).join(" "), f = a.some((d) => typeof d.index == "number" && d.index < 0);
    l.usage = (o == null ? void 0 : o.kind) === "command" && o.usage ? b.concat(" ", o.usage) : [m, p(c), (o == null ? void 0 : o.kind) === "command" && o.type !== void 0 ? `<${o.type}>` : "", s && f ? g.formatMessage("generate-help.has-options") : "", y(a), s && !f ? g.formatMessage("generate-help.has-options") : ""].filter((d) => d).join(" ").concat(`
`), gt(r, t, l);
  }
  function gt(e = {}, n, t = {}) {
    let i = new te(), o = 2, r = (m) => {
      let f = m.rawAliases;
      return m.negatable && (f = f.map((O) => O.length === 1 ? O : "(no)".concat(O))), Fe(T(E({}, m), {
        rawAliases: f
      })).join(", ");
    }, l = (m) => {
      let f = (d) => d && ` (${d})`, O = (d) => JSON.stringify(d, null, 1).split(/\n\s?/).map((x, C, A) => A.length > 1 && ![0, 1, A.length - 1].includes(C) ? " ".concat(x) : x).join("");
      return f([Array.isArray(m.enum) ? g.formatMessage("generate-help.option-enum", {
        enum: O(m.enum)
      }) : "", m.default !== void 0 ? g.formatMessage("generate-help.option-default", {
        default: O(m.default)
      }) : ""].filter((d) => d).join(", "));
    }, c = (m, f, O) => {
      let d = [" ".repeat(O), f.format("name", m.name, 2)].join("");
      return [d, Ae([m.description || "-", l(m)].join(""), {
        start: d.length
      })].join("");
    }, s = {
      namespaces: [],
      commands: [],
      options: []
    }, {
      elementSections: a,
      formattedNames: p
    } = Object.values(e).filter(({
      hidden: m
    }) => m !== true).reduce((m, f) => {
      let d = {
        namespace: "namespaces",
        command: "commands",
        option: "options"
      }[f.kind], x = r(f), C = T(E({}, f), {
        name: x
      });
      return m.formattedNames.push(x), m.elementSections[d].push(C), m;
    }, {
      elementSections: s,
      formattedNames: []
    });
    i.process("name", p), Object.entries(a).filter(([m, f]) => f.length > 0).forEach(([m, f]) => {
      let d = `${g.formatMessage(`generate-help.${m}-title`)}:
`;
      f.forEach((x) => {
        d += c(x, i, o);
      }), t[m] = d;
    }), Object.values(Ue).forEach((m) => {
      t[m] || (t[m] = void 0);
    });
    let y = (m) => `{${m}}`, b = Object.entries(t).reduce((m, [f, O]) => {
      let d = new RegExp(`${y(f)}${O ? "" : `
*`}`);
      return m.replace(d, O || "");
    }, n.help.template);
    g.logger.log(b);
  }
  function Q(e, n, t) {
    let i = I(e), o = {}, r = (s) => Object.entries(s).filter(([a, {
      kind: p
    }]) => p === "option").reduce((a, [p, y]) => T(E({}, a), {
      [p]: y
    }), {}), l = (s = {}) => Object.entries(o).filter(([a]) => !Object.keys(s).includes(a)).reduce((a, [p, y]) => T(E({}, a), {
      [p]: y
    }), s), c = n[0] === t.commandsPath ? n.slice(1) : n;
    for (let s = 0; s < c.length; s++) {
      let a = c[s];
      if (o = l(r(i)), s === c.length - 1) {
        i = i[a];
        break;
      } else if (i.hasOwnProperty(a) && ["namespace", "command"].includes(i[a].kind)) i = i[a].options;
      else return;
    }
    return c.length > 0 && i && (i.options = l(i.options)), i;
  }
  function be(e) {
    let {
      cliName: n,
      cliVersion: t
    } = e;
    g.logger.log(g.formatMessage("generate-version.template", {
      cliName: n,
      cliVersion: t
    }));
  }
  function Re(e) {
    let n = e.definition;
    e.rawLocation.length > 0 && (n = Q(e.definition, e.rawLocation, e.cliOptions).options);
    let t = Object.values(n || {}).filter((r) => e.kind.includes(r.kind)).reduce((r, l) => [...r, ...l.aliases], []), {
      value: i,
      distance: o
    } = Le(e.target, t);
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
    static test(n, t) {
      return new RegExp(t.replace(/\{\w+\}/g, `[a-zA-Z-0-9/\\., "'|]+`)).test(n);
    }
    static analize(n) {
      var t;
      if (n) return (t = Object.entries(g.messages).find(([i, o]) => this.test(n, o))) == null ? void 0 : t[0];
    }
  };
  var K = class {
  };
  K.log = (...n) => {
    process.stdout.write("".concat(n.join("")));
  }, K.error = (...n) => {
    process.stderr.write("ERROR ".concat(n.join("")));
  };
  var qe = {
    "execute.base-location-error": "There was a problem finding base script location",
    "execute.handler-not-found": "Could not find handler for command in {path}",
    "execute.execution-error": "There was a problem executing the script ({path}: {error})",
    "generate-help.scope-not-found": "Unable to find the specified scope ({scope})",
    "generate-help.usage": "Usage",
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
  function Ye(e, ...n) {
    return Object.entries(n[0] || {}).reduce((t, [i, o]) => t.replace(new RegExp(`{${i}}`, "g"), o), g.messages[e]);
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
    register(n, t) {
      var i;
      for (let o of Object.keys(t)) (i = this.hooks)[o] || (i[o] = []), this.hooks[o].push({
        name: n,
        fn: t[o]
      });
    }
    execute(o, r) {
      return $(this, arguments, function* (n, t, i = {}) {
        let l = this.hooks[n];
        if (!l || !l.length) return;
        i.executed || (i.executed = []);
        let c = i.reverse ? [...l].reverse() : l, s = i.exclude ? c.filter((a) => !i.exclude.includes(a.name)) : c;
        for (let a of s) {
          i.executed.push(a.name), D(`[${String(a.name)}::${n}]`, "TRACE");
          try {
            yield a.fn(T(E({}, t), {
              data: this.hookData
            }));
          } catch (p) {
            if (i.captureError) {
              D(`[${String(a.name)}::${n}::error] `.concat(String(p)), "TRACE");
              continue;
            }
            throw p;
          }
        }
      });
    }
    get(n) {
      return this.hooks[n] || [];
    }
  }, Ze = ke;
  var N = class N2 {
    constructor(n, t = {}) {
      this.hooksManager = new Ze();
      var l;
      let i = Ve(), o = $e(i) || {};
      Object.assign(N2.logger, t.logger || {}), Object.assign(N2.messages, E({}, t.messages || {})), this.options = {
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
          description: N2.formatMessage("help.description"),
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
          description: N2.formatMessage("version.description"),
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
        debug: !["false", "0", "", void 0].includes((l = process.env[z]) == null ? void 0 : l.toLowerCase())
      } : {});
      return fe(this.options, t, r), t.baseScriptLocation && (this.options.baseLocation = this.options.baseScriptLocation, H({
        property: "CliOptions.baseScriptLocation",
        alternative: "CliOptions.baseLocation"
      })), W.default.isAbsolute(this.options.baseLocation) || (this.options.baseLocation = W.default.resolve(i, this.options.baseLocation)), W.default.isAbsolute(this.options.commandsPath) && (this.options.commandsPath = W.default.relative(this.options.baseLocation, this.options.commandsPath) || "."), process.env[z] = this.options.debug ? "1" : "", this.definition = I(n), this.definition = Be(this.definition, this.options), this;
    }
    init() {
      return $(this, null, function* () {
        return this.ensureInit();
      });
    }
    ensureInit() {
      return $(this, null, function* () {
        return this.initPromise ? this.initPromise : (this.initPromise = $(this, null, function* () {
          for (let n of this.options.plugins.filter((t) => t.init)) yield n.init(this);
          this.hooksManager.register(/* @__PURE__ */ Symbol("global"), this.options.hooks);
          for (let n of this.options.plugins) this.hooksManager.register(n.name || /* @__PURE__ */ Symbol(), n.hooks || {});
        }), this.initPromise);
      });
    }
    parse(n) {
      let t = Ee({
        args: n,
        definition: this.definition,
        cliOptions: this.options
      });
      return delete t.rawLocation, t;
    }
    run(n) {
      return $(this, null, function* () {
        yield this.ensureInit();
        let t = Array.isArray(n) ? n : process.argv.slice(2);
        yield this.hooksManager.execute("beforeParse", {
          args: t
        });
        let m = Ee({
          args: t,
          definition: this.definition,
          cliOptions: this.options,
          initial: E(E({}, this.configContent()), this.envContent())
        }), {
          rawLocation: i
        } = m, o = F(m, ["rawLocation"]);
        yield this.hooksManager.execute("afterParse", o);
        let r = o.location.length === 0 && typeof this.options.rootCommand == "string" ? [this.options.rootCommand] : o.location, l = Q(this.definition, r, this.options), c = o.errors.map((f) => ({
          type: ce.analize(f),
          e: f
        })).filter(({
          e: f
        }) => f);
        if (this.options.version.autoInclude && o.options.version) return be(this.options);
        if (this.options.version.autoInclude && delete o.options.version, this.options.help.autoInclude && (o.options.help || this.options.rootCommand === false && o.location.length === 0 || l.kind === "namespace")) {
          let f = this.options.errors.onGenerateHelp, O = c.filter((d) => f.includes(d.type)).sort((d, x) => f.indexOf(d.type) - f.indexOf(x.type));
          return O.length > 0 && N2.logger.error(O[0].e, `
`), xe(this.definition, i, this.options);
        } else this.options.help.autoInclude && delete o.options.help;
        let s = this.options.errors.onExecuteCommand, a = c.filter((f) => s.includes(f.type)).sort((f, O) => s.indexOf(f.type) - s.indexOf(O.type));
        if (a.length > 0) return j(a[0].e);
        let p = typeof l.action == "function" ? l.action : Ge, y = T(E({}, o), {
          location: r
        }), b = {
          executed: []
        };
        try {
          yield this.hooksManager.execute("beforeExecute", y, b), yield p(T(E({}, o), {
            location: r
          }), this.options);
        } catch (f) {
          try {
            let O = this.hooksManager.get("beforeExecute").map((x) => x.name), d = O == null ? void 0 : O.filter((x) => !b.executed.includes(x));
            yield this.hooksManager.execute("afterExecute", T(E({}, y), {
              error: f
            }), Object.assign(b, {
              reverse: true,
              captureError: true,
              exclude: d,
              executed: []
            }));
          } catch (O) {
          }
          return j(f.message || f);
        }
        yield this.hooksManager.execute("afterExecute", y, {
          reverse: true,
          captureError: true
        });
      });
    }
    help(n = []) {
      xe(this.definition, n, this.options);
    }
    version() {
      be(this.options);
    }
    configContent() {
      if (!this.options.configFile || this.options.configFile.names.length === 0) return;
      let n = me(process.cwd(), this.options.configFile.names);
      if (n) try {
        let t = Qe.default.readFileSync(n, "utf-8");
        return (this.options.configFile.parse || ((i) => JSON.parse(i)))(t, n);
      } catch (t) {
      }
    }
    envContent() {
      let n = this.options.envPrefix;
      if (n) return Object.entries(process.env).filter(([t]) => t.startsWith(n)).reduce((t, [i, o]) => T(E({}, t), {
        [i.replace(new RegExp("^".concat(n)), "").toLowerCase()]: o
      }), {});
    }
    completions() {
      re({
        definition: this.definition,
        cliOptions: this.options
      });
    }
  };
  N.logger = K, N.messages = E(E({}, We), qe), N.formatMessage = Ye, N.defineCommand = ze, N.defineNamespace = Je, N.debug = De;
  var g = N;
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
class Kernel {
  cpid = 1;
  fds = { 0: void 0, 1: void 0, 2: void 0 };
  processmap = {};
  getpid() {
    return this.cpid;
  }
  gethostname() {
    return window.location.hostname;
  }
  getFD(fd) {
    return this.fds[fd];
  }
  setFD(fd, value) {
    this.fds[fd] = value;
  }
  registerProcess(w) {
    this.processmap[this.cpid] = w;
  }
  kill(signal) {
    if (!this.processmap[this.cpid]) return;
    this.processmap[this.cpid].postMessage(JSON.stringify({ type: "signal", value: signal }));
  }
}
const kernel = new Kernel();
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
const root = await navigator.storage.getDirectory();
class FileSystem {
  // Store a dedicated handle for stdin fd (stdout and stderr are sent to main thread) to be used in `readFileSync`
  stdinHandle = null;
  // Pending write operation
  wp = Promise.resolve();
  async #getDirHandle(pathOrParts, create) {
    const parts = Array.isArray(pathOrParts) ? pathOrParts : pathOrParts.split("/").filter(Boolean);
    let h = root;
    for (const part of parts) {
      h = await h.getDirectoryHandle(part, { create });
    }
    return h;
  }
  async #getFileHandle(path2, create) {
    const parts = path2.split("/").filter(Boolean);
    const dirh = await this.#getDirHandle(parts.slice(0, parts.length - 1), create);
    return dirh.getFileHandle(parts[parts.length - 1], { create });
  }
  getProcessFdPath(fd) {
    return `/proc/${kernel.getpid()}/fd/${fd}`;
  }
  async writeFile(path2, content, opts = {}) {
    this.wp = this.wp.then(() => this.#writeFile(path2, content, opts));
    return this.wp;
  }
  async readFile(path2) {
    await this.wp;
    return this.#readFile(path2);
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system#deleting_a_file_or_folder
  async deleteFile(path2) {
    await this.wp;
    const h = await this.#getFileHandle(path2);
    return h.remove();
  }
  async createDir(path2, create) {
    const parts = path2.split("/").filter(Boolean);
    const existsParent = await this.#getDirHandle(parts.slice(0, parts.length - 1), false).catch(() => false);
    return this.#getDirHandle(path2, create || existsParent);
  }
  async info(path$1) {
    const target = path.basename(path$1);
    const parent = path.resolve(path$1, "..");
    if (parent == path$1) {
      return { type: "directory", name: path$1 };
    }
    const dir = await this.readDir(parent);
    return dir.find((e) => e.name === target);
  }
  async #readFile(path2) {
    const handle = await this.#getFileHandle(path2);
    return handle.getFile().then((f) => f.text()).then((r) => {
      return r.slice(r.indexOf("\n") + 1);
    });
  }
  async #writeFile(path2, content, opts) {
    let c;
    if (opts.metadata || !opts.concat) {
      const e = opts.concat ? await this.#readFile(path2) : "";
      c = `${JSON.stringify(opts.metadata || {})}
${e}${content}`;
    } else {
      c = content;
    }
    return this.#writeRawFileContent(path2, c, opts);
  }
  /** Get file metadata by reading stream until a "\n" is found */
  async getFileMetadata(path2) {
    const reader = (await this.#getFileHandle(path2).then((h) => h.getFile())).stream().getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) return buffer;
      buffer += decoder.decode(value, { stream: true });
      if (buffer.indexOf("\n") !== -1) break;
    }
    try {
      return JSON.parse(buffer.slice(0, buffer.indexOf("\n")));
    } catch {
      return {};
    }
  }
  async #writeRawFileContent(path2, content, opts) {
    const handle = await this.#getFileHandle(path2, true);
    const position = opts.concat ? (await handle.getFile()).size : void 0;
    const writable = await handle.createWritable({ keepExistingData: opts.concat });
    await writable.write({ type: "write", data: content, position });
    await writable.close();
  }
  /** Compatibility method with original `fs.readFileSync`
   * If a number is provided, treat it as file-descriptor, and read from `/proc/{PID}/fd/{fd}`
   * We will assume the only fd requested will be 0 (used by cli-er)
   */
  readFileSync(pathOrFd) {
    if (typeof pathOrFd === "string") {
      return "";
    }
    if (pathOrFd !== 0) {
      return "";
    }
    const fileSize = this.stdinHandle.getSize();
    const buffer = new DataView(new ArrayBuffer(fileSize));
    this.stdinHandle.read(buffer, { at: 0 });
    const content = new TextDecoder("utf-8").decode(new Uint8Array(buffer.buffer));
    return content.slice(content.indexOf("\n"));
  }
  async readDir(path2) {
    const handle = await this.#getDirHandle(path2);
    const entries = [];
    for await (const [name, value] of handle.entries()) {
      entries.push({ name, type: value.kind });
    }
    return entries;
  }
  /** Create initial FS structure */
  async init(fileMap) {
    await root.remove().catch(() => {
    });
    for (const f in fileMap) {
      await this.writeFile(f, fileMap[f]);
    }
  }
  // Create a stdin handle for web-worker
  async wwPrepareStdinHandle() {
    this.stdinHandle = await this.#getFileHandle(this.getProcessFdPath(0), true).then(
      (h) => h.createSyncAccessHandle()
    );
    return () => this.stdinHandle.close();
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
    cliName: name
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
  const { name, cliSpec, args, process: p, cliHandlerUrl } = data2;
  merge(process, p);
  require("url").pathToFileURL = () => ({ href: cliHandlerUrl });
  require("fs").readFileSync = fs.readFileSync.bind(fs);
  const cleanup = await fs.wwPrepareStdinHandle();
  await run({ name, cliSpec, args });
  cleanup();
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
