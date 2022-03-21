# HAMM - Home Assistant configuration Manager (M)

HAMM aims to make Home Assistant configuration testable, repeatable and reusable. It provides tools
to set up multiple independent HA instances for testing and production deployment and managing
configuration from a single source of truth which can be stored in a version control system like GIT.

## Prerequisites

1. HAMM only works in UNIX-like systems like Linux or BSD. MS Windows users should use
   [WSL2](https://docs.microsoft.com/en-us/windows/wsl/).
2. [Node.js](https://nodejs.org/) version 16 or above is required. If you need to use multiple versions of Node.js
   on your machine, use [nvm](https://github.com/nvm-sh/nvm).
3. [Git](https://git-scm.com/) should also be installed on your machine.

## Usage

### Installation

There is no need to install HAMM manually. Just run the commands through `npx` utility which is part of Node.js.

### Create a new project

First you need to create a new project. To do that run

```shell
$ npx hamm create path/to/project
```

Replace `path/to/project` with a path to a directory which should contain project files.
The directory will be created for you.

### Project structure

`hamm.json` contains basic configuration for the project.

`env` directory contains environment specific configuration. Only two environments are supported at the moment:
`dev` and `prod`.

`src` contains your Home Assistant configuration files.

`overlays` contains configuration files specific to each environment which will be written over `src` contents
during build process.

### Building the project

To build the project for `dev` environment run

```shell
$ npx hamm build dev
```

To build the project for `prod` environment run

```shell
$ npx hamm build prod
```

Results of the build process can be found in `build` directory.

### Watch mode

HAMM supports watch mode. In watch mode the project will be auto-rebuilt every time changes are saved to disk.

```shell
$ npx hamm watch dev
```

### Clean

To clean the `build` directory, run

```shell
$ npx hamm clean [ENVIRONMENT]
```

Where `ENVIRONMENT` can be either `dev`, `prod`, or not present. If `ENVIRONMENT` is not present, the whole
`build` directory will be removed.

### Debug

Debug command will print out current HAMM state and its configuration.

```shell
$ npx hamm debug [ENVIRONMENT]
```

Where `ENVIRONMENT` can be either `dev`, `prod`, or not present. If `ENVIRONMENT` is not present,
environment configuration output will be skipped.
