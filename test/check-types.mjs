//@ts-check
/* This file is intended for testing library types. The assertions made here will be tested via `yarn tsc` in "test" script */
import Cli from "../dist";

/**
 * @typedef {import("../dist").Definition} Definition
 */

/* Option can not declare nested options */
//@ts-expect-error
new Cli({ nms: { kind: "option", options: {} } });

/* Command can only declare options of kind "option" */
//@ts-expect-error
new Cli({ cmd: { kind: "command", options: { nms: { kind: "namespace" } } } });
//@ts-expect-error
new Cli({ cmd: { kind: "command", options: { cmd: { kind: "command" } } } });
new Cli({ cmd: { kind: "command", options: { opt: { kind: "option" } } } });

/* Definition declared outside constructor - Error */
const definitionError = { opt: { kind: "option" } }
//@ts-expect-error
new Cli(definitionError);

/* Definition declared outside constructor */
/** @type {Definition} */
const definition = { opt: { kind: "option" } }
new Cli(definition);