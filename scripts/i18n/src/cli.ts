#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  ArgvConfigs,
  extractionRunner,
  filterValidPackageFolders,
  getPackagesFolderPaths,
  supportedProjectCodes,
  SupportedProjectCodes,
} from './i18nExtraction';

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
      } = argv;
      const AllPackageFolders = await getPackagesFolderPaths();

      if (packageFolders.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Package Folders not specified, Running extraction on all packages');
      }

      let packageFoldersToExtract = AllPackageFolders;
      if (packageFolders.length > 0) {
        packageFoldersToExtract = filterValidPackageFolders(packageFolders, AllPackageFolders);
      }

      const parserConfigs: ArgvConfigs = {
        locales,
        useKeysAsDefaultValue: useKeysAsDefaultValue as boolean,
        createOldCatalogs: createOldCatalogs as boolean,
        verbose: verbose as boolean,
        projectCode: projectCode as SupportedProjectCodes,
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
