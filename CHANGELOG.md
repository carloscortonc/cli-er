# [0.8.0](https://github.com/carloscortonc/cli-er/compare/v0.7.2...v0.8.0) (2023-03-05)


### Bug Fixes

* help-sections not replaced on execution error ([6baa1c5](https://github.com/carloscortonc/cli-er/commit/6baa1c55216f6e512c556c7f97935b492b3c3a7e))
* preference for option-alias over option value ([68157af](https://github.com/carloscortonc/cli-er/commit/68157afa7321de9dae09c4c99c114474884e743b))
* version option not detected ([4495be2](https://github.com/carloscortonc/cli-er/commit/4495be2a61fd93af338e3dfd9ef401bdf401efbd))


### Performance Improvements

* **dependencies:** remove read-pkg-up ([51b11f5](https://github.com/carloscortonc/cli-er/commit/51b11f5952d44be11d4ed8bfe2025a386bf31015))


### Features

* allow templating generated help ([8b6c8fc](https://github.com/carloscortonc/cli-er/commit/8b6c8fcc0f78818fb9dc1cd33eb6c05021a1a8ed))
* generate error for options without value ([8d0c8a2](https://github.com/carloscortonc/cli-er/commit/8d0c8a2bb84bc04500e1b9609fff55d959551c3d))
* show cli-description when printing root help ([bac2886](https://github.com/carloscortonc/cli-er/commit/bac2886e9033dc231d3a7def8e03f675e825a8ba))
* show full help when no root-command is registered and target location is empty ([89008ff](https://github.com/carloscortonc/cli-er/commit/89008ff88b8aad24641a4cbd29ab8621735b374f))
* show scoped-help when a namespace is invoked ([2e5a06f](https://github.com/carloscortonc/cli-er/commit/2e5a06fc7c6d36e64d7c096ba439085435563d96))

## [0.7.2](https://github.com/carloscortonc/cli-er/compare/v0.7.1...v0.7.2) (2023-02-18)


### Bug Fixes

* register and log errors in scoped-help ([1ec5ff2](https://github.com/carloscortonc/cli-er/commit/1ec5ff20c4dfbf4a85f994057e4d0ec18070612a))

## [0.7.1](https://github.com/carloscortonc/cli-er/compare/v0.7.0...v0.7.1) (2023-02-17)


### Bug Fixes

* error when executing "-h" with no other args ([384a7bf](https://github.com/carloscortonc/cli-er/commit/384a7bfc9258946379330ee5de2cf31cafc61a8b))

# [0.7.0](https://github.com/carloscortonc/cli-er/compare/v0.6.0...v0.7.0) (2023-02-12)


### Bug Fixes

* behaviour on scoped-help with wrong location ([83cd6d3](https://github.com/carloscortonc/cli-er/commit/83cd6d32cc1505d6ea92014a48ee90a692fd8849))
* include inherited options in scoped help ([53a5b40](https://github.com/carloscortonc/cli-er/commit/53a5b4039fc0aade15bf8bdc5a3e142686830cca))


### Features

* allow to override cli-app version and name ([5ada4c6](https://github.com/carloscortonc/cli-er/commit/5ada4c67b81ef394002f8bd06bbc09811e483582))
* consider entry-filename as script path ([25c6d47](https://github.com/carloscortonc/cli-er/commit/25c6d47d0737bd430eaa0c0901fd1f6e4b833fdc))
* show error message when script execution fails ([c81f0d5](https://github.com/carloscortonc/cli-er/commit/c81f0d5d98dae1ccd9c4dc033d7bbce52b3ab938))

# [0.6.0](https://github.com/carloscortonc/cli-er/compare/v0.5.0...v0.6.0) (2022-10-07)


### Features

* allow custom logger ([0a69731](https://github.com/carloscortonc/cli-er/commit/0a69731873d1b279065001fa0aa98dab1335f099)) [/github.com/lirantal/nodejs-cli-apps-best-practices#14](https://github.com//github.com/lirantal/nodejs-cli-apps-best-practices/issues/14)
* correct use of exit codes when error occurs ([13e7562](https://github.com/carloscortonc/cli-er/commit/13e7562f2272c3670828a6d9523549116b421c66)) [/github.com/lirantal/nodejs-cli-apps-best-practices#64](https://github.com//github.com/lirantal/nodejs-cli-apps-best-practices/issues/64)
* document command type in generated help ([b40c4d3](https://github.com/carloscortonc/cli-er/commit/b40c4d338dd8b0bfcadf3b8e47f47ad97578515e))
* generate error for option with wrong value ([70a95c0](https://github.com/carloscortonc/cli-er/commit/70a95c01615422fc867c07a0d8d847f521cf7efd))
* new option.value to modify parsed result ([41f8a35](https://github.com/carloscortonc/cli-er/commit/41f8a35c89d5ea4f6b7814607d7abbbf2b5c82d6))
* support for "float" option type ([365e930](https://github.com/carloscortonc/cli-er/commit/365e930566a93368ca991e5d8811c4ede065863c))

# [0.5.0](https://github.com/carloscortonc/cli-er/compare/v0.4.0...v0.5.0) (2022-09-16)


### Features

* allow to hide elements in generated help ([97149cb](https://github.com/carloscortonc/cli-er/commit/97149cb72132d22184d12126f513c63cfdf3c363))
* enable invocation in options-only definition ([aa45f2e](https://github.com/carloscortonc/cli-er/commit/aa45f2ec1dd51cbf8fb5146501df83b2bab09973))
* identify wrong options ([e3f1868](https://github.com/carloscortonc/cli-er/commit/e3f1868f4c9a6c24c200c1de5873493b48fd8a94))
* show suggestion when command not found ([bb4beb2](https://github.com/carloscortonc/cli-er/commit/bb4beb262f2ebd9cf85e7b3e6ba91f5ebecc1864))
* support for ts-scripts execution ([f85ac74](https://github.com/carloscortonc/cli-er/commit/f85ac74a227da3b8f960beb1a791f7e1d9ce7407))


### Bug Fixes

* command with no options breaks help ([9559f83](https://github.com/carloscortonc/cli-er/commit/9559f83c37ac012cb4b69e23094a7e617e00fcf0))

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
