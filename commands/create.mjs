import * as fs from 'fs/promises';
import * as path from 'path';
import 'zx/globals';

export async function cmdCreate(folder, scriptPath) {
  console.log('\nChecking if git is installed...');

  try {
    await quiet($`git --version`);
  } catch (e) {
    console.log('Git not found! Please install git to continue https://git-scm.com/\n');
    return;
  }

  const templateSource = path.join(scriptPath, 'template');

  console.log(`\nCreating new project in \x1b[36m${ folder }\x1b[0m using template from \x1b[36m${ templateSource }\x1b[0m...`);

  await fs.mkdir(folder, { recursive: true });
  await fs.cp(templateSource, folder, { recursive: true });

  console.log('\nDONE!\n');

  console.log('You can now build the project in development mode:');
  console.log('    \x1b[37m$ npx hamm build dev\x1b[0m\n');
  console.log('Or you can build it in production mode:');
  console.log('    \x1b[37m$ npx hamm build prod\x1b[0m\n');
  console.log('Once you build your configuration, you can test locally with Docker:');
  console.log('    \x1b[37m$ docker run --name homeassistant \\');
  console.log('        -p 8123:8123 \\');
  console.log('        -e \'TZ=Europe/London\' \\');
  console.log(`        -v ${ path.join(process.cwd(), folder, 'build') }:/config \\`);
  console.log('        -v /etc/localtime:/etc/localtime:ro \\');
  console.log('        ghcr.io/home-assistant/home-assistant:stable\x1b[0m\n');
  console.log('Don\'t forget to replace "Europe/London" with your local time zone!\n');

}
