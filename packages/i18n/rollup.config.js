import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import path from 'path';

/**
 *  loads all @opensrp json string files in the locale folder
 */
function readLocaleFiles() {
  const localesFolder = path.resolve(__dirname, 'locales');
  const resources = {};

  const projectCodes = fs.readdirSync(localesFolder);

  for (const projectCode of projectCodes) {
    const projectCodeFolder = path.join(localesFolder, projectCode);

    const namespaces = fs.readdirSync(projectCodeFolder);
    for (const namespace of namespaces) {
      const projectNamespaceFolder = path.join(projectCodeFolder, namespace);

      const localeFiles = fs.readdirSync(projectNamespaceFolder);
      for (const localeFile of localeFiles) {
        const localeFilePath = path.join(projectNamespaceFolder, localeFile);
        const lngFromLocaleFile = path.parse(localeFilePath).name;
        const fileContent = fs.readFileSync(localeFilePath);
        const jsonFilecontent = JSON.parse(fileContent);
        const thisLanguageCode = `${lngFromLocaleFile}-${projectCode.toUpperCase()}`;
        resources[thisLanguageCode] = {
          ...resources[thisLanguageCode],
          [namespace]: jsonFilecontent,
        };
      }
    }
  }
  return resources;
}

const resources = readLocaleFiles();

const config = {
  input: 'src/index.tsx',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
    replace({
      'process.env.__OPENSRP_WEB_LANG_RESOURCES__': JSON.stringify(resources),
      preventAssignment: true,
    }),
  ],
};

export default config;
