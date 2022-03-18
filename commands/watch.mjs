import { getOverlayDir, getTargetBuildDir, loadEnvironment, loadProject } from '../lib/project.mjs';
import { Colors, logInfo } from '../lib/logger.mjs';
import { runBuildProcess } from '../lib/build-process.mjs';

export async function cmdWatch(env) {
  const project = await loadProject();

  if (project === null) {
    return;
  }

  const targetDir = getTargetBuildDir(project, env);
  const overlayDir = getOverlayDir(env);
  const config = await loadEnvironment(env);

  await runBuildProcess(env, targetDir, overlayDir, config);

  logInfo(`\nWatching changes in ${ Colors.cyan }${ process.cwd() }${ Colors.reset }...\n\n`);
}
