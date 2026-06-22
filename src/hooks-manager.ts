import type { Hooks } from "./types";
import { debug } from "./utils";

type HookName = string | symbol;
interface ExecuteOptions {
  /** Reference to an array where the list of executed hooks will be stored */
  executed?: HookName[];
  /** Whether to reverse the order of the hooks */
  reverse?: boolean;
  /** List of hook "group" names to exclude */
  exclude?: HookName[];
}

class HooksManager {
  hooks: { [K in keyof Hooks]: { name: HookName; fn: Hooks[K] }[] } = {};
  hookData = {};

  register(name: HookName, hooks: Hooks) {
    for (const hook of Object.keys(hooks) as (keyof Hooks)[]) {
      this.hooks[hook] ||= [];
      this.hooks[hook].push({ name, fn: hooks[hook] as any });
    }
  }

  async execute<T extends keyof Hooks>(
    hook: T,
    ctx: Omit<Parameters<NonNullable<Hooks[T]>>[0], "data">,
    opts: ExecuteOptions = {},
  ) {
    const _list = this.hooks[hook];
    if (!_list || !_list.length) return;
    opts.executed ||= [];
    const list = opts.reverse ? ([..._list].reverse() as typeof _list) : _list;
    const filtered = opts.exclude ? list.filter((e) => !opts.exclude!.includes(e.name)) : list;
    for (const h of filtered) {
      opts.executed.push(h.name);
      debug("TRACE", `[${String(h.name)}::${hook}]`);
      await h.fn!({ ...ctx, data: this.hookData } as any);
    }
  }

  get(hook: keyof Hooks) {
    return this.hooks[hook] || [];
  }
}

export default HooksManager;
