import path from 'path';
import glob from 'glob';
import { promisify } from 'util';
import * as fs from 'fs';
import { getLocaleFilePaths, REPO_ROOT_PATH } from './utils.js';

const promisedGlob = promisify(glob);

/** parses through an individual translation file gets the translation string and
 * appends them to the hashmap store.
 * @param {string} filePath - file path for the translation file
 * @param {Record<string, string>} unifiedJson - The hashmap store
 */
function processFile(filePath, unifiedJson) {
  const qualifiedPath = path.resolve(REPO_ROOT_PATH, filePath);
  const contents = JSON.parse(fs.readFileSync(qualifiedPath, 'utf-8'));
  Object.entries(contents).forEach(([key, value]) => {
    if (!value) {
      unifiedJson[key] = key;
    } else {
      if (key !== value) {
        unifiedJson[value] = value;
      }
      unifiedJson[key] = value;
    }
  });
}

export async function downloadStrings(projectCode = 'core', locale = 'en', outFile = undefined) {
  const unifiedJson = {};
  const resourceFiles = await getLocaleFilePaths(projectCode, locale);
  for (const resource of resourceFiles) {
    processFile(resource, unifiedJson);
  }
  const mergedTranslationFilePath =
    outFile ?? path.resolve(REPO_ROOT_PATH, `fhir-web-${projectCode}-${locale}.json`);
  fs.writeFileSync(mergedTranslationFilePath, JSON.stringify(unifiedJson, undefined, 2));
}
