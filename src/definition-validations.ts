import { DefinitionElement } from "./cli-utils";
import { DEBUG_TYPE, debug, isDebugActive } from "./utils";

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
    debug(
      DEBUG_TYPE.WARN,
      `Duplicated Option.positional value <${duplicate}> in option ${positionalOptions[duplicatedIndex!].key}`,
    );
  }
  // Check correlation between numerical values
  const numericalOpts = positionalOptions.filter((o) => typeof o.positional === "number");
  const numerical = numericalOpts.map((o) => o.positional as number);
  let missing = 0;
  if (
    numerical.length > 0 &&
    (numerical[0] !== 0 || numerical.slice(1).some((n) => numerical.indexOf((missing = n - 1)) < 0))
  ) {
    debug(DEBUG_TYPE.WARN, `Missing correlative positional value <${missing}> in options: ${fOpts(numericalOpts)}`);
  }
}
