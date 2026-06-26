export const CLIER_DEBUG_KEY = "CLIER_DEBUG";
export const isDebugActive = () =>
  !["false", "0", "", undefined].includes(process.env[CLIER_DEBUG_KEY]?.toLowerCase()!);

export enum DEBUG_TYPE {
  /** Used for deprecations, definition warnings, etc */
  WARN = "WARN",
  /** Used for debugging execution */
  TRACE = "TRACE",
}

interface DebugStrategy {
  namespace: string;
  log: ((message: string) => void) & { enabled?: boolean };
}

export class NoOpDebugStrategy implements DebugStrategy {
  namespace: string;
  constructor(namespace: string) {
    this.namespace = namespace;
  }
  log(message: string) {}
}

class DefaultDebugStrategy extends NoOpDebugStrategy {
  log(message: string) {
    console.error(`${this.namespace} ${message}`);
  }
}

class ClierDebugStrategy extends NoOpDebugStrategy {
  log(message: string, type?: DEBUG_TYPE) {
    console.error(`[${this.namespace}::${type}] ${message}`);
    if (type === DEBUG_TYPE.WARN) {
      process.exitCode = 1;
    }
  }
}

type Constructor<T> = new (namespace: string) => T;
interface DebuggerConfig {
  namespace: string;
  enabled: boolean;
  strategy: Constructor<DebugStrategy>;
}

export class Debugger {
  private strategy: DebugStrategy;
  log: DebugStrategy["log"];

  constructor(config: DebuggerConfig) {
    this.strategy = config.enabled ? new config.strategy(config.namespace) : new NoOpDebugStrategy(config.namespace);

    const self = this;
    this.log = function (message: string) {
      self.strategy.log(...(arguments as unknown as [string]));
    } as DebugStrategy["log"];
    Object.assign(this.log, { enabled: config.enabled });
  }
}

// clier debugger implementation
export const clierdebug = new Debugger({ namespace: "CLIER", enabled: isDebugActive(), strategy: ClierDebugStrategy })
  .log as (message: string, type: `${DEBUG_TYPE}`) => void;

// Generic debug-logger implementation
export const debug = (namespace: string) => {
  const enabled = (() => {
    if (!process.env.DEBUG) return false;
    if (process.env.DEBUG === "*") return true;
    const nms = process.env.DEBUG.split(",");
    return nms.some((nm) => nm === namespace || (namespace.startsWith(nm.slice(0, nm.length - 1)) && nm.endsWith("*")));
  })();

  return new Debugger({
    namespace,
    enabled,
    strategy: DefaultDebugStrategy,
  }).log;
};
