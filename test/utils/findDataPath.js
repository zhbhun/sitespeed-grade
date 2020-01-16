const fs = require('fs');
const path = require('path');

async function findDataPath(target) {
  const list = await fs.promises.readdir(target);
  if (list.some(item => item === 'data')) {
    return path.resolve(target, 'data');
  }
  for (let index = 0; index < list.length; index += 1) {
    const subPath = path.resolve(target, list[index]);
    const stat = await fs.promises.stat(subPath);
    if (stat.isDirectory()) {
      const result = findDataPath(path.resolve(subPath));
      if (result) {
        return result;
      }
    }
  }
  return null;
};

module.exports = findDataPath;
