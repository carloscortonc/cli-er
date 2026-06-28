require = (/* @__PURE__ */ (function() {
  function r(e, n, t) {
    function o2(i22, f) {
      if (!n[i22]) {
        if (!e[i22]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i22, true);
          if (u) return u(i22, true);
          var a = new Error("Cannot find module '" + i22 + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i22] = { exports: {} };
        e[i22][0].call(p.exports, function(r2) {
          var n2 = e[i22][1][r2];
          return o2(n2 || r2);
        }, p, p.exports, r, e, n, t);
      }
      return n[i22].exports;
    }
    for (var u = "function" == typeof require && require, i2 = 0; i2 < t.length; i2++) o2(t[i2]);
    return o2;
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
    for (var i2 in e) le.call(e, i2) && n.indexOf(i2) < 0 && (t[i2] = e[i2]);
    if (e != null && ee) for (var i2 of ee(e)) n.indexOf(i2) < 0 && Te.call(e, i2) && (t[i2] = e[i2]);
    return t;
  };
  var at = (e, n) => {
    for (var t in n) Y(e, t, {
      get: n[t],
      enumerable: true
    });
  }, Ce = (e, n, t, i2) => {
    if (n && typeof n == "object" || typeof n == "function") for (let o2 of st(n)) !le.call(e, o2) && o2 !== t && Y(e, o2, {
      get: () => n[o2],
      enumerable: !(i2 = it(n, o2)) || i2.enumerable
    });
    return e;
  };
  var w = (e, n, t) => (t = e != null ? tt(rt(e)) : {}, Ce(!e || !e.__esModule ? Y(t, "default", {
    value: e,
    enumerable: true
  }) : t, e)), ct = (e) => Ce(Y({}, "__esModule", {
    value: true
  }), e);
  var $ = (e, n, t) => new Promise((i2, o2) => {
    var r = (s2) => {
      try {
        c(t.next(s2));
      } catch (a) {
        o2(a);
      }
    }, l = (s2) => {
      try {
        c(t.throw(s2));
      } catch (a) {
        o2(a);
      }
    }, c = (s2) => s2.done ? i2(s2.value) : Promise.resolve(s2.value).then(r, l);
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
      this.log = function(i2) {
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
    let n = process.env.DEBUG ? process.env.DEBUG === "*" ? true : process.env.DEBUG.split(",").some((i2) => i2 === e || e.startsWith(i2.slice(0, i2.length - 1)) && i2.endsWith("*")) : false;
    return new B({
      namespace: e,
      enabled: n,
      strategy: pe
    }).log;
  };
  var I = (e) => {
    var t, i2;
    if (((t = e == null ? void 0 : e.constructor) == null ? void 0 : t.name) === "Map") {
      let o2 = /* @__PURE__ */ new Map();
      for (let [r, l] of e.entries()) o2.set(r, I(l));
      return o2;
    }
    if (((i2 = e == null ? void 0 : e.constructor) == null ? void 0 : i2.name) === "Set") {
      let o2 = /* @__PURE__ */ new Set();
      for (let r of [...e]) o2.add(I(r));
      return o2;
    }
    if (Array.isArray(e)) return e.map(I);
    if (!Me(e)) return e;
    let n = {};
    for (let o2 of Object.keys(e)) Object.assign(n, {
      [o2]: I(e[o2])
    });
    return n;
  }, te = class {
    constructor() {
      return this.maxLengths = {}, this;
    }
    process(n, t) {
      return this.maxLengths[n] = Math.max(...t.map((i2) => i2.length)), this;
    }
    format(n, t, i2 = 0) {
      return t.padEnd(this.maxLengths[n] + i2, " ");
    }
  };
  function Ae(e, n) {
    var p;
    let {
      start: t,
      rightMargin: i2 = 2,
      indent: o2 = 1
    } = n, r = process.stdout.columns, l = r - t - i2;
    if (!r || l <= 0) return e.concat(`
`);
    let c = e, s2 = 0, a = [];
    for (; c.length > l; ) {
      let y = ((p = /.+[ ]/.exec(c.slice(0, l))) == null ? void 0 : p[0]) || (s2 = 1, c.slice(0, l - 1).concat("-"));
      a.push(y), c = c.slice(y.length - s2), s2 = 0;
    }
    return a.push(c), a.join(`
${" ".repeat(t + o2)}`).concat(`
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
        fe(e[t], ...n.map((i2) => i2[t]));
        continue;
      }
      Object.assign(e, ...n.reduce((i2, o2 = {}) => [...i2, o2[t] !== void 0 ? {
        [t]: o2[t]
      } : {}], []));
    }
    for (let t of n) for (let i2 in t) i2 in e || (e[i2] = t[i2]);
  }
  function me(e, n) {
    let t = (e == null ? void 0 : e.split(new RegExp(`(?!^)${G.default.sep == "\\" ? G.default.sep.repeat(2) : G.default.sep}`))) || [];
    for (let i2 = t.length; i2 > 0; i2--) for (let o2 of n) {
      let r = G.default.resolve(...t.slice(0, i2), o2);
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
        let i2 = `<${t.property}> is deprecated`.concat(t.version ? ` and will be removed in ${t.version}` : "", t.alternative ? `. Use <${t.alternative}> instead` : "", t.description ? ". ".concat(t.description) : "");
        this.list.has(i2) || (this.list.add(i2), D(i2, "WARN"));
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
    let i2 = (Array.isArray(e) ? e : [e]).find((r) => !n.enum.includes(r)), o2 = () => n.enum.join(" | ");
    return i2 ? g.formatMessage("option_wrong_value", {
      option: n.key,
      expected: Se(o2(), "'"),
      found: i2.toString()
    }) : void 0;
  };
  function se({
    value: e,
    current: n,
    option: t,
    truePositional: i2
  }) {
    let o2 = t.type, r = {
      value: void 0,
      next: void 0,
      error: e === void 0 && t.kind === "option" ? g.formatMessage("option_missing_value", {
        type: o2,
        option: t.key
      }) : void 0
    }, l = g.formatMessage("option_wrong_value", {
      option: t.key,
      expected: `<${o2}>`,
      found: e
    }), c = e === "-" && t.stdin && !process.stdin.isTTY ? Ie.default.readFileSync(0, "utf-8").trim() : e, a = {
      string: () => ({
        value: c,
        error: r.error || ie([c], t)
      }),
      boolean: () => ({
        value: ["true", void 0].includes(c) || i2 && c !== "false",
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
    }[o2]();
    return E(E({}, r), a);
  }
  function ge(e) {
    if (!J()) return;
    let n = (s2) => s2.map((a) => a.key).join(","), t = e.map((s2) => s2.positional), i2, o2;
    (i2 = t.find((s2, a) => t.indexOf(s2) !== (o2 = a))) && D(`Duplicated Option.positional value <${i2}> in option ${e[o2].key}`, "WARN");
    let r = e.filter((s2) => typeof s2.positional == "number"), l = r.map((s2) => s2.positional);
    if (!l.length) return;
    let c = 0;
    l.some((s2) => ![0, -1].includes(s2) && l.indexOf(s2 > 0 ? c = s2 - 1 : c = s2 + 1) < 0) && D(`Missing correlative positional value <${c}> in options: ${n(r)}`, "WARN");
  }
  var lt = (e, n) => {
    let t = Object.values(n).reduce((o2, r) => o2.concat(r.aliases), []), i2 = (o2) => new RegExp(`^(?<alias>${o2})${Z(o2) ? "" : "="}(?<value>.+)`);
    return e.reduce((o2, r) => {
      var c;
      let l = t.find((s2) => i2(s2).test(r));
      if (l) {
        let {
          alias: s2,
          value: a
        } = (c = i2(l).exec(r)) == null ? void 0 : c.groups;
        return o2.concat([s2, a]);
      }
      return o2.concat([r]);
    }, []);
  }, pt = (e, n) => {
    let t = Object.values(n).reduce((o2, r) => {
      var c, s2;
      let l;
      return r.kind === "option" && r.type === "boolean" && ((s2 = l = (c = r.aliases) == null ? void 0 : c.filter(Z)) == null ? void 0 : s2.length) > 0 ? o2.concat(l.map((a) => a.replace(/^-/, ""))) : o2;
    }, []), i2 = new RegExp(`^-(?<flags>[${t.join("")}]+)$`);
    return e.reduce((o2, r) => {
      var c;
      if (i2.test(r)) {
        let {
          flags: s2
        } = (c = i2.exec(r)) == null ? void 0 : c.groups;
        return o2.concat(s2.split("").map((a) => "-".concat(a)));
      }
      return o2.concat([r]);
    }, []);
  }, ut = (e, n) => [pt, lt].reduce((t, i2) => i2(t, n), e), je = ut;
  function dt(e, n) {
    let t = {}, i2 = (r, l) => {
      let c = `${r}:${l}`;
      if (t[c] !== void 0) return t[c];
      let s2 = o2(r, l);
      return t[c] = s2, s2;
    };
    function o2(r, l) {
      let [c, s2] = r.length > l.length ? [r, l] : [l, r];
      return s2.length === 0 ? c.length : c[0] === s2[0] ? i2(c.slice(1), s2.slice(1)) : 1 + Math.min(i2(c.slice(1), s2), i2(c, s2.slice(1)), i2(c.slice(1), s2.slice(1)));
    }
    return o2(e, n);
  }
  function Le(e, n) {
    return n.map((t) => ({
      distance: dt(e, t),
      value: t
    })).reduce((t, i2) => i2.distance < t.distance ? i2 : t, {
      distance: 1 / 0
    });
  }
  function re({
    definition: e,
    cliOptions: n
  }) {
    let t = (a = 1) => " ".repeat(2 * a), i2 = (a, p) => Object.values(a.options || {}).filter(p || (() => true)).reduce((y, b) => y.concat(...b.aliases.filter((m) => !Z(m))), []).join(","), o2 = [], r = [], l = (a, p = "") => {
      if (!a) return;
      let y = i2({
        options: a
      }, (b) => b.kind === "option");
      r.push(`"o_${p}=${y}"`);
      for (let b of Object.values(a)) {
        let m = i2(b, (f) => ["namespace", "command"].includes(f.kind));
        b.kind === "namespace" && o2.push(`"${b.key}=${m}"`), l(b.options, b.key);
      }
    };
    l(e);
    let c = (a) => [""].concat(...a).join(`
${t(2)}`).concat(`
${t(1)}`), s2 = Object.entries({
      cliName: n.cliName,
      cliVersion: n.cliVersion,
      clierVersion: _e(),
      date: ft("YYYY-MM-DD HH:mm"),
      command: n.completion.command,
      nestings: c(o2),
      optionsByLocation: c(r)
    }).reduce((a, [p, y]) => a.replace(new RegExp(`{{${p}}}`, "g"), y), mt);
    process.stdout.write(s2);
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
      p: i2,
      n: o2,
      o: r
    }) => ({
      v: (n[t]() + r).toString().padStart(i2, "0"),
      n: o2
    })).reduce((t, {
      v: i2,
      n: o2
    }) => t.replace(new RegExp(o2), i2), e);
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
    let s2 = n.help, {
      autoInclude: t,
      template: i2
    } = s2, o2 = F(s2, ["autoInclude", "template"]);
    t && (e.help = o2);
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
    let i2 = n[e];
    i2.kind || (i2.kind = Object.values(i2.options || {}).some(he) ? "namespace" : he(i2) ? "command" : "option");
    let o2 = T(E({}, t), {
      positional: []
    });
    if (i2.kind === "option") if (i2.positional === true ? i2.type = "list" : i2.type || (i2.type = "string"), ![void 0, false].includes(i2.positional) && t.positional.push(i2), i2.aliases = i2.aliases || [e], i2.type === "boolean" && i2.negatable === true && (l = i2.aliases) != null && l.some((s2) => !s2.startsWith("-") && s2.length > 1)) {
      let s2 = e.concat("Negated");
      n[s2] = {
        kind: "option",
        type: "boolean",
        aliases: i2.aliases.filter((a) => !a.startsWith("-") && a.length > 1).reduce((a, p) => [...a, ...["no", "no-"].map((y) => y.concat(p))], []),
        parser: (a) => {
          let p = se(a);
          return T(E({}, p), {
            value: !p.value
          });
        },
        hidden: true,
        key: e
      }, ye(s2, n, o2);
    } else i2.type === "boolean" && i2.negatable === true && (i2.negatable = false, D(`Boolean option <${e}> will be included without negated aliases. To change this, provide long aliases without dashes`, "WARN"));
    i2.key || (i2.key = e), i2.rawAliases = i2.aliases, i2.aliases = Fe(i2);
    let r = t.location.length > 0 ? t.location.join(".").concat(".") : "";
    i2.description = g.formatMessage(r.concat(e, ".description"), {}) || i2.description, H({
      property: "Command.type",
      condition: i2.kind === "command" && i2.type !== void 0,
      description: "Create inside a new option with `positional: 0` instead"
    }), H({
      property: "Option.value",
      condition: typeof i2.value == "function",
      version: "0.12.0",
      alternative: "Option.parser"
    });
    for (let s2 in (c = i2.options) != null ? c : {}) ye(s2, i2.options, Object.assign(o2, {
      location: t.location.concat(e)
    }));
    ge(o2.positional);
  }
  function Ee(e) {
    var A;
    let {
      args: n,
      definition: t,
      cliOptions: i2
    } = e, o2 = {
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
    }, s2 = t, a = false, p = [];
    e: for (let u = 0; u < n.length; u++) {
      let h = n[u];
      if (h === "--") {
        o2.options.__ = n.slice(u + 1);
        let k = n.length - l.length;
        l = l.slice(0, u - (k - 1) - 1);
        break e;
      } else if (a) continue;
      let P = Object.entries(s2 != null ? s2 : {}).sort(([k, v]) => v.kind === "option" ? -1 : 1);
      for (let k = 0; k < P.length; k++) {
        let [v, S] = P[k];
        if (S.kind === "option") {
          p.push(...S.aliases);
          continue;
        }
        if (!((A = S.aliases) != null && A.includes(h))) {
          if (k < P.length - 1) continue;
          if (!p.includes(h) && (!i2.rootCommand || o2.location.length > 0)) {
            let M = Re({
              target: h,
              kind: ["namespace", "command"],
              definition: t,
              rawLocation: o2.rawLocation,
              cliOptions: i2
            }), L = "".concat(g.formatMessage("command_not_found", {
              command: h
            }), g.formatMessage("parse-arguments.suggestion", {
              suggestion: M
            }));
            o2.errors.push(L);
          }
          break e;
        }
        if (S.kind === "command") {
          S.type === void 0 && (l = l.slice(1)), o2.location.push(v), o2.rawLocation.push(v), a = true;
          break;
        }
        l = l.slice(1), o2.location.push(v), o2.rawLocation.push(v);
        let V = s2[v].default, _ = Object.values(s2[v].options || {}).filter((M) => M.kind === "command").map((M) => M.key);
        V && !_.includes(l[0]) ? (o2.location.push(V), s2 = s2[v].options[V].options || {}) : s2 = s2[v].options || {};
        break;
      }
    }
    let y = o2.location.length === 0 && typeof i2.rootCommand == "string" ? [i2.rootCommand] : o2.location, b = Q(t, y, i2), m = y.length > 0 ? E({
      "": b
    }, b.options) : t;
    Object.values(m).forEach(c);
    let f = Object.values(m).reduce((u, v) => {
      var S = v, {
        positional: h,
        kind: P
      } = S, k = F(S, ["positional", "kind"]);
      return P === "option" && (h === true || typeof h == "number") && (u[h.toString()] = k), u;
    }, {}), O;
    ((P) => (P.TRUE = "1", P.FALSE = "0"))(O || (O = {}));
    let d = false, x = false, C = je(l, m);
    for (let u = 0; u < C.length; u++) {
      let h = C[u], P = C[u + 1], k = typeof r[h] == "string" ? r[h] : h, v = f[u] || (x ? f[u - C.length] : void 0);
      d || (d = v && r.hasOwnProperty(k));
      let S = false, V = (d ? void 0 : v) || (S = true, f.true), [_, M] = r.hasOwnProperty(k) ? [r[k], "0"] : [V, V ? "1" : "0"];
      if (x || (x = S && M === "1"), _ !== void 0) {
        let L = _.key, X = {
          0: P,
          1: h
        }, Pe = Object.entries(X).some(([Xe, et]) => Xe === M && r.hasOwnProperty(et)) ? void 0 : X[M], q2 = (typeof _.parser == "function" ? _.parser : se)({
          value: Pe,
          current: o2.options[L],
          option: T(E({}, _), {
            key: M === "1" ? _.key : h
          }),
          truePositional: !!f.true,
          format: () => H({
            property: "Option.parser::format",
            alternative: "Cli.formatMessage"
          })
        });
        q2.error ? o2.errors.push(q2.error) : o2.options[L] = q2.value, u += q2.next !== void 0 ? q2.next : Pe !== void 0 ? 1 : 0, u -= M === "1" ? 1 : 0;
      } else {
        o2.options._.push(h);
        let L = Re({
          target: h,
          kind: ["option"],
          rawLocation: o2.location,
          definition: t,
          cliOptions: i2,
          maxDistance: 3
        }), X = "".concat(g.formatMessage("option_not_found", {
          option: h
        }), L ? g.formatMessage("parse-arguments.suggestion", {
          suggestion: L
        }) : "");
        o2.errors.push(X);
      }
    }
    return Object.values(m).some((u) => {
      if (u.default !== void 0 && o2.options[u.key] === void 0 && (o2.options[u.key] = u.default), u.required && o2.options[u.key] === void 0) return o2.errors.push(g.formatMessage("option_required", {
        option: u.key
      })), true;
    }), Object.values(m).some((u) => {
      if (!u.requires || o2.options[u.key] === void 0) return false;
      let P = (typeof u.requires == "function" ? u.requires(o2.options[u.key]) : u.requires).filter((k) => o2.options[k] === void 0).map((k) => "".concat(u.key, "->", k));
      if (P.length > 0) return o2.errors.push(g.formatMessage("option_missing_dependencies", {
        option: u.key,
        dependencies: P.join(", ")
      })), true;
    }), Object.values(r).filter((u) => typeof u != "string" && typeof u.value == "function").forEach((u) => {
      let h = u.key;
      o2.options[h] = u.value(o2.options[h], E({}, o2.options));
    }), o2;
  }
  function Ge(i2, o2) {
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
      let s2 = [".", ...c].reduce((p, y, b, m) => {
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
      D(`[run:executeScript] List of candidates: ${JSON.stringify(s2)}`, "TRACE");
      let a = s2.find((p) => Oe.default.existsSync(p.path));
      if (!a) return D(s2.reduce((p, y) => "".concat(p, "  ", y.path, `
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
    let i2 = n, o2 = Q(e, i2, t), r = e, l = {};
    i2.length > 0 ? o2 && ["namespace", "command"].includes(o2.kind) ? (l.description = (O = o2.description) == null ? void 0 : O.concat(`
`), r = o2.options) : (g.logger.log(`
${g.formatMessage("generate-help.scope-not-found", {
      scope: i2.join(" > ")
    })}
`), i2 = []) : t.cliDescription && (l.description = t.cliDescription.concat(`
`));
    let {
      existingKinds: c,
      hasOptions: s2,
      positionalOptions: a
    } = Object.values(r || {}).filter((d) => !d.hidden).reduce((d, x) => {
      let {
        kind: C,
        positional: A,
        required: u,
        key: h
      } = x;
      if (C === "option") {
        let P = ["help", "version"].some((v) => v === h && t[v].autoInclude), k = A === true || typeof A == "number";
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
    }, b = `${g.formatMessage("generate-help.usage")}:  ${t.cliName}`, m = [b, i2.join(" ")].filter((d) => d).join(" "), f = a.some((d) => typeof d.index == "number" && d.index < 0);
    l.usage = (o2 == null ? void 0 : o2.kind) === "command" && o2.usage ? b.concat(" ", o2.usage) : [m, p(c), (o2 == null ? void 0 : o2.kind) === "command" && o2.type !== void 0 ? `<${o2.type}>` : "", s2 && f ? g.formatMessage("generate-help.has-options") : "", y(a), s2 && !f ? g.formatMessage("generate-help.has-options") : ""].filter((d) => d).join(" ").concat(`
`), gt(r, t, l);
  }
  function gt(e = {}, n, t = {}) {
    let i2 = new te(), o2 = 2, r = (m) => {
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
    }, s2 = {
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
      elementSections: s2,
      formattedNames: []
    });
    i2.process("name", p), Object.entries(a).filter(([m, f]) => f.length > 0).forEach(([m, f]) => {
      let d = `${g.formatMessage(`generate-help.${m}-title`)}:
`;
      f.forEach((x) => {
        d += c(x, i2, o2);
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
    let i2 = I(e), o2 = {}, r = (s2) => Object.entries(s2).filter(([a, {
      kind: p
    }]) => p === "option").reduce((a, [p, y]) => T(E({}, a), {
      [p]: y
    }), {}), l = (s2 = {}) => Object.entries(o2).filter(([a]) => !Object.keys(s2).includes(a)).reduce((a, [p, y]) => T(E({}, a), {
      [p]: y
    }), s2), c = n[0] === t.commandsPath ? n.slice(1) : n;
    for (let s2 = 0; s2 < c.length; s2++) {
      let a = c[s2];
      if (o2 = l(r(i2)), s2 === c.length - 1) {
        i2 = i2[a];
        break;
      } else if (i2.hasOwnProperty(a) && ["namespace", "command"].includes(i2[a].kind)) i2 = i2[a].options;
      else return;
    }
    return c.length > 0 && i2 && (i2.options = l(i2.options)), i2;
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
      value: i2,
      distance: o2
    } = Le(e.target, t);
    return !e.maxDistance || o2 <= e.maxDistance ? i2 : void 0;
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
      if (n) return (t = Object.entries(g.messages).find(([i2, o2]) => this.test(n, o2))) == null ? void 0 : t[0];
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
    return Object.entries(n[0] || {}).reduce((t, [i2, o2]) => t.replace(new RegExp(`{${i2}}`, "g"), o2), g.messages[e]);
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
      var i2;
      for (let o2 of Object.keys(t)) (i2 = this.hooks)[o2] || (i2[o2] = []), this.hooks[o2].push({
        name: n,
        fn: t[o2]
      });
    }
    execute(o2, r) {
      return $(this, arguments, function* (n, t, i2 = {}) {
        let l = this.hooks[n];
        if (!l || !l.length) return;
        i2.executed || (i2.executed = []);
        let c = i2.reverse ? [...l].reverse() : l, s2 = i2.exclude ? c.filter((a) => !i2.exclude.includes(a.name)) : c;
        for (let a of s2) {
          i2.executed.push(a.name), D(`[${String(a.name)}::${n}]`, "TRACE");
          try {
            yield a.fn(T(E({}, t), {
              data: this.hookData
            }));
          } catch (p) {
            if (i2.captureError) {
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
      let i2 = Ve(), o2 = $e(i2) || {};
      Object.assign(N2.logger, t.logger || {}), Object.assign(N2.messages, E({}, t.messages || {})), this.options = {
        baseLocation: i2,
        baseScriptLocation: i2,
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
        cliName: o2.name || W.default.parse(ae()).name,
        cliVersion: o2.version || "-",
        cliDescription: o2.description || "",
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
      })), W.default.isAbsolute(this.options.baseLocation) || (this.options.baseLocation = W.default.resolve(i2, this.options.baseLocation)), W.default.isAbsolute(this.options.commandsPath) && (this.options.commandsPath = W.default.relative(this.options.baseLocation, this.options.commandsPath) || "."), process.env[z] = this.options.debug ? "1" : "", this.definition = I(n), this.definition = Be(this.definition, this.options), this;
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
          rawLocation: i2
        } = m, o2 = F(m, ["rawLocation"]);
        yield this.hooksManager.execute("afterParse", o2);
        let r = o2.location.length === 0 && typeof this.options.rootCommand == "string" ? [this.options.rootCommand] : o2.location, l = Q(this.definition, r, this.options), c = o2.errors.map((f) => ({
          type: ce.analize(f),
          e: f
        })).filter(({
          e: f
        }) => f);
        if (this.options.version.autoInclude && o2.options.version) return be(this.options);
        if (this.options.version.autoInclude && delete o2.options.version, this.options.help.autoInclude && (o2.options.help || this.options.rootCommand === false && o2.location.length === 0 || l.kind === "namespace")) {
          let f = this.options.errors.onGenerateHelp, O = c.filter((d) => f.includes(d.type)).sort((d, x) => f.indexOf(d.type) - f.indexOf(x.type));
          return O.length > 0 && N2.logger.error(O[0].e, `
`), xe(this.definition, i2, this.options);
        } else this.options.help.autoInclude && delete o2.options.help;
        let s2 = this.options.errors.onExecuteCommand, a = c.filter((f) => s2.includes(f.type)).sort((f, O) => s2.indexOf(f.type) - s2.indexOf(O.type));
        if (a.length > 0) return j(a[0].e);
        let p = typeof l.action == "function" ? l.action : Ge, y = T(E({}, o2), {
          location: r
        }), b = {
          executed: []
        };
        try {
          yield this.hooksManager.execute("beforeExecute", y, b), yield p(T(E({}, o2), {
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
        return (this.options.configFile.parse || ((i2) => JSON.parse(i2)))(t, n);
      } catch (t) {
      }
    }
    envContent() {
      let n = this.options.envPrefix;
      if (n) return Object.entries(process.env).filter(([t]) => t.startsWith(n)).reduce((t, [i2, o2]) => T(E({}, t), {
        [i2.replace(new RegExp("^".concat(n)), "").toLowerCase()]: o2
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
    for (var i2 = 0; i2 <= path2.length; ++i2) {
      if (i2 < path2.length)
        code = path2.charCodeAt(i2);
      else if (code === 47)
        break;
      else
        code = 47;
      if (code === 47) {
        if (lastSlash === i2 - 1 || dots === 1) ;
        else if (lastSlash !== i2 - 1 && dots === 2) {
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
                lastSlash = i2;
                dots = 0;
                continue;
              }
            } else if (res.length === 2 || res.length === 1) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i2;
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
            res += "/" + path2.slice(lastSlash + 1, i2);
          else
            res = path2.slice(lastSlash + 1, i2);
          lastSegmentLength = i2 - lastSlash - 1;
        }
        lastSlash = i2;
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
      for (var i2 = arguments.length - 1; i2 >= -1 && !resolvedAbsolute; i2--) {
        var path2;
        if (i2 >= 0)
          path2 = arguments[i2];
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
      for (var i2 = 0; i2 < arguments.length; ++i2) {
        var arg = arguments[i2];
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
      var i2 = 0;
      for (; i2 <= length; ++i2) {
        if (i2 === length) {
          if (toLen > length) {
            if (to.charCodeAt(toStart + i2) === 47) {
              return to.slice(toStart + i2 + 1);
            } else if (i2 === 0) {
              return to.slice(toStart + i2);
            }
          } else if (fromLen > length) {
            if (from.charCodeAt(fromStart + i2) === 47) {
              lastCommonSep = i2;
            } else if (i2 === 0) {
              lastCommonSep = 0;
            }
          }
          break;
        }
        var fromCode = from.charCodeAt(fromStart + i2);
        var toCode = to.charCodeAt(toStart + i2);
        if (fromCode !== toCode)
          break;
        else if (fromCode === 47)
          lastCommonSep = i2;
      }
      var out = "";
      for (i2 = fromStart + lastCommonSep + 1; i2 <= fromEnd; ++i2) {
        if (i2 === fromEnd || from.charCodeAt(i2) === 47) {
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
      var end2 = -1;
      var matchedSlash = true;
      for (var i2 = path2.length - 1; i2 >= 1; --i2) {
        code = path2.charCodeAt(i2);
        if (code === 47) {
          if (!matchedSlash) {
            end2 = i2;
            break;
          }
        } else {
          matchedSlash = false;
        }
      }
      if (end2 === -1) return hasRoot ? "/" : ".";
      if (hasRoot && end2 === 1) return "//";
      return path2.slice(0, end2);
    },
    basename: function basename(path2, ext) {
      if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
      assertPath(path2);
      var start = 0;
      var end2 = -1;
      var matchedSlash = true;
      var i2;
      if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
        if (ext.length === path2.length && ext === path2) return "";
        var extIdx = ext.length - 1;
        var firstNonSlashEnd = -1;
        for (i2 = path2.length - 1; i2 >= 0; --i2) {
          var code = path2.charCodeAt(i2);
          if (code === 47) {
            if (!matchedSlash) {
              start = i2 + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              matchedSlash = false;
              firstNonSlashEnd = i2 + 1;
            }
            if (extIdx >= 0) {
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  end2 = i2;
                }
              } else {
                extIdx = -1;
                end2 = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end2) end2 = firstNonSlashEnd;
        else if (end2 === -1) end2 = path2.length;
        return path2.slice(start, end2);
      } else {
        for (i2 = path2.length - 1; i2 >= 0; --i2) {
          if (path2.charCodeAt(i2) === 47) {
            if (!matchedSlash) {
              start = i2 + 1;
              break;
            }
          } else if (end2 === -1) {
            matchedSlash = false;
            end2 = i2 + 1;
          }
        }
        if (end2 === -1) return "";
        return path2.slice(start, end2);
      }
    },
    extname: function extname(path2) {
      assertPath(path2);
      var startDot = -1;
      var startPart = 0;
      var end2 = -1;
      var matchedSlash = true;
      var preDotState = 0;
      for (var i2 = path2.length - 1; i2 >= 0; --i2) {
        var code = path2.charCodeAt(i2);
        if (code === 47) {
          if (!matchedSlash) {
            startPart = i2 + 1;
            break;
          }
          continue;
        }
        if (end2 === -1) {
          matchedSlash = false;
          end2 = i2 + 1;
        }
        if (code === 46) {
          if (startDot === -1)
            startDot = i2;
          else if (preDotState !== 1)
            preDotState = 1;
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end2 === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end2 - 1 && startDot === startPart + 1) {
        return "";
      }
      return path2.slice(startDot, end2);
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
      var end2 = -1;
      var matchedSlash = true;
      var i2 = path2.length - 1;
      var preDotState = 0;
      for (; i2 >= start; --i2) {
        code = path2.charCodeAt(i2);
        if (code === 47) {
          if (!matchedSlash) {
            startPart = i2 + 1;
            break;
          }
          continue;
        }
        if (end2 === -1) {
          matchedSlash = false;
          end2 = i2 + 1;
        }
        if (code === 46) {
          if (startDot === -1) startDot = i2;
          else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end2 === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end2 - 1 && startDot === startPart + 1) {
        if (end2 !== -1) {
          if (startPart === 0 && isAbsolute) ret.base = ret.name = path2.slice(1, end2);
          else ret.base = ret.name = path2.slice(startPart, end2);
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path2.slice(1, startDot);
          ret.base = path2.slice(1, end2);
        } else {
          ret.name = path2.slice(startPart, startDot);
          ret.base = path2.slice(startPart, end2);
        }
        ret.ext = path2.slice(startDot, end2);
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
function handleKey(e, cbMap) {
  e.addEventListener("keydown", (e2) => {
    cbMap[e2.key]?.(e2);
  });
}
let [s, i$1, sp$1, o$1, oa$1] = ["shell", "input", "sprompt", "output", "output-after"].map(
  (id) => document.getElementById(id)
);
const OUTPUT_ID = "exec";
function renderInput(value) {
  const input = document.createElement("div");
  input.className = "input-wrapper";
  input.innerHTML = `<span>${window.CLI_PROMPT}</span><span>${value}</span>`;
  sp$1.classList.add("executing");
  clearOutput(oa$1);
  o$1.appendChild(input);
}
function updateInputValue(value) {
  i$1.value = value;
  i$1.setSelectionRange(value.length, value.length);
}
function createElement(tag, props) {
  let e = document.createElement(tag);
  for (let p in props) {
    e[p] = props[p];
  }
  return e;
}
const parseColor = (v) => {
  return v.replaceAll(
    new RegExp("\\e\\[(?:(?<id1>\\d)?;)?(?<id2>\\d{2,})m(?<v>.+?)(?<!\\\\)\\e\\[0m", "g"),
    '<span class="color-$<id2> color-mode-$<id1>">$<v></span>'
  );
};
const scapeColor = (v) => v.replace(/\e\[0m/g, "\\$&");
function renderOutput(value, { error } = {}) {
  const r = document.querySelector(`#output>pre[data-id="${OUTPUT_ID}"]`) || void 0;
  const e = r || document.createElement("pre");
  if (error) {
    const l = createElement("span", { innerHTML: value, ...error && { className: "error" } });
    e.appendChild(l);
  } else {
    const l = parseColor(value);
    e.insertAdjacentHTML("beforeend", l);
  }
  if (!r) {
    e.setAttribute("data-id", OUTPUT_ID);
    o$1.appendChild(e);
  }
  clearOutput(oa$1);
  s.scrollTop = s.scrollHeight;
}
function flushOutput() {
  sp$1.classList.remove("executing");
  let e = document.querySelector(`#output>pre[data-id="${OUTPUT_ID}"]`);
  if (!e) return;
  e.removeAttribute("data-id");
}
function updateOutput(value) {
  oa$1.innerText = value;
}
function clearOutput(e = o$1) {
  e.innerHTML = "";
}
const clearSpec = {
  definition: {},
  cliOptions: { cliDescription: "Clear the terminal screen", help: { hidden: true } },
  action: () => clearOutput()
};
window.CLI_HISTORY = [];
let historyStart = 0;
let hIndex = 0;
function cmd(params) {
  if (params.c) {
    historyStart = CLI_HISTORY.length;
    return Cli.logger.log("History cleared");
  }
  let size = 20;
  params.n ||= size * -1;
  let start = Math.max(historyStart, params.n > 0 ? params.n - 1 : CLI_HISTORY.length + params.n - 1);
  let end2 = Math.min(CLI_HISTORY.length - 1, start + size);
  let output = CLI_HISTORY.slice(start, end2).map((curr, i2) => "".concat((start + i2 + 1 - historyStart).toString().padStart(3, " "), "  ", curr)).join("\n");
  Cli.logger.log(output);
}
const spec = {
  definition: {
    n: { type: "number", positional: 0, description: "Start at index n" },
    c: { type: "boolean", description: "Clear the history list" }
  },
  cliOptions: { cliDescription: "Command line history" },
  action: cmd
};
function add(value) {
  CLI_HISTORY.push(value);
  hIndex = CLI_HISTORY.length;
}
function previous() {
  let v = CLI_HISTORY[--hIndex];
  hIndex = Math.max(0, hIndex);
  return v;
}
function next() {
  let v = CLI_HISTORY[++hIndex];
  hIndex = Math.min(hIndex, CLI_HISTORY.length);
  return v;
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
const Signal = {
  SIGINT: 2
};
class FileDescriptor {
  buffer = "";
  type = void 0;
  metadata = {};
  constructor(type, metadata) {
    this.type = type;
    this.metadata = metadata;
  }
  write(v) {
    this.buffer += v;
  }
  flush() {
    const v = this.buffer;
    this.buffer = "";
    return v;
  }
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
    const i2 = parts[1].findIndex((e, index) => e !== parts[0][index]) ?? parts[0].length - 1;
    const base = i2 > parts[0].length - 1 ? ["."] : Array.from({ length: parts[0].length - i2 }, () => "..");
    return base.concat(parts[1].slice(i2)).join("/");
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
function abstract(optMethodName) {
  const methodName = optMethodName || "";
  return function() {
    throw new Error(
      "this method " + methodName + " is abstract! (it has no implementation in class " + this.constructor.name + ")"
    );
  };
}
function assert(cond, message) {
  if (!cond) {
    throw new Error(message || "Assertion failed");
  }
}
function defineLazyProperty(obj, propName, getterFn) {
  let memo;
  Object.defineProperty(obj, propName, {
    get() {
      if (!memo) {
        memo = getterFn.call(this);
      }
      return memo;
    }
  });
}
function clone(obj) {
  if (obj) {
    return Object.assign({}, obj);
  }
  return obj;
}
function repeatFn(fn, n) {
  const arr = [];
  while (n-- > 0) {
    arr.push(fn());
  }
  return arr;
}
function repeatStr(str, n) {
  return new Array(n + 1).join(str);
}
function repeat(x, n) {
  return repeatFn(() => x, n);
}
function getDuplicates(array) {
  const duplicates = [];
  for (let idx = 0; idx < array.length; idx++) {
    const x = array[idx];
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
      duplicates.push(x);
    }
  }
  return duplicates;
}
function copyWithoutDuplicates(array) {
  const noDuplicates = [];
  array.forEach((entry) => {
    if (noDuplicates.indexOf(entry) < 0) {
      noDuplicates.push(entry);
    }
  });
  return noDuplicates;
}
function isSyntactic(ruleName) {
  const firstChar = ruleName[0];
  return firstChar === firstChar.toUpperCase();
}
function isLexical(ruleName) {
  return !isSyntactic(ruleName);
}
function padLeft(str, len, optChar) {
  const ch = optChar || " ";
  if (str.length < len) {
    return repeatStr(ch, len - str.length) + str;
  }
  return str;
}
function StringBuffer() {
  this.strings = [];
}
StringBuffer.prototype.append = function(str) {
  this.strings.push(str);
};
StringBuffer.prototype.contents = function() {
  return this.strings.join("");
};
const escapeUnicode = (str) => String.fromCodePoint(parseInt(str, 16));
function unescapeCodePoint(s2) {
  if (s2.charAt(0) === "\\") {
    switch (s2.charAt(1)) {
      case "b":
        return "\b";
      case "f":
        return "\f";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "t":
        return "	";
      case "v":
        return "\v";
      case "x":
        return escapeUnicode(s2.slice(2, 4));
      case "u":
        return s2.charAt(2) === "{" ? escapeUnicode(s2.slice(3, -1)) : escapeUnicode(s2.slice(2, 6));
      default:
        return s2.charAt(1);
    }
  } else {
    return s2;
  }
}
function unexpectedObjToString(obj) {
  if (obj == null) {
    return String(obj);
  }
  const baseToString = Object.prototype.toString.call(obj);
  try {
    let typeName;
    if (obj.constructor && obj.constructor.name) {
      typeName = obj.constructor.name;
    } else if (baseToString.indexOf("[object ") === 0) {
      typeName = baseToString.slice(8, -1);
    } else {
      typeName = typeof obj;
    }
    return typeName + ": " + JSON.stringify(String(obj));
  } catch {
    return baseToString;
  }
}
function checkNotNull(obj, message = "unexpected null value") {
  if (obj == null) {
    throw new Error(message);
  }
  return obj;
}
const common = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StringBuffer,
  abstract,
  assert,
  checkNotNull,
  clone,
  copyWithoutDuplicates,
  defineLazyProperty,
  getDuplicates,
  isLexical,
  isSyntactic,
  padLeft,
  repeat,
  repeatFn,
  repeatStr,
  unescapeCodePoint,
  unexpectedObjToString
}, Symbol.toStringTag, { value: "Module" }));
const toRegExp = (val) => new RegExp(String.raw`\p{${val}}`, "u");
const UnicodeCategories = Object.fromEntries(
  [
    "Cc",
    "Cf",
    "Cn",
    "Co",
    "Cs",
    "Ll",
    "Lm",
    "Lo",
    "Lt",
    "Lu",
    "Mc",
    "Me",
    "Mn",
    "Nd",
    "Nl",
    "No",
    "Pc",
    "Pd",
    "Pe",
    "Pf",
    "Pi",
    "Po",
    "Ps",
    "Sc",
    "Sk",
    "Sm",
    "So",
    "Zl",
    "Zp",
    "Zs"
  ].map((cat2) => [cat2, toRegExp(cat2)])
);
UnicodeCategories["Ltmo"] = new RegExp("\\p{Lt}|\\p{Lm}|\\p{Lo}", "u");
const UnicodeBinaryProperties = Object.fromEntries(
  ["XID_Start", "XID_Continue", "White_Space"].map((prop) => [prop, toRegExp(prop)])
);
class PExpr {
  constructor() {
    if (this.constructor === PExpr) {
      throw new Error("PExpr cannot be instantiated -- it's abstract");
    }
  }
  // Set the `source` property to the interval containing the source for this expression.
  withSource(interval) {
    if (interval) {
      this.source = interval.trimmed();
    }
    return this;
  }
}
const any = Object.create(PExpr.prototype);
const end = Object.create(PExpr.prototype);
class Terminal extends PExpr {
  constructor(obj) {
    super();
    this.obj = obj;
  }
}
class Range extends PExpr {
  constructor(from, to) {
    super();
    this.from = from;
    this.to = to;
    this.matchCodePoint = from.length > 1 || to.length > 1;
  }
}
class Param extends PExpr {
  constructor(index) {
    super();
    this.index = index;
  }
}
class Alt extends PExpr {
  constructor(terms) {
    super();
    this.terms = terms;
  }
}
class Extend extends Alt {
  constructor(superGrammar, name, body) {
    const origBody = superGrammar.rules[name].body;
    super([body, origBody]);
    this.superGrammar = superGrammar;
    this.name = name;
    this.body = body;
  }
}
class Splice extends Alt {
  constructor(superGrammar, ruleName, beforeTerms, afterTerms) {
    const origBody = superGrammar.rules[ruleName].body;
    super([...beforeTerms, origBody, ...afterTerms]);
    this.superGrammar = superGrammar;
    this.ruleName = ruleName;
    this.expansionPos = beforeTerms.length;
  }
}
class Seq extends PExpr {
  constructor(factors) {
    super();
    this.factors = factors;
  }
}
class Iter extends PExpr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}
class Star extends Iter {
}
class Plus extends Iter {
}
class Opt extends Iter {
}
Star.prototype.operator = "*";
Plus.prototype.operator = "+";
Opt.prototype.operator = "?";
Star.prototype.minNumMatches = 0;
Plus.prototype.minNumMatches = 1;
Opt.prototype.minNumMatches = 0;
Star.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Plus.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Opt.prototype.maxNumMatches = 1;
class Not extends PExpr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}
class Lookahead extends PExpr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}
class Lex extends PExpr {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}
class Apply extends PExpr {
  constructor(ruleName, args = []) {
    super();
    this.ruleName = ruleName;
    this.args = args;
  }
  isSyntactic() {
    return isSyntactic(this.ruleName);
  }
  // This method just caches the result of `this.toString()` in a non-enumerable property.
  toMemoKey() {
    if (!this._memoKey) {
      Object.defineProperty(this, "_memoKey", { value: this.toString() });
    }
    return this._memoKey;
  }
}
class UnicodeChar extends PExpr {
  constructor(categoryOrProp) {
    super();
    this.categoryOrProp = categoryOrProp;
    if (categoryOrProp in UnicodeCategories) {
      this.pattern = UnicodeCategories[categoryOrProp];
    } else if (categoryOrProp in UnicodeBinaryProperties) {
      this.pattern = UnicodeBinaryProperties[categoryOrProp];
    } else {
      throw new Error(
        `Invalid Unicode category or property name: ${JSON.stringify(categoryOrProp)}`
      );
    }
  }
}
function createError(message, optInterval) {
  let e;
  if (optInterval) {
    e = new Error(optInterval.getLineAndColumnMessage() + message);
    e.shortMessage = message;
    e.interval = optInterval;
  } else {
    e = new Error(message);
  }
  return e;
}
function intervalSourcesDontMatch() {
  return createError("Interval sources don't match");
}
function grammarSyntaxError(matchFailure) {
  const e = new Error();
  Object.defineProperty(e, "message", {
    enumerable: true,
    get() {
      return matchFailure.message;
    }
  });
  Object.defineProperty(e, "shortMessage", {
    enumerable: true,
    get() {
      return "Expected " + matchFailure.getExpectedText();
    }
  });
  e.interval = matchFailure.getInterval();
  return e;
}
function undeclaredGrammar(grammarName, namespace, interval) {
  const message = namespace ? `Grammar ${grammarName} is not declared in namespace '${namespace}'` : "Undeclared grammar " + grammarName;
  return createError(message, interval);
}
function duplicateGrammarDeclaration(grammar2, namespace) {
  return createError("Grammar " + grammar2.name + " is already declared in this namespace");
}
function grammarDoesNotSupportIncrementalParsing(grammar2) {
  return createError(`Grammar '${grammar2.name}' does not support incremental parsing`);
}
function undeclaredRule(ruleName, grammarName, optInterval) {
  return createError(
    "Rule " + ruleName + " is not declared in grammar " + grammarName,
    optInterval
  );
}
function cannotOverrideUndeclaredRule(ruleName, grammarName, optSource) {
  return createError(
    "Cannot override rule " + ruleName + " because it is not declared in " + grammarName,
    optSource
  );
}
function cannotExtendUndeclaredRule(ruleName, grammarName, optSource) {
  return createError(
    "Cannot extend rule " + ruleName + " because it is not declared in " + grammarName,
    optSource
  );
}
function duplicateRuleDeclaration(ruleName, grammarName, declGrammarName, optSource) {
  let message = "Duplicate declaration for rule '" + ruleName + "' in grammar '" + grammarName + "'";
  if (grammarName !== declGrammarName) {
    message += " (originally declared in '" + declGrammarName + "')";
  }
  return createError(message, optSource);
}
function wrongNumberOfParameters(ruleName, expected, actual, source) {
  return createError(
    "Wrong number of parameters for rule " + ruleName + " (expected " + expected + ", got " + actual + ")",
    source
  );
}
function wrongNumberOfArguments(ruleName, expected, actual, expr) {
  return createError(
    "Wrong number of arguments for rule " + ruleName + " (expected " + expected + ", got " + actual + ")",
    expr
  );
}
function duplicateParameterNames(ruleName, duplicates, source) {
  return createError(
    "Duplicate parameter names in rule " + ruleName + ": " + duplicates.join(", "),
    source
  );
}
function invalidParameter(ruleName, expr) {
  return createError(
    "Invalid parameter to rule " + ruleName + ": " + expr + " has arity " + expr.getArity() + ", but parameter expressions must have arity 1",
    expr.source
  );
}
const syntacticVsLexicalNote = "NOTE: A _syntactic rule_ is a rule whose name begins with a capital letter. See https://ohmjs.org/d/svl for more details.";
function applicationOfSyntacticRuleFromLexicalContext(ruleName, applyExpr) {
  return createError(
    "Cannot apply syntactic rule " + ruleName + " from here (inside a lexical context)",
    applyExpr.source
  );
}
function applySyntacticWithLexicalRuleApplication(applyExpr) {
  const { ruleName } = applyExpr;
  return createError(
    `applySyntactic is for syntactic rules, but '${ruleName}' is a lexical rule. ` + syntacticVsLexicalNote,
    applyExpr.source
  );
}
function unnecessaryExperimentalApplySyntactic(applyExpr) {
  return createError(
    "applySyntactic is not required here (in a syntactic context)",
    applyExpr.source
  );
}
function incorrectArgumentType(expectedType, expr) {
  return createError("Incorrect argument type: expected " + expectedType, expr.source);
}
function multipleSuperSplices(expr) {
  return createError("'...' can appear at most once in a rule body", expr.source);
}
function invalidCodePoint(applyWrapper) {
  const node = applyWrapper._node;
  assert(node && node.isNonterminal() && node.ctorName === "escapeChar_unicodeCodePoint");
  const digitIntervals = applyWrapper.children.slice(1, -1).map((d) => d.source);
  const fullInterval = digitIntervals[0].coverageWith(...digitIntervals.slice(1));
  return createError(
    `U+${fullInterval.contents} is not a valid Unicode code point`,
    fullInterval
  );
}
function kleeneExprHasNullableOperand(kleeneExpr, applicationStack) {
  const actuals = applicationStack.length > 0 ? applicationStack[applicationStack.length - 1].args : [];
  const expr = kleeneExpr.expr.substituteParams(actuals);
  let message = "Nullable expression " + expr + " is not allowed inside '" + kleeneExpr.operator + "' (possible infinite loop)";
  if (applicationStack.length > 0) {
    const stackTrace = applicationStack.map((app) => new Apply(app.ruleName, app.args)).join("\n");
    message += "\nApplication stack (most recent application last):\n" + stackTrace;
  }
  return createError(message, kleeneExpr.expr.source);
}
function inconsistentArity(ruleName, expected, actual, expr) {
  return createError(
    "Rule " + ruleName + " involves an alternation which has inconsistent arity (expected " + expected + ", got " + actual + ")",
    expr.source
  );
}
function multipleErrors(errors) {
  const messages = errors.map((e) => e.message);
  return createError(["Errors:"].concat(messages).join("\n- "), errors[0].interval);
}
function missingSemanticAction(ctorName, name, type, stack) {
  let stackTrace = stack.slice(0, -1).map((info) => {
    const ans = "  " + info[0].name + " > " + info[1];
    return info.length === 3 ? ans + " for '" + info[2] + "'" : ans;
  }).join("\n");
  stackTrace += "\n  " + name + " > " + ctorName;
  let moreInfo = "";
  if (ctorName === "_iter") {
    moreInfo = [
      "\nNOTE: as of Ohm v16, there is no default action for iteration nodes — see ",
      "  https://ohmjs.org/d/dsa for details."
    ].join("\n");
  }
  const message = [
    `Missing semantic action for '${ctorName}' in ${type} '${name}'.${moreInfo}`,
    "Action stack (most recent call last):",
    stackTrace
  ].join("\n");
  const e = createError(message);
  e.name = "missingSemanticAction";
  return e;
}
function throwErrors(errors) {
  if (errors.length === 1) {
    throw errors[0];
  }
  if (errors.length > 1) {
    throw multipleErrors(errors);
  }
}
function padNumbersToEqualLength(arr) {
  let maxLen = 0;
  const strings = arr.map((n) => {
    const str = n.toString();
    maxLen = Math.max(maxLen, str.length);
    return str;
  });
  return strings.map((s2) => padLeft(s2, maxLen));
}
function strcpy(dest, src, offset) {
  const origDestLen = dest.length;
  const start = dest.slice(0, offset);
  const end2 = dest.slice(offset + src.length);
  return (start + src + end2).substr(0, origDestLen);
}
function lineAndColumnToMessage(...ranges) {
  const lineAndCol = this;
  const { offset } = lineAndCol;
  const { repeatStr: repeatStr2 } = common;
  const sb = new StringBuffer();
  sb.append("Line " + lineAndCol.lineNum + ", col " + lineAndCol.colNum + ":\n");
  const lineNumbers = padNumbersToEqualLength([
    lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
    lineAndCol.lineNum,
    lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1
  ]);
  const appendLine = (num, content, prefix) => {
    sb.append(prefix + lineNumbers[num] + " | " + content + "\n");
  };
  if (lineAndCol.prevLine != null) {
    appendLine(0, lineAndCol.prevLine, "  ");
  }
  appendLine(1, lineAndCol.line, "> ");
  const lineLen = lineAndCol.line.length;
  let indicationLine = repeatStr2(" ", lineLen + 1);
  for (let i2 = 0; i2 < ranges.length; ++i2) {
    let startIdx = ranges[i2][0];
    let endIdx = ranges[i2][1];
    assert(startIdx >= 0 && startIdx <= endIdx, "range start must be >= 0 and <= end");
    const lineStartOffset = offset - lineAndCol.colNum + 1;
    startIdx = Math.max(0, startIdx - lineStartOffset);
    endIdx = Math.min(endIdx - lineStartOffset, lineLen);
    indicationLine = strcpy(indicationLine, repeatStr2("~", endIdx - startIdx), startIdx);
  }
  const gutterWidth = 2 + lineNumbers[1].length + 3;
  sb.append(repeatStr2(" ", gutterWidth));
  indicationLine = strcpy(indicationLine, "^", lineAndCol.colNum - 1);
  sb.append(indicationLine.replace(/ +$/, "") + "\n");
  if (lineAndCol.nextLine != null) {
    appendLine(2, lineAndCol.nextLine, "  ");
  }
  return sb.contents();
}
let builtInRulesCallbacks = [];
function awaitBuiltInRules(cb) {
  builtInRulesCallbacks.push(cb);
}
function announceBuiltInRules(grammar2) {
  builtInRulesCallbacks.forEach((cb) => {
    cb(grammar2);
  });
  builtInRulesCallbacks = null;
}
function getLineAndColumn(str, offset) {
  let lineNum = 1;
  let colNum = 1;
  let currOffset = 0;
  let lineStartOffset = 0;
  let nextLine = null;
  let prevLine = null;
  let prevLineStartOffset = -1;
  while (currOffset < offset) {
    const c = str.charAt(currOffset++);
    if (c === "\n") {
      lineNum++;
      colNum = 1;
      prevLineStartOffset = lineStartOffset;
      lineStartOffset = currOffset;
    } else if (c !== "\r") {
      colNum++;
    }
  }
  let lineEndOffset = str.indexOf("\n", lineStartOffset);
  if (lineEndOffset === -1) {
    lineEndOffset = str.length;
  } else {
    const nextLineEndOffset = str.indexOf("\n", lineEndOffset + 1);
    nextLine = nextLineEndOffset === -1 ? str.slice(lineEndOffset) : str.slice(lineEndOffset, nextLineEndOffset);
    nextLine = nextLine.replace(/^\r?\n/, "").replace(/\r$/, "");
  }
  if (prevLineStartOffset >= 0) {
    prevLine = str.slice(prevLineStartOffset, lineStartOffset).replace(/\r?\n$/, "");
  }
  const line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, "");
  return {
    offset,
    lineNum,
    colNum,
    line,
    prevLine,
    nextLine,
    toString: lineAndColumnToMessage
  };
}
function getLineAndColumnMessage(str, offset, ...ranges) {
  return getLineAndColumn(str, offset).toString(...ranges);
}
const uniqueId = /* @__PURE__ */ (() => {
  let idCounter = 0;
  return (prefix) => "" + prefix + idCounter++;
})();
class Interval {
  constructor(sourceString, startIdx, endIdx) {
    Object.defineProperty(this, "_sourceString", {
      value: sourceString,
      configurable: false,
      enumerable: false,
      writable: false
    });
    this.startIdx = startIdx;
    this.endIdx = endIdx;
  }
  get sourceString() {
    return this._sourceString;
  }
  get contents() {
    if (this._contents === void 0) {
      this._contents = this.sourceString.slice(this.startIdx, this.endIdx);
    }
    return this._contents;
  }
  get length() {
    return this.endIdx - this.startIdx;
  }
  coverageWith(...intervals) {
    return Interval.coverage(...intervals, this);
  }
  collapsedLeft() {
    return new Interval(this.sourceString, this.startIdx, this.startIdx);
  }
  collapsedRight() {
    return new Interval(this.sourceString, this.endIdx, this.endIdx);
  }
  getLineAndColumn() {
    return getLineAndColumn(this.sourceString, this.startIdx);
  }
  getLineAndColumnMessage() {
    const range = [this.startIdx, this.endIdx];
    return getLineAndColumnMessage(this.sourceString, this.startIdx, range);
  }
  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus(that) {
    if (this.sourceString !== that.sourceString) {
      throw intervalSourcesDontMatch();
    } else if (this.startIdx === that.startIdx && this.endIdx === that.endIdx) {
      return [];
    } else if (this.startIdx < that.startIdx && that.endIdx < this.endIdx) {
      return [
        new Interval(this.sourceString, this.startIdx, that.startIdx),
        new Interval(this.sourceString, that.endIdx, this.endIdx)
      ];
    } else if (this.startIdx < that.endIdx && that.endIdx < this.endIdx) {
      return [new Interval(this.sourceString, that.endIdx, this.endIdx)];
    } else if (this.startIdx < that.startIdx && that.startIdx < this.endIdx) {
      return [new Interval(this.sourceString, this.startIdx, that.startIdx)];
    } else {
      return [this];
    }
  }
  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo(that) {
    if (this.sourceString !== that.sourceString) {
      throw intervalSourcesDontMatch();
    }
    assert(
      this.startIdx >= that.startIdx && this.endIdx <= that.endIdx,
      "other interval does not cover this one"
    );
    return new Interval(
      this.sourceString,
      this.startIdx - that.startIdx,
      this.endIdx - that.startIdx
    );
  }
  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends.
  trimmed() {
    const { contents } = this;
    const startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
    const endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
    return new Interval(this.sourceString, startIdx, endIdx);
  }
  subInterval(offset, len) {
    const newStartIdx = this.startIdx + offset;
    return new Interval(this.sourceString, newStartIdx, newStartIdx + len);
  }
}
Interval.coverage = function(firstInterval, ...intervals) {
  let { startIdx, endIdx } = firstInterval;
  for (const interval of intervals) {
    if (interval.sourceString !== firstInterval.sourceString) {
      throw intervalSourcesDontMatch();
    } else {
      startIdx = Math.min(startIdx, interval.startIdx);
      endIdx = Math.max(endIdx, interval.endIdx);
    }
  }
  return new Interval(firstInterval.sourceString, startIdx, endIdx);
};
const MAX_CHAR_CODE = 65535;
const MAX_CODE_POINT = 1114111;
class InputStream {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.examinedLength = 0;
  }
  atEnd() {
    const ans = this.pos >= this.source.length;
    this.examinedLength = Math.max(this.examinedLength, this.pos + 1);
    return ans;
  }
  next() {
    const ans = this.source[this.pos++];
    this.examinedLength = Math.max(this.examinedLength, this.pos);
    return ans;
  }
  nextCharCode() {
    const nextChar = this.next();
    return nextChar && nextChar.charCodeAt(0);
  }
  nextCodePoint() {
    const cp = this.source.slice(this.pos++).codePointAt(0);
    if (cp > MAX_CHAR_CODE) {
      this.pos += 1;
    }
    this.examinedLength = Math.max(this.examinedLength, this.pos);
    return cp;
  }
  matchString(s2, optIgnoreCase) {
    let idx;
    if (optIgnoreCase) {
      for (idx = 0; idx < s2.length; idx++) {
        const actual = this.next();
        const expected = s2[idx];
        if (actual == null || actual.toUpperCase() !== expected.toUpperCase()) {
          return false;
        }
      }
      return true;
    }
    for (idx = 0; idx < s2.length; idx++) {
      if (this.next() !== s2[idx]) {
        return false;
      }
    }
    return true;
  }
  sourceSlice(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  }
  interval(startIdx, optEndIdx) {
    return new Interval(this.source, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
}
class MatchResult {
  constructor(matcher, input, startExpr, cst, cstOffset, rightmostFailurePosition, optRecordedFailures) {
    this.matcher = matcher;
    this.input = input;
    this.startExpr = startExpr;
    this._cst = cst;
    this._cstOffset = cstOffset;
    this._rightmostFailurePosition = rightmostFailurePosition;
    this._rightmostFailures = optRecordedFailures;
    if (this.failed()) {
      defineLazyProperty(this, "message", function() {
        const detail = "Expected " + this.getExpectedText();
        return getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail;
      });
      defineLazyProperty(this, "shortMessage", function() {
        const detail = "expected " + this.getExpectedText();
        const errorInfo = getLineAndColumn(
          this.input,
          this.getRightmostFailurePosition()
        );
        return "Line " + errorInfo.lineNum + ", col " + errorInfo.colNum + ": " + detail;
      });
    }
  }
  succeeded() {
    return !!this._cst;
  }
  failed() {
    return !this.succeeded();
  }
  getRightmostFailurePosition() {
    return this._rightmostFailurePosition;
  }
  getRightmostFailures() {
    if (!this._rightmostFailures) {
      this.matcher.setInput(this.input);
      const matchResultWithFailures = this.matcher._match(this.startExpr, {
        tracing: false,
        positionToRecordFailures: this.getRightmostFailurePosition()
      });
      this._rightmostFailures = matchResultWithFailures.getRightmostFailures();
    }
    return this._rightmostFailures;
  }
  toString() {
    return this.succeeded() ? "[match succeeded]" : "[match failed at position " + this.getRightmostFailurePosition() + "]";
  }
  // Return a string summarizing the expected contents of the input stream when
  // the match failure occurred.
  getExpectedText() {
    if (this.succeeded()) {
      throw new Error("cannot get expected text of a successful MatchResult");
    }
    const sb = new StringBuffer();
    let failures = this.getRightmostFailures();
    failures = failures.filter((failure) => !failure.isFluffy());
    for (let idx = 0; idx < failures.length; idx++) {
      if (idx > 0) {
        if (idx === failures.length - 1) {
          sb.append(failures.length > 2 ? ", or " : " or ");
        } else {
          sb.append(", ");
        }
      }
      sb.append(failures[idx].toString());
    }
    return sb.contents();
  }
  getInterval() {
    const pos = this.getRightmostFailurePosition();
    return new Interval(this.input, pos, pos);
  }
}
class PosInfo {
  constructor() {
    this.applicationMemoKeyStack = [];
    this.memo = {};
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    this.currentLeftRecursion = void 0;
  }
  isActive(application) {
    return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
  }
  enter(application) {
    this.applicationMemoKeyStack.push(application.toMemoKey());
  }
  exit() {
    this.applicationMemoKeyStack.pop();
  }
  startLeftRecursion(headApplication, memoRec) {
    memoRec.isLeftRecursion = true;
    memoRec.headApplication = headApplication;
    memoRec.nextLeftRecursion = this.currentLeftRecursion;
    this.currentLeftRecursion = memoRec;
    const { applicationMemoKeyStack } = this;
    const indexOfFirstInvolvedRule = applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1;
    const involvedApplicationMemoKeys = applicationMemoKeyStack.slice(
      indexOfFirstInvolvedRule
    );
    memoRec.isInvolved = function(applicationMemoKey) {
      return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0;
    };
    memoRec.updateInvolvedApplicationMemoKeys = function() {
      for (let idx = indexOfFirstInvolvedRule; idx < applicationMemoKeyStack.length; idx++) {
        const applicationMemoKey = applicationMemoKeyStack[idx];
        if (!this.isInvolved(applicationMemoKey)) {
          involvedApplicationMemoKeys.push(applicationMemoKey);
        }
      }
    };
  }
  endLeftRecursion() {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
  }
  // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
  // the memoized result (which starts out being a failure) is always used.
  shouldUseMemoizedResult(memoRec) {
    if (!memoRec.isLeftRecursion) {
      return true;
    }
    const { applicationMemoKeyStack } = this;
    for (let idx = 0; idx < applicationMemoKeyStack.length; idx++) {
      const applicationMemoKey = applicationMemoKeyStack[idx];
      if (memoRec.isInvolved(applicationMemoKey)) {
        return false;
      }
    }
    return true;
  }
  memoize(memoKey, memoRec) {
    this.memo[memoKey] = memoRec;
    this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
    this.maxRightmostFailureOffset = Math.max(
      this.maxRightmostFailureOffset,
      memoRec.rightmostFailureOffset
    );
    return memoRec;
  }
  clearObsoleteEntries(pos, invalidatedIdx) {
    if (pos + this.maxExaminedLength <= invalidatedIdx) {
      return;
    }
    const { memo } = this;
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    Object.keys(memo).forEach((k) => {
      const memoRec = memo[k];
      if (pos + memoRec.examinedLength > invalidatedIdx) {
        delete memo[k];
      } else {
        this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
        this.maxRightmostFailureOffset = Math.max(
          this.maxRightmostFailureOffset,
          memoRec.rightmostFailureOffset
        );
      }
    });
  }
}
const BALLOT_X = "✗";
const CHECK_MARK = "✓";
const DOT_OPERATOR = "⋅";
const RIGHTWARDS_DOUBLE_ARROW = "⇒";
const SYMBOL_FOR_HORIZONTAL_TABULATION = "␉";
const SYMBOL_FOR_LINE_FEED = "␊";
const SYMBOL_FOR_CARRIAGE_RETURN = "␍";
const Flags = {
  succeeded: 1 << 0,
  isRootNode: 1 << 1,
  isImplicitSpaces: 1 << 2,
  isMemoized: 1 << 3,
  isHeadOfLeftRecursion: 1 << 4,
  terminatesLR: 1 << 5
};
function spaces(n) {
  return repeat(" ", n).join("");
}
function getInputExcerpt(input, pos, len) {
  const excerpt = asEscapedString(input.slice(pos, pos + len));
  if (excerpt.length < len) {
    return excerpt + repeat(" ", len - excerpt.length).join("");
  }
  return excerpt;
}
function asEscapedString(obj) {
  if (typeof obj === "string") {
    return obj.replace(/ /g, DOT_OPERATOR).replace(/\t/g, SYMBOL_FOR_HORIZONTAL_TABULATION).replace(/\n/g, SYMBOL_FOR_LINE_FEED).replace(/\r/g, SYMBOL_FOR_CARRIAGE_RETURN);
  }
  return String(obj);
}
class Trace {
  constructor(input, pos1, pos2, expr, succeeded, bindings, optChildren) {
    this.input = input;
    this.pos = this.pos1 = pos1;
    this.pos2 = pos2;
    this.source = new Interval(input, pos1, pos2);
    this.expr = expr;
    this.bindings = bindings;
    this.children = optChildren || [];
    this.terminatingLREntry = null;
    this._flags = succeeded ? Flags.succeeded : 0;
  }
  get displayString() {
    return this.expr.toDisplayString();
  }
  clone() {
    return this.cloneWithExpr(this.expr);
  }
  cloneWithExpr(expr) {
    const ans = new Trace(
      this.input,
      this.pos,
      this.pos2,
      expr,
      this.succeeded,
      this.bindings,
      this.children
    );
    ans.isHeadOfLeftRecursion = this.isHeadOfLeftRecursion;
    ans.isImplicitSpaces = this.isImplicitSpaces;
    ans.isMemoized = this.isMemoized;
    ans.isRootNode = this.isRootNode;
    ans.terminatesLR = this.terminatesLR;
    ans.terminatingLREntry = this.terminatingLREntry;
    return ans;
  }
  // Record the trace information for the terminating condition of the LR loop.
  recordLRTermination(ruleBodyTrace, value) {
    this.terminatingLREntry = new Trace(
      this.input,
      this.pos,
      this.pos2,
      this.expr,
      false,
      [value],
      [ruleBodyTrace]
    );
    this.terminatingLREntry.terminatesLR = true;
  }
  // Recursively traverse this trace node and all its descendents, calling a visitor function
  // for each node that is visited. If `vistorObjOrFn` is an object, then its 'enter' property
  // is a function to call before visiting the children of a node, and its 'exit' property is
  // a function to call afterwards. If `visitorObjOrFn` is a function, it represents the 'enter'
  // function.
  //
  // The functions are called with three arguments: the Trace node, its parent Trace, and a number
  // representing the depth of the node in the tree. (The root node has depth 0.) `optThisArg`, if
  // specified, is the value to use for `this` when executing the visitor functions.
  walk(visitorObjOrFn, optThisArg) {
    let visitor = visitorObjOrFn;
    if (typeof visitor === "function") {
      visitor = { enter: visitor };
    }
    function _walk(node, parent, depth) {
      let recurse = true;
      if (visitor.enter) {
        if (visitor.enter.call(optThisArg, node, parent, depth) === Trace.prototype.SKIP) {
          recurse = false;
        }
      }
      if (recurse) {
        node.children.forEach((child) => {
          _walk(child, node, depth + 1);
        });
        if (visitor.exit) {
          visitor.exit.call(optThisArg, node, parent, depth);
        }
      }
    }
    if (this.isRootNode) {
      this.children.forEach((c) => {
        _walk(c, null, 0);
      });
    } else {
      _walk(this, null, 0);
    }
  }
  // Return a string representation of the trace.
  // Sample:
  //     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
  //     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
  //     12⋅+⋅2⋅*⋅3       ✗ addExp_plus
  toString() {
    const sb = new StringBuffer();
    this.walk((node, parent, depth) => {
      if (!node) {
        return this.SKIP;
      }
      const ctorName = node.expr.constructor.name;
      if (ctorName === "Alt") {
        return;
      }
      sb.append(getInputExcerpt(node.input, node.pos, 10) + spaces(depth * 2 + 1));
      sb.append((node.succeeded ? CHECK_MARK : BALLOT_X) + " " + node.displayString);
      if (node.isHeadOfLeftRecursion) {
        sb.append(" (LR)");
      }
      if (node.succeeded) {
        const contents = asEscapedString(node.source.contents);
        sb.append(" " + RIGHTWARDS_DOUBLE_ARROW + "  ");
        sb.append(typeof contents === "string" ? '"' + contents + '"' : contents);
      }
      sb.append("\n");
    });
    return sb.contents();
  }
}
Trace.prototype.SKIP = {};
Object.keys(Flags).forEach((name) => {
  const mask = Flags[name];
  Object.defineProperty(Trace.prototype, name, {
    get() {
      return (this._flags & mask) !== 0;
    },
    set(val) {
      if (val) {
        this._flags |= mask;
      } else {
        this._flags &= ~mask;
      }
    }
  });
});
PExpr.prototype.allowsSkippingPrecedingSpace = abstract("allowsSkippingPrecedingSpace");
any.allowsSkippingPrecedingSpace = end.allowsSkippingPrecedingSpace = Apply.prototype.allowsSkippingPrecedingSpace = Terminal.prototype.allowsSkippingPrecedingSpace = Range.prototype.allowsSkippingPrecedingSpace = UnicodeChar.prototype.allowsSkippingPrecedingSpace = function() {
  return true;
};
Alt.prototype.allowsSkippingPrecedingSpace = Iter.prototype.allowsSkippingPrecedingSpace = Lex.prototype.allowsSkippingPrecedingSpace = Lookahead.prototype.allowsSkippingPrecedingSpace = Not.prototype.allowsSkippingPrecedingSpace = Param.prototype.allowsSkippingPrecedingSpace = Seq.prototype.allowsSkippingPrecedingSpace = function() {
  return false;
};
let BuiltInRules$1;
awaitBuiltInRules((g) => {
  BuiltInRules$1 = g;
});
let lexifyCount;
PExpr.prototype.assertAllApplicationsAreValid = function(ruleName, grammar2) {
  lexifyCount = 0;
  this._assertAllApplicationsAreValid(ruleName, grammar2);
};
PExpr.prototype._assertAllApplicationsAreValid = abstract(
  "_assertAllApplicationsAreValid"
);
any._assertAllApplicationsAreValid = end._assertAllApplicationsAreValid = Terminal.prototype._assertAllApplicationsAreValid = Range.prototype._assertAllApplicationsAreValid = Param.prototype._assertAllApplicationsAreValid = UnicodeChar.prototype._assertAllApplicationsAreValid = function(ruleName, grammar2) {
};
Lex.prototype._assertAllApplicationsAreValid = function(ruleName, grammar2) {
  lexifyCount++;
  this.expr._assertAllApplicationsAreValid(ruleName, grammar2);
  lexifyCount--;
};
Alt.prototype._assertAllApplicationsAreValid = function(ruleName, grammar2) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar2);
  }
};
Seq.prototype._assertAllApplicationsAreValid = function(ruleName, grammar2) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar2);
  }
};
Iter.prototype._assertAllApplicationsAreValid = Not.prototype._assertAllApplicationsAreValid = Lookahead.prototype._assertAllApplicationsAreValid = function(ruleName, grammar2) {
  this.expr._assertAllApplicationsAreValid(ruleName, grammar2);
};
Apply.prototype._assertAllApplicationsAreValid = function(ruleName, grammar2, skipSyntacticCheck = false) {
  const ruleInfo = grammar2.rules[this.ruleName];
  const isContextSyntactic = isSyntactic(ruleName) && lexifyCount === 0;
  if (!ruleInfo) {
    throw undeclaredRule(this.ruleName, grammar2.name, this.source);
  }
  if (!skipSyntacticCheck && isSyntactic(this.ruleName) && !isContextSyntactic) {
    throw applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
  }
  const actual = this.args.length;
  const expected = ruleInfo.formals.length;
  if (actual !== expected) {
    throw wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
  }
  const isBuiltInApplySyntactic = BuiltInRules$1 && ruleInfo === BuiltInRules$1.rules.applySyntactic;
  const isBuiltInCaseInsensitive = BuiltInRules$1 && ruleInfo === BuiltInRules$1.rules.caseInsensitive;
  if (isBuiltInCaseInsensitive) {
    if (!(this.args[0] instanceof Terminal)) {
      throw incorrectArgumentType('a Terminal (e.g. "abc")', this.args[0]);
    }
  }
  if (isBuiltInApplySyntactic) {
    const arg = this.args[0];
    if (!(arg instanceof Apply)) {
      throw incorrectArgumentType("a syntactic rule application", arg);
    }
    if (!isSyntactic(arg.ruleName)) {
      throw applySyntacticWithLexicalRuleApplication(arg);
    }
    if (isContextSyntactic) {
      throw unnecessaryExperimentalApplySyntactic(this);
    }
  }
  this.args.forEach((arg) => {
    arg._assertAllApplicationsAreValid(ruleName, grammar2, isBuiltInApplySyntactic);
    if (arg.getArity() !== 1) {
      throw invalidParameter(this.ruleName, arg);
    }
  });
};
PExpr.prototype.assertChoicesHaveUniformArity = abstract(
  "assertChoicesHaveUniformArity"
);
any.assertChoicesHaveUniformArity = end.assertChoicesHaveUniformArity = Terminal.prototype.assertChoicesHaveUniformArity = Range.prototype.assertChoicesHaveUniformArity = Param.prototype.assertChoicesHaveUniformArity = Lex.prototype.assertChoicesHaveUniformArity = UnicodeChar.prototype.assertChoicesHaveUniformArity = function(ruleName) {
};
Alt.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  if (this.terms.length === 0) {
    return;
  }
  const arity = this.terms[0].getArity();
  for (let idx = 0; idx < this.terms.length; idx++) {
    const term = this.terms[idx];
    term.assertChoicesHaveUniformArity();
    const otherArity = term.getArity();
    if (arity !== otherArity) {
      throw inconsistentArity(ruleName, arity, otherArity, term);
    }
  }
};
Extend.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  const actualArity = this.terms[0].getArity();
  const expectedArity = this.terms[1].getArity();
  if (actualArity !== expectedArity) {
    throw inconsistentArity(ruleName, expectedArity, actualArity, this.terms[0]);
  }
};
Seq.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertChoicesHaveUniformArity(ruleName);
  }
};
Iter.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};
Not.prototype.assertChoicesHaveUniformArity = function(ruleName) {
};
Lookahead.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};
Apply.prototype.assertChoicesHaveUniformArity = function(ruleName) {
};
PExpr.prototype.assertIteratedExprsAreNotNullable = abstract(
  "assertIteratedExprsAreNotNullable"
);
any.assertIteratedExprsAreNotNullable = end.assertIteratedExprsAreNotNullable = Terminal.prototype.assertIteratedExprsAreNotNullable = Range.prototype.assertIteratedExprsAreNotNullable = Param.prototype.assertIteratedExprsAreNotNullable = UnicodeChar.prototype.assertIteratedExprsAreNotNullable = function(grammar2) {
};
Alt.prototype.assertIteratedExprsAreNotNullable = function(grammar2) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertIteratedExprsAreNotNullable(grammar2);
  }
};
Seq.prototype.assertIteratedExprsAreNotNullable = function(grammar2) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertIteratedExprsAreNotNullable(grammar2);
  }
};
Iter.prototype.assertIteratedExprsAreNotNullable = function(grammar2) {
  this.expr.assertIteratedExprsAreNotNullable(grammar2);
  if (this.expr.isNullable(grammar2)) {
    throw kleeneExprHasNullableOperand(this, []);
  }
};
Opt.prototype.assertIteratedExprsAreNotNullable = Not.prototype.assertIteratedExprsAreNotNullable = Lookahead.prototype.assertIteratedExprsAreNotNullable = Lex.prototype.assertIteratedExprsAreNotNullable = function(grammar2) {
  this.expr.assertIteratedExprsAreNotNullable(grammar2);
};
Apply.prototype.assertIteratedExprsAreNotNullable = function(grammar2) {
  this.args.forEach((arg) => {
    arg.assertIteratedExprsAreNotNullable(grammar2);
  });
};
class Node {
  constructor(matchLength) {
    this.matchLength = matchLength;
  }
  get ctorName() {
    throw new Error("subclass responsibility");
  }
  numChildren() {
    return this.children ? this.children.length : 0;
  }
  childAt(idx) {
    if (this.children) {
      return this.children[idx];
    }
  }
  indexOfChild(arg) {
    return this.children.indexOf(arg);
  }
  hasChildren() {
    return this.numChildren() > 0;
  }
  hasNoChildren() {
    return !this.hasChildren();
  }
  onlyChild() {
    if (this.numChildren() !== 1) {
      throw new Error(
        "cannot get only child of a node of type " + this.ctorName + " (it has " + this.numChildren() + " children)"
      );
    } else {
      return this.firstChild();
    }
  }
  firstChild() {
    if (this.hasNoChildren()) {
      throw new Error(
        "cannot get first child of a " + this.ctorName + " node, which has no children"
      );
    } else {
      return this.childAt(0);
    }
  }
  lastChild() {
    if (this.hasNoChildren()) {
      throw new Error(
        "cannot get last child of a " + this.ctorName + " node, which has no children"
      );
    } else {
      return this.childAt(this.numChildren() - 1);
    }
  }
  childBefore(child) {
    const childIdx = this.indexOfChild(child);
    if (childIdx < 0) {
      throw new Error("Node.childBefore() called w/ an argument that is not a child");
    } else if (childIdx === 0) {
      throw new Error("cannot get child before first child");
    } else {
      return this.childAt(childIdx - 1);
    }
  }
  childAfter(child) {
    const childIdx = this.indexOfChild(child);
    if (childIdx < 0) {
      throw new Error("Node.childAfter() called w/ an argument that is not a child");
    } else if (childIdx === this.numChildren() - 1) {
      throw new Error("cannot get child after last child");
    } else {
      return this.childAt(childIdx + 1);
    }
  }
  isTerminal() {
    return false;
  }
  isNonterminal() {
    return false;
  }
  isIteration() {
    return false;
  }
  isOptional() {
    return false;
  }
}
class TerminalNode extends Node {
  get ctorName() {
    return "_terminal";
  }
  isTerminal() {
    return true;
  }
  get primitiveValue() {
    throw new Error("The `primitiveValue` property was removed in Ohm v17.");
  }
}
class NonterminalNode extends Node {
  constructor(ruleName, children, childOffsets, matchLength) {
    super(matchLength);
    this.ruleName = ruleName;
    this.children = children;
    this.childOffsets = childOffsets;
  }
  get ctorName() {
    return this.ruleName;
  }
  isNonterminal() {
    return true;
  }
  isLexical() {
    return isLexical(this.ctorName);
  }
  isSyntactic() {
    return isSyntactic(this.ctorName);
  }
}
class IterationNode extends Node {
  constructor(children, childOffsets, matchLength, isOptional) {
    super(matchLength);
    this.children = children;
    this.childOffsets = childOffsets;
    this.optional = isOptional;
  }
  get ctorName() {
    return "_iter";
  }
  isIteration() {
    return true;
  }
  isOptional() {
    return this.optional;
  }
}
PExpr.prototype.eval = abstract("eval");
any.eval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  const cp = inputStream.nextCodePoint();
  if (cp !== void 0) {
    state.pushBinding(new TerminalNode(String.fromCodePoint(cp).length), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};
end.eval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  if (inputStream.atEnd()) {
    state.pushBinding(new TerminalNode(0), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};
Terminal.prototype.eval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  if (!inputStream.matchString(this.obj)) {
    state.processFailure(origPos, this);
    return false;
  } else {
    state.pushBinding(new TerminalNode(this.obj.length), origPos);
    return true;
  }
};
Range.prototype.eval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  const cp = this.matchCodePoint ? inputStream.nextCodePoint() : inputStream.nextCharCode();
  if (cp !== void 0 && this.from.codePointAt(0) <= cp && cp <= this.to.codePointAt(0)) {
    state.pushBinding(new TerminalNode(String.fromCodePoint(cp).length), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};
Param.prototype.eval = function(state) {
  return state.eval(state.currentApplication().args[this.index]);
};
Lex.prototype.eval = function(state) {
  state.enterLexifiedContext();
  const ans = state.eval(this.expr);
  state.exitLexifiedContext();
  return ans;
};
Alt.prototype.eval = function(state) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    if (state.eval(this.terms[idx])) {
      return true;
    }
  }
  return false;
};
Seq.prototype.eval = function(state) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    const factor = this.factors[idx];
    if (!state.eval(factor)) {
      return false;
    }
  }
  return true;
};
Iter.prototype.eval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  const arity = this.getArity();
  const cols = [];
  const colOffsets = [];
  while (cols.length < arity) {
    cols.push([]);
    colOffsets.push([]);
  }
  let numMatches = 0;
  let prevPos = origPos;
  let idx;
  while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
    if (inputStream.pos === prevPos) {
      throw kleeneExprHasNullableOperand(this, state._applicationStack);
    }
    prevPos = inputStream.pos;
    numMatches++;
    const row = state._bindings.splice(state._bindings.length - arity, arity);
    const rowOffsets = state._bindingOffsets.splice(
      state._bindingOffsets.length - arity,
      arity
    );
    for (idx = 0; idx < row.length; idx++) {
      cols[idx].push(row[idx]);
      colOffsets[idx].push(rowOffsets[idx]);
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  }
  let offset = state.posToOffset(origPos);
  let matchLength = 0;
  if (numMatches > 0) {
    const lastCol = cols[arity - 1];
    const lastColOffsets = colOffsets[arity - 1];
    const endOffset = lastColOffsets[lastColOffsets.length - 1] + lastCol[lastCol.length - 1].matchLength;
    offset = colOffsets[0][0];
    matchLength = endOffset - offset;
  }
  const isOptional = this instanceof Opt;
  for (idx = 0; idx < cols.length; idx++) {
    state._bindings.push(
      new IterationNode(cols[idx], colOffsets[idx], matchLength, isOptional)
    );
    state._bindingOffsets.push(offset);
  }
  return true;
};
Not.prototype.eval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  state.pushFailuresInfo();
  const ans = state.eval(this.expr);
  state.popFailuresInfo();
  if (ans) {
    state.processFailure(origPos, this);
    return false;
  }
  inputStream.pos = origPos;
  return true;
};
Lookahead.prototype.eval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  if (state.eval(this.expr)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};
Apply.prototype.eval = function(state) {
  const caller = state.currentApplication();
  const actuals = caller ? caller.args : [];
  const app = this.substituteParams(actuals);
  const posInfo = state.getCurrentPosInfo();
  if (posInfo.isActive(app)) {
    return app.handleCycle(state);
  }
  const memoKey = app.toMemoKey();
  const memoRec = posInfo.memo[memoKey];
  if (memoRec && posInfo.shouldUseMemoizedResult(memoRec)) {
    if (state.hasNecessaryInfo(memoRec)) {
      return state.useMemoizedResult(state.inputStream.pos, memoRec);
    }
    delete posInfo.memo[memoKey];
  }
  return app.reallyEval(state);
};
Apply.prototype.handleCycle = function(state) {
  const posInfo = state.getCurrentPosInfo();
  const { currentLeftRecursion } = posInfo;
  const memoKey = this.toMemoKey();
  let memoRec = posInfo.memo[memoKey];
  if (currentLeftRecursion && currentLeftRecursion.headApplication.toMemoKey() === memoKey) {
    memoRec.updateInvolvedApplicationMemoKeys();
  } else if (!memoRec) {
    memoRec = posInfo.memoize(memoKey, {
      matchLength: 0,
      examinedLength: 0,
      value: false,
      rightmostFailureOffset: -1
    });
    posInfo.startLeftRecursion(this, memoRec);
  }
  return state.useMemoizedResult(state.inputStream.pos, memoRec);
};
Apply.prototype.reallyEval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  const origPosInfo = state.getCurrentPosInfo();
  const ruleInfo = state.grammar.rules[this.ruleName];
  const { body } = ruleInfo;
  const { description } = ruleInfo;
  state.enterApplication(origPosInfo, this);
  if (description) {
    state.pushFailuresInfo();
  }
  const origInputStreamExaminedLength = inputStream.examinedLength;
  inputStream.examinedLength = 0;
  let value = this.evalOnce(body, state);
  const currentLR = origPosInfo.currentLeftRecursion;
  const memoKey = this.toMemoKey();
  const isHeadOfLeftRecursion = currentLR && currentLR.headApplication.toMemoKey() === memoKey;
  let memoRec;
  if (state.doNotMemoize) {
    state.doNotMemoize = false;
  } else if (isHeadOfLeftRecursion) {
    value = this.growSeedResult(body, state, origPos, currentLR, value);
    origPosInfo.endLeftRecursion();
    memoRec = currentLR;
    memoRec.examinedLength = inputStream.examinedLength - origPos;
    memoRec.rightmostFailureOffset = state._getRightmostFailureOffset();
    origPosInfo.memoize(memoKey, memoRec);
  } else if (!currentLR || !currentLR.isInvolved(memoKey)) {
    memoRec = origPosInfo.memoize(memoKey, {
      matchLength: inputStream.pos - origPos,
      examinedLength: inputStream.examinedLength - origPos,
      value,
      failuresAtRightmostPosition: state.cloneRecordedFailures(),
      rightmostFailureOffset: state._getRightmostFailureOffset()
    });
  }
  const succeeded = !!value;
  if (description) {
    state.popFailuresInfo();
    if (!succeeded) {
      state.processFailure(origPos, this);
    }
    if (memoRec) {
      memoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();
    }
  }
  if (state.isTracing() && memoRec) {
    const entry = state.getTraceEntry(origPos, this, succeeded, succeeded ? [value] : []);
    if (isHeadOfLeftRecursion) {
      assert(entry.terminatingLREntry != null || !succeeded);
      entry.isHeadOfLeftRecursion = true;
    }
    memoRec.traceEntry = entry;
  }
  inputStream.examinedLength = Math.max(
    inputStream.examinedLength,
    origInputStreamExaminedLength
  );
  state.exitApplication(origPosInfo, value);
  return succeeded;
};
Apply.prototype.evalOnce = function(expr, state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  if (state.eval(expr)) {
    const arity = expr.getArity();
    const bindings = state._bindings.splice(state._bindings.length - arity, arity);
    const offsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
    const matchLength = inputStream.pos - origPos;
    return new NonterminalNode(this.ruleName, bindings, offsets, matchLength);
  } else {
    return false;
  }
};
Apply.prototype.growSeedResult = function(body, state, origPos, lrMemoRec, newValue) {
  if (!newValue) {
    return false;
  }
  const { inputStream } = state;
  while (true) {
    lrMemoRec.matchLength = inputStream.pos - origPos;
    lrMemoRec.value = newValue;
    lrMemoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();
    if (state.isTracing()) {
      const seedTrace = state.trace[state.trace.length - 1];
      lrMemoRec.traceEntry = new Trace(
        state.input,
        origPos,
        inputStream.pos,
        this,
        true,
        [newValue],
        [seedTrace.clone()]
      );
    }
    inputStream.pos = origPos;
    newValue = this.evalOnce(body, state);
    if (inputStream.pos - origPos <= lrMemoRec.matchLength) {
      break;
    }
    if (state.isTracing()) {
      state.trace.splice(-2, 1);
    }
  }
  if (state.isTracing()) {
    lrMemoRec.traceEntry.recordLRTermination(state.trace.pop(), newValue);
  }
  inputStream.pos = origPos + lrMemoRec.matchLength;
  return lrMemoRec.value;
};
UnicodeChar.prototype.eval = function(state) {
  const { inputStream } = state;
  const origPos = inputStream.pos;
  const cp = inputStream.nextCodePoint();
  if (cp !== void 0 && cp <= MAX_CODE_POINT) {
    const ch = String.fromCodePoint(cp);
    if (this.pattern.test(ch)) {
      state.pushBinding(new TerminalNode(ch.length), origPos);
      return true;
    }
  }
  state.processFailure(origPos, this);
  return false;
};
PExpr.prototype.getArity = abstract("getArity");
any.getArity = end.getArity = Terminal.prototype.getArity = Range.prototype.getArity = Param.prototype.getArity = Apply.prototype.getArity = UnicodeChar.prototype.getArity = function() {
  return 1;
};
Alt.prototype.getArity = function() {
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};
Seq.prototype.getArity = function() {
  let arity = 0;
  for (let idx = 0; idx < this.factors.length; idx++) {
    arity += this.factors[idx].getArity();
  }
  return arity;
};
Iter.prototype.getArity = function() {
  return this.expr.getArity();
};
Not.prototype.getArity = function() {
  return 0;
};
Lookahead.prototype.getArity = Lex.prototype.getArity = function() {
  return this.expr.getArity();
};
function getMetaInfo(expr, grammarInterval) {
  const metaInfo = {};
  if (expr.source && grammarInterval) {
    const adjusted = expr.source.relativeTo(grammarInterval);
    metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
  }
  return metaInfo;
}
PExpr.prototype.outputRecipe = abstract("outputRecipe");
any.outputRecipe = function(formals, grammarInterval) {
  return ["any", getMetaInfo(this, grammarInterval)];
};
end.outputRecipe = function(formals, grammarInterval) {
  return ["end", getMetaInfo(this, grammarInterval)];
};
Terminal.prototype.outputRecipe = function(formals, grammarInterval) {
  return ["terminal", getMetaInfo(this, grammarInterval), this.obj];
};
Range.prototype.outputRecipe = function(formals, grammarInterval) {
  return ["range", getMetaInfo(this, grammarInterval), this.from, this.to];
};
Param.prototype.outputRecipe = function(formals, grammarInterval) {
  return ["param", getMetaInfo(this, grammarInterval), this.index];
};
Alt.prototype.outputRecipe = function(formals, grammarInterval) {
  return ["alt", getMetaInfo(this, grammarInterval)].concat(
    this.terms.map((term) => term.outputRecipe(formals, grammarInterval))
  );
};
Extend.prototype.outputRecipe = function(formals, grammarInterval) {
  const extension = this.terms[0];
  return extension.outputRecipe(formals, grammarInterval);
};
Splice.prototype.outputRecipe = function(formals, grammarInterval) {
  const beforeTerms = this.terms.slice(0, this.expansionPos);
  const afterTerms = this.terms.slice(this.expansionPos + 1);
  return [
    "splice",
    getMetaInfo(this, grammarInterval),
    beforeTerms.map((term) => term.outputRecipe(formals, grammarInterval)),
    afterTerms.map((term) => term.outputRecipe(formals, grammarInterval))
  ];
};
Seq.prototype.outputRecipe = function(formals, grammarInterval) {
  return ["seq", getMetaInfo(this, grammarInterval)].concat(
    this.factors.map((factor) => factor.outputRecipe(formals, grammarInterval))
  );
};
Star.prototype.outputRecipe = Plus.prototype.outputRecipe = Opt.prototype.outputRecipe = Not.prototype.outputRecipe = Lookahead.prototype.outputRecipe = Lex.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    this.constructor.name.toLowerCase(),
    getMetaInfo(this, grammarInterval),
    this.expr.outputRecipe(formals, grammarInterval)
  ];
};
Apply.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    "app",
    getMetaInfo(this, grammarInterval),
    this.ruleName,
    this.args.map((arg) => arg.outputRecipe(formals, grammarInterval))
  ];
};
UnicodeChar.prototype.outputRecipe = function(formals, grammarInterval) {
  return ["unicodeChar", getMetaInfo(this, grammarInterval), this.categoryOrProp];
};
PExpr.prototype.introduceParams = abstract("introduceParams");
any.introduceParams = end.introduceParams = Terminal.prototype.introduceParams = Range.prototype.introduceParams = Param.prototype.introduceParams = UnicodeChar.prototype.introduceParams = function(formals) {
  return this;
};
Alt.prototype.introduceParams = function(formals) {
  this.terms.forEach((term, idx, terms) => {
    terms[idx] = term.introduceParams(formals);
  });
  return this;
};
Seq.prototype.introduceParams = function(formals) {
  this.factors.forEach((factor, idx, factors) => {
    factors[idx] = factor.introduceParams(formals);
  });
  return this;
};
Iter.prototype.introduceParams = Not.prototype.introduceParams = Lookahead.prototype.introduceParams = Lex.prototype.introduceParams = function(formals) {
  this.expr = this.expr.introduceParams(formals);
  return this;
};
Apply.prototype.introduceParams = function(formals) {
  const index = formals.indexOf(this.ruleName);
  if (index >= 0) {
    if (this.args.length > 0) {
      throw new Error("Parameterized rules cannot be passed as arguments to another rule.");
    }
    return new Param(index).withSource(this.source);
  } else {
    this.args.forEach((arg, idx, args) => {
      args[idx] = arg.introduceParams(formals);
    });
    return this;
  }
};
PExpr.prototype.isNullable = function(grammar2) {
  return this._isNullable(grammar2, /* @__PURE__ */ Object.create(null));
};
PExpr.prototype._isNullable = abstract("_isNullable");
any._isNullable = Range.prototype._isNullable = Param.prototype._isNullable = Plus.prototype._isNullable = UnicodeChar.prototype._isNullable = function(grammar2, memo) {
  return false;
};
end._isNullable = function(grammar2, memo) {
  return true;
};
Terminal.prototype._isNullable = function(grammar2, memo) {
  if (typeof this.obj === "string") {
    return this.obj === "";
  } else {
    return false;
  }
};
Alt.prototype._isNullable = function(grammar2, memo) {
  return this.terms.length === 0 || this.terms.some((term) => term._isNullable(grammar2, memo));
};
Seq.prototype._isNullable = function(grammar2, memo) {
  return this.factors.every((factor) => factor._isNullable(grammar2, memo));
};
Star.prototype._isNullable = Opt.prototype._isNullable = Not.prototype._isNullable = Lookahead.prototype._isNullable = function(grammar2, memo) {
  return true;
};
Lex.prototype._isNullable = function(grammar2, memo) {
  return this.expr._isNullable(grammar2, memo);
};
Apply.prototype._isNullable = function(grammar2, memo) {
  const key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    const { body } = grammar2.rules[this.ruleName];
    const inlined = body.substituteParams(this.args);
    memo[key] = false;
    memo[key] = inlined._isNullable(grammar2, memo);
  }
  return memo[key];
};
PExpr.prototype.substituteParams = abstract("substituteParams");
any.substituteParams = end.substituteParams = Terminal.prototype.substituteParams = Range.prototype.substituteParams = UnicodeChar.prototype.substituteParams = function(actuals) {
  return this;
};
Param.prototype.substituteParams = function(actuals) {
  return checkNotNull(actuals[this.index]);
};
Alt.prototype.substituteParams = function(actuals) {
  return new Alt(this.terms.map((term) => term.substituteParams(actuals)));
};
Seq.prototype.substituteParams = function(actuals) {
  return new Seq(this.factors.map((factor) => factor.substituteParams(actuals)));
};
Iter.prototype.substituteParams = Not.prototype.substituteParams = Lookahead.prototype.substituteParams = Lex.prototype.substituteParams = function(actuals) {
  return new this.constructor(this.expr.substituteParams(actuals));
};
Apply.prototype.substituteParams = function(actuals) {
  if (this.args.length === 0) {
    return this;
  } else {
    const args = this.args.map((arg) => arg.substituteParams(actuals));
    return new Apply(this.ruleName, args);
  }
};
function isRestrictedJSIdentifier(str) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str);
}
function resolveDuplicatedNames(argumentNameList) {
  const count = /* @__PURE__ */ Object.create(null);
  argumentNameList.forEach((argName) => {
    count[argName] = (count[argName] || 0) + 1;
  });
  Object.keys(count).forEach((dupArgName) => {
    if (count[dupArgName] <= 1) {
      return;
    }
    let subscript = 1;
    argumentNameList.forEach((argName, idx) => {
      if (argName === dupArgName) {
        argumentNameList[idx] = argName + "_" + subscript++;
      }
    });
  });
}
PExpr.prototype.toArgumentNameList = abstract("toArgumentNameList");
any.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ["any"];
};
end.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ["end"];
};
Terminal.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  if (typeof this.obj === "string" && /^[_a-zA-Z0-9]+$/.test(this.obj)) {
    return ["_" + this.obj];
  } else {
    return ["$" + firstArgIndex];
  }
};
Range.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  let argName = this.from + "_to_" + this.to;
  if (!isRestrictedJSIdentifier(argName)) {
    argName = "_" + argName;
  }
  if (!isRestrictedJSIdentifier(argName)) {
    argName = "$" + firstArgIndex;
  }
  return [argName];
};
Alt.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  const termArgNameLists = this.terms.map(
    (term) => term.toArgumentNameList(firstArgIndex, true)
  );
  const argumentNameList = [];
  const numArgs = termArgNameLists[0].length;
  for (let colIdx = 0; colIdx < numArgs; colIdx++) {
    const col = [];
    for (let rowIdx = 0; rowIdx < this.terms.length; rowIdx++) {
      col.push(termArgNameLists[rowIdx][colIdx]);
    }
    const uniqueNames = copyWithoutDuplicates(col);
    argumentNameList.push(uniqueNames.join("_or_"));
  }
  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};
Seq.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  let argumentNameList = [];
  this.factors.forEach((factor) => {
    const factorArgumentNameList = factor.toArgumentNameList(firstArgIndex, true);
    argumentNameList = argumentNameList.concat(factorArgumentNameList);
    firstArgIndex += factorArgumentNameList.length;
  });
  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};
Iter.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  const argumentNameList = this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map(
    (exprArgumentString) => exprArgumentString[exprArgumentString.length - 1] === "s" ? exprArgumentString + "es" : exprArgumentString + "s"
  );
  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};
Opt.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map((argName) => {
    return "opt" + argName[0].toUpperCase() + argName.slice(1);
  });
};
Not.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return [];
};
Lookahead.prototype.toArgumentNameList = Lex.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck);
};
Apply.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return [this.ruleName];
};
UnicodeChar.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ["$" + firstArgIndex];
};
Param.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ["param" + this.index];
};
PExpr.prototype.toDisplayString = abstract("toDisplayString");
Alt.prototype.toDisplayString = Seq.prototype.toDisplayString = function() {
  if (this.source) {
    return this.source.trimmed().contents;
  }
  return "[" + this.constructor.name + "]";
};
any.toDisplayString = end.toDisplayString = Iter.prototype.toDisplayString = Not.prototype.toDisplayString = Lookahead.prototype.toDisplayString = Lex.prototype.toDisplayString = Terminal.prototype.toDisplayString = Range.prototype.toDisplayString = Param.prototype.toDisplayString = function() {
  return this.toString();
};
Apply.prototype.toDisplayString = function() {
  if (this.args.length > 0) {
    const ps = this.args.map((arg) => arg.toDisplayString());
    return this.ruleName + "<" + ps.join(",") + ">";
  } else {
    return this.ruleName;
  }
};
UnicodeChar.prototype.toDisplayString = function() {
  return "Unicode [" + this.categoryOrProp + "] character";
};
function isValidType(type) {
  return type === "description" || type === "string" || type === "code";
}
class Failure {
  constructor(pexpr, text, type) {
    if (!isValidType(type)) {
      throw new Error("invalid Failure type: " + type);
    }
    this.pexpr = pexpr;
    this.text = text;
    this.type = type;
    this.fluffy = false;
  }
  getPExpr() {
    return this.pexpr;
  }
  getText() {
    return this.text;
  }
  getType() {
    return this.type;
  }
  isDescription() {
    return this.type === "description";
  }
  isStringTerminal() {
    return this.type === "string";
  }
  isCode() {
    return this.type === "code";
  }
  isFluffy() {
    return this.fluffy;
  }
  makeFluffy() {
    this.fluffy = true;
  }
  clearFluffy() {
    this.fluffy = false;
  }
  subsumes(that) {
    return this.getText() === that.getText() && this.type === that.type && (!this.isFluffy() || this.isFluffy() && that.isFluffy());
  }
  toString() {
    return this.type === "string" ? JSON.stringify(this.getText()) : this.getText();
  }
  clone() {
    const failure = new Failure(this.pexpr, this.text, this.type);
    if (this.isFluffy()) {
      failure.makeFluffy();
    }
    return failure;
  }
  toKey() {
    return this.toString() + "#" + this.type;
  }
}
PExpr.prototype.toFailure = abstract("toFailure");
any.toFailure = function(grammar2) {
  return new Failure(this, "any object", "description");
};
end.toFailure = function(grammar2) {
  return new Failure(this, "end of input", "description");
};
Terminal.prototype.toFailure = function(grammar2) {
  return new Failure(this, this.obj, "string");
};
Range.prototype.toFailure = function(grammar2) {
  return new Failure(this, JSON.stringify(this.from) + ".." + JSON.stringify(this.to), "code");
};
Not.prototype.toFailure = function(grammar2) {
  const description = this.expr === any ? "nothing" : "not " + this.expr.toFailure(grammar2);
  return new Failure(this, description, "description");
};
Lookahead.prototype.toFailure = function(grammar2) {
  return this.expr.toFailure(grammar2);
};
Apply.prototype.toFailure = function(grammar2) {
  let { description } = grammar2.rules[this.ruleName];
  if (!description) {
    const article = /^[aeiouAEIOU]/.test(this.ruleName) ? "an" : "a";
    description = article + " " + this.ruleName;
  }
  return new Failure(this, description, "description");
};
UnicodeChar.prototype.toFailure = function(grammar2) {
  return new Failure(this, "a Unicode [" + this.categoryOrProp + "] character", "description");
};
Alt.prototype.toFailure = function(grammar2) {
  const fs2 = this.terms.map((t) => t.toFailure(grammar2));
  const description = "(" + fs2.join(" or ") + ")";
  return new Failure(this, description, "description");
};
Seq.prototype.toFailure = function(grammar2) {
  const fs2 = this.factors.map((f) => f.toFailure(grammar2));
  const description = "(" + fs2.join(" ") + ")";
  return new Failure(this, description, "description");
};
Iter.prototype.toFailure = function(grammar2) {
  const description = "(" + this.expr.toFailure(grammar2) + this.operator + ")";
  return new Failure(this, description, "description");
};
PExpr.prototype.toString = abstract("toString");
any.toString = function() {
  return "any";
};
end.toString = function() {
  return "end";
};
Terminal.prototype.toString = function() {
  return JSON.stringify(this.obj);
};
Range.prototype.toString = function() {
  return JSON.stringify(this.from) + ".." + JSON.stringify(this.to);
};
Param.prototype.toString = function() {
  return "$" + this.index;
};
Lex.prototype.toString = function() {
  return "#(" + this.expr.toString() + ")";
};
Alt.prototype.toString = function() {
  return this.terms.length === 1 ? this.terms[0].toString() : "(" + this.terms.map((term) => term.toString()).join(" | ") + ")";
};
Seq.prototype.toString = function() {
  return this.factors.length === 1 ? this.factors[0].toString() : "(" + this.factors.map((factor) => factor.toString()).join(" ") + ")";
};
Iter.prototype.toString = function() {
  return this.expr + this.operator;
};
Not.prototype.toString = function() {
  return "~" + this.expr;
};
Lookahead.prototype.toString = function() {
  return "&" + this.expr;
};
Apply.prototype.toString = function() {
  if (this.args.length > 0) {
    const ps = this.args.map((arg) => arg.toString());
    return this.ruleName + "<" + ps.join(",") + ">";
  } else {
    return this.ruleName;
  }
};
UnicodeChar.prototype.toString = function() {
  return "\\p{" + this.categoryOrProp + "}";
};
class CaseInsensitiveTerminal extends PExpr {
  constructor(param) {
    super();
    this.obj = param;
  }
  _getString(state) {
    const terminal = state.currentApplication().args[this.obj.index];
    assert(terminal instanceof Terminal, "expected a Terminal expression");
    return terminal.obj;
  }
  // Implementation of the PExpr API
  allowsSkippingPrecedingSpace() {
    return true;
  }
  eval(state) {
    const { inputStream } = state;
    const origPos = inputStream.pos;
    const matchStr = this._getString(state);
    if (!inputStream.matchString(matchStr, true)) {
      state.processFailure(origPos, this);
      return false;
    } else {
      state.pushBinding(new TerminalNode(matchStr.length), origPos);
      return true;
    }
  }
  getArity() {
    return 1;
  }
  substituteParams(actuals) {
    return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
  }
  toDisplayString() {
    return this.obj.toDisplayString() + " (case-insensitive)";
  }
  toFailure(grammar2) {
    return new Failure(
      this,
      this.obj.toFailure(grammar2) + " (case-insensitive)",
      "description"
    );
  }
  _isNullable(grammar2, memo) {
    return this.obj._isNullable(grammar2, memo);
  }
}
let builtInApplySyntacticBody;
awaitBuiltInRules((builtInRules) => {
  builtInApplySyntacticBody = builtInRules.rules.applySyntactic.body;
});
const applySpaces = new Apply("spaces");
class MatchState {
  constructor(matcher, startExpr, optPositionToRecordFailures) {
    this.matcher = matcher;
    this.startExpr = startExpr;
    this.grammar = matcher.grammar;
    this.input = matcher.getInput();
    this.inputStream = new InputStream(this.input);
    this.memoTable = matcher._memoTable;
    this.userData = void 0;
    this.doNotMemoize = false;
    this._bindings = [];
    this._bindingOffsets = [];
    this._applicationStack = [];
    this._posStack = [0];
    this.inLexifiedContextStack = [false];
    this.rightmostFailurePosition = -1;
    this._rightmostFailurePositionStack = [];
    this._recordedFailuresStack = [];
    if (optPositionToRecordFailures !== void 0) {
      this.positionToRecordFailures = optPositionToRecordFailures;
      this.recordedFailures = /* @__PURE__ */ Object.create(null);
    }
  }
  posToOffset(pos) {
    return pos - this._posStack[this._posStack.length - 1];
  }
  enterApplication(posInfo, app) {
    this._posStack.push(this.inputStream.pos);
    this._applicationStack.push(app);
    this.inLexifiedContextStack.push(false);
    posInfo.enter(app);
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this.rightmostFailurePosition = -1;
  }
  exitApplication(posInfo, optNode) {
    const origPos = this._posStack.pop();
    this._applicationStack.pop();
    this.inLexifiedContextStack.pop();
    posInfo.exit();
    this.rightmostFailurePosition = Math.max(
      this.rightmostFailurePosition,
      this._rightmostFailurePositionStack.pop()
    );
    if (optNode) {
      this.pushBinding(optNode, origPos);
    }
  }
  enterLexifiedContext() {
    this.inLexifiedContextStack.push(true);
  }
  exitLexifiedContext() {
    this.inLexifiedContextStack.pop();
  }
  currentApplication() {
    return this._applicationStack[this._applicationStack.length - 1];
  }
  inSyntacticContext() {
    const currentApplication = this.currentApplication();
    if (currentApplication) {
      return currentApplication.isSyntactic() && !this.inLexifiedContext();
    } else {
      return this.startExpr.factors[0].isSyntactic();
    }
  }
  inLexifiedContext() {
    return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
  }
  skipSpaces() {
    this.pushFailuresInfo();
    this.eval(applySpaces);
    this.popBinding();
    this.popFailuresInfo();
    return this.inputStream.pos;
  }
  skipSpacesIfInSyntacticContext() {
    return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
  }
  maybeSkipSpacesBefore(expr) {
    if (expr.allowsSkippingPrecedingSpace() && expr !== applySpaces) {
      return this.skipSpacesIfInSyntacticContext();
    } else {
      return this.inputStream.pos;
    }
  }
  pushBinding(node, origPos) {
    this._bindings.push(node);
    this._bindingOffsets.push(this.posToOffset(origPos));
  }
  popBinding() {
    this._bindings.pop();
    this._bindingOffsets.pop();
  }
  numBindings() {
    return this._bindings.length;
  }
  truncateBindings(newLength) {
    while (this._bindings.length > newLength) {
      this.popBinding();
    }
  }
  getCurrentPosInfo() {
    return this.getPosInfo(this.inputStream.pos);
  }
  getPosInfo(pos) {
    let posInfo = this.memoTable[pos];
    if (!posInfo) {
      posInfo = this.memoTable[pos] = new PosInfo();
    }
    return posInfo;
  }
  processFailure(pos, expr) {
    this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, pos);
    if (this.recordedFailures && pos === this.positionToRecordFailures) {
      const app = this.currentApplication();
      if (app) {
        expr = expr.substituteParams(app.args);
      }
      this.recordFailure(expr.toFailure(this.grammar), false);
    }
  }
  recordFailure(failure, shouldCloneIfNew) {
    const key = failure.toKey();
    if (!this.recordedFailures[key]) {
      this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
    } else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) {
      this.recordedFailures[key].clearFluffy();
    }
  }
  recordFailures(failures, shouldCloneIfNew) {
    Object.keys(failures).forEach((key) => {
      this.recordFailure(failures[key], shouldCloneIfNew);
    });
  }
  cloneRecordedFailures() {
    if (!this.recordedFailures) {
      return void 0;
    }
    const ans = /* @__PURE__ */ Object.create(null);
    Object.keys(this.recordedFailures).forEach((key) => {
      ans[key] = this.recordedFailures[key].clone();
    });
    return ans;
  }
  getRightmostFailurePosition() {
    return this.rightmostFailurePosition;
  }
  _getRightmostFailureOffset() {
    return this.rightmostFailurePosition >= 0 ? this.posToOffset(this.rightmostFailurePosition) : -1;
  }
  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry(pos, expr) {
    const posInfo = this.memoTable[pos];
    if (posInfo && expr instanceof Apply) {
      const memoRec = posInfo.memo[expr.toMemoKey()];
      if (memoRec && memoRec.traceEntry) {
        const entry = memoRec.traceEntry.cloneWithExpr(expr);
        entry.isMemoized = true;
        return entry;
      }
    }
    return null;
  }
  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry(pos, expr, succeeded, bindings) {
    if (expr instanceof Apply) {
      const app = this.currentApplication();
      const actuals = app ? app.args : [];
      expr = expr.substituteParams(actuals);
    }
    return this.getMemoizedTraceEntry(pos, expr) || new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace);
  }
  isTracing() {
    return !!this.trace;
  }
  hasNecessaryInfo(memoRec) {
    if (this.trace && !memoRec.traceEntry) {
      return false;
    }
    if (this.recordedFailures && this.inputStream.pos + memoRec.rightmostFailureOffset === this.positionToRecordFailures) {
      return !!memoRec.failuresAtRightmostPosition;
    }
    return true;
  }
  useMemoizedResult(origPos, memoRec) {
    if (this.trace) {
      this.trace.push(memoRec.traceEntry);
    }
    const memoRecRightmostFailurePosition = this.inputStream.pos + memoRec.rightmostFailureOffset;
    this.rightmostFailurePosition = Math.max(
      this.rightmostFailurePosition,
      memoRecRightmostFailurePosition
    );
    if (this.recordedFailures && this.positionToRecordFailures === memoRecRightmostFailurePosition && memoRec.failuresAtRightmostPosition) {
      this.recordFailures(memoRec.failuresAtRightmostPosition, true);
    }
    this.inputStream.examinedLength = Math.max(
      this.inputStream.examinedLength,
      memoRec.examinedLength + origPos
    );
    if (memoRec.value) {
      this.inputStream.pos += memoRec.matchLength;
      this.pushBinding(memoRec.value, origPos);
      return true;
    }
    return false;
  }
  // Evaluate `expr` and return `true` if it succeeded, `false` otherwise. On success, `bindings`
  // will have `expr.getArity()` more elements than before, and the input stream's position may
  // have increased. On failure, `bindings` and position will be unchanged.
  eval(expr) {
    const { inputStream } = this;
    const origNumBindings = this._bindings.length;
    const origUserData = this.userData;
    let origRecordedFailures;
    if (this.recordedFailures) {
      origRecordedFailures = this.recordedFailures;
      this.recordedFailures = /* @__PURE__ */ Object.create(null);
    }
    const origPos = inputStream.pos;
    const memoPos = this.maybeSkipSpacesBefore(expr);
    let origTrace;
    if (this.trace) {
      origTrace = this.trace;
      this.trace = [];
    }
    const ans = expr.eval(this);
    if (this.trace) {
      const bindings = this._bindings.slice(origNumBindings);
      const traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings);
      traceEntry.isImplicitSpaces = expr === applySpaces;
      traceEntry.isRootNode = expr === this.startExpr;
      origTrace.push(traceEntry);
      this.trace = origTrace;
    }
    if (ans) {
      if (this.recordedFailures && inputStream.pos === this.positionToRecordFailures) {
        Object.keys(this.recordedFailures).forEach((key) => {
          this.recordedFailures[key].makeFluffy();
        });
      }
    } else {
      inputStream.pos = origPos;
      this.truncateBindings(origNumBindings);
      this.userData = origUserData;
    }
    if (this.recordedFailures) {
      this.recordFailures(origRecordedFailures, false);
    }
    if (expr === builtInApplySyntacticBody) {
      this.skipSpaces();
    }
    return ans;
  }
  getMatchResult() {
    this.grammar._setUpMatchState(this);
    this.eval(this.startExpr);
    let rightmostFailures;
    if (this.recordedFailures) {
      rightmostFailures = Object.keys(this.recordedFailures).map(
        (key) => this.recordedFailures[key]
      );
    }
    const cst = this._bindings[0];
    if (cst) {
      cst.grammar = this.grammar;
    }
    return new MatchResult(
      this.matcher,
      this.input,
      this.startExpr,
      cst,
      this._bindingOffsets[0],
      this.rightmostFailurePosition,
      rightmostFailures
    );
  }
  getTrace() {
    this.trace = [];
    const matchResult = this.getMatchResult();
    const rootTrace = this.trace[this.trace.length - 1];
    rootTrace.result = matchResult;
    return rootTrace;
  }
  pushFailuresInfo() {
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this._recordedFailuresStack.push(this.recordedFailures);
  }
  popFailuresInfo() {
    this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop();
    this.recordedFailures = this._recordedFailuresStack.pop();
  }
}
class Matcher {
  constructor(grammar2) {
    this.grammar = grammar2;
    this._memoTable = [];
    this._input = "";
    this._isMemoTableStale = false;
  }
  _resetMemoTable() {
    this._memoTable = [];
    this._isMemoTableStale = false;
  }
  getInput() {
    return this._input;
  }
  setInput(str) {
    if (this._input !== str) {
      this.replaceInputRange(0, this._input.length, str);
    }
    return this;
  }
  replaceInputRange(startIdx, endIdx, str) {
    const prevInput = this._input;
    const memoTable = this._memoTable;
    if (startIdx < 0 || startIdx > prevInput.length || endIdx < 0 || endIdx > prevInput.length || startIdx > endIdx) {
      throw new Error("Invalid indices: " + startIdx + " and " + endIdx);
    }
    this._input = prevInput.slice(0, startIdx) + str + prevInput.slice(endIdx);
    if (this._input !== prevInput && memoTable.length > 0) {
      this._isMemoTableStale = true;
    }
    const restOfMemoTable = memoTable.slice(endIdx);
    memoTable.length = startIdx;
    for (let idx = 0; idx < str.length; idx++) {
      memoTable.push(void 0);
    }
    for (const posInfo of restOfMemoTable) {
      memoTable.push(posInfo);
    }
    for (let pos = 0; pos < startIdx; pos++) {
      const posInfo = memoTable[pos];
      if (posInfo) {
        posInfo.clearObsoleteEntries(pos, startIdx);
      }
    }
    return this;
  }
  match(optStartApplicationStr, options = { incremental: true }) {
    return this._match(this._getStartExpr(optStartApplicationStr), {
      incremental: options.incremental,
      tracing: false
    });
  }
  trace(optStartApplicationStr, options = { incremental: true }) {
    return this._match(this._getStartExpr(optStartApplicationStr), {
      incremental: options.incremental,
      tracing: true
    });
  }
  _match(startExpr, options = {}) {
    const opts = {
      tracing: false,
      incremental: true,
      positionToRecordFailures: void 0,
      ...options
    };
    if (!opts.incremental) {
      this._resetMemoTable();
    } else if (this._isMemoTableStale && !this.grammar.supportsIncrementalParsing) {
      throw grammarDoesNotSupportIncrementalParsing(this.grammar);
    }
    const state = new MatchState(this, startExpr, opts.positionToRecordFailures);
    return opts.tracing ? state.getTrace() : state.getMatchResult();
  }
  /*
    Returns the starting expression for this Matcher's associated grammar. If
    `optStartApplicationStr` is specified, it is a string expressing a rule application in the
    grammar. If not specified, the grammar's default start rule will be used.
  */
  _getStartExpr(optStartApplicationStr) {
    const applicationStr = optStartApplicationStr || this.grammar.defaultStartRule;
    if (!applicationStr) {
      throw new Error("Missing start rule argument -- the grammar has no default start rule.");
    }
    const startApp = this.grammar.parseApplication(applicationStr);
    return new Seq([startApp, end]);
  }
}
const globalActionStack = [];
const hasOwnProperty = (x, prop) => Object.prototype.hasOwnProperty.call(x, prop);
class Wrapper {
  constructor(node, sourceInterval, baseInterval) {
    this._node = node;
    this.source = sourceInterval;
    this._baseInterval = baseInterval;
    if (node.isNonterminal()) {
      assert(sourceInterval === baseInterval);
    }
    this._childWrappers = [];
  }
  _forgetMemoizedResultFor(attributeName) {
    delete this._node[this._semantics.attributeKeys[attributeName]];
    this.children.forEach((child) => {
      child._forgetMemoizedResultFor(attributeName);
    });
  }
  // Returns the wrapper of the specified child node. Child wrappers are created lazily and
  // cached in the parent wrapper's `_childWrappers` instance variable.
  child(idx) {
    if (!(0 <= idx && idx < this._node.numChildren())) {
      return void 0;
    }
    let childWrapper = this._childWrappers[idx];
    if (!childWrapper) {
      const childNode = this._node.childAt(idx);
      const offset = this._node.childOffsets[idx];
      const source = this._baseInterval.subInterval(offset, childNode.matchLength);
      const base = childNode.isNonterminal() ? source : this._baseInterval;
      childWrapper = this._childWrappers[idx] = this._semantics.wrap(childNode, source, base);
    }
    return childWrapper;
  }
  // Returns an array containing the wrappers of all of the children of the node associated
  // with this wrapper.
  _children() {
    for (let idx = 0; idx < this._node.numChildren(); idx++) {
      this.child(idx);
    }
    return this._childWrappers;
  }
  // Returns `true` if the CST node associated with this wrapper corresponds to an iteration
  // expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
  isIteration() {
    return this._node.isIteration();
  }
  // Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
  // otherwise.
  isTerminal() {
    return this._node.isTerminal();
  }
  // Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
  // otherwise.
  isNonterminal() {
    return this._node.isNonterminal();
  }
  // Returns `true` if the CST node associated with this wrapper is a nonterminal node
  // corresponding to a syntactic rule, `false` otherwise.
  isSyntactic() {
    return this.isNonterminal() && this._node.isSyntactic();
  }
  // Returns `true` if the CST node associated with this wrapper is a nonterminal node
  // corresponding to a lexical rule, `false` otherwise.
  isLexical() {
    return this.isNonterminal() && this._node.isLexical();
  }
  // Returns `true` if the CST node associated with this wrapper is an iterator node
  // having either one or no child (? operator), `false` otherwise.
  // Otherwise, throws an exception.
  isOptional() {
    return this._node.isOptional();
  }
  // Create a new _iter wrapper in the same semantics as this wrapper.
  iteration(optChildWrappers) {
    const childWrappers = optChildWrappers || [];
    const childNodes = childWrappers.map((c) => c._node);
    const iter = new IterationNode(childNodes, [], -1, false);
    const wrapper = this._semantics.wrap(iter, null, null);
    wrapper._childWrappers = childWrappers;
    return wrapper;
  }
  // Returns an array containing the children of this CST node.
  get children() {
    return this._children();
  }
  // Returns the name of grammar rule that created this CST node.
  get ctorName() {
    return this._node.ctorName;
  }
  // Returns the number of children of this CST node.
  get numChildren() {
    return this._node.numChildren();
  }
  // Returns the contents of the input stream consumed by this CST node.
  get sourceString() {
    return this.source.contents;
  }
}
class Semantics {
  constructor(grammar2, superSemantics) {
    const self = this;
    this.grammar = grammar2;
    this.checkedActionDicts = false;
    this.Wrapper = class extends (superSemantics ? superSemantics.Wrapper : Wrapper) {
      constructor(node, sourceInterval, baseInterval) {
        super(node, sourceInterval, baseInterval);
        self.checkActionDictsIfHaventAlready();
        this._semantics = self;
      }
      toString() {
        return "[semantics wrapper for " + self.grammar.name + "]";
      }
    };
    this.super = superSemantics;
    if (superSemantics) {
      if (!(grammar2.equals(this.super.grammar) || grammar2._inheritsFrom(this.super.grammar))) {
        throw new Error(
          "Cannot extend a semantics for grammar '" + this.super.grammar.name + "' for use with grammar '" + grammar2.name + "' (not a sub-grammar)"
        );
      }
      this.operations = Object.create(this.super.operations);
      this.attributes = Object.create(this.super.attributes);
      this.attributeKeys = /* @__PURE__ */ Object.create(null);
      for (const attributeName in this.attributes) {
        Object.defineProperty(this.attributeKeys, attributeName, {
          value: uniqueId(attributeName)
        });
      }
    } else {
      this.operations = /* @__PURE__ */ Object.create(null);
      this.attributes = /* @__PURE__ */ Object.create(null);
      this.attributeKeys = /* @__PURE__ */ Object.create(null);
    }
  }
  toString() {
    return "[semantics for " + this.grammar.name + "]";
  }
  checkActionDictsIfHaventAlready() {
    if (!this.checkedActionDicts) {
      this.checkActionDicts();
      this.checkedActionDicts = true;
    }
  }
  // Checks that the action dictionaries for all operations and attributes in this semantics,
  // including the ones that were inherited from the super-semantics, agree with the grammar.
  // Throws an exception if one or more of them doesn't.
  checkActionDicts() {
    let name;
    for (name in this.operations) {
      this.operations[name].checkActionDict(this.grammar);
    }
    for (name in this.attributes) {
      this.attributes[name].checkActionDict(this.grammar);
    }
  }
  toRecipe(semanticsOnly) {
    function hasSuperSemantics(s2) {
      return s2.super !== Semantics.BuiltInSemantics._getSemantics();
    }
    let str = "(function(g) {\n";
    if (hasSuperSemantics(this)) {
      str += "  var semantics = " + this.super.toRecipe(true) + "(g";
      const superSemanticsGrammar = this.super.grammar;
      let relatedGrammar = this.grammar;
      while (relatedGrammar !== superSemanticsGrammar) {
        str += ".superGrammar";
        relatedGrammar = relatedGrammar.superGrammar;
      }
      str += ");\n";
      str += "  return g.extendSemantics(semantics)";
    } else {
      str += "  return g.createSemantics()";
    }
    ["Operation", "Attribute"].forEach((type) => {
      const semanticOperations = this[type.toLowerCase() + "s"];
      Object.keys(semanticOperations).forEach((name) => {
        const { actionDict, formals, builtInDefault } = semanticOperations[name];
        let signature = name;
        if (formals.length > 0) {
          signature += "(" + formals.join(", ") + ")";
        }
        let method;
        if (hasSuperSemantics(this) && this.super[type.toLowerCase() + "s"][name]) {
          method = "extend" + type;
        } else {
          method = "add" + type;
        }
        str += "\n    ." + method + "(" + JSON.stringify(signature) + ", {";
        const srcArray = [];
        Object.keys(actionDict).forEach((actionName) => {
          if (actionDict[actionName] !== builtInDefault) {
            let source = actionDict[actionName].toString().trim();
            source = source.replace(/^.*\(/, "function(");
            srcArray.push("\n      " + JSON.stringify(actionName) + ": " + source);
          }
        });
        str += srcArray.join(",") + "\n    })";
      });
    });
    str += ";\n  })";
    if (!semanticsOnly) {
      str = "(function() {\n  var grammar = this.fromRecipe(" + this.grammar.toRecipe() + ");\n  var semantics = " + str + "(grammar);\n  return semantics;\n});\n";
    }
    return str;
  }
  addOperationOrAttribute(type, signature, actionDict) {
    const typePlural = type + "s";
    const parsedNameAndFormalArgs = parseSignature(signature, type);
    const { name } = parsedNameAndFormalArgs;
    const { formals } = parsedNameAndFormalArgs;
    this.assertNewName(name, type);
    const builtInDefault = newDefaultAction(type, name, doIt);
    const realActionDict = { _default: builtInDefault };
    Object.keys(actionDict).forEach((name2) => {
      realActionDict[name2] = actionDict[name2];
    });
    const entry = type === "operation" ? new Operation(name, formals, realActionDict, builtInDefault) : new Attribute(name, realActionDict, builtInDefault);
    entry.checkActionDict(this.grammar);
    this[typePlural][name] = entry;
    function doIt(...args) {
      const thisThing = this._semantics[typePlural][name];
      if (arguments.length !== thisThing.formals.length) {
        throw new Error(
          "Invalid number of arguments passed to " + name + " " + type + " (expected " + thisThing.formals.length + ", got " + arguments.length + ")"
        );
      }
      const argsObj = /* @__PURE__ */ Object.create(null);
      for (const [idx, val] of Object.entries(args)) {
        const formal = thisThing.formals[idx];
        argsObj[formal] = val;
      }
      const oldArgs = this.args;
      this.args = argsObj;
      const ans = thisThing.execute(this._semantics, this);
      this.args = oldArgs;
      return ans;
    }
    if (type === "operation") {
      this.Wrapper.prototype[name] = doIt;
      this.Wrapper.prototype[name].toString = function() {
        return "[" + name + " operation]";
      };
    } else {
      Object.defineProperty(this.Wrapper.prototype, name, {
        get: doIt,
        configurable: true
        // So the property can be deleted.
      });
      Object.defineProperty(this.attributeKeys, name, {
        value: uniqueId(name)
      });
    }
  }
  extendOperationOrAttribute(type, name, actionDict) {
    const typePlural = type + "s";
    parseSignature(name, "attribute");
    if (!(this.super && name in this.super[typePlural])) {
      throw new Error(
        "Cannot extend " + type + " '" + name + "': did not inherit an " + type + " with that name"
      );
    }
    if (hasOwnProperty(this[typePlural], name)) {
      throw new Error("Cannot extend " + type + " '" + name + "' again");
    }
    const inheritedFormals = this[typePlural][name].formals;
    const inheritedActionDict = this[typePlural][name].actionDict;
    const newActionDict = Object.create(inheritedActionDict);
    Object.keys(actionDict).forEach((name2) => {
      newActionDict[name2] = actionDict[name2];
    });
    this[typePlural][name] = type === "operation" ? new Operation(name, inheritedFormals, newActionDict) : new Attribute(name, newActionDict);
    this[typePlural][name].checkActionDict(this.grammar);
  }
  assertNewName(name, type) {
    if (hasOwnProperty(Wrapper.prototype, name)) {
      throw new Error("Cannot add " + type + " '" + name + "': that's a reserved name");
    }
    if (name in this.operations) {
      throw new Error(
        "Cannot add " + type + " '" + name + "': an operation with that name already exists"
      );
    }
    if (name in this.attributes) {
      throw new Error(
        "Cannot add " + type + " '" + name + "': an attribute with that name already exists"
      );
    }
  }
  // Returns a wrapper for the given CST `node` in this semantics.
  // If `node` is already a wrapper, returns `node` itself.  // TODO: why is this needed?
  wrap(node, source, optBaseInterval) {
    const baseInterval = optBaseInterval || source;
    return node instanceof this.Wrapper ? node : new this.Wrapper(node, source, baseInterval);
  }
}
function parseSignature(signature, type) {
  if (!Semantics.prototypeGrammar) {
    assert(signature.indexOf("(") === -1);
    return {
      name: signature,
      formals: []
    };
  }
  const r = Semantics.prototypeGrammar.match(
    signature,
    type === "operation" ? "OperationSignature" : "AttributeSignature"
  );
  if (r.failed()) {
    throw new Error(r.message);
  }
  return Semantics.prototypeGrammarSemantics(r).parse();
}
function newDefaultAction(type, name, doIt) {
  return function(...children) {
    const thisThing = this._semantics.operations[name] || this._semantics.attributes[name];
    const args = thisThing.formals.map((formal) => this.args[formal]);
    if (!this.isIteration() && children.length === 1) {
      return doIt.apply(children[0], args);
    } else {
      throw missingSemanticAction(this.ctorName, name, type, globalActionStack);
    }
  };
}
Semantics.createSemantics = function(grammar2, optSuperSemantics) {
  const s2 = new Semantics(
    grammar2,
    optSuperSemantics !== void 0 ? optSuperSemantics : Semantics.BuiltInSemantics._getSemantics()
  );
  const proxy = function ASemantics(matchResult) {
    if (!(matchResult instanceof MatchResult)) {
      throw new TypeError(
        "Semantics expected a MatchResult, but got " + unexpectedObjToString(matchResult)
      );
    }
    if (matchResult.failed()) {
      throw new TypeError("cannot apply Semantics to " + matchResult.toString());
    }
    const cst = matchResult._cst;
    if (cst.grammar !== grammar2) {
      throw new Error(
        "Cannot use a MatchResult from grammar '" + cst.grammar.name + "' with a semantics for '" + grammar2.name + "'"
      );
    }
    const inputStream = new InputStream(matchResult.input);
    return s2.wrap(cst, inputStream.interval(matchResult._cstOffset, matchResult.input.length));
  };
  proxy.addOperation = function(signature, actionDict) {
    s2.addOperationOrAttribute("operation", signature, actionDict);
    return proxy;
  };
  proxy.extendOperation = function(name, actionDict) {
    s2.extendOperationOrAttribute("operation", name, actionDict);
    return proxy;
  };
  proxy.addAttribute = function(name, actionDict) {
    s2.addOperationOrAttribute("attribute", name, actionDict);
    return proxy;
  };
  proxy.extendAttribute = function(name, actionDict) {
    s2.extendOperationOrAttribute("attribute", name, actionDict);
    return proxy;
  };
  proxy._getActionDict = function(operationOrAttributeName) {
    const action = s2.operations[operationOrAttributeName] || s2.attributes[operationOrAttributeName];
    if (!action) {
      throw new Error(
        '"' + operationOrAttributeName + '" is not a valid operation or attribute name in this semantics for "' + grammar2.name + '"'
      );
    }
    return action.actionDict;
  };
  proxy._remove = function(operationOrAttributeName) {
    let semantic;
    if (operationOrAttributeName in s2.operations) {
      semantic = s2.operations[operationOrAttributeName];
      delete s2.operations[operationOrAttributeName];
    } else if (operationOrAttributeName in s2.attributes) {
      semantic = s2.attributes[operationOrAttributeName];
      delete s2.attributes[operationOrAttributeName];
    }
    delete s2.Wrapper.prototype[operationOrAttributeName];
    return semantic;
  };
  proxy.getOperationNames = function() {
    return Object.keys(s2.operations);
  };
  proxy.getAttributeNames = function() {
    return Object.keys(s2.attributes);
  };
  proxy.getGrammar = function() {
    return s2.grammar;
  };
  proxy.toRecipe = function(semanticsOnly) {
    return s2.toRecipe(semanticsOnly);
  };
  proxy.toString = s2.toString.bind(s2);
  proxy._getSemantics = function() {
    return s2;
  };
  return proxy;
};
class Operation {
  constructor(name, formals, actionDict, builtInDefault) {
    this.name = name;
    this.formals = formals;
    this.actionDict = actionDict;
    this.builtInDefault = builtInDefault;
  }
  checkActionDict(grammar2) {
    grammar2._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
  }
  // Execute this operation on the CST node associated with `nodeWrapper` in the context of the
  // given Semantics instance.
  execute(semantics2, nodeWrapper) {
    try {
      const { ctorName } = nodeWrapper._node;
      let actionFn = this.actionDict[ctorName];
      if (actionFn) {
        globalActionStack.push([this, ctorName]);
        return actionFn.apply(nodeWrapper, nodeWrapper._children());
      }
      if (nodeWrapper.isNonterminal()) {
        actionFn = this.actionDict._nonterminal;
        if (actionFn) {
          globalActionStack.push([this, "_nonterminal", ctorName]);
          return actionFn.apply(nodeWrapper, nodeWrapper._children());
        }
      }
      globalActionStack.push([this, "default action", ctorName]);
      return this.actionDict._default.apply(nodeWrapper, nodeWrapper._children());
    } finally {
      globalActionStack.pop();
    }
  }
}
Operation.prototype.typeName = "operation";
class Attribute extends Operation {
  constructor(name, actionDict, builtInDefault) {
    super(name, [], actionDict, builtInDefault);
  }
  execute(semantics2, nodeWrapper) {
    const node = nodeWrapper._node;
    const key = semantics2.attributeKeys[this.name];
    if (!hasOwnProperty(node, key)) {
      node[key] = Operation.prototype.execute.call(this, semantics2, nodeWrapper);
    }
    return node[key];
  }
}
Attribute.prototype.typeName = "attribute";
const SPECIAL_ACTION_NAMES = ["_iter", "_terminal", "_nonterminal", "_default"];
function getSortedRuleValues(grammar2) {
  return Object.keys(grammar2.rules).sort().map((name) => grammar2.rules[name]);
}
const jsonToJS = (str) => str.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
let ohmGrammar$1;
let buildGrammar$1;
class Grammar {
  constructor(name, superGrammar, rules, optDefaultStartRule) {
    this.name = name;
    this.superGrammar = superGrammar;
    this.rules = rules;
    if (optDefaultStartRule) {
      if (!(optDefaultStartRule in rules)) {
        throw new Error(
          "Invalid start rule: '" + optDefaultStartRule + "' is not a rule in grammar '" + name + "'"
        );
      }
      this.defaultStartRule = optDefaultStartRule;
    }
    this._matchStateInitializer = void 0;
    this.supportsIncrementalParsing = true;
  }
  matcher() {
    return new Matcher(this);
  }
  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn() {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  }
  equals(g) {
    if (this === g) {
      return true;
    }
    if (g == null || this.name !== g.name || this.defaultStartRule !== g.defaultStartRule || !(this.superGrammar === g.superGrammar || this.superGrammar.equals(g.superGrammar))) {
      return false;
    }
    const myRules = getSortedRuleValues(this);
    const otherRules = getSortedRuleValues(g);
    return myRules.length === otherRules.length && myRules.every((rule, i2) => {
      return rule.description === otherRules[i2].description && rule.formals.join(",") === otherRules[i2].formals.join(",") && rule.body.toString() === otherRules[i2].body.toString();
    });
  }
  match(input, optStartApplication) {
    const m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.match(optStartApplication);
  }
  trace(input, optStartApplication) {
    const m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.trace(optStartApplication);
  }
  createSemantics() {
    return Semantics.createSemantics(this);
  }
  extendSemantics(superSemantics) {
    return Semantics.createSemantics(this, superSemantics._getSemantics());
  }
  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict(what, name, actionDict) {
    const problems = [];
    for (const k in actionDict) {
      const v = actionDict[k];
      const isSpecialAction = SPECIAL_ACTION_NAMES.includes(k);
      if (!isSpecialAction && !(k in this.rules)) {
        problems.push(`'${k}' is not a valid semantic action for '${this.name}'`);
        continue;
      }
      if (typeof v !== "function") {
        problems.push(`'${k}' must be a function in an action dictionary for '${this.name}'`);
        continue;
      }
      const actual = v.length;
      const expected = this._topDownActionArity(k);
      if (actual !== expected) {
        let details;
        if (k === "_iter" || k === "_nonterminal") {
          details = `it should use a rest parameter, e.g. \`${k}(...children) {}\`. NOTE: this is new in Ohm v16 — see https://ohmjs.org/d/ati for details.`;
        } else {
          details = `expected ${expected}, got ${actual}`;
        }
        problems.push(`Semantic action '${k}' has the wrong arity: ${details}`);
      }
    }
    if (problems.length > 0) {
      const prettyProblems = problems.map((problem) => "- " + problem);
      const error = new Error(
        [
          `Found errors in the action dictionary of the '${name}' ${what}:`,
          ...prettyProblems
        ].join("\n")
      );
      error.problems = problems;
      throw error;
    }
  }
  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity(actionName) {
    return SPECIAL_ACTION_NAMES.includes(actionName) ? 0 : this.rules[actionName].body.getArity();
  }
  _inheritsFrom(grammar2) {
    let g = this.superGrammar;
    while (g) {
      if (g.equals(grammar2, true)) {
        return true;
      }
      g = g.superGrammar;
    }
    return false;
  }
  toRecipe(superGrammarExpr = void 0) {
    const metaInfo = {};
    if (this.source) {
      metaInfo.source = this.source.contents;
    }
    let startRule = null;
    if (this.defaultStartRule) {
      startRule = this.defaultStartRule;
    }
    const rules = {};
    Object.keys(this.rules).forEach((ruleName) => {
      const ruleInfo = this.rules[ruleName];
      const { body } = ruleInfo;
      const isDefinition = !this.superGrammar || !this.superGrammar.rules[ruleName];
      let operation;
      if (isDefinition) {
        operation = "define";
      } else {
        operation = body instanceof Extend ? "extend" : "override";
      }
      const metaInfo2 = {};
      if (ruleInfo.source && this.source) {
        const adjusted = ruleInfo.source.relativeTo(this.source);
        metaInfo2.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
      }
      const description = isDefinition ? ruleInfo.description : null;
      const bodyRecipe = body.outputRecipe(ruleInfo.formals, this.source);
      rules[ruleName] = [
        operation,
        // "define"/"extend"/"override"
        metaInfo2,
        description,
        ruleInfo.formals,
        bodyRecipe
      ];
    });
    let superGrammarOutput = "null";
    if (superGrammarExpr) {
      superGrammarOutput = superGrammarExpr;
    } else if (this.superGrammar && !this.superGrammar.isBuiltIn()) {
      superGrammarOutput = this.superGrammar.toRecipe();
    }
    const recipeElements = [
      ...["grammar", metaInfo, this.name].map(JSON.stringify),
      superGrammarOutput,
      ...[startRule, rules].map(JSON.stringify)
    ];
    return jsonToJS(`[${recipeElements.join(",")}]`);
  }
  // TODO: Come up with better names for these methods.
  // TODO: Write the analog of these methods for inherited attributes.
  toOperationActionDictionaryTemplate() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  }
  toAttributeActionDictionaryTemplate() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  }
  _toOperationOrAttributeActionDictionaryTemplate() {
    const sb = new StringBuffer();
    sb.append("{");
    let first = true;
    for (const ruleName in this.rules) {
      const { body } = this.rules[ruleName];
      if (first) {
        first = false;
      } else {
        sb.append(",");
      }
      sb.append("\n");
      sb.append("  ");
      this.addSemanticActionTemplate(ruleName, body, sb);
    }
    sb.append("\n}");
    return sb.contents();
  }
  addSemanticActionTemplate(ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(": function(");
    const arity = this._topDownActionArity(ruleName);
    sb.append(repeat("_", arity).join(", "));
    sb.append(") {\n");
    sb.append("  }");
  }
  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication(str) {
    let app;
    if (str.indexOf("<") === -1) {
      app = new Apply(str);
    } else {
      const cst = ohmGrammar$1.match(str, "Base_application");
      app = buildGrammar$1(cst, {});
    }
    if (!(app.ruleName in this.rules)) {
      throw undeclaredRule(app.ruleName, this.name);
    }
    const { formals } = this.rules[app.ruleName];
    if (formals.length !== app.args.length) {
      const { source } = this.rules[app.ruleName];
      throw wrongNumberOfParameters(
        app.ruleName,
        formals.length,
        app.args.length,
        source
      );
    }
    return app;
  }
  _setUpMatchState(state) {
    if (this._matchStateInitializer) {
      this._matchStateInitializer(state);
    }
  }
}
Grammar.ProtoBuiltInRules = new Grammar(
  "ProtoBuiltInRules",
  // name
  void 0,
  // supergrammar
  {
    any: {
      body: any,
      formals: [],
      description: "any character",
      primitive: true
    },
    end: {
      body: end,
      formals: [],
      description: "end of input",
      primitive: true
    },
    caseInsensitive: {
      body: new CaseInsensitiveTerminal(new Param(0)),
      formals: ["str"],
      primitive: true
    },
    lower: {
      body: new UnicodeChar("Ll"),
      formals: [],
      description: "a lowercase letter",
      primitive: true
    },
    upper: {
      body: new UnicodeChar("Lu"),
      formals: [],
      description: "an uppercase letter",
      primitive: true
    },
    // Union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
    unicodeLtmo: {
      body: new UnicodeChar("Ltmo"),
      formals: [],
      description: "a Unicode character in Lt, Lm, or Lo",
      primitive: true
    },
    // These rules are not truly primitive (they could be written in userland) but are defined
    // here for bootstrapping purposes.
    spaces: {
      body: new Star(new Apply("space")),
      formals: []
    },
    space: {
      body: new Range("\0", " "),
      formals: [],
      description: "a space"
    }
  }
);
Grammar.initApplicationParser = function(grammar2, builderFn) {
  ohmGrammar$1 = grammar2;
  buildGrammar$1 = builderFn;
};
class GrammarDecl {
  constructor(name) {
    this.name = name;
  }
  // Helpers
  sourceInterval(startIdx, endIdx) {
    return this.source.subInterval(startIdx, endIdx - startIdx);
  }
  ensureSuperGrammar() {
    if (!this.superGrammar) {
      this.withSuperGrammar(
        // TODO: The conditional expression below is an ugly hack. It's kind of ok because
        // I doubt anyone will ever try to declare a grammar called `BuiltInRules`. Still,
        // we should try to find a better way to do this.
        this.name === "BuiltInRules" ? Grammar.ProtoBuiltInRules : Grammar.BuiltInRules
      );
    }
    return this.superGrammar;
  }
  ensureSuperGrammarRuleForOverriding(name, source) {
    const ruleInfo = this.ensureSuperGrammar().rules[name];
    if (!ruleInfo) {
      throw cannotOverrideUndeclaredRule(name, this.superGrammar.name, source);
    }
    return ruleInfo;
  }
  installOverriddenOrExtendedRule(name, formals, body, source) {
    const duplicateParameterNames$1 = getDuplicates(formals);
    if (duplicateParameterNames$1.length > 0) {
      throw duplicateParameterNames(name, duplicateParameterNames$1, source);
    }
    const ruleInfo = this.ensureSuperGrammar().rules[name];
    const expectedFormals = ruleInfo.formals;
    const expectedNumFormals = expectedFormals ? expectedFormals.length : 0;
    if (formals.length !== expectedNumFormals) {
      throw wrongNumberOfParameters(name, expectedNumFormals, formals.length, source);
    }
    return this.install(name, formals, body, ruleInfo.description, source);
  }
  install(name, formals, body, description, source, primitive = false) {
    this.rules[name] = {
      body: body.introduceParams(formals),
      formals,
      description,
      source,
      primitive
    };
    return this;
  }
  // Stuff that you should only do once
  withSuperGrammar(superGrammar) {
    if (this.superGrammar) {
      throw new Error("the super grammar of a GrammarDecl cannot be set more than once");
    }
    this.superGrammar = superGrammar;
    this.rules = Object.create(superGrammar.rules);
    if (!superGrammar.isBuiltIn()) {
      this.defaultStartRule = superGrammar.defaultStartRule;
    }
    return this;
  }
  withDefaultStartRule(ruleName) {
    this.defaultStartRule = ruleName;
    return this;
  }
  withSource(source) {
    this.source = new InputStream(source).interval(0, source.length);
    return this;
  }
  // Creates a Grammar instance, and if it passes the sanity checks, returns it.
  build() {
    const grammar2 = new Grammar(
      this.name,
      this.ensureSuperGrammar(),
      this.rules,
      this.defaultStartRule
    );
    grammar2._matchStateInitializer = grammar2.superGrammar._matchStateInitializer;
    grammar2.supportsIncrementalParsing = grammar2.superGrammar.supportsIncrementalParsing;
    const grammarErrors = [];
    let grammarHasInvalidApplications = false;
    Object.keys(grammar2.rules).forEach((ruleName) => {
      const { body } = grammar2.rules[ruleName];
      try {
        body.assertChoicesHaveUniformArity(ruleName);
      } catch (e) {
        grammarErrors.push(e);
      }
      try {
        body.assertAllApplicationsAreValid(ruleName, grammar2);
      } catch (e) {
        grammarErrors.push(e);
        grammarHasInvalidApplications = true;
      }
    });
    if (!grammarHasInvalidApplications) {
      Object.keys(grammar2.rules).forEach((ruleName) => {
        const { body } = grammar2.rules[ruleName];
        try {
          body.assertIteratedExprsAreNotNullable(grammar2, []);
        } catch (e) {
          grammarErrors.push(e);
        }
      });
    }
    if (grammarErrors.length > 0) {
      throwErrors(grammarErrors);
    }
    if (this.source) {
      grammar2.source = this.source;
    }
    return grammar2;
  }
  // Rule declarations
  define(name, formals, body, description, source, primitive) {
    this.ensureSuperGrammar();
    if (this.superGrammar.rules[name]) {
      throw duplicateRuleDeclaration(name, this.name, this.superGrammar.name, source);
    } else if (this.rules[name]) {
      throw duplicateRuleDeclaration(name, this.name, this.name, source);
    }
    const duplicateParameterNames$1 = getDuplicates(formals);
    if (duplicateParameterNames$1.length > 0) {
      throw duplicateParameterNames(name, duplicateParameterNames$1, source);
    }
    return this.install(name, formals, body, description, source, primitive);
  }
  override(name, formals, body, descIgnored, source) {
    this.ensureSuperGrammarRuleForOverriding(name, source);
    this.installOverriddenOrExtendedRule(name, formals, body, source);
    return this;
  }
  extend(name, formals, fragment, descIgnored, source) {
    const ruleInfo = this.ensureSuperGrammar().rules[name];
    if (!ruleInfo) {
      throw cannotExtendUndeclaredRule(name, this.superGrammar.name, source);
    }
    const body = new Extend(this.superGrammar, name, fragment);
    body.source = fragment.source;
    this.installOverriddenOrExtendedRule(name, formals, body, source);
    return this;
  }
}
class Builder {
  constructor() {
    this.currentDecl = null;
    this.currentRuleName = null;
  }
  newGrammar(name) {
    return new GrammarDecl(name);
  }
  grammar(metaInfo, name, superGrammar, defaultStartRule, rules) {
    const gDecl = new GrammarDecl(name);
    if (superGrammar) {
      gDecl.withSuperGrammar(
        superGrammar instanceof Grammar ? superGrammar : this.fromRecipe(superGrammar)
      );
    }
    if (defaultStartRule) {
      gDecl.withDefaultStartRule(defaultStartRule);
    }
    if (metaInfo && metaInfo.source) {
      gDecl.withSource(metaInfo.source);
    }
    this.currentDecl = gDecl;
    Object.keys(rules).forEach((ruleName) => {
      this.currentRuleName = ruleName;
      const ruleRecipe = rules[ruleName];
      const action = ruleRecipe[0];
      const metaInfo2 = ruleRecipe[1];
      const description = ruleRecipe[2];
      const formals = ruleRecipe[3];
      const body = this.fromRecipe(ruleRecipe[4]);
      let source;
      if (gDecl.source && metaInfo2 && metaInfo2.sourceInterval) {
        source = gDecl.source.subInterval(
          metaInfo2.sourceInterval[0],
          metaInfo2.sourceInterval[1] - metaInfo2.sourceInterval[0]
        );
      }
      gDecl[action](ruleName, formals, body, description, source);
    });
    this.currentRuleName = this.currentDecl = null;
    return gDecl.build();
  }
  terminal(x) {
    return new Terminal(x);
  }
  range(from, to) {
    return new Range(from, to);
  }
  param(index) {
    return new Param(index);
  }
  alt(...termArgs) {
    let terms = [];
    for (let arg of termArgs) {
      if (!(arg instanceof PExpr)) {
        arg = this.fromRecipe(arg);
      }
      if (arg instanceof Alt) {
        terms = terms.concat(arg.terms);
      } else {
        terms.push(arg);
      }
    }
    return terms.length === 1 ? terms[0] : new Alt(terms);
  }
  seq(...factorArgs) {
    let factors = [];
    for (let arg of factorArgs) {
      if (!(arg instanceof PExpr)) {
        arg = this.fromRecipe(arg);
      }
      if (arg instanceof Seq) {
        factors = factors.concat(arg.factors);
      } else {
        factors.push(arg);
      }
    }
    return factors.length === 1 ? factors[0] : new Seq(factors);
  }
  star(expr) {
    if (!(expr instanceof PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new Star(expr);
  }
  plus(expr) {
    if (!(expr instanceof PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new Plus(expr);
  }
  opt(expr) {
    if (!(expr instanceof PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new Opt(expr);
  }
  not(expr) {
    if (!(expr instanceof PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new Not(expr);
  }
  lookahead(expr) {
    if (!(expr instanceof PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new Lookahead(expr);
  }
  lex(expr) {
    if (!(expr instanceof PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new Lex(expr);
  }
  app(ruleName, optParams) {
    if (optParams && optParams.length > 0) {
      optParams = optParams.map(function(param) {
        return param instanceof PExpr ? param : this.fromRecipe(param);
      }, this);
    }
    return new Apply(ruleName, optParams);
  }
  // Note that unlike other methods in this class, this method cannot be used as a
  // convenience constructor. It only works with recipes, because it relies on
  // `this.currentDecl` and `this.currentRuleName` being set.
  splice(beforeTerms, afterTerms) {
    return new Splice(
      this.currentDecl.superGrammar,
      this.currentRuleName,
      beforeTerms.map((term) => this.fromRecipe(term)),
      afterTerms.map((term) => this.fromRecipe(term))
    );
  }
  fromRecipe(recipe) {
    const args = recipe[0] === "grammar" ? recipe.slice(1) : recipe.slice(2);
    const result = this[recipe[0]](...args);
    const metaInfo = recipe[1];
    if (metaInfo) {
      if (metaInfo.sourceInterval && this.currentDecl) {
        result.withSource(this.currentDecl.sourceInterval(...metaInfo.sourceInterval));
      }
    }
    return result;
  }
}
function makeRecipe(recipe) {
  if (typeof recipe === "function") {
    return recipe.call(new Builder());
  } else {
    if (typeof recipe === "string") {
      recipe = JSON.parse(recipe);
    }
    return new Builder().fromRecipe(recipe);
  }
}
const BuiltInRules = makeRecipe(["grammar", { "source": 'BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = "0".."9"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | "a".."f"\n    | "A".."F"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n  // Allows a syntactic rule application within a lexical context.\n  applySyntactic<app> = app\n}' }, "BuiltInRules", null, null, { "alnum": ["define", { "sourceInterval": [18, 78] }, "an alpha-numeric character", [], ["alt", { "sourceInterval": [60, 78] }, ["app", { "sourceInterval": [60, 66] }, "letter", []], ["app", { "sourceInterval": [73, 78] }, "digit", []]]], "letter": ["define", { "sourceInterval": [82, 142] }, "a letter", [], ["alt", { "sourceInterval": [107, 142] }, ["app", { "sourceInterval": [107, 112] }, "lower", []], ["app", { "sourceInterval": [119, 124] }, "upper", []], ["app", { "sourceInterval": [131, 142] }, "unicodeLtmo", []]]], "digit": ["define", { "sourceInterval": [146, 177] }, "a digit", [], ["range", { "sourceInterval": [169, 177] }, "0", "9"]], "hexDigit": ["define", { "sourceInterval": [181, 254] }, "a hexadecimal digit", [], ["alt", { "sourceInterval": [219, 254] }, ["app", { "sourceInterval": [219, 224] }, "digit", []], ["range", { "sourceInterval": [231, 239] }, "a", "f"], ["range", { "sourceInterval": [246, 254] }, "A", "F"]]], "ListOf": ["define", { "sourceInterval": [258, 336] }, null, ["elem", "sep"], ["alt", { "sourceInterval": [282, 336] }, ["app", { "sourceInterval": [282, 307] }, "NonemptyListOf", [["param", { "sourceInterval": [297, 301] }, 0], ["param", { "sourceInterval": [303, 306] }, 1]]], ["app", { "sourceInterval": [314, 336] }, "EmptyListOf", [["param", { "sourceInterval": [326, 330] }, 0], ["param", { "sourceInterval": [332, 335] }, 1]]]]], "NonemptyListOf": ["define", { "sourceInterval": [340, 388] }, null, ["elem", "sep"], ["seq", { "sourceInterval": [372, 388] }, ["param", { "sourceInterval": [372, 376] }, 0], ["star", { "sourceInterval": [377, 388] }, ["seq", { "sourceInterval": [378, 386] }, ["param", { "sourceInterval": [378, 381] }, 1], ["param", { "sourceInterval": [382, 386] }, 0]]]]], "EmptyListOf": ["define", { "sourceInterval": [392, 434] }, null, ["elem", "sep"], ["seq", { "sourceInterval": [438, 438] }]], "listOf": ["define", { "sourceInterval": [438, 516] }, null, ["elem", "sep"], ["alt", { "sourceInterval": [462, 516] }, ["app", { "sourceInterval": [462, 487] }, "nonemptyListOf", [["param", { "sourceInterval": [477, 481] }, 0], ["param", { "sourceInterval": [483, 486] }, 1]]], ["app", { "sourceInterval": [494, 516] }, "emptyListOf", [["param", { "sourceInterval": [506, 510] }, 0], ["param", { "sourceInterval": [512, 515] }, 1]]]]], "nonemptyListOf": ["define", { "sourceInterval": [520, 568] }, null, ["elem", "sep"], ["seq", { "sourceInterval": [552, 568] }, ["param", { "sourceInterval": [552, 556] }, 0], ["star", { "sourceInterval": [557, 568] }, ["seq", { "sourceInterval": [558, 566] }, ["param", { "sourceInterval": [558, 561] }, 1], ["param", { "sourceInterval": [562, 566] }, 0]]]]], "emptyListOf": ["define", { "sourceInterval": [572, 682] }, null, ["elem", "sep"], ["seq", { "sourceInterval": [685, 685] }]], "applySyntactic": ["define", { "sourceInterval": [685, 710] }, null, ["app"], ["param", { "sourceInterval": [707, 710] }, 0]] }]);
Grammar.BuiltInRules = BuiltInRules;
announceBuiltInRules(Grammar.BuiltInRules);
const ohmGrammar = makeRecipe(["grammar", { "source": `Ohm {

  Grammars
    = Grammar*

  Grammar
    = ident SuperGrammar? "{" Rule* "}"

  SuperGrammar
    = "<:" ident

  Rule
    = ident Formals? ruleDescr? "="  RuleBody  -- define
    | ident Formals?            ":=" OverrideRuleBody  -- override
    | ident Formals?            "+=" RuleBody  -- extend

  RuleBody
    = "|"? NonemptyListOf<TopLevelTerm, "|">

  TopLevelTerm
    = Seq caseName  -- inline
    | Seq

  OverrideRuleBody
    = "|"? NonemptyListOf<OverrideTopLevelTerm, "|">

  OverrideTopLevelTerm
    = "..."  -- superSplice
    | TopLevelTerm

  Formals
    = "<" ListOf<ident, ","> ">"

  Params
    = "<" ListOf<Seq, ","> ">"

  Alt
    = NonemptyListOf<Seq, "|">

  Seq
    = Iter*

  Iter
    = Pred "*"  -- star
    | Pred "+"  -- plus
    | Pred "?"  -- opt
    | Pred

  Pred
    = "~" Lex  -- not
    | "&" Lex  -- lookahead
    | Lex

  Lex
    = "#" Base  -- lex
    | Base

  Base
    = ident Params? ~(ruleDescr? "=" | ":=" | "+=")  -- application
    | oneCharTerminal ".." oneCharTerminal           -- range
    | terminal                                       -- terminal
    | "(" Alt ")"                                    -- paren

  ruleDescr  (a rule description)
    = "(" ruleDescrText ")"

  ruleDescrText
    = (~")" any)*

  caseName
    = "--" (~"\\n" space)* name (~"\\n" space)* ("\\n" | &"}")

  name  (a name)
    = nameFirst nameRest*

  nameFirst
    = "_"
    | letter

  nameRest
    = "_"
    | alnum

  ident  (an identifier)
    = name

  terminal
    = "\\"" terminalChar* "\\""

  oneCharTerminal
    = "\\"" terminalChar "\\""

  terminalChar
    = escapeChar
      | ~"\\\\" ~"\\"" ~"\\n" "\\u{0}".."\\u{10FFFF}"

  escapeChar  (an escape sequence)
    = "\\\\\\\\"                                     -- backslash
    | "\\\\\\""                                     -- doubleQuote
    | "\\\\\\'"                                     -- singleQuote
    | "\\\\b"                                      -- backspace
    | "\\\\n"                                      -- lineFeed
    | "\\\\r"                                      -- carriageReturn
    | "\\\\t"                                      -- tab
    | "\\\\u{" hexDigit hexDigit? hexDigit?
             hexDigit? hexDigit? hexDigit? "}"   -- unicodeCodePoint
    | "\\\\u" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape
    | "\\\\x" hexDigit hexDigit                    -- hexEscape

  space
   += comment

  comment
    = "//" (~"\\n" any)* &("\\n" | end)  -- singleLine
    | "/*" (~"*/" any)* "*/"  -- multiLine

  tokens = token*

  token = caseName | comment | ident | operator | punctuation | terminal | any

  operator = "<:" | "=" | ":=" | "+=" | "*" | "+" | "?" | "~" | "&"

  punctuation = "<" | ">" | "," | "--"
}` }, "Ohm", null, "Grammars", { "Grammars": ["define", { "sourceInterval": [9, 32] }, null, [], ["star", { "sourceInterval": [24, 32] }, ["app", { "sourceInterval": [24, 31] }, "Grammar", []]]], "Grammar": ["define", { "sourceInterval": [36, 83] }, null, [], ["seq", { "sourceInterval": [50, 83] }, ["app", { "sourceInterval": [50, 55] }, "ident", []], ["opt", { "sourceInterval": [56, 69] }, ["app", { "sourceInterval": [56, 68] }, "SuperGrammar", []]], ["terminal", { "sourceInterval": [70, 73] }, "{"], ["star", { "sourceInterval": [74, 79] }, ["app", { "sourceInterval": [74, 78] }, "Rule", []]], ["terminal", { "sourceInterval": [80, 83] }, "}"]]], "SuperGrammar": ["define", { "sourceInterval": [87, 116] }, null, [], ["seq", { "sourceInterval": [106, 116] }, ["terminal", { "sourceInterval": [106, 110] }, "<:"], ["app", { "sourceInterval": [111, 116] }, "ident", []]]], "Rule_define": ["define", { "sourceInterval": [131, 181] }, null, [], ["seq", { "sourceInterval": [131, 170] }, ["app", { "sourceInterval": [131, 136] }, "ident", []], ["opt", { "sourceInterval": [137, 145] }, ["app", { "sourceInterval": [137, 144] }, "Formals", []]], ["opt", { "sourceInterval": [146, 156] }, ["app", { "sourceInterval": [146, 155] }, "ruleDescr", []]], ["terminal", { "sourceInterval": [157, 160] }, "="], ["app", { "sourceInterval": [162, 170] }, "RuleBody", []]]], "Rule_override": ["define", { "sourceInterval": [188, 248] }, null, [], ["seq", { "sourceInterval": [188, 235] }, ["app", { "sourceInterval": [188, 193] }, "ident", []], ["opt", { "sourceInterval": [194, 202] }, ["app", { "sourceInterval": [194, 201] }, "Formals", []]], ["terminal", { "sourceInterval": [214, 218] }, ":="], ["app", { "sourceInterval": [219, 235] }, "OverrideRuleBody", []]]], "Rule_extend": ["define", { "sourceInterval": [255, 305] }, null, [], ["seq", { "sourceInterval": [255, 294] }, ["app", { "sourceInterval": [255, 260] }, "ident", []], ["opt", { "sourceInterval": [261, 269] }, ["app", { "sourceInterval": [261, 268] }, "Formals", []]], ["terminal", { "sourceInterval": [281, 285] }, "+="], ["app", { "sourceInterval": [286, 294] }, "RuleBody", []]]], "Rule": ["define", { "sourceInterval": [120, 305] }, null, [], ["alt", { "sourceInterval": [131, 305] }, ["app", { "sourceInterval": [131, 170] }, "Rule_define", []], ["app", { "sourceInterval": [188, 235] }, "Rule_override", []], ["app", { "sourceInterval": [255, 294] }, "Rule_extend", []]]], "RuleBody": ["define", { "sourceInterval": [309, 362] }, null, [], ["seq", { "sourceInterval": [324, 362] }, ["opt", { "sourceInterval": [324, 328] }, ["terminal", { "sourceInterval": [324, 327] }, "|"]], ["app", { "sourceInterval": [329, 362] }, "NonemptyListOf", [["app", { "sourceInterval": [344, 356] }, "TopLevelTerm", []], ["terminal", { "sourceInterval": [358, 361] }, "|"]]]]], "TopLevelTerm_inline": ["define", { "sourceInterval": [385, 408] }, null, [], ["seq", { "sourceInterval": [385, 397] }, ["app", { "sourceInterval": [385, 388] }, "Seq", []], ["app", { "sourceInterval": [389, 397] }, "caseName", []]]], "TopLevelTerm": ["define", { "sourceInterval": [366, 418] }, null, [], ["alt", { "sourceInterval": [385, 418] }, ["app", { "sourceInterval": [385, 397] }, "TopLevelTerm_inline", []], ["app", { "sourceInterval": [415, 418] }, "Seq", []]]], "OverrideRuleBody": ["define", { "sourceInterval": [422, 491] }, null, [], ["seq", { "sourceInterval": [445, 491] }, ["opt", { "sourceInterval": [445, 449] }, ["terminal", { "sourceInterval": [445, 448] }, "|"]], ["app", { "sourceInterval": [450, 491] }, "NonemptyListOf", [["app", { "sourceInterval": [465, 485] }, "OverrideTopLevelTerm", []], ["terminal", { "sourceInterval": [487, 490] }, "|"]]]]], "OverrideTopLevelTerm_superSplice": ["define", { "sourceInterval": [522, 543] }, null, [], ["terminal", { "sourceInterval": [522, 527] }, "..."]], "OverrideTopLevelTerm": ["define", { "sourceInterval": [495, 562] }, null, [], ["alt", { "sourceInterval": [522, 562] }, ["app", { "sourceInterval": [522, 527] }, "OverrideTopLevelTerm_superSplice", []], ["app", { "sourceInterval": [550, 562] }, "TopLevelTerm", []]]], "Formals": ["define", { "sourceInterval": [566, 606] }, null, [], ["seq", { "sourceInterval": [580, 606] }, ["terminal", { "sourceInterval": [580, 583] }, "<"], ["app", { "sourceInterval": [584, 602] }, "ListOf", [["app", { "sourceInterval": [591, 596] }, "ident", []], ["terminal", { "sourceInterval": [598, 601] }, ","]]], ["terminal", { "sourceInterval": [603, 606] }, ">"]]], "Params": ["define", { "sourceInterval": [610, 647] }, null, [], ["seq", { "sourceInterval": [623, 647] }, ["terminal", { "sourceInterval": [623, 626] }, "<"], ["app", { "sourceInterval": [627, 643] }, "ListOf", [["app", { "sourceInterval": [634, 637] }, "Seq", []], ["terminal", { "sourceInterval": [639, 642] }, ","]]], ["terminal", { "sourceInterval": [644, 647] }, ">"]]], "Alt": ["define", { "sourceInterval": [651, 685] }, null, [], ["app", { "sourceInterval": [661, 685] }, "NonemptyListOf", [["app", { "sourceInterval": [676, 679] }, "Seq", []], ["terminal", { "sourceInterval": [681, 684] }, "|"]]]], "Seq": ["define", { "sourceInterval": [689, 704] }, null, [], ["star", { "sourceInterval": [699, 704] }, ["app", { "sourceInterval": [699, 703] }, "Iter", []]]], "Iter_star": ["define", { "sourceInterval": [719, 736] }, null, [], ["seq", { "sourceInterval": [719, 727] }, ["app", { "sourceInterval": [719, 723] }, "Pred", []], ["terminal", { "sourceInterval": [724, 727] }, "*"]]], "Iter_plus": ["define", { "sourceInterval": [743, 760] }, null, [], ["seq", { "sourceInterval": [743, 751] }, ["app", { "sourceInterval": [743, 747] }, "Pred", []], ["terminal", { "sourceInterval": [748, 751] }, "+"]]], "Iter_opt": ["define", { "sourceInterval": [767, 783] }, null, [], ["seq", { "sourceInterval": [767, 775] }, ["app", { "sourceInterval": [767, 771] }, "Pred", []], ["terminal", { "sourceInterval": [772, 775] }, "?"]]], "Iter": ["define", { "sourceInterval": [708, 794] }, null, [], ["alt", { "sourceInterval": [719, 794] }, ["app", { "sourceInterval": [719, 727] }, "Iter_star", []], ["app", { "sourceInterval": [743, 751] }, "Iter_plus", []], ["app", { "sourceInterval": [767, 775] }, "Iter_opt", []], ["app", { "sourceInterval": [790, 794] }, "Pred", []]]], "Pred_not": ["define", { "sourceInterval": [809, 824] }, null, [], ["seq", { "sourceInterval": [809, 816] }, ["terminal", { "sourceInterval": [809, 812] }, "~"], ["app", { "sourceInterval": [813, 816] }, "Lex", []]]], "Pred_lookahead": ["define", { "sourceInterval": [831, 852] }, null, [], ["seq", { "sourceInterval": [831, 838] }, ["terminal", { "sourceInterval": [831, 834] }, "&"], ["app", { "sourceInterval": [835, 838] }, "Lex", []]]], "Pred": ["define", { "sourceInterval": [798, 862] }, null, [], ["alt", { "sourceInterval": [809, 862] }, ["app", { "sourceInterval": [809, 816] }, "Pred_not", []], ["app", { "sourceInterval": [831, 838] }, "Pred_lookahead", []], ["app", { "sourceInterval": [859, 862] }, "Lex", []]]], "Lex_lex": ["define", { "sourceInterval": [876, 892] }, null, [], ["seq", { "sourceInterval": [876, 884] }, ["terminal", { "sourceInterval": [876, 879] }, "#"], ["app", { "sourceInterval": [880, 884] }, "Base", []]]], "Lex": ["define", { "sourceInterval": [866, 903] }, null, [], ["alt", { "sourceInterval": [876, 903] }, ["app", { "sourceInterval": [876, 884] }, "Lex_lex", []], ["app", { "sourceInterval": [899, 903] }, "Base", []]]], "Base_application": ["define", { "sourceInterval": [918, 979] }, null, [], ["seq", { "sourceInterval": [918, 963] }, ["app", { "sourceInterval": [918, 923] }, "ident", []], ["opt", { "sourceInterval": [924, 931] }, ["app", { "sourceInterval": [924, 930] }, "Params", []]], ["not", { "sourceInterval": [932, 963] }, ["alt", { "sourceInterval": [934, 962] }, ["seq", { "sourceInterval": [934, 948] }, ["opt", { "sourceInterval": [934, 944] }, ["app", { "sourceInterval": [934, 943] }, "ruleDescr", []]], ["terminal", { "sourceInterval": [945, 948] }, "="]], ["terminal", { "sourceInterval": [951, 955] }, ":="], ["terminal", { "sourceInterval": [958, 962] }, "+="]]]]], "Base_range": ["define", { "sourceInterval": [986, 1041] }, null, [], ["seq", { "sourceInterval": [986, 1022] }, ["app", { "sourceInterval": [986, 1001] }, "oneCharTerminal", []], ["terminal", { "sourceInterval": [1002, 1006] }, ".."], ["app", { "sourceInterval": [1007, 1022] }, "oneCharTerminal", []]]], "Base_terminal": ["define", { "sourceInterval": [1048, 1106] }, null, [], ["app", { "sourceInterval": [1048, 1056] }, "terminal", []]], "Base_paren": ["define", { "sourceInterval": [1113, 1168] }, null, [], ["seq", { "sourceInterval": [1113, 1124] }, ["terminal", { "sourceInterval": [1113, 1116] }, "("], ["app", { "sourceInterval": [1117, 1120] }, "Alt", []], ["terminal", { "sourceInterval": [1121, 1124] }, ")"]]], "Base": ["define", { "sourceInterval": [907, 1168] }, null, [], ["alt", { "sourceInterval": [918, 1168] }, ["app", { "sourceInterval": [918, 963] }, "Base_application", []], ["app", { "sourceInterval": [986, 1022] }, "Base_range", []], ["app", { "sourceInterval": [1048, 1056] }, "Base_terminal", []], ["app", { "sourceInterval": [1113, 1124] }, "Base_paren", []]]], "ruleDescr": ["define", { "sourceInterval": [1172, 1231] }, "a rule description", [], ["seq", { "sourceInterval": [1210, 1231] }, ["terminal", { "sourceInterval": [1210, 1213] }, "("], ["app", { "sourceInterval": [1214, 1227] }, "ruleDescrText", []], ["terminal", { "sourceInterval": [1228, 1231] }, ")"]]], "ruleDescrText": ["define", { "sourceInterval": [1235, 1266] }, null, [], ["star", { "sourceInterval": [1255, 1266] }, ["seq", { "sourceInterval": [1256, 1264] }, ["not", { "sourceInterval": [1256, 1260] }, ["terminal", { "sourceInterval": [1257, 1260] }, ")"]], ["app", { "sourceInterval": [1261, 1264] }, "any", []]]]], "caseName": ["define", { "sourceInterval": [1270, 1338] }, null, [], ["seq", { "sourceInterval": [1285, 1338] }, ["terminal", { "sourceInterval": [1285, 1289] }, "--"], ["star", { "sourceInterval": [1290, 1304] }, ["seq", { "sourceInterval": [1291, 1302] }, ["not", { "sourceInterval": [1291, 1296] }, ["terminal", { "sourceInterval": [1292, 1296] }, "\n"]], ["app", { "sourceInterval": [1297, 1302] }, "space", []]]], ["app", { "sourceInterval": [1305, 1309] }, "name", []], ["star", { "sourceInterval": [1310, 1324] }, ["seq", { "sourceInterval": [1311, 1322] }, ["not", { "sourceInterval": [1311, 1316] }, ["terminal", { "sourceInterval": [1312, 1316] }, "\n"]], ["app", { "sourceInterval": [1317, 1322] }, "space", []]]], ["alt", { "sourceInterval": [1326, 1337] }, ["terminal", { "sourceInterval": [1326, 1330] }, "\n"], ["lookahead", { "sourceInterval": [1333, 1337] }, ["terminal", { "sourceInterval": [1334, 1337] }, "}"]]]]], "name": ["define", { "sourceInterval": [1342, 1382] }, "a name", [], ["seq", { "sourceInterval": [1363, 1382] }, ["app", { "sourceInterval": [1363, 1372] }, "nameFirst", []], ["star", { "sourceInterval": [1373, 1382] }, ["app", { "sourceInterval": [1373, 1381] }, "nameRest", []]]]], "nameFirst": ["define", { "sourceInterval": [1386, 1418] }, null, [], ["alt", { "sourceInterval": [1402, 1418] }, ["terminal", { "sourceInterval": [1402, 1405] }, "_"], ["app", { "sourceInterval": [1412, 1418] }, "letter", []]]], "nameRest": ["define", { "sourceInterval": [1422, 1452] }, null, [], ["alt", { "sourceInterval": [1437, 1452] }, ["terminal", { "sourceInterval": [1437, 1440] }, "_"], ["app", { "sourceInterval": [1447, 1452] }, "alnum", []]]], "ident": ["define", { "sourceInterval": [1456, 1489] }, "an identifier", [], ["app", { "sourceInterval": [1485, 1489] }, "name", []]], "terminal": ["define", { "sourceInterval": [1493, 1531] }, null, [], ["seq", { "sourceInterval": [1508, 1531] }, ["terminal", { "sourceInterval": [1508, 1512] }, '"'], ["star", { "sourceInterval": [1513, 1526] }, ["app", { "sourceInterval": [1513, 1525] }, "terminalChar", []]], ["terminal", { "sourceInterval": [1527, 1531] }, '"']]], "oneCharTerminal": ["define", { "sourceInterval": [1535, 1579] }, null, [], ["seq", { "sourceInterval": [1557, 1579] }, ["terminal", { "sourceInterval": [1557, 1561] }, '"'], ["app", { "sourceInterval": [1562, 1574] }, "terminalChar", []], ["terminal", { "sourceInterval": [1575, 1579] }, '"']]], "terminalChar": ["define", { "sourceInterval": [1583, 1660] }, null, [], ["alt", { "sourceInterval": [1602, 1660] }, ["app", { "sourceInterval": [1602, 1612] }, "escapeChar", []], ["seq", { "sourceInterval": [1621, 1660] }, ["not", { "sourceInterval": [1621, 1626] }, ["terminal", { "sourceInterval": [1622, 1626] }, "\\"]], ["not", { "sourceInterval": [1627, 1632] }, ["terminal", { "sourceInterval": [1628, 1632] }, '"']], ["not", { "sourceInterval": [1633, 1638] }, ["terminal", { "sourceInterval": [1634, 1638] }, "\n"]], ["range", { "sourceInterval": [1639, 1660] }, "\0", "􏿿"]]]], "escapeChar_backslash": ["define", { "sourceInterval": [1703, 1758] }, null, [], ["terminal", { "sourceInterval": [1703, 1709] }, "\\\\"]], "escapeChar_doubleQuote": ["define", { "sourceInterval": [1765, 1822] }, null, [], ["terminal", { "sourceInterval": [1765, 1771] }, '\\"']], "escapeChar_singleQuote": ["define", { "sourceInterval": [1829, 1886] }, null, [], ["terminal", { "sourceInterval": [1829, 1835] }, "\\'"]], "escapeChar_backspace": ["define", { "sourceInterval": [1893, 1948] }, null, [], ["terminal", { "sourceInterval": [1893, 1898] }, "\\b"]], "escapeChar_lineFeed": ["define", { "sourceInterval": [1955, 2009] }, null, [], ["terminal", { "sourceInterval": [1955, 1960] }, "\\n"]], "escapeChar_carriageReturn": ["define", { "sourceInterval": [2016, 2076] }, null, [], ["terminal", { "sourceInterval": [2016, 2021] }, "\\r"]], "escapeChar_tab": ["define", { "sourceInterval": [2083, 2132] }, null, [], ["terminal", { "sourceInterval": [2083, 2088] }, "\\t"]], "escapeChar_unicodeCodePoint": ["define", { "sourceInterval": [2139, 2243] }, null, [], ["seq", { "sourceInterval": [2139, 2221] }, ["terminal", { "sourceInterval": [2139, 2145] }, "\\u{"], ["app", { "sourceInterval": [2146, 2154] }, "hexDigit", []], ["opt", { "sourceInterval": [2155, 2164] }, ["app", { "sourceInterval": [2155, 2163] }, "hexDigit", []]], ["opt", { "sourceInterval": [2165, 2174] }, ["app", { "sourceInterval": [2165, 2173] }, "hexDigit", []]], ["opt", { "sourceInterval": [2188, 2197] }, ["app", { "sourceInterval": [2188, 2196] }, "hexDigit", []]], ["opt", { "sourceInterval": [2198, 2207] }, ["app", { "sourceInterval": [2198, 2206] }, "hexDigit", []]], ["opt", { "sourceInterval": [2208, 2217] }, ["app", { "sourceInterval": [2208, 2216] }, "hexDigit", []]], ["terminal", { "sourceInterval": [2218, 2221] }, "}"]]], "escapeChar_unicodeEscape": ["define", { "sourceInterval": [2250, 2309] }, null, [], ["seq", { "sourceInterval": [2250, 2291] }, ["terminal", { "sourceInterval": [2250, 2255] }, "\\u"], ["app", { "sourceInterval": [2256, 2264] }, "hexDigit", []], ["app", { "sourceInterval": [2265, 2273] }, "hexDigit", []], ["app", { "sourceInterval": [2274, 2282] }, "hexDigit", []], ["app", { "sourceInterval": [2283, 2291] }, "hexDigit", []]]], "escapeChar_hexEscape": ["define", { "sourceInterval": [2316, 2371] }, null, [], ["seq", { "sourceInterval": [2316, 2339] }, ["terminal", { "sourceInterval": [2316, 2321] }, "\\x"], ["app", { "sourceInterval": [2322, 2330] }, "hexDigit", []], ["app", { "sourceInterval": [2331, 2339] }, "hexDigit", []]]], "escapeChar": ["define", { "sourceInterval": [1664, 2371] }, "an escape sequence", [], ["alt", { "sourceInterval": [1703, 2371] }, ["app", { "sourceInterval": [1703, 1709] }, "escapeChar_backslash", []], ["app", { "sourceInterval": [1765, 1771] }, "escapeChar_doubleQuote", []], ["app", { "sourceInterval": [1829, 1835] }, "escapeChar_singleQuote", []], ["app", { "sourceInterval": [1893, 1898] }, "escapeChar_backspace", []], ["app", { "sourceInterval": [1955, 1960] }, "escapeChar_lineFeed", []], ["app", { "sourceInterval": [2016, 2021] }, "escapeChar_carriageReturn", []], ["app", { "sourceInterval": [2083, 2088] }, "escapeChar_tab", []], ["app", { "sourceInterval": [2139, 2221] }, "escapeChar_unicodeCodePoint", []], ["app", { "sourceInterval": [2250, 2291] }, "escapeChar_unicodeEscape", []], ["app", { "sourceInterval": [2316, 2339] }, "escapeChar_hexEscape", []]]], "space": ["extend", { "sourceInterval": [2375, 2394] }, null, [], ["app", { "sourceInterval": [2387, 2394] }, "comment", []]], "comment_singleLine": ["define", { "sourceInterval": [2412, 2458] }, null, [], ["seq", { "sourceInterval": [2412, 2443] }, ["terminal", { "sourceInterval": [2412, 2416] }, "//"], ["star", { "sourceInterval": [2417, 2429] }, ["seq", { "sourceInterval": [2418, 2427] }, ["not", { "sourceInterval": [2418, 2423] }, ["terminal", { "sourceInterval": [2419, 2423] }, "\n"]], ["app", { "sourceInterval": [2424, 2427] }, "any", []]]], ["lookahead", { "sourceInterval": [2430, 2443] }, ["alt", { "sourceInterval": [2432, 2442] }, ["terminal", { "sourceInterval": [2432, 2436] }, "\n"], ["app", { "sourceInterval": [2439, 2442] }, "end", []]]]]], "comment_multiLine": ["define", { "sourceInterval": [2465, 2501] }, null, [], ["seq", { "sourceInterval": [2465, 2487] }, ["terminal", { "sourceInterval": [2465, 2469] }, "/*"], ["star", { "sourceInterval": [2470, 2482] }, ["seq", { "sourceInterval": [2471, 2480] }, ["not", { "sourceInterval": [2471, 2476] }, ["terminal", { "sourceInterval": [2472, 2476] }, "*/"]], ["app", { "sourceInterval": [2477, 2480] }, "any", []]]], ["terminal", { "sourceInterval": [2483, 2487] }, "*/"]]], "comment": ["define", { "sourceInterval": [2398, 2501] }, null, [], ["alt", { "sourceInterval": [2412, 2501] }, ["app", { "sourceInterval": [2412, 2443] }, "comment_singleLine", []], ["app", { "sourceInterval": [2465, 2487] }, "comment_multiLine", []]]], "tokens": ["define", { "sourceInterval": [2505, 2520] }, null, [], ["star", { "sourceInterval": [2514, 2520] }, ["app", { "sourceInterval": [2514, 2519] }, "token", []]]], "token": ["define", { "sourceInterval": [2524, 2600] }, null, [], ["alt", { "sourceInterval": [2532, 2600] }, ["app", { "sourceInterval": [2532, 2540] }, "caseName", []], ["app", { "sourceInterval": [2543, 2550] }, "comment", []], ["app", { "sourceInterval": [2553, 2558] }, "ident", []], ["app", { "sourceInterval": [2561, 2569] }, "operator", []], ["app", { "sourceInterval": [2572, 2583] }, "punctuation", []], ["app", { "sourceInterval": [2586, 2594] }, "terminal", []], ["app", { "sourceInterval": [2597, 2600] }, "any", []]]], "operator": ["define", { "sourceInterval": [2604, 2669] }, null, [], ["alt", { "sourceInterval": [2615, 2669] }, ["terminal", { "sourceInterval": [2615, 2619] }, "<:"], ["terminal", { "sourceInterval": [2622, 2625] }, "="], ["terminal", { "sourceInterval": [2628, 2632] }, ":="], ["terminal", { "sourceInterval": [2635, 2639] }, "+="], ["terminal", { "sourceInterval": [2642, 2645] }, "*"], ["terminal", { "sourceInterval": [2648, 2651] }, "+"], ["terminal", { "sourceInterval": [2654, 2657] }, "?"], ["terminal", { "sourceInterval": [2660, 2663] }, "~"], ["terminal", { "sourceInterval": [2666, 2669] }, "&"]]], "punctuation": ["define", { "sourceInterval": [2673, 2709] }, null, [], ["alt", { "sourceInterval": [2687, 2709] }, ["terminal", { "sourceInterval": [2687, 2690] }, "<"], ["terminal", { "sourceInterval": [2693, 2696] }, ">"], ["terminal", { "sourceInterval": [2699, 2702] }, ","], ["terminal", { "sourceInterval": [2705, 2709] }, "--"]]] }]);
const superSplicePlaceholder = Object.create(PExpr.prototype);
function namespaceHas(ns, name) {
  for (const prop in ns) {
    if (prop === name) return true;
  }
  return false;
}
function buildGrammar(match, namespace, optOhmGrammarForTesting) {
  const builder = new Builder();
  let decl;
  let currentRuleName;
  let currentRuleFormals;
  let overriding = false;
  const metaGrammar = optOhmGrammarForTesting || ohmGrammar;
  const helpers = metaGrammar.createSemantics().addOperation("visit", {
    Grammars(grammarIter) {
      return grammarIter.children.map((c) => c.visit());
    },
    Grammar(id, s2, _open, rules, _close) {
      const grammarName = id.visit();
      decl = builder.newGrammar(grammarName);
      s2.child(0) && s2.child(0).visit();
      rules.children.map((c) => c.visit());
      const g = decl.build();
      g.source = this.source.trimmed();
      if (namespaceHas(namespace, grammarName)) {
        throw duplicateGrammarDeclaration(g);
      }
      namespace[grammarName] = g;
      return g;
    },
    SuperGrammar(_, n) {
      const superGrammarName = n.visit();
      if (superGrammarName === "null") {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !namespaceHas(namespace, superGrammarName)) {
          throw undeclaredGrammar(superGrammarName, namespace, n.source);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },
    Rule_define(n, fs2, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs2.children.map((c) => c.visit())[0] || [];
      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }
      const body = b.visit();
      const description = d.children.map((c) => c.visit())[0];
      const source = this.source.trimmed();
      return decl.define(currentRuleName, currentRuleFormals, body, description, source);
    },
    Rule_override(n, fs2, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs2.children.map((c) => c.visit())[0] || [];
      const source = this.source.trimmed();
      decl.ensureSuperGrammarRuleForOverriding(currentRuleName, source);
      overriding = true;
      const body = b.visit();
      overriding = false;
      return decl.override(currentRuleName, currentRuleFormals, body, null, source);
    },
    Rule_extend(n, fs2, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs2.children.map((c) => c.visit())[0] || [];
      const body = b.visit();
      const source = this.source.trimmed();
      return decl.extend(currentRuleName, currentRuleFormals, body, null, source);
    },
    RuleBody(_, terms) {
      return builder.alt(...terms.visit()).withSource(this.source);
    },
    OverrideRuleBody(_, terms) {
      const args = terms.visit();
      const expansionPos = args.indexOf(superSplicePlaceholder);
      if (expansionPos >= 0) {
        const beforeTerms = args.slice(0, expansionPos);
        const afterTerms = args.slice(expansionPos + 1);
        afterTerms.forEach((t) => {
          if (t === superSplicePlaceholder) throw multipleSuperSplices(t);
        });
        return new Splice(
          decl.superGrammar,
          currentRuleName,
          beforeTerms,
          afterTerms
        ).withSource(this.source);
      } else {
        return builder.alt(...args).withSource(this.source);
      }
    },
    Formals(opointy, fs2, cpointy) {
      return fs2.visit();
    },
    Params(opointy, ps, cpointy) {
      return ps.visit();
    },
    Alt(seqs) {
      return builder.alt(...seqs.visit()).withSource(this.source);
    },
    TopLevelTerm_inline(b, n) {
      const inlineRuleName = currentRuleName + "_" + n.visit();
      const body = b.visit();
      const source = this.source.trimmed();
      const isNewRuleDeclaration = !(decl.superGrammar && decl.superGrammar.rules[inlineRuleName]);
      if (overriding && !isNewRuleDeclaration) {
        decl.override(inlineRuleName, currentRuleFormals, body, null, source);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body, null, source);
      }
      const params = currentRuleFormals.map((formal) => builder.app(formal));
      return builder.app(inlineRuleName, params).withSource(body.source);
    },
    OverrideTopLevelTerm_superSplice(_) {
      return superSplicePlaceholder;
    },
    Seq(expr) {
      return builder.seq(...expr.children.map((c) => c.visit())).withSource(this.source);
    },
    Iter_star(x, _) {
      return builder.star(x.visit()).withSource(this.source);
    },
    Iter_plus(x, _) {
      return builder.plus(x.visit()).withSource(this.source);
    },
    Iter_opt(x, _) {
      return builder.opt(x.visit()).withSource(this.source);
    },
    Pred_not(_, x) {
      return builder.not(x.visit()).withSource(this.source);
    },
    Pred_lookahead(_, x) {
      return builder.lookahead(x.visit()).withSource(this.source);
    },
    Lex_lex(_, x) {
      return builder.lex(x.visit()).withSource(this.source);
    },
    Base_application(rule, ps) {
      const params = ps.children.map((c) => c.visit())[0] || [];
      return builder.app(rule.visit(), params).withSource(this.source);
    },
    Base_range(from, _, to) {
      return builder.range(from.visit(), to.visit()).withSource(this.source);
    },
    Base_terminal(expr) {
      return builder.terminal(expr.visit()).withSource(this.source);
    },
    Base_paren(open, x, close) {
      return x.visit();
    },
    ruleDescr(open, t, close) {
      return t.visit();
    },
    ruleDescrText(_) {
      return this.sourceString.trim();
    },
    caseName(_, space1, n, space2, end2) {
      return n.visit();
    },
    name(first, rest) {
      return this.sourceString;
    },
    nameFirst(expr) {
    },
    nameRest(expr) {
    },
    terminal(open, cs, close) {
      return cs.children.map((c) => c.visit()).join("");
    },
    oneCharTerminal(open, c, close) {
      return c.visit();
    },
    escapeChar(c) {
      try {
        return unescapeCodePoint(this.sourceString);
      } catch (err) {
        if (err instanceof RangeError && err.message.startsWith("Invalid code point ")) {
          throw invalidCodePoint(c);
        }
        throw err;
      }
    },
    NonemptyListOf(x, _, xs) {
      return [x.visit()].concat(xs.children.map((c) => c.visit()));
    },
    EmptyListOf() {
      return [];
    },
    _terminal() {
      return this.sourceString;
    }
  });
  return helpers(match).visit();
}
const operationsAndAttributesGrammar = makeRecipe(["grammar", { "source": 'OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = "(" ListOf<name, ","> ")"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = "_"\n    | letter\n\n  nameRest\n    = "_"\n    | alnum\n\n}' }, "OperationsAndAttributes", null, "AttributeSignature", { "AttributeSignature": ["define", { "sourceInterval": [29, 58] }, null, [], ["app", { "sourceInterval": [54, 58] }, "name", []]], "OperationSignature": ["define", { "sourceInterval": [62, 100] }, null, [], ["seq", { "sourceInterval": [87, 100] }, ["app", { "sourceInterval": [87, 91] }, "name", []], ["opt", { "sourceInterval": [92, 100] }, ["app", { "sourceInterval": [92, 99] }, "Formals", []]]]], "Formals": ["define", { "sourceInterval": [104, 143] }, null, [], ["seq", { "sourceInterval": [118, 143] }, ["terminal", { "sourceInterval": [118, 121] }, "("], ["app", { "sourceInterval": [122, 139] }, "ListOf", [["app", { "sourceInterval": [129, 133] }, "name", []], ["terminal", { "sourceInterval": [135, 138] }, ","]]], ["terminal", { "sourceInterval": [140, 143] }, ")"]]], "name": ["define", { "sourceInterval": [147, 187] }, "a name", [], ["seq", { "sourceInterval": [168, 187] }, ["app", { "sourceInterval": [168, 177] }, "nameFirst", []], ["star", { "sourceInterval": [178, 187] }, ["app", { "sourceInterval": [178, 186] }, "nameRest", []]]]], "nameFirst": ["define", { "sourceInterval": [191, 223] }, null, [], ["alt", { "sourceInterval": [207, 223] }, ["terminal", { "sourceInterval": [207, 210] }, "_"], ["app", { "sourceInterval": [217, 223] }, "letter", []]]], "nameRest": ["define", { "sourceInterval": [227, 257] }, null, [], ["alt", { "sourceInterval": [242, 257] }, ["terminal", { "sourceInterval": [242, 245] }, "_"], ["app", { "sourceInterval": [252, 257] }, "alnum", []]]] }]);
initBuiltInSemantics(Grammar.BuiltInRules);
initPrototypeParser(operationsAndAttributesGrammar);
function initBuiltInSemantics(builtInRules) {
  const actions = {
    empty() {
      return this.iteration();
    },
    nonEmpty(first, _, rest) {
      return this.iteration([first].concat(rest.children));
    },
    self(..._children) {
      return this;
    }
  };
  Semantics.BuiltInSemantics = Semantics.createSemantics(builtInRules, null).addOperation(
    "asIteration",
    {
      emptyListOf: actions.empty,
      nonemptyListOf: actions.nonEmpty,
      EmptyListOf: actions.empty,
      NonemptyListOf: actions.nonEmpty,
      _iter: actions.self
    }
  );
}
function initPrototypeParser(grammar2) {
  Semantics.prototypeGrammarSemantics = grammar2.createSemantics().addOperation("parse", {
    AttributeSignature(name) {
      return {
        name: name.parse(),
        formals: []
      };
    },
    OperationSignature(name, optFormals) {
      return {
        name: name.parse(),
        formals: optFormals.children.map((c) => c.parse())[0] || []
      };
    },
    Formals(oparen, fs2, cparen) {
      return fs2.asIteration().children.map((c) => c.parse());
    },
    name(first, rest) {
      return this.sourceString;
    }
  });
  Semantics.prototypeGrammar = grammar2;
}
function findIndentation(input) {
  let pos = 0;
  const stack = [0];
  const topOfStack = () => stack[stack.length - 1];
  const result = {};
  const regex = /( *).*(?:$|\r?\n|\r)/g;
  let match;
  while ((match = regex.exec(input)) != null) {
    const [line, indent] = match;
    if (line.length === 0) break;
    const indentSize = indent.length;
    const prevSize = topOfStack();
    const indentPos = pos + indentSize;
    if (indentSize > prevSize) {
      stack.push(indentSize);
      result[indentPos] = 1;
    } else if (indentSize < prevSize) {
      const prevLength = stack.length;
      while (topOfStack() !== indentSize) {
        stack.pop();
      }
      result[indentPos] = -1 * (prevLength - stack.length);
    }
    pos += line.length;
  }
  if (stack.length > 1) {
    result[pos] = 1 - stack.length;
  }
  return result;
}
const INDENT_DESCRIPTION = "an indented block";
const DEDENT_DESCRIPTION = "a dedent";
const INVALID_CODE_POINT = 1114111 + 1;
class InputStreamWithIndentation extends InputStream {
  constructor(state) {
    super(state.input);
    this.state = state;
  }
  _indentationAt(pos) {
    return this.state.userData[pos] || 0;
  }
  atEnd() {
    return super.atEnd() && this._indentationAt(this.pos) === 0;
  }
  next() {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos);
      return void 0;
    }
    return super.next();
  }
  nextCharCode() {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos);
      return INVALID_CODE_POINT;
    }
    return super.nextCharCode();
  }
  nextCodePoint() {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos);
      return INVALID_CODE_POINT;
    }
    return super.nextCodePoint();
  }
}
class Indentation extends PExpr {
  constructor(isIndent = true) {
    super();
    this.isIndent = isIndent;
  }
  allowsSkippingPrecedingSpace() {
    return true;
  }
  eval(state) {
    const { inputStream } = state;
    const pseudoTokens = state.userData;
    state.doNotMemoize = true;
    const origPos = inputStream.pos;
    const sign = this.isIndent ? 1 : -1;
    const count = (pseudoTokens[origPos] || 0) * sign;
    if (count > 0) {
      state.userData = Object.create(pseudoTokens);
      state.userData[origPos] -= sign;
      state.pushBinding(new TerminalNode(0), origPos);
      return true;
    } else {
      state.processFailure(origPos, this);
      return false;
    }
  }
  getArity() {
    return 1;
  }
  _assertAllApplicationsAreValid(ruleName, grammar2) {
  }
  _isNullable(grammar2, memo) {
    return false;
  }
  assertChoicesHaveUniformArity(ruleName) {
  }
  assertIteratedExprsAreNotNullable(grammar2) {
  }
  introduceParams(formals) {
    return this;
  }
  substituteParams(actuals) {
    return this;
  }
  toString() {
    return this.isIndent ? "indent" : "dedent";
  }
  toDisplayString() {
    return this.toString();
  }
  toFailure(grammar2) {
    const description = this.isIndent ? INDENT_DESCRIPTION : DEDENT_DESCRIPTION;
    return new Failure(this, description, "description");
  }
}
const applyIndent = new Apply("indent");
const applyDedent = new Apply("dedent");
const newAnyBody = new Splice(BuiltInRules, "any", [applyIndent, applyDedent], []);
const IndentationSensitive = new Builder().newGrammar("IndentationSensitive").withSuperGrammar(BuiltInRules).define("indent", [], new Indentation(true), INDENT_DESCRIPTION, void 0, true).define("dedent", [], new Indentation(false), DEDENT_DESCRIPTION, void 0, true).extend("any", [], newAnyBody, "any character", void 0).build();
Object.assign(IndentationSensitive, {
  _matchStateInitializer(state) {
    state.userData = findIndentation(state.input);
    state.inputStream = new InputStreamWithIndentation(state);
  },
  supportsIncrementalParsing: false
});
Grammar.initApplicationParser(ohmGrammar, buildGrammar);
const isBuffer = (obj) => !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
function compileAndLoad(source, namespace) {
  const m = ohmGrammar.match(source, "Grammars");
  if (m.failed()) {
    throw grammarSyntaxError(m);
  }
  return buildGrammar(m, namespace);
}
function grammar$1(source, optNamespace) {
  const ns = grammars(source);
  const grammarNames = Object.keys(ns);
  if (grammarNames.length === 0) {
    throw new Error("Missing grammar definition");
  } else if (grammarNames.length > 1) {
    const secondGrammar = ns[grammarNames[1]];
    const interval = secondGrammar.source;
    throw new Error(
      getLineAndColumnMessage(interval.sourceString, interval.startIdx) + "Found more than one grammar definition -- use ohm.grammars() instead."
    );
  }
  return ns[grammarNames[0]];
}
function grammars(source, optNamespace) {
  const ns = /* @__PURE__ */ Object.create({});
  if (typeof source !== "string") {
    if (isBuffer(source)) {
      source = source.toString();
    } else {
      throw new TypeError(
        "Expected string as first argument, got " + unexpectedObjToString(source)
      );
    }
  }
  compileAndLoad(source, ns);
  return ns;
}
const grammar = grammar$1(String.raw`
  Shell {
    Statement = OrStatement
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
    Assignment = Keyword ~space "=" ~space Quoted
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
    word_char = letter | digit | "-" | "." | "_" | ":" | "$"
  }
`);
const semantics = grammar.createSemantics().addOperation("ast", {
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
  Expr_expr(a, _s, cmd2, _s2, t) {
    return { type: "cmd", cmd: cmd2.ast(), args: t.ast().flat(), env: a.ast() };
  },
  Assignment(k, _, v) {
    return { type: "env", args: [k.ast(), v.ast()] };
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
  Quoted_quoted(_lq, s2, _rq) {
    const args = s2.children.map((c) => {
      let v = c.ast();
      if (c.ctorName === "QuotedText") {
        let i2 = c.source.startIdx - 1;
        for (i2; s2.source.sourceString[i2] == " "; i2--) ;
        v = "".concat(" ".repeat(c.source.startIdx - 1 - i2), v);
      }
      return v;
    });
    return { type: "quote", args };
  },
  QuotedText(q2) {
    return q2.children.map((c) => c.ctorName !== "any" ? c.ast() : c.sourceString).join("");
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
  }
});
function WorkerWrapper(options) {
  return new Worker(
    "/cli-er/previews/pr-151/assets/exec-worker-BmoXLMRx.js",
    {
      type: "module",
      name: options?.name
    }
  );
}
const functionPrefix = "__fn__ ";
function serialize(data) {
  return JSON.stringify(data, (_, v) => {
    if (typeof v === "function") {
      return functionPrefix.concat(v.toString());
    }
    return v;
  });
}
class FileDescriptorStack {
  value = { 0: [], 1: [], 2: [] };
  init() {
    for (const fd in this.value) {
      this.value[fd] = [];
      this.push(fd, new FileDescriptor("TTY"));
    }
  }
  push(fd, value) {
    kernel.setFD(fd, value);
    this.value[fd].push(value);
  }
  pop(fd) {
    const v = this.value[fd].pop();
    const s2 = this.value[fd];
    kernel.setFD(fd, s2[s2.length - 1]);
    return v;
  }
  async flush() {
    for (const fd of [2, 1]) {
      const d = kernel.getFD(fd);
      if (d.type === "TTY") {
        const buffer = d.flush();
        buffer && renderOutput(buffer.replace(/\n?$/, "\n"), { error: fd == 2 });
      } else if (d.type === "FILE") {
        const buffer = d.flush();
        await fs.writeFile(d.metadata.name, buffer, { concat: true });
      }
    }
  }
}
const FDStack = new FileDescriptorStack();
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
process.stdout.write = (v) => kernel.getFD(1).write(v);
process.stderr.write = (v) => kernel.getFD(2).write(v);
let execWorker;
const instantiateWorker = () => {
  execWorker = new WorkerWrapper();
  kernel.registerProcess(execWorker);
};
instantiateWorker();
async function executeAst(node) {
  try {
    if (typeof node === "string") {
      return node;
    }
    if (node.type === "quote") {
      FDStack.push(1, new FileDescriptor("PIPE"));
      const args = [];
      for (const arg of node.args) {
        if (typeof arg === "string" || arg.type === "expansion") {
          args.push(await executeAst(arg));
          continue;
        }
        await executeAst(arg);
        const buffer = kernel.getFD(1).flush().replace(/\n?$/, "");
        args.push(buffer);
      }
      FDStack.pop(1);
      return args.join("");
    }
    if (node.type === "env") {
      const arg1 = node.args[1];
      const v = typeof arg1 !== "string" && arg1.type !== "quote" ? { type: "quote", args: [arg1] } : arg1;
      const r = [node.args[0], await executeAst(v)];
      if (node.cmd === true) {
        return r;
      }
      process.env[r[0]] = r[1];
    }
    if (node.type === "expansion") {
      const v = node.args[0];
      if (v === "0") return process.env.SHELL;
      if (v == "?") return process.lastExitCode.toString();
      if (v == "$") return kernel.getpid();
      return process.env[v];
    }
    if (node.type === "cmd") {
      const cliSpec = CLI_COMMANDS[node.cmd];
      const args = [];
      for (const arg of node.args) {
        let av = await executeAst(arg);
        av !== void 0 && args.push(av);
      }
      const env = { ...process.env };
      for (const e of node.env) {
        const [k, v] = await executeAst({ ...e, cmd: true });
        env[k] = v;
      }
      console.log(`[execute::cmd] ${node.cmd} args=${JSON.stringify(args)} env=${JSON.stringify(env)}`);
      if (!cliSpec) {
        process.stderr.write(`cliersh: command not found: "${node.cmd}"
`);
        return process.exit(-1);
      }
      if (cliSpec.builtin) {
        await run({ name: node.cmd, cliSpec, args });
        return process.exit(process.exitCode);
      }
      const p = { env, stdout: { columns: process.stdout.columns }, stdin: { isTTY: process.stdin.isTTY } };
      return await new Promise((resolve, reject) => {
        execWorker.postMessage(serialize({ name: node.cmd, cliSpec, args, process: p, cliHandlerUrl }));
        execWorker.onmessage = ({ data }) => {
          if (data.type === "output") {
            process[data.stream].write(data.value);
          } else if (data.type === "exit") {
            process.exit(data.exitCode);
            data.exitCode === 130 ? (instantiateWorker(), reject({ code: "SIGINT" })) : resolve();
          }
        };
      });
    }
    if (node.type === "and") {
      for (const child of node.args) {
        await executeAst(child);
        if (process.lastExitCode !== 0) break;
      }
    }
    if (node.type === "or") {
      for (const child of node.args) {
        await executeAst(child);
        if (process.lastExitCode === 0) break;
      }
    }
    if (node.type === "pipe") {
      FDStack.push(1, new FileDescriptor("PIPE"));
      await executeAst(node.args[0], { flush: false });
      const pipe = FDStack.pop(1);
      await FDStack.flush();
      FDStack.push(0, pipe);
      await fs.writeFile(fs.getProcessFdPath(0), pipe.buffer);
      await executeAst(node.args[1]);
      FDStack.pop(0);
      await fs.deleteFile(fs.getProcessFdPath(0));
    }
    if (node.type === "redirect") {
      const [{ op, value }, expr] = node.args;
      await fs.writeFile(value, "", { concat: op === ">>" && await fs.info(value) });
      FDStack.push(1, new FileDescriptor("FILE", { name: value }));
      await executeAst(expr);
      await FDStack.flush();
      FDStack.pop(1);
    }
  } finally {
    await FDStack.flush();
  }
}
async function execute(input) {
  const r = grammar.match(input);
  if (!r.succeeded()) {
    renderOutput(r.message, { error: true });
  }
  const ast = semantics(r).ast();
  FDStack.init();
  return executeAst(ast);
}
function prompt() {
  let template = process.env.PS1 || "";
  let h = kernel.gethostname();
  const r = {
    "\\u": process.env.USER,
    "\\w": path.getCwd(),
    "\\h": h.slice(0, h.indexOf(".")),
    "\\H": h
  };
  for (const [k, v] of Object.entries(r)) {
    template = template.replace(k, v);
  }
  return template;
}
const commands = {
  definition: {},
  cliOptions: { cliDescription: "List available commands", help: { hidden: true } },
  action: () => Cli.logger.log("Available commands: ", Object.keys(CLI_COMMANDS).join(", "), "\n")
};
const echo = {
  definition: { args: { type: "string", positional: true, stdin: true } },
  cliOptions: { help: { hidden: true } },
  action: ({ args }) => {
    if (!args) return;
    Cli.logger.log(scapeColor(args.join(" ")), "\n");
  }
};
const sleep = {
  definition: { seconds: { type: "number", positional: 0, required: true, description: "number of seconds to sleep" } },
  cliOptions: {},
  action: async ({ seconds }) => new Promise((resolve) => setTimeout(resolve, seconds * 1e3)),
  builtin: false
  // Mark it as `false` so it will be executed inside web-worker (cancellable)
};
const printenv = {
  definition: { name: { type: "string", positional: 0 } },
  cliOptions: { help: { template: "Usage: printenv [name]" } },
  action: ({ name }) => {
    if (name) {
      return process.env[name] ? process.stdout.write(process.env[name]) : void 0;
    }
    const env = Object.entries(process.env).map(([k, v]) => `${k}=${scapeColor(v)}`).join("\n");
    process.stdout.write(env);
  }
};
const pwd = {
  definition: {},
  cliOptions: {},
  action: () => process.stdout.write(path.getCwd())
};
const ls = {
  definition: { files: { type: "string", positional: true, default: [] } },
  cliOptions: {},
  action: async (params) => {
    const rfiles = params.files.length ? params.files : ["."];
    const fps = rfiles.map((f) => path.resolve(path.getCwd(), f));
    const files = await Promise.all(fps.map((fp) => fs.info(fp).then((r) => [fp, r])));
    for (const f of files.filter((e) => !e[1])) {
      Cli.logger.error("No such file or directory: ".concat(f[0]));
      process.exitCode = 1;
    }
    const efiles = files.filter((e) => e[1]).map((e) => ({ ...e[1], path: e[0] }));
    for (let i2 = 0; i2 < efiles.length; i2++) {
      const f = efiles[i2];
      const contents = f.type == "file" ? [{ name: f.name }] : await fs.readDir(f.path);
      const title = f.type == "directory" && files.length > 1 ? f.path.concat(":\n") : "";
      process.stdout.write(
        "".concat(title, contents.map((c) => c.name).join("   "), i2 < efiles.length - 1 ? "\n\n" : "")
      );
    }
  }
};
const cd = {
  definition: { path: { type: "string", positional: 0 } },
  cliOptions: {},
  action: async ({ path: path$1 }) => {
    if (!path$1) return;
    const fp = path.resolve(path.getCwd(), path$1);
    const e = await fs.info(fp);
    if (!e || e.type !== "directory") {
      const m = !e ? "not such file or directory" : "not a directory";
      Cli.logger.error(m.concat(": ", path$1));
      return process.exit(1);
    }
    return path.setCwd(fp);
  }
};
const cat = {
  definition: { path: { type: "string", positional: 0 } },
  cliOptions: {},
  action: async ({ path: path$1 }) => {
    if (!path$1) return;
    const fp = path.resolve(path.getCwd(), path$1);
    const e = await fs.info(fp);
    if (!e || e.type !== "file") {
      const m = !e ? "not such file or directory" : "is a directory";
      Cli.logger.error(m.concat(": ", path$1));
      return process.exit(1);
    }
    return fs.readFile(fp).then(process.stdout.write);
  }
};
const mkdir = {
  definition: {
    names: { positional: true, description: "List of directory names" },
    createIntermediate: {
      type: "boolean",
      default: false,
      aliases: ["p"],
      description: "Create intermediate directories as required"
    }
  },
  cliOptions: {},
  action: async (params) => Promise.all(
    params.names.map(
      (n) => fs.createDir(path.resolve(path.getCwd(), n), params.createIntermediate).catch(() => {
        Cli.logger.error(`No such file or directory: ${n}
`);
      })
    )
  )
};
const clier = {
  definition: { cmd: { type: "string", positional: 0, description: "Name of the command", required: true } },
  cliOptions: { cliDescription: "Show clier-information about a command" },
  action: ({ cmd: cmd2 }) => {
    const cmdConfig = window.CLI_COMMANDS[cmd2];
    if (!cmdConfig) {
      Cli.logger.error("No such command: ", cmd2);
      return process.exit(1);
    }
    const format = (o2) => JSON.stringify(o2, null, 2).replace(/^/gm, " ".repeat(3));
    const info = "".concat(
      cmdConfig.source ? `Source: e[4;30m${cmdConfig.source}e[0m

` : "",
      "DEFINITION:\n",
      format(cmdConfig.definition),
      "\n\nOPTIONS\n",
      format(cmdConfig.cliOptions)
    );
    process.stdout.write(info);
  }
};
const builtincmds = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cat,
  cd,
  clier,
  commands,
  echo,
  ls,
  mkdir,
  printenv,
  pwd,
  sleep
}, Symbol.toStringTag, { value: "Module" }));
const builtins = { history: spec, clear: clearSpec, ...builtincmds };
for (const c of Object.keys(builtins)) {
  builtins[c].builtin ??= true;
  window.CLI_COMMANDS[c] = builtins[c];
}
const blobSource = "export default (...args) => globalThis.CLI_ACTION_REF(...args);";
const blob = new Blob([blobSource], { type: "text/javascript" });
window.cliHandlerUrl = URL.createObjectURL(blob);
require("url").pathToFileURL = () => ({ href: cliHandlerUrl });
let [i, sp, o, oa, lm, sr] = ["input", "sprompt", "output", "output-after", "theme", "size-ref"].map(
  (id) => document.getElementById(id)
);
document.addEventListener("click", () => i.focus());
o.addEventListener("click", (e) => e.stopPropagation());
lm.addEventListener(
  "click",
  () => document.body.classList[document.body.classList.contains("light") ? "remove" : "add"]("light")
);
const updateColumns = () => {
  const charW = sr.getBoundingClientRect().width;
  process.stdout.columns = Math.floor(o.clientWidth / charW);
};
updateColumns();
window.addEventListener("resize", updateColumns);
await fs.init({ "/users/guest/README.md": "Welcome!" }).catch(() => {
});
require("fs").readFileSync = fs.readFileSync.bind(fs);
path.setCwd("/");
Object.defineProperty(process.stdin, "isTTY", {
  get() {
    return kernel.getFD(0)?.type === "TTY";
  }
});
Object.assign(process.env, {
  SHELL: "cliersh",
  USER: "guest",
  PS1: `e[0;32m\\u@\\He[0m:e[0;34m\\w $e[0m`
});
const updatePrompt = () => {
  let p = prompt();
  if (window.CLI_PROMPT === p) return;
  window.CLI_PROMPT = parseColor(p);
  sp.innerHTML = window.CLI_PROMPT;
};
updatePrompt();
handleKey(i, {
  Enter: () => {
    let inputValue = i.value;
    renderInput(inputValue);
    if (!inputValue) {
      return flushOutput();
    }
    add(inputValue);
    i.value = "";
    execute(inputValue).finally(() => {
      updatePrompt();
      flushOutput();
    });
  },
  c: (e) => {
    if (!e.ctrlKey) return;
    kernel.kill(Signal.SIGINT);
    i.value = "";
    renderOutput("^C");
    flushOutput();
  },
  Tab: (e) => {
    e.preventDefault();
    const candidates = Object.keys(CLI_COMMANDS).filter((k) => k.startsWith(i.value));
    if (!candidates.length) return;
    if (candidates.length === 1) {
      i.value = candidates[0];
      return clearOutput(oa);
    }
    updateOutput(candidates.join("  "));
  },
  ArrowUp: (e) => {
    e.preventDefault();
    let p = previous();
    if (!p) return;
    updateInputValue(p);
  },
  ArrowDown: (e) => {
    e.preventDefault();
    let n = next();
    if (!n) return;
    updateInputValue(n);
  }
});
let q = new URLSearchParams(window.location.search).get("cmd") || "commands";
{
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  await delay(500);
  for (let l of q.slice("")) {
    i.value += l;
    await delay(30);
  }
  await delay(200);
  i.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
}
