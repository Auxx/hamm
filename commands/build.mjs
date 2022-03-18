import * as fs from 'fs/promises';
import * as path from 'path';
import 'zx/globals';
import { Colors, logInfo } from '../lib/logger.mjs';
import { getOverlayDir, getTargetBuildDir, loadEnvironment, loadProject } from '../lib/project.mjs';
import { replaceProjectVars } from '../lib/replacers.mjs';

export async function cmdBuild(env) {
  const project = await loadProject();

  if (project === null) {
    return;
  }

  const targetDir = getTargetBuildDir(project, env);
  const overlayDir = getOverlayDir(env);
  const config = await loadEnvironment(env);

  logInfo('\nBuild process starting...');

  logInfo(`Copying files...`);
  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile('configuration.yaml', path.join(targetDir, 'configuration.yaml'));

  if (env === 'dev') {
    await fs.copyFile('automations.yaml', path.join(targetDir, 'automations.yaml'));
    await fs.copyFile('scenes.yaml', path.join(targetDir, 'scenes.yaml'));
    await fs.copyFile('scripts.yaml', path.join(targetDir, 'scripts.yaml'));
    await fs.copyFile('secrets.yaml', path.join(targetDir, 'secrets.yaml'));
  }

  await fs.cp('dashboards', path.join(targetDir, 'dashboards'), { recursive: true });
  await fs.cp('packages', path.join(targetDir, 'packages'), { recursive: true });
  await fs.cp('custom_components', path.join(targetDir, 'custom_components'), { recursive: true });
  await fs.cp(overlayDir, targetDir, { recursive: true });

  logInfo(`Removing files and directories specified in ${ Colors.cyan }remove${ Colors.reset } section...`);
  if (config.remove instanceof Array) {
    for (const rm of config.remove) {
      const rmPath = path.join(targetDir, rm);
      await fs.rm(rmPath, { recursive: true });
      logInfo(`Removed ${ Colors.cyan }${ rmPath }${ Colors.reset }.`);
    }
  } else {
    logInfo('Nothing to remove, skipping.');
  }

  logInfo('Processing text replacements...');
  await replaceProjectVars(targetDir, config);

  logInfo('DONE!\n');
}
