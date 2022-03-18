import * as fs from 'fs/promises';
import { getBuildDir, getTargetBuildDir, loadProject } from '../lib/project.mjs';
import { Colors, logError, logInfo } from '../lib/logger.mjs';

export async function cmdClean(env) {
  const project = await loadProject();

  if (project === null) {
    return;
  }

  const targetDir = env === undefined
    ? getBuildDir(project)
    : getTargetBuildDir(project, env);

  logInfo(`Removing ${ Colors.cyan }${ targetDir }${ Colors.reset }...`);

  try {
    await fs.rm(targetDir, { recursive: true });
  } catch (e) {
    logError(`Removing files failed. This is most likely because ${ Colors.cyan }${ targetDir }${ Colors.reset } contains files created by Home Assistant docker image.`);
    logInfo(`\nTo remove everything manually, run:`);
    logInfo(`    ${ Colors.white }$ sudo rm -Rf ${ targetDir }${ Colors.reset }\n`);

    return;
  }

  logInfo('DONE!\n');
}
