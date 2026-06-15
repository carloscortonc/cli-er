import type { Hooks } from "./types";

type HookName = string | symbol;
interface ExecuteOptions {
  /** Reference to an array where the list of executed hooks will be stored */
  executed?: HookName[];
  /** Whether to reverse the order of the hooks */
  reverse?: boolean;
  /** List of of hook "group" names to execute */
  filter?: HookName[];
}

class HooksManager {
  hooks: { [K in keyof Hooks]: { name: HookName; fn: Hooks[K] }[] };

  constructor() {
    this.hooks = {};
  }

  register(name: HookName, hooks: Hooks) {
    for (const hook of Object.keys(hooks) as (keyof Hooks)[]) {
      this.hooks[hook] ||= [];
      this.hooks[hook].push({ name, fn: hooks[hook] as any });
    }
  }

  async execute<T extends keyof Hooks>(hook: T, ctx: Parameters<NonNullable<Hooks[T]>>[0], opts: ExecuteOptions = {}) {
    const _list = this.hooks[hook];
    if (!_list || !_list.length) return;
    opts.executed ||= [];
    const list = opts.reverse ? ([..._list].reverse() as typeof _list) : _list;
    const filtered = opts.filter ? list.filter((e) => opts.filter!.includes(e.name)) : list;
    for (const hook of filtered) {
      await hook.fn!(ctx as any);
      opts.executed.push(hook.name);
    }
  }
}

export default HooksManager;
