This examples ilustrates a common namespace `config` that may exist among other namespaces/commands.

## Example executions:

```shell
# Retrieve all configuration
node config.js config
# Above is the same as:
node config.js config get

# Retrieve the configuration for a given key
node config.js config key
# Above is the same as:
node config.js config get key

# Update a configuration entry
node config.js config set key value
```
