An option can be configured with `stdin: true` to allow reading from process.stdin if available

## Example executions:

```shell
# Print the last 5 lines (n=5) of the file ./package.json
node tail.js package.json -n5

# Print the last 5 lines from provided stdin
cat package.json | node tail.js - -n5

# [tail-v2] Checking stdin manually, but "-" is no longer required
cat package.json | node tail-v2.js -n5
```
