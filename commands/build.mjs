import * as fs from 'fs/promises';
import * as path from 'path';
import 'zx/globals';
import { Colors, logError, logInfo, logWarn } from '../lib/logger.mjs';

async function loadProject() {
  try {
    return JSON.parse((await fs.readFile('hamm.json')).toString());
  } catch (e) {
    return null;
  }
}

function getTargetDir(project) {
  if (project.hasOwnProperty('outputDir')) {
    return project.outputDir;
  }

  logWarn(`${ Colors.cyan }outputDir${ Colors.reset } was not specified, using ${ Colors.cyan }build${ Colors.reset } directory instead.`);
  return 'build';
}

async function loadEnvConfig(env) {
  const configFile = path.join('env', env, 'config.json');

  try {
    return JSON.parse((await fs.readFile(configFile)).toString());
  } catch (e) {
    logWarn(`Cannot load environment configuration from ${ Colors.cyan }${ configFile }${ Colors.reset }, assuming empty configuration...`);
    return {};
  }
}

async function loadSecrets(env) {
  const secretsFile = path.join('env', env, 'secrets.json');

  try {
    return JSON.parse((await fs.readFile(secretsFile)).toString());
  } catch (e) {
    logWarn(`Cannot load secrets from ${ Colors.cyan }${ secretsFile }${ Colors.reset }, assuming there are none...`);
    return {};
  }
}

async function loadEnvironment(env) {
  const config = await loadEnvConfig(env);
  const secrets = await loadSecrets(env);
  const result = {
    vars: {},
    ...config
  };

  result.vars = { ...result.vars, ...secrets };

  return result;
}

export async function cmdBuild(env) {
  logInfo(`\nLoading build configuration for ${ Colors.cyan }${ env }${ Colors.reset } environment...`);

  const project = await loadProject();

  if (project === null) {
    logError(`${ Colors.cyan }hamm.json${ Colors.reset } was not found in current directory.\n`);
    return;
  }

  if (project.version > 1) {
    logError('Unsupported configuration version in \x1b[36mhamm.json\x1b[0m!');
    logInfo(`Version found: ${ Colors.red }${ project.version }${ Colors.reset }. Supported versions: ${ Colors.cyan }1${ Colors.reset }.\n`);
    return;
  }

  const targetDir = path.join(getTargetDir(project), env);
  const config = await loadEnvironment(env);

  logInfo('\nBuild process starting...');

  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile('configuration.yaml', path.join(targetDir, 'configuration.yaml'));
  await fs.cp('dashboards', path.join(targetDir, 'dashboards'), { recursive: true });
  await fs.cp('packages', path.join(targetDir, 'packages'), { recursive: true });
  await fs.cp('custom_components', path.join(targetDir, 'custom_components'), { recursive: true });
  // await fs.cp(overlay, targetDir, { recursive: true });
}
