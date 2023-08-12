With positional arguments (since 0.11.0), isolated options can be grouped within an option.
In the case of the oficial `jest-cli`, this is used for the list of files to test (https://jestjs.io/docs/cli#--testpathpatternregex)

With `cli-er` you can define it with:

```js
{
  //...
  testPathPattern: {
    positional: true
  }
}
```

## Example executions:

```shell
# Empty list
node jest-cli.js

# Provide a list of files, mixed with other options
node jest-cli.js first-file --opt optvalue second-file
```
