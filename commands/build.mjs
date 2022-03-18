import 'zx/globals';
import { getOverlayDir, getTargetBuildDir, loadEnvironment, loadProject } from '../lib/project.mjs';
import { runBuildProcess } from '../lib/build-process.mjs';

export async function cmdBuild(env) {
  const project = await loadProject();

  if (project === null) {
    return;
  }

  const targetDir = getTargetBuildDir(project, env);
  const overlayDir = getOverlayDir(env);
  const config = await loadEnvironment(env);

  await runBuildProcess(env, targetDir, overlayDir, config);
}
