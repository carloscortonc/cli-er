import Cli from ".";

export const CLI_MESSAGES = {
  "execute.base-location-error": "There was a problem finding base script location",
  "execute.handler-not-found": "Could not find handler for command in {path}",
  "execute.execution-error": "There was a problem executing the script ({path}: {error})",
  "generate-help.scope-not-found": "Unable to find the specified scope ({scope})",
  "generate-help.usage": "Usage",
  "generate-help.has-options": "[OPTIONS]",
  "generate-help.option-default": "(default: {default})",
  "generate-help.namespaces-title": "Namespaces",
  "generate-help.commands-title": "Commands",
  "generate-help.options-title": "Options",
  "generate-version.template": "  {cliName} version: {cliVersion}\n",
  "parse-arguments.suggestion": '. Did you mean "{suggestion}" ?',
  "help.description": "Display global help, or scoped to a namespace/command",
  "version.description": "Display version",
} as const;

type ExtractVariables<T> = T extends `${string}{${infer Var}}${infer Rest}` ? Var | ExtractVariables<Rest> : never;

/** Method for formatting internationalized messages */
export function formatMessage<T extends keyof typeof Cli.messages>(
  messageId: T,
  ...params: ExtractVariables<(typeof Cli.messages)[T]> extends never
    ? []
    : [{ [key in ExtractVariables<(typeof Cli.messages)[T]>]: string }]
) {
  return Object.entries(params[0] || {}).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, "g"), v as string),
    (Cli.messages as any)[messageId],
  );
}
