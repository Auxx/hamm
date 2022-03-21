import * as fs from 'fs/promises';
import * as path from 'path';

import 'zx/globals';

import { Colors, logError, logInfo, printDockerCommand } from '../lib/logger.mjs';
import { getTemplateDir } from '../lib/project.mjs';

export async function cmdCreate(folder, scriptPath) {
  logInfo('\nChecking if git is installed...');

  try {
    await quiet($`git --version`);
  } catch (e) {
    logError('Git not found! Please install git to continue https://git-scm.com/\n');
    return;
  }

  await fs.mkdir(folder, { recursive: true });

  logInfo('Preparing Virtual Components for Home Assistant...');

  const vchaPath = path.join(folder, 'vcha');
  await quiet($`git clone https://github.com/twrecked/hass-virtual.git ${ vchaPath }`);
  await fs.cp(path.join(vchaPath, 'custom_components'), path.join(folder, 'custom_components'), { recursive: true });
  await fs.rm(vchaPath, { recursive: true });

  const templateSource = getTemplateDir(scriptPath);

  logInfo(`\nCreating new project in \x1b[36m${ folder }\x1b[0m using template from \x1b[36m${ templateSource }\x1b[0m...`);

  await fs.cp(templateSource, folder, { recursive: true });

  logInfo('\nDONE!\n');

  logInfo('Change to project directory:');
  logInfo(`    ${ Colors.white }$ cd ${ folder }${ Colors.reset }\n`);

  logInfo('You can now build the project in development mode:');
  logInfo(`    ${ Colors.white }$ npx hamm build dev${ Colors.reset }\n`);

  logInfo('Once you build your configuration, you can test locally with Docker:');
  printDockerCommand(path.join(process.cwd(), folder, 'build', 'dev'));
  logInfo('Don\'t forget to update your local time zone if necessary!\n');

  logInfo('Or you can build it in production mode:');
  logInfo(`    ${ Colors.white }$ npx hamm build prod${ Colors.reset }\n`);
}
