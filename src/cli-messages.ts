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
  "help.description": "Display global help, or scoped to a namespace/command",
  "version.description": "Display version",
};

/** Method for formatting internationalized messages */
export function formatMessage(messageId: string, params: { [key: string]: string } = {}) {
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, "g"), v),
    Cli.messages[messageId],
  );
}
