import {stdin, stdout, argv} from 'process';
import {sep, resolve, isAbsolute} from 'path';
import {readdir, readFile, writeFile, rename, copyFile, rm} from 'fs/promises';
import {createInterface} from 'readline';
import {Transform} from 'stream';

// Custom
import {ALL_COMMANDS} from './../src/constants.js';
import {getCurrentDirPath} from './../src/utils.js';

async function main() {
  let currentDir = getCurrentDirPath(import.meta.url);
  const rl = createInterface({
    input: stdin,
    output: stdout,
  });
  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk);
    },
  });
  const args = {};
  argv.map((el) => {
    if (el.startsWith('--')) {
      const _arrFromString = el.slice(2).split('=');
      args[_arrFromString[0]] = _arrFromString[1];
    }
  });

  // Start CLI
  transformStream.pipe(stdout);

  // If no username set
  if (args.username === undefined) {
    transformStream.write(`Please, run command in following format "npm run start -- --username=your_username"\n`);
    rl.close();

    return false;
  }

  // Welcome message
  transformStream.write(`Welcome to the File Manager, ${args.username}!\n`);
  transformStream.write(`You are currently in ${currentDir}\n`);

  // On command
  rl.on('line', async (data) => {
    const command = data.split(' ');

    if (!ALL_COMMANDS.includes(command[0])) {
      transformStream.write('Invalid input\n');

      return false;
    }

    switch (command[0]) {
      case '.exit':
        transformStream.write(`Thank you for using File Manager, ${args.username}!\n`);
        rl.close();
        break;
      // System
      case 'up':
        const reducedPath = currentDir.split(sep);
        reducedPath.pop();
        currentDir = reducedPath.length > 1 ? reducedPath.join('/') : '/';
        transformStream.write(`You are currently in ${currentDir}\n`);
        break;
      case 'cd':
        currentDir = !isAbsolute(command[1]) ? resolve(currentDir, command[1]) : command[1];

        try {
          await readdir(currentDir);
          transformStream.write(`You are currently in ${currentDir}\n`);
        } catch {
          transformStream.write(`Folder isn't exist...\n`);
        }

        break;
      case 'ls':
        try {
          const files = await readdir(currentDir);

          for (const file of files) {
            transformStream.write(`${file}\n`);
          }
        } catch {
          transformStream.write(`Something goes wrong, please try again...\n`);
        }

        break;
      // /System
      // Basic operations with files
      case 'cat':
        try {
          const filePath = !isAbsolute(command[1]) ? resolve(currentDir, command[1]) : command[1];
          const fileText = await readFile(filePath, 'utf8');
          transformStream.write(`${fileText}\n`);
        } catch {
          transformStream.write(`Something goes wrong, please check that tha path to the file typed in correct way...\n`);
        }

        break;
      case 'add':
        try {
          await writeFile(`${currentDir}/${command[1]}`, '', {flag: 'wx'});
          transformStream.write(`File was created in the ${currentDir} directory.\n`);
        } catch {
          transformStream.write(`Seems like file that you try to create is exist...\n`);
        }

        break;
      case 'rn':
        try {
          await rename(`${currentDir}/${command[1]}`, `${currentDir}/${command[2]}`);
          transformStream.write(`File ${command[1]} was renamed with ${command[2]}.\n`);
        } catch {
          transformStream.write(`Something goes wrong, please try again...\n`);
        }

        break;
      case 'cp':
        try {
          const currentPath = !isAbsolute(command[1]) ? resolve(currentDir, command[1]) : command[1];
          const fileName = currentPath.split(sep).splice(-1);
          const targetPath = !isAbsolute(command[2]) ? resolve(currentDir, command[2]) : command[2];
          await copyFile(`${currentPath}`, `${targetPath}/${fileName}`);
          transformStream.write(`File was copied.\n`);
        } catch {
          transformStream.write(`Something goes wrong, please try again...\n`);
        }

        break;
      case 'mv':
        try {
          const currentPath = !isAbsolute(command[1]) ? resolve(currentDir, command[1]) : command[1];
          const fileName = currentPath.split(sep).splice(-1);
          const targetPath = !isAbsolute(command[2]) ? resolve(currentDir, command[2]) : command[2];
          await copyFile(`${currentPath}`, `${targetPath}/${fileName}`);
          await rm(currentPath);
          transformStream.write(`File was moved.\n`);
        } catch {
          transformStream.write(`Something goes wrong, please try again...\n`);
        }

        break;
      case 'rm':
        try {
          const targetFile = !isAbsolute(command[1]) ? resolve(currentDir, command[1]) : command[1];
          await rm(targetFile);
          transformStream.write(`File was deleted.\n`);
        } catch {
          transformStream.write(`Something goes wrong, please try again...\n`);
        }

        break;
      // /Basic operations with files
      default:
        transformStream.write(command[0]);
        break;
    }
  });

  // On exit
  process.on('SIGINT', () => {
    transformStream.write(`\nThank you for using File Manager, ${args.username}!\n`);
    rl.close();
  });
}

main();