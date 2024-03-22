#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const glob = require('glob');
const vfs = require('vinyl-fs');
const { transform } = require('i18next-parser');
const util = require('util');

const promisedGlob = util.promisify(glob);

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

const REPO_ROOT_PATH = path.resolve('');

/** get worktree folder paths relative to repo root directory */
const getPackagesFolderPaths = async () => {
  const workspacesGlob = '{app,packages/*}';
  return promisedGlob(workspacesGlob, { cwd: REPO_ROOT_PATH }).catch(() => {
    return [];
  });
};

/**
 * Checks that cli provided package folders are actually valid
 *
 * @param packageFolders - cli provided foldernames
 * @param allValidPackages - all valid semipaths
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

const supportedProjectCodes = ['eusm', 'core', 'echis'];

const extractionRunner = (argvConfigs, packageSemiPaths) => {
  const {
    locales,
    projectCode,
    verbose,
    useKeysAsDefaultValue,
    createOldCatalogs,
    outputNamespace,
  } = argvConfigs;
  let count = 0;
  packageSemiPaths.forEach((packageSemiPath) => {
    const packageName = path.basename(packageSemiPath);
    const namespace = outputNamespace ?? packageName;
    const inputFilesGlob = `${path.resolve(
      REPO_ROOT_PATH,
      packageSemiPath
    )}/!(node_modules|dist|build)/**/!(*.test).@(tsx|ts|js|jsx)`;
    const outputPath = path.resolve(
      REPO_ROOT_PATH,
      `packages/i18n/locales/${projectCode}/$NAMESPACE/$LOCALE.json`
    );
    const parserConfigs = {
      ...defaultParserConfigs,
      defaultNamespace: namespace,
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
          .on('reading', function (file) {
            console.log(`  [read]     ${file.path}`);
            count++;
          })
          .on('data', function (file) {
            console.log(`  [write]   ${file.path}`);
          })
          .on('error', function (message, region) {
            message += `:  ${region.trim()}`;
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

yargs(hideBin(process.argv))
  .command(
    'extract [packageFolders..]',
    'Extract locale json files to i18n package',
    (builder) => {
      return builder
        .positional('packageFolders', {
          describe: 'packages where extraction shoud happen',
          type: 'string',
          demandOption: true,
        })
        .options({
          locales: {
            default: 'en',
            describe: 'Extracted strings will be put in [locale].json file',
            type: 'string',
            alias: 'l',
          },
          'project-code': {
            default: 'core',
            describe: 'Parent level namespace for storing/loading translation files',
            choices: supportedProjectCodes,
            alias: 'p',
          },
          'use-keys-as-default-value': {
            default: false,
            describe: 'Duplicate key to also be value',
            type: 'boolean',
          },
          'create-old-catalogs': {
            default: false,
            describe: 'Retain removed translations in separate json files',
            type: 'boolean',
          },
          'output-namespace': {
            default: false,
            describe:
              'Manually override the namespace/package under which the translations will be written to',
            type: 'string',
            alias: 'n',
          },
        })
        .array(['locales', 'packageFolders']);
    },
    async (argv) => {
      const {
        packageFolders,
        locales,
        useKeysAsDefaultValue,
        createOldCatalogs,
        projectCode,
        verbose,
        outputNamespace,
      } = argv;
      const AllPackageFolders = await getPackagesFolderPaths();

      if (packageFolders.length === 0) {
        console.log('Package Folders not specified, Running extraction on all packages');
      }

      let packageFoldersToExtract = AllPackageFolders;
      if (packageFolders.length > 0) {
        packageFoldersToExtract = filterValidPackageFolders(packageFolders, AllPackageFolders);
      }

      if (outputNamespace && packageFolders.length > 1) {
        throw Error(
          'Can only provide a namespace override when extracting from a single package only'
        );
      }

      const parserConfigs = {
        locales,
        useKeysAsDefaultValue,
        createOldCatalogs,
        verbose,
        projectCode,
        outputNamespace,
      };
      extractionRunner(parserConfigs, packageFoldersToExtract);
    }
  )
  .option('verbose', {
    alias: 'v',
    default: false,
    boolean: true,
  })
  .demandCommand()
  .help()
  .parse();
