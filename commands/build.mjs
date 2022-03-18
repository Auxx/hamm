import * as fs from 'fs/promises';
import * as path from 'path';
import 'zx/globals';
import { Colors, logInfo } from '../lib/logger.mjs';
import { getOverlayDir, getTargetBuildDir, loadEnvironment, loadProject } from '../lib/project.mjs';

export async function cmdBuild(env) {
  logInfo(`\nLoading build configuration for ${ Colors.cyan }${ env }${ Colors.reset } environment...`);

  const project = await loadProject();

  if (project === null) {
    return;
  }

  const targetDir = getTargetBuildDir(project, env);
  const overlayDir = getOverlayDir(env);
  const config = await loadEnvironment(env);

  logInfo('\nBuild process starting...');

  // console.log('targetDir', targetDir);
  // console.log('overlayDir', overlayDir);
  // console.log('config', config);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile('configuration.yaml', path.join(targetDir, 'configuration.yaml'));
  await fs.cp('dashboards', path.join(targetDir, 'dashboards'), { recursive: true });
  await fs.cp('packages', path.join(targetDir, 'packages'), { recursive: true });
  await fs.cp('custom_components', path.join(targetDir, 'custom_components'), { recursive: true });
  await fs.cp(overlayDir, targetDir, { recursive: true });

  logInfo('DONE!\n');
}
