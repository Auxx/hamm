#!/usr/bin/env node

import * as url from 'url';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { cmdCreate } from './commands/create.mjs';
import { cmdBuild } from './commands/build.mjs';
import { cmdClean } from './commands/clean.mjs';

const scriptPath = path.dirname(url.fileURLToPath(import.meta.url));

yargs(hideBin(process.argv))
  .command(
    'create [folder]',
    'Create new Home Assistant configuration project',
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

  .demandCommand()
  .parse();
