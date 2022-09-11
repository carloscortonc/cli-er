CLI applications written in typescript can be executed with:

```sh
node -r ts-node/register ts-cli
```

> **Note**
> Some ts-node and tsconfig options can be used to improve transpilation/execution time (check [this example](./tsconfig.json))

## Example executions:

```shell
# No namespace/command: invoke index script
node -r ts-node/register ts-cli

# Execute "cmd" command
node -r ts-node/register ts-cli nms cmd
```
