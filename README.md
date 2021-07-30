# Polar

Polar is a development environment to compile, deploy, test, run them on different networks.

## Requirements

- Node 14+
- Yarn v1.22+ or NPM `v6.0+**
- Connection to an Secret node. Follow our infrastructure README for instructions how to setup a private network.

## Setup

### Install dependencies

1. Setup Rust compiler

```
    cd infrastructure
    make setup-rust
```

## Install polar

### Installation from master.
The master branch corresponds to the latest version.

To use  `polar` on your system, follow steps below:
```bash
git clone https://github.com/arufa-research/polar.git
cd polar
yarn install
yarn build
cd packages/polar
yarn link
chmod +x $HOME/.yarn/bin/polar
```
## Usage

### Initialize a project

```bash
polar init <project-name>
```

This will create a directory `<project-name>` with boiler-plate code inside the current directory.

### Compile the project

Go to project directory:

```bash
cd <project-name>
```

Compile the project and generate `.wasm` and `.json` schema files:

```bash
polar compile .
```

## Run tests

```bash
yarn run test
```

## License

This project is forked from hardhat, and just base on the hardhat-core part then modify it under MIT license.

## Thanks

hardhat - Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software. Get Solidity stack traces & console.log.
