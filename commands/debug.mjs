import { Colors, logInfo, logWarn } from '../lib/logger.mjs';
import { getOverlayDir, getTargetBuildDir, loadEnvironment, loadProject } from '../lib/project.mjs';

export async function cmdDebug(env) {
  logWarn('Debug mode.\n');

  logInfo(`Current folder: ${ Colors.cyan }${ process.cwd() }${ Colors.reset }`);

  const project = await loadProject();

  if (project === null) {
    return;
  }

  logInfo('Project configuration:');
  logInfo(`${ JSON.stringify(project, null, 2) }\n`);

  if (env === undefined) {
    logWarn('Environment was not specified, quitting.\n');
    return;
  }

  const targetDir = getTargetBuildDir(project, env);
  const overlayDir = getOverlayDir(env);
  const config = await loadEnvironment(env);

  logInfo(`\nBuild directory: ${ Colors.cyan }${ targetDir }${ Colors.reset }`);
  logInfo(`Overlay directory: ${ Colors.cyan }${ overlayDir }${ Colors.reset }`);
  logInfo(`\nEnvironment:`);
  logInfo(`${ JSON.stringify(config, null, 2) }\n`);
}
