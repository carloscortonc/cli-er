# Example: Hooks

Source: [`examples/hooks/`](https://github.com/carloscortonc/cli-er/tree/develop/examples/hooks)

Shows how to use `CliOptions.hooks` to run code at lifecycle events:
- `beforeParse`: validate environment variables before parsing arguments
- `afterParse`: log the parsed output
- `beforeExecute`: authentication check — throws to prevent execution
- `afterExecute`: cleanup, always called even if `beforeExecute` threw

See [Features → Lifecycle hooks](/guide/features#lifecycle-hooks) for the full diagram.
