To create a custom option-parser the `value` property can be used, specifying the option type as "string" (default)

## Example executions:

```shell
# The custom-parser returns current undefined if no valid date is provided (Option.value since v0.6.0, Option.parser since 0.10.0)
node custom-option-parser.js

# The custom-parser will use the provided value to create a new date (Option.value since v0.6.0, Option.parser since 0.10.0)
node custom-option-parser.js --date 2022/08/04
```
