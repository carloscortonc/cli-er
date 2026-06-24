import { DefinitionElement } from "./cli-utils";
import { clierdebug, DEBUG_TYPE, isDebugActive } from "./debug-logger";

/** Apply positional-values validations. Checks if debug mode is active to avoid unnecessary execution */
export function validatePositional(positionalOptions: DefinitionElement[]) {
  if (!isDebugActive()) {
    return;
  }
  const fOpts = (opts: DefinitionElement[]) => opts.map((o) => o.key).join(",");
  // Check duplicities
  const values = positionalOptions.map((o) => o.positional!);
  let duplicate, duplicatedIndex: number;
  if ((duplicate = values.find((v, index) => values.indexOf(v) !== (duplicatedIndex = index)))) {
    clierdebug(
      `Duplicated Option.positional value <${duplicate}> in option ${positionalOptions[duplicatedIndex!].key}`,
      DEBUG_TYPE.WARN,
    );
  }
  // Check correlation between numerical values
  const numericalOpts = positionalOptions.filter((o) => typeof o.positional === "number");
  const numerical = numericalOpts.map((o) => o.positional as number);

  if (!numerical.length) return;
  let missing = 0;
  if (
    // -1 and 0 are the ends of each check, so skip them. For the rest, validate that {n-1}(positives)/ {n+1}(negatives) exists
    numerical.some((n) => ![0, -1].includes(n) && numerical.indexOf(n > 0 ? (missing = n - 1) : (missing = n + 1)) < 0)
  ) {
    clierdebug(
      `Missing correlative positional value <${missing}> in options: ${fOpts(numericalOpts)}`,
      DEBUG_TYPE.WARN,
    );
  }
}
