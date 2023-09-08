`cli-er` supports internationalization (since v0.11.0) by acepting `CliOptions.messages` with overriden messages:

This way, you can redefine all messages used internally. The default (en) are declared in these two files:
- [cli-messages.ts](/src/cli-messages.ts)
- [cli-errors.ts](/src/cli-errors.ts)

In the example from this folder, the current language used by the user is stored in a configuration file (`.intlclirc.json`). This is then used to load the correct messages from the intl folder.