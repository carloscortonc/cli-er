<h1 align="center">cli-er</h1>
<p align="center">
Tool for building advance cli applications using a definition object, with a folder structure strategy that helps organize all the commands logic, and help generation included
</p>

## Usage

example.js:

```js
import Cli from "cli-er";

const definition = {...}

new Cli(definition).run();
```

Invocation:

```
node example.js [namespace(s)|command] [OPTIONS]
```
