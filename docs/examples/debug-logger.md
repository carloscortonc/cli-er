# Example: Debug Logger

Source: [`examples/debug-logger/`](https://github.com/carloscortonc/cli-er/tree/develop/examples/debug-logger)

Shows how to use the static `Cli.debug(namespace)` logger, similar to the popular [`debug`](https://www.npmjs.com/package/debug) package:

```sh
DEBUG=myapp node cli.js
# myapp Some message
```

See [Features → Debug logger](/guide/features#debug-logger) for the full specification.
