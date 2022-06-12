import {dirname} from 'path';
import {fileURLToPath} from 'url';
import path from 'path';

function getCurrentFilePath(dir, file) {
  return path.join(dirname(fileURLToPath(dir)), file);
}

function getCurrentDirPath(dir) {
  return dirname(fileURLToPath(dir));
}

export {getCurrentFilePath, getCurrentDirPath};