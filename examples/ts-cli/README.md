CLI applications written in typescript can be executed (since v0.5.0) with:

```sh
node -r ts-node/register ts-cli
```

> **Note**
> Some ts-node and tsconfig options can be used to improve transpilation/execution time (check [this example](/examples/ts-cli/tsconfig.json))

## Example executions:

```shell
# No namespace/command: invoke index script
node -r ts-node/register ts-cli

# Execute "cmd" command
node -r ts-node/register ts-cli nms cmd
```
