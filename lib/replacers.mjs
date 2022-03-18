import fs from 'fs/promises';
import { eachFile } from './files.mjs';

const projectVarPattern = /(~~[A-Z_0-9]+~~)/g;
const projectVarNamePattern = /~~([A-Z_0-9]+)~~/;

function checkFileNameMatch(fileName, rules) {
  return rules.some(rule => fileName.endsWith(rule));
}

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
    if (checkFileNameMatch(filePath, config.replaceOnlyIn)) {
      const contents = (await fs.readFile(filePath)).toString();
      const result = contents.replace(projectVarPattern, projectVarReplacer(config));
      await fs.writeFile(filePath, result);
    }
  });
}
