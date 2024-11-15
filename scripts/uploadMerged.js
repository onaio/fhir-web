import path from 'path';
import fs from 'fs';
import { ensureFilePath, getLocaleFilePaths } from './utils.js';

function processFile(filePath, unifiedJson) {
  const qualifiedPath = path.resolve(REPO_ROOT_PATH, filePath);
  ensureFilePath(qualifiedPath);
  const respectivePackageStringMap = JSON.parse(fs.readFileSync(qualifiedPath, 'utf-8'));
  const UpdatedStringMap = {};
  Object.entries(respectivePackageStringMap).forEach(([key, value]) => {
    let updateValue = unifiedJson[key];
    if (value) {
      if (key !== value) {
        updateValue = unifiedJson[value];
      }
    }
    UpdatedStringMap[key] = updateValue;
  });
  fs.writeFileSync(filePath, JSON.stringify(UpdatedStringMap, undefined, 2));
}

export async function uploadTranslations(inFile, projectCode = 'core', locale = 'en') {
  unifiedJson = JSON.parse(fs.readFileSync(inFile, 'utf-8'));
  const resourceFiles = await getLocaleFilePaths(projectCode, locale);
  for (const resource of resourceFiles) {
    processFile(resource);
  }
}
