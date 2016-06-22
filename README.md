## Installation

``` bash
npm install static-build -g
```

## Usage


``` bash
Usage: static-build [options]

Options:
  --dev       watch the changes and start a server for developing
  -s, --src   the source file directory                               [required]
  -d, --dist  the distination directory to be built into

Examples:
  static-build -s .  use files in current directory to build
```


## Contribution Guide

``` bash

# build for publish
make build

# run tests
make test
```
