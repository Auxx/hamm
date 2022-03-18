import fs from 'fs/promises';
import { eachFile } from './files.mjs';

const projectVarPattern = /(~~[A-Z_0-9]+~~)/g;
const projectVarNamePattern = /~~([A-Z_0-9]+)~~/;

export function projectVarReplacer(config) {
  return match => {
    const id = match.replace(projectVarNamePattern, '$1');
    return config.vars.hasOwnProperty(id)
      ? config.vars[ id ]
      : match;
  };
}

export async function replaceProjectVars(targetDir, config) {
  await eachFile(targetDir, async (filePath) => {
    const contents = (await fs.readFile(filePath)).toString();
    const result = contents.replace(projectVarPattern, projectVarReplacer(config));
    await fs.writeFile(filePath, result);
  });
}
