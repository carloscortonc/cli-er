import { DefinitionElement } from "./cli-utils";
import { debug, isDebugActive } from "./utils";

/** Apply positional-values validations. Checks if debug mode is active to avoid unnecessary execution */
export function validatePositional(positionalOptions: DefinitionElement[]) {
  if (!isDebugActive()) {
    return;
  }
  const fOpts = (opts: DefinitionElement[]) => opts.map((o) => o.key).join(",");
  // Check duplicities
  const values = positionalOptions.map((o) => o.positional!);
  let duplicate;
  if ((duplicate = values.find((v, index) => values.slice(index + 1).indexOf(v) > -1))) {
    debug(`Duplicated Option.positional value <${duplicate}> in options: ${fOpts(positionalOptions)}`);
  }
  // Check correlation between numerical values
  const numericalOpts = positionalOptions.filter((o) => typeof o.positional === "number");
  const numerical = numericalOpts.map((o) => o.positional as number);
  let missing = 0;
  if (
    numerical.length > 0 &&
    (numerical[0] !== 0 || numerical.slice(1).some((n) => numerical.indexOf((missing = n - 1)) < 0))
  ) {
    debug(`Missing correlative positional value <${missing}> in options: ${fOpts(numericalOpts)}`);
  }
}
