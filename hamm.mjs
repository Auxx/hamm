#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { cmdCreate } from './commands/create.mjs';
import * as url from 'url';
import * as path from 'path';

const scriptPath = path.dirname(url.fileURLToPath(import.meta.url));

yargs(hideBin(process.argv))
  .command(
    'create [folder]',
    'Create new Home Assistant configuration project',
    y => y.positional('folder', { describe: '' }).demandOption('folder'),
    argv => cmdCreate(argv.folder, scriptPath))
  .demandCommand()
  .parse();
