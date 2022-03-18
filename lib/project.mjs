import fs from 'fs/promises';
import path from 'path';
import { Colors, logError, logInfo, logWarn } from './logger.mjs';

const envRoot = 'env';
const buildRoot = 'build';
const overlayRoot = 'overlays';

const projectConfigFile = 'hamm.json';
const envConfigFile = 'config.json';
const envSecretsFile = 'secrets.json';

export async function loadProject() {
  logInfo(`\nLoading project configuration...`);

  try {
    const project = JSON.parse((await fs.readFile(projectConfigFile)).toString());

    if (project.version > 1) {
      logError(`Unsupported configuration version in \x1b[36m${ projectConfigFile }\x1b[0m!`);
      logInfo(`Version found: ${ Colors.red }${ project.version }${ Colors.reset }. Supported versions: ${ Colors.cyan }1${ Colors.reset }.\n`);
      return null;
    }

    return project;
  } catch (e) {
    logError(`${ Colors.cyan }${ projectConfigFile }${ Colors.reset } was not found in current directory.\n`);
    return null;
  }
}

export function getBuildDir(project) {
  if (project.hasOwnProperty('outputDir')) {
    return project.outputDir;
  }

  logWarn(`${ Colors.cyan }outputDir${ Colors.reset } was not specified, using ${ Colors.cyan }${ buildRoot }${ Colors.reset } directory instead.`);
  return buildRoot;
}

export function getTargetBuildDir(project, env) {
  return path.join(getBuildDir(project), env);
}

export function getOverlayDir(env) {
  return path.join(overlayRoot, env);
}

export async function loadEnvConfig(env) {
  const configFile = path.join(envRoot, env, envConfigFile);

  try {
    return JSON.parse((await fs.readFile(configFile)).toString());
  } catch (e) {
    logWarn(`Cannot load environment configuration from ${ Colors.cyan }${ configFile }${ Colors.reset }, assuming empty configuration.`);
    return {};
  }
}

export async function loadSecrets(env) {
  const secretsFile = path.join(envRoot, env, envSecretsFile);

  try {
    return JSON.parse((await fs.readFile(secretsFile)).toString());
  } catch (e) {
    logWarn(`Cannot load secrets from ${ Colors.cyan }${ secretsFile }${ Colors.reset }, assuming there are none.`);
    return {};
  }
}

export async function loadEnvironment(env) {
  logInfo(`Loading build configuration for ${ Colors.cyan }${ env }${ Colors.reset } environment...`);

  const config = await loadEnvConfig(env);
  const secrets = await loadSecrets(env);
  const result = {
    vars: {},
    ...config
  };

  result.vars = { ...result.vars, ...secrets };

  return result;
}
