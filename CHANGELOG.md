# [0.4.0](https://github.com/carloscortonc/cli-er/compare/v0.3.1...v0.4.0) (2022-09-07)


### Bug Fixes

* command does not get its options processed unless suplied in args ([cfe17c5](https://github.com/carloscortonc/cli-er/commit/cfe17c58cca6506d85db704703522b2c6a1005e0))
* command should not appear in parsingOutput if missing "type" property ([0a66dbe](https://github.com/carloscortonc/cli-er/commit/0a66dbee27d242ce8db2850ab391483d9855f1ea))
* remove autoincluded opts for script execution ([8b36ddb](https://github.com/carloscortonc/cli-er/commit/8b36ddb22514312fdcb0c05c991c916fe50709f8))


### Features

* allow custom help and version descriptions ([f2dc50e](https://github.com/carloscortonc/cli-er/commit/f2dc50ecbf705a6d15d839d002880d5635c98a1a))
* auto-include version option by default ([cef9bcd](https://github.com/carloscortonc/cli-er/commit/cef9bcd32ec191602d4331f8e54adc214bd2f043))
* new property "action" to be used as command callback ([70a0406](https://github.com/carloscortonc/cli-er/commit/70a040691eda6c5dba1f35d3441f0583fe757117))
* support for "number" option type ([3b24f90](https://github.com/carloscortonc/cli-er/commit/3b24f90fc1549aa9ff1b5411531111d2b93eadab))

## [0.3.1](https://github.com/carloscortonc/cli-er/compare/v0.3.0...v0.3.1) (2022-08-31)


### Bug Fixes

* **types:** types not available from plain js files ([dc78657](https://github.com/carloscortonc/cli-er/commit/dc78657b1a20010cb7bdee9cc216be0ee48c64a0))

# [0.3.0](https://github.com/carloscortonc/cli-er/compare/v0.2.0...v0.3.0) (2022-08-24)


### Features

* allow multiple appearances for list-type options ([80731c6](https://github.com/carloscortonc/cli-er/commit/80731c674290d50e0d6fb4e48a24ec83847946d0))
* set string as default option-type ([bfa621b](https://github.com/carloscortonc/cli-er/commit/bfa621bcff46a88dbe49fb7009a9a42faeedd823))
* show scoped help if run method fails ([c8b12f1](https://github.com/carloscortonc/cli-er/commit/c8b12f1817e51e09f233191432ac8da464a523e1))
* target es6 for node v12 support ([bfdc0c7](https://github.com/carloscortonc/cli-er/commit/bfdc0c7c19d75726203f15b9384570fa485ca998))


### Bug Fixes

* **types:** modify "extension" type in CliOptions ([9446ebc](https://github.com/carloscortonc/cli-er/commit/9446ebc4e7a4e00ff7e24a8491441935641066c8))

# [0.2.0](https://github.com/carloscortonc/cli-er/compare/v0.1.1...v0.2.0) (2022-08-12)


### Bug Fixes

* make use of cli-options when executing script ([9c34bae](https://github.com/carloscortonc/cli-er/commit/9c34bae4f574674b81cf14194f289c7ee0ac72b4))
* modify lodash merge behaviour with arrays ([587999b](https://github.com/carloscortonc/cli-er/commit/587999b82b40ca6ac0afca2219c448679dca8c31))
* some options are not correctly parsed ([54daf97](https://github.com/carloscortonc/cli-er/commit/54daf975e9f17a6aa0bad1fa478a6546d12e5323))
* **types:** allow optional cliOptions for nested objects ([44374b5](https://github.com/carloscortonc/cli-er/commit/44374b5e5b316e9a7a669fbb0526a29b55a8bb83))


### Features

* auto-include help option by default ([202d979](https://github.com/carloscortonc/cli-er/commit/202d979c925c67ab78b0c400559aa32493290716))
* support for scoped help ([5bbd4c8](https://github.com/carloscortonc/cli-er/commit/5bbd4c842cf662bce925725074de2ba140531a07))

## [0.1.1](https://github.com/carloscortonc/cli-er/compare/v0.1.0...v0.1.1) (2022-08-06)


### Bug Fixes

* adapt code after DefinitionElement type change ([07349a5](https://github.com/carloscortonc/cli-er/commit/07349a555216f50b776d98145a2ccdd77a176521))
* include correct types for DefinitionElement ([dca1a31](https://github.com/carloscortonc/cli-er/commit/dca1a315c872650683f0ffc3e5c7bc102bfc7f09))
