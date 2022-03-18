import * as fs from 'fs/promises';
import { getBuildDir, getTargetBuildDir, loadProject } from '../lib/project.mjs';
import { Colors, logInfo } from '../lib/logger.mjs';

export async function cmdClean(env) {
  const project = await loadProject();

  if (project === null) {
    return;
  }

  const targetDir = env === undefined
    ? getBuildDir(project)
    : getTargetBuildDir(project, env);

  logInfo(`Removing ${ Colors.cyan }${ targetDir }${ Colors.reset }...`);

  await fs.rm(targetDir, { recursive: true });

  logInfo('DONE!\n');
}
