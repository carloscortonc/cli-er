import fs from "../fs";
import { F_MODE } from "../kernel/permission";
import pathmodule from "../path";

export const chmod = {
  definition: {
    mod: { type: "string", positional: 0, required: true },
    files: { type: "string", positional: true, required: true },
  },
  cliOptions: {},
  action: async ({ mod, files }) => {
    for (const file of files) {
      const fp = pathmodule.resolve(pathmodule.getCwd(), file);
      const e = await fs.info(fp);
      if (e?.type !== "file") {
        throw new Error(`"${file}" is not a file`);
      }
      const newp = calculateFinalPermissions(mod, e.metadata?.p || 0);
      console.log(newp);
      await fs.updateMetadata(fp, { ...e.metadata, p: newp });
      console.log({ mod, files, newp });
    }
  },
};

/** Calculate the final permissions from a modifier + current value
 * Modifier can be:
 * - 3 digit e.g. "060"
 * - [+-][rwx]
 */
const calculateFinalPermissions = (mod, current) => {
  if (/\d{3}/.test(mod)) {
    return parseInt(mod);
  }
  if (/[+-][rwx]/.test(mod)) {
    let add = mod[0] === "+";
    const v = { r: F_MODE.READ, w: F_MODE.WRITE, x: F_MODE.EXECUTE }[mod[1]];
    return add ? current | v : current ^ v;
  }
  throw new Error("Invalid modifier format");
};
