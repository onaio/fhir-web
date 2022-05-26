/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import path from 'path';
import glob from 'glob';
import vfs from 'vinyl-fs';
import { transform } from 'i18next-parser';
import util from 'util';

const promisedGlob = util.promisify(glob);

export const defaultParserConfigs = {
  FALLBACK_LOCALE: 'en',
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  defaultValue: '',
  indentation: 2,
  keepRemoved: false,
  keySeparator: false,
  lexers: {
    hbs: ['HandlebarsLexer'],
    handlebars: [
      {
        lexer: 'HandlebarsLexer',
        functions: ['t'],
      },
    ],
    htm: ['HTMLLexer'],
    html: ['HTMLLexer'],
    mjs: ['JavascriptLexer'],
    js: ['JavascriptLexer'],
    ts: ['JavascriptLexer'],
    jsx: ['JsxLexer'],
    tsx: ['JsxLexer'],
    default: ['JavascriptLexer'],
  },
  lineEnding: 'auto',
  locales: [''],
  namespaceSeparator: '::',
  output: '',
  input: undefined as string | undefined,
  reactNamespace: false,
  sort: true,
  useKeysAsDefaultValue: false,
  verbose: false,
};

export type ParserConfigsT = typeof defaultParserConfigs;

export const REPO_ROOT_PATH = path.resolve('');

/** get worktree folder paths relative to repo root directory */
export const getPackagesFolderPaths = async () => {
  const workspacesGlob = '{app,packages/*}';
  return promisedGlob(workspacesGlob, { cwd: REPO_ROOT_PATH }).catch(() => {
    return [];
  });
};

export const filterValidPackageFolders = (packageFolders: string[], allValidPackages: string[]) => {
  const validNamesLookup: Record<string, string> = {};
  const validPaths: string[] = [];
  const invalidPaths: string[] = [];
  allValidPackages.forEach((semiPath) => {
    const parts = semiPath.split(path.sep);
    if (parts.length > 0) {
      validNamesLookup[parts[parts.length - 1]] = semiPath;
    }
  });
  packageFolders.forEach((packageFolderName) => {
    const foundSemiPath = validNamesLookup[packageFolderName];
    if (foundSemiPath) {
      validPaths.push(foundSemiPath);
    } else {
      invalidPaths.push(packageFolderName);
    }
  });
  if (invalidPaths.length > 0) {
    console.error(`These folders were not found: ${invalidPaths.join(', ')}`);
  }
  return validPaths;
};

export const supportedProjectCodes = ['eusm', 'core'] as const;
export type SupportedProjectCodes = typeof supportedProjectCodes[0];
export interface ArgvConfigs {
  locales: string[];
  projectCode: SupportedProjectCodes;
  verbose: boolean;
  useKeysAsDefaultValue: boolean;
  createOldCatalogs: boolean;
}

export const extractionRunner = (argvConfigs: ArgvConfigs, packageSemiPaths: string[]) => {
  const { locales, projectCode, verbose, useKeysAsDefaultValue, createOldCatalogs } = argvConfigs;
  let count = 0;
  packageSemiPaths.forEach((packageSemiPath) => {
    const packageName = path.basename(packageSemiPath);
    const inputFilesGlob = `${path.resolve(
      REPO_ROOT_PATH,
      packageSemiPath
    )}/!(node_modules|dist|build)/**/*.{js,tsx,ts,tsx}`;
    const outputPath = path.resolve(
      REPO_ROOT_PATH,
      `packages/i18n/locales/${projectCode}/${packageName}/$LOCALE.json`
    );
    const parserConfigs: ParserConfigsT = {
      ...defaultParserConfigs,
      defaultNamespace: packageName,
      locales,
      verbose: !!verbose,
      useKeysAsDefaultValue: !!useKeysAsDefaultValue,
      createOldCatalogs: !!createOldCatalogs,
      input: inputFilesGlob,
      output: outputPath,
    };

    vfs
      .src(inputFilesGlob)
      .pipe(
        new transform(parserConfigs)
          .on('reading', function (file: any) {
            console.log(`  [read]     ${file.path}`);
            count++;
          })
          .on('data', function (file: any) {
            console.log(`  [write]   ${file.path}`);
          })
          .on('error', function (message: string, region: string) {
            message += ': ' + region.trim();
            console.log(`  [error]   ${message}`);
          })
          .on('warning', function (message: string) {
            console.log(`  [warning]  ${message}`);
          })
          .on('finish', function () {
            console.log();
            console.log(`  Stats:  ${count} files were parsed`);
          })
      )
      .pipe(vfs.dest(process.cwd()));
  });
};
