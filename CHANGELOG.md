# [0.13.0](https://github.com/carloscortonc/cli-er/compare/v0.12.1...v0.13.0) (2023-10-18)


### Bug Fixes

* update script default-import logic ([#72](https://github.com/carloscortonc/cli-er/issues/72)) ([850bb6c](https://github.com/carloscortonc/cli-er/commit/850bb6c11f7de2e87e63db43908d2a7f29d62799))


### Features

* allow relative/absolute paths on `CliOptions.commandsPath` ([#71](https://github.com/carloscortonc/cli-er/issues/71)) ([173a230](https://github.com/carloscortonc/cli-er/commit/173a230d105b63acad143ce13808bb4efafc0760))
* new debug trace-mode ([#67](https://github.com/carloscortonc/cli-er/issues/67)) ([5c92403](https://github.com/carloscortonc/cli-er/commit/5c9240331441c6f5a63fe401574272a755edca01))
* show suggestions for unknown options ([#68](https://github.com/carloscortonc/cli-er/issues/68)) ([5b5a5cd](https://github.com/carloscortonc/cli-er/commit/5b5a5cd44775de2794356d906ce534eeb3a82890))
* use tty columns when generating help ([#63](https://github.com/carloscortonc/cli-er/issues/63)) ([cc95ea9](https://github.com/carloscortonc/cli-er/commit/cc95ea9a1ce5cc9c98ae6796fe2d7f23af2fe175))


### Performance Improvements

* **dependencies:** remove fastest-levenshtein ([#69](https://github.com/carloscortonc/cli-er/issues/69)) ([f0b980a](https://github.com/carloscortonc/cli-er/commit/f0b980a21190dbb6d4b37ea38fb10d11fb7ed890))

## [0.12.1](https://github.com/carloscortonc/cli-er/compare/v0.12.0...v0.12.1) (2023-09-20)


### Bug Fixes

* wrong generated paths for root commands ([#65](https://github.com/carloscortonc/cli-er/issues/65)) ([ebe562a](https://github.com/carloscortonc/cli-er/commit/ebe562ae757254ab1390cea5c7a947513b00c81f))

# [0.12.0](https://github.com/carloscortonc/cli-er/compare/v0.11.0...v0.12.0) (2023-09-08)


### Features

* allow overwriting version implementation ([#53](https://github.com/carloscortonc/cli-er/issues/53)) ([6eef720](https://github.com/carloscortonc/cli-er/commit/6eef7208746809e59aa8acd9cae00c5376757bc9))
* command may define aliases ([#59](https://github.com/carloscortonc/cli-er/issues/59)) ([2c88183](https://github.com/carloscortonc/cli-er/commit/2c88183ab04c8733588fd8fc8831f92fb87cd492))
* implement negated boolean options ([#51](https://github.com/carloscortonc/cli-er/issues/51)) ([7255686](https://github.com/carloscortonc/cli-er/commit/7255686b2d1223b437166b00814493a0f617da25))
* improve message-formatting api ([#55](https://github.com/carloscortonc/cli-er/issues/55)) ([ce8c852](https://github.com/carloscortonc/cli-er/commit/ce8c852ff221e58d36cdbdf741d2f6822805d91e))
* lookup elements descriptions inside messages ([#54](https://github.com/carloscortonc/cli-er/issues/54)) ([e69c95d](https://github.com/carloscortonc/cli-er/commit/e69c95d59a276dd3edeebd1d7451b42a14bc3656))
* set exitCode when debug-logs are generated ([#58](https://github.com/carloscortonc/cli-er/issues/58)) ([485b878](https://github.com/carloscortonc/cli-er/commit/485b878e8118202346eed99fa96c068b65cd54cd))
* support new option-value syntax ([#56](https://github.com/carloscortonc/cli-er/issues/56)) ([47b64a6](https://github.com/carloscortonc/cli-er/commit/47b64a64c1861786b0c5efe8820a03eef30a5082))
* support short alias boolean concatenation ([#57](https://github.com/carloscortonc/cli-er/issues/57)) ([f9f5a27](https://github.com/carloscortonc/cli-er/commit/f9f5a27fefe14d2e083f0f8d87876a6bd0787fbb))


### Bug Fixes

* preserve string rootCommand in executeScript ([#52](https://github.com/carloscortonc/cli-er/issues/52)) ([0d96f6f](https://github.com/carloscortonc/cli-er/commit/0d96f6f6a3cdda3dd77fb33451f444f1b26da8eb))

# [0.11.0](https://github.com/carloscortonc/cli-er/compare/v0.10.1...v0.11.0) (2023-08-06)


### Features

* allow defining a default command ([#42](https://github.com/carloscortonc/cli-er/issues/42)) ([1b33b66](https://github.com/carloscortonc/cli-er/commit/1b33b667cdcf416187fda7603cf3a2b5ca965186))
* allow defining custom messages ([#43](https://github.com/carloscortonc/cli-er/issues/43)) ([fd0350e](https://github.com/carloscortonc/cli-er/commit/fd0350e8973215975a17733e1ce37882b0be4721))
* implement positional arguments ([#47](https://github.com/carloscortonc/cli-er/issues/47)) ([89cfb69](https://github.com/carloscortonc/cli-er/commit/89cfb69c6714ed51d6a00ed5f6ba3e88e470e9bc))
* implement stop-parsing symbol ([#44](https://github.com/carloscortonc/cli-er/issues/44)) ([99a6c8d](https://github.com/carloscortonc/cli-er/commit/99a6c8db8aafe2d5448b7d8a0403846687f50c69))
* infer Element.kind when possible ([#41](https://github.com/carloscortonc/cli-er/issues/41)) ([61817c8](https://github.com/carloscortonc/cli-er/commit/61817c820a976f0a03a0c8234e23c4dbc9d547a1))


### Performance Improvements

* **dependencies:** remove lodash.clonedeep ([#45](https://github.com/carloscortonc/cli-er/issues/45)) ([3193e4d](https://github.com/carloscortonc/cli-er/commit/3193e4dafc1400d5b0fa26fc39ff1c1201f99d12))

## [0.10.1](https://github.com/carloscortonc/cli-er/compare/v0.10.0...v0.10.1) (2023-04-22)


### Bug Fixes

* avoid showing onFail deprecation when not used ([#39](https://github.com/carloscortonc/cli-er/issues/39)) ([0b1fcf9](https://github.com/carloscortonc/cli-er/commit/0b1fcf96e7c0d57ea0c7724cecc76cd9d8e71923))

# [0.10.0](https://github.com/carloscortonc/cli-er/compare/v0.9.2...v0.10.0) (2023-04-22)


### Bug Fixes

* env variables should overwrite cliOptions ([#36](https://github.com/carloscortonc/cli-er/issues/36)) ([0cd211f](https://github.com/carloscortonc/cli-er/commit/0cd211f394280359459bbe56c5972dea9568009a))


### Performance Improvements

* **dependencies:** remove lodash.mergewith ([#35](https://github.com/carloscortonc/cli-er/issues/35)) ([012c3e5](https://github.com/carloscortonc/cli-er/commit/012c3e557ab79f0d5b99942087bb45a41aab1114))


### Features

* allow custom option parser ([#33](https://github.com/carloscortonc/cli-er/issues/33)) ([e643234](https://github.com/carloscortonc/cli-er/commit/e6432348b209262a5101687020fc762bcc7d3072))
* allow to overwrite all fields of version and help ([#29](https://github.com/carloscortonc/cli-er/issues/29)) ([97ef5c9](https://github.com/carloscortonc/cli-er/commit/97ef5c9c3634b68bbf2dd2bbf9217f21f6314aa2))
* create new debug mode for developing ([#28](https://github.com/carloscortonc/cli-er/issues/28)) ([c2ec2d3](https://github.com/carloscortonc/cli-er/commit/c2ec2d303c4978ccc06dd5e53fedbf365218297d))
* improve error handler, allow customization ([#27](https://github.com/carloscortonc/cli-er/issues/27)) ([c4bb1c5](https://github.com/carloscortonc/cli-er/commit/c4bb1c5df0d764792398eb483f2135ad39631448))
* print deprecations in debug mode ([#34](https://github.com/carloscortonc/cli-er/issues/34)) ([e936f45](https://github.com/carloscortonc/cli-er/commit/e936f45a5c1dadea8e0a7c4952483edd9ce02e54))
* types available through named exports ([#30](https://github.com/carloscortonc/cli-er/issues/30)) ([1486085](https://github.com/carloscortonc/cli-er/commit/148608592ab098efa6d9b0803b015c1248b1eced))

## [0.9.2](https://github.com/carloscortonc/cli-er/compare/v0.9.1...v0.9.2) (2023-04-09)


### Bug Fixes

* evaluate only appropriate parser ([#25](https://github.com/carloscortonc/cli-er/issues/25)) ([aa6eb72](https://github.com/carloscortonc/cli-er/commit/aa6eb727d19bb7534257d35d3147141fc190eba2))

## [0.9.1](https://github.com/carloscortonc/cli-er/compare/v0.9.0...v0.9.1) (2023-03-26)


### Bug Fixes

* differentiate windows vs unix paths ([#22](https://github.com/carloscortonc/cli-er/issues/22)) ([6464e1e](https://github.com/carloscortonc/cli-er/commit/6464e1e4a2e1d2d0a254a3120658d3423c82e3ea))
* entrypoint file may be symlink ([#21](https://github.com/carloscortonc/cli-er/issues/21)) ([a2adb6a](https://github.com/carloscortonc/cli-er/commit/a2adb6a2d6f8592cec6d4e3d57b445aeb15b5c15))
* hide required option error when help requested ([#23](https://github.com/carloscortonc/cli-er/issues/23)) ([50f7acb](https://github.com/carloscortonc/cli-er/commit/50f7acb466a188028314fd0395374f9172f8d6a6))

# [0.9.0](https://github.com/carloscortonc/cli-er/compare/v0.8.0...v0.9.0) (2023-03-25)


### Features

* generate all possible paths from location ([#18](https://github.com/carloscortonc/cli-er/issues/18)) ([5794c1d](https://github.com/carloscortonc/cli-er/commit/5794c1d1d4083c383ef6ce4bcb775ff41b32c0d1))
* improve types and type checking ([2482f22](https://github.com/carloscortonc/cli-er/commit/2482f2264d75616d33be6cbeb0c913890ecf3296))
* support required options ([#19](https://github.com/carloscortonc/cli-er/issues/19)) ([c3c47d0](https://github.com/carloscortonc/cli-er/commit/c3c47d09ccc9eef16cae2bba5fd5e302a81e5863))


### Bug Fixes

* support esm for executing scripts ([#17](https://github.com/carloscortonc/cli-er/issues/17)) ([0e19f75](https://github.com/carloscortonc/cli-er/commit/0e19f755178f55c01703d4eeee9cb40a1f525b9d))

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
