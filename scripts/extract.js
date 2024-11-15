import path from 'path';
import vfs from 'vinyl-fs';
import { transform } from 'i18next-parser';
import { promisedGlob, REPO_ROOT_PATH } from './utils.js';
import { gulp as i18nextParser } from 'i18next-parser';
import * as gulp from 'gulp';

export const supportedProjectCodes = ['eusm', 'core', 'echis'];
export const supportedLocaleCodes = ['en', 'fr', 'sw'];

const defaultParserConfigs = {
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
  input: undefined,
  reactNamespace: false,
  sort: true,
  useKeysAsDefaultValue: false,
  verbose: false,
};

/** get workTree folder paths relative to repo root directory */
const getPackagesFolderPaths = async () => {
  const workspacesGlob = '{app,packages/*}';
  return promisedGlob(workspacesGlob, { cwd: REPO_ROOT_PATH }).catch(() => {
    return [];
  });
};

/**
 * Checks that cli provided package folders are actually valid
 *
 * @param packageFolders - cli provided folder names
 * @param allValidPackages - all valid semi paths
 */
const filterValidPackageFolders = (packageFolders, allValidPackages) => {
  const validNamesLookup = {};
  const validPaths = [];
  const invalidPaths = [];
  // semiPath: package path relative to the repo directory
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

const extractionRunner = (argvConfigs, packageSemiPaths) => {
  console.log({ argvConfigs });
  const { packages, locales, keyAsDefault, preserve, project, verbose, outputNamespace } =
    argvConfigs;
  let count = 0;
  packageSemiPaths.forEach((packageSemiPath) => {
    const packageName = path.basename(packageSemiPath);
    const namespace = outputNamespace ? outputNamespace : packageName;
    const inputFilesGlob = `${path.resolve(
      REPO_ROOT_PATH,
      packageSemiPath
    )}/!(node_modules|dist|build)/**/!(tests)/*.@(tsx|ts|js|jsx)`;
    const outputPath = path.resolve(
      REPO_ROOT_PATH,
      `packages/i18n/locales/${project}/$NAMESPACE/$LOCALE.json`
    );
    const parserConfigs = {
      ...defaultParserConfigs,
      defaultNamespace: namespace,
      locales,
      verbose: !!verbose,
      useKeysAsDefaultValue: !!keyAsDefault,
      createOldCatalogs: !!preserve,
      input: inputFilesGlob,
      output: outputPath,
    };

    vfs
      .src(inputFilesGlob)
      .pipe(
        new transform(parserConfigs)
          .on('reading', function (file) {
            console.log(`  [read]     ${file.path}`);
            count++;
          })
          .on('data', function (file) {
            console.log(`  [write]   ${file.path}`);
          })
          .on('error', function (message, region) {
            message += `:  ${region?.trim()}`;
            console.log(`  [error]   ${message}`);
          })
          .on('warning', function (message) {
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

export async function runExtractions(argv) {
  const { packages, outputNamespace } = argv;
  const AllPackageFolders = await getPackagesFolderPaths();

  if (packages && packages.length === 0) {
    console.log('Package Folders not specified, Running extraction on all packages');
  }

  let packageFoldersToExtract = AllPackageFolders;
  if (packages.length > 0) {
    packageFoldersToExtract = filterValidPackageFolders(packages, AllPackageFolders);
  }

  if (outputNamespace && packages.length > 1) {
    throw Error('Can only provide a namespace override when extracting from a single package only');
  }

  extractionRunner(argv, packageFoldersToExtract);
}
