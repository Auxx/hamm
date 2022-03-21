import fs from 'fs/promises';
import path from 'path';

export async function eachFile(folder, callback) {
  try {
    const list = await fs.readdir(folder);

    for (const f of list) {
      const filePath = path.join(folder, f);

      if ((await fs.lstat(filePath)).isDirectory()) {
        await eachFile(filePath, callback);
      } else {
        await callback(filePath);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export async function copyIfNotExist(source, target) {
  try {
    await fs.access(target);
  } catch (e) {
    await fs.copyFile(source, target);
  }
}
