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
  log(message: string): void;
}

class NoOpDebugStrategy implements DebugStrategy {
  namespace: string;
  constructor(namespace: string) {
    this.namespace = namespace;
  }
  log(message: string) {}
}

class DefaultDebugStrategy extends NoOpDebugStrategy {
  log(message: string, type?: DEBUG_TYPE) {
    process.stderr.write(`${this.namespace} ${message}\n`);
  }
}

class ClierDebugStrategy extends NoOpDebugStrategy {
  log(message: string, type?: DEBUG_TYPE) {
    process.stderr.write(`[${this.namespace}::${type}] ${message}\n`);
    if (type === DEBUG_TYPE.WARN) {
      process.exitCode = 1;
    }
  }
}

type Constructor<T> = new (namespace: string) => T;
interface DebuggerConfig {
  namespace: string;
  condition: () => boolean;
  strategy: Constructor<DebugStrategy>;
}

class Debugger {
  private strategy: DebugStrategy;

  constructor(config: DebuggerConfig) {
    this.strategy = config.condition()
      ? new config.strategy(config.namespace)
      : new NoOpDebugStrategy(config.namespace);

    this.log = this.log.bind(this);
  }

  log(message: string) {
    this.strategy.log(...(arguments as unknown as [string]));
  }
}

// clier debugger implementation
export const clierdebug = new Debugger({ namespace: "CLIER", condition: isDebugActive, strategy: ClierDebugStrategy })
  .log as (message: string, type: `${DEBUG_TYPE}`) => void;

// Generic debug-logger implementation
export const debug = (namespace: string) =>
  new Debugger({
    namespace,
    condition: () => {
      if (!process.env.DEBUG) return false;
      if (process.env.DEBUG === "*") return true;
      const nms = process.env.DEBUG.split(",");
      return nms.some((nm) => nm === namespace || (namespace.startsWith(nm) && nm.endsWith("*")));
    },
    strategy: DefaultDebugStrategy,
  }).log;
