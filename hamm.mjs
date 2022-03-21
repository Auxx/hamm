#!/usr/bin/env node

import * as url from 'url';
import * as path from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { cmdCreate } from './commands/create.mjs';
import { cmdBuild } from './commands/build.mjs';
import { cmdClean } from './commands/clean.mjs';
import { cmdDebug } from './commands/debug.mjs';
import { cmdWatch } from './commands/watch.mjs';

const scriptPath = path.dirname(url.fileURLToPath(import.meta.url));

yargs(hideBin(process.argv))
  .command(
    'create [folder]',
    'Create new Home Assistant configuration project.',
    y => y.positional('folder', { describe: 'path to target folder (will be created)' }).demandOption('folder'),
    argv => cmdCreate(argv.folder, scriptPath))

  .command(
    'build [environment]',
    'Build configuration for the specific environment',
    y => y
      .positional('environment', { describe: 'Target environment ("dev" or "prod")' })
      .choices('environment', [ 'dev', 'prod' ])
      .demandOption('environment'),
    argv => cmdBuild(argv.environment))

  .command(
    'clean [environment]',
    'Clean build directory.',
    y => y
      .positional('environment', { describe: 'Target environment ("dev" or "prod", not specified for all)' })
      .choices('environment', [ 'dev', 'prod' ]),
    argv => cmdClean(argv.environment))

  .command(
    'debug [environment]',
    'Prints out current project settings and stuff.',
    y => y
      .positional('environment', { describe: 'Target environment ("dev" or "prod", not specified for all)' })
      .choices('environment', [ 'dev', 'prod' ]),
    argv => cmdDebug(argv.environment, scriptPath))

  .command(
    'watch [environment]',
    'Watches file changes and re-builds the project automatically.',
    y => y
      .positional('environment', { describe: 'Target environment ("dev" or "prod")' })
      .choices('environment', [ 'dev', 'prod' ])
      .demandOption('environment'),
    argv => cmdWatch(argv.environment))

  .demandCommand()
  .parse();
