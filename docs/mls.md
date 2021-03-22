# Multi-language Support (MLS)

OpenSRP Web supports multi-language using [react.i18next](https://react.i18next.com/). This document is divided into 2 sections

1. Usage - contains instructions on how consumers of the packages, can tweak mls.
2. Contributors - Targets people with the intent of either adding packages that should support MlS or maintining packages that aleardy support MLS

## Usage

**Package's MLS contract**:

- Packages here-in are configured by using the `setAllConfigs` or `setConfig` methods in `@opensrp/pkg-config`.
- They also get the `18next`-`i18n` instance from the configs, this means to use MLS, you will need to init an `i18next` instance and pass it to `@opensrp/pkg-config` configs.
- For the i18n configuration to work right of the bat, it needs to be dispatched to the configs before any code in the packages is run(i.e. before actually importing the packages themselves, that is of-course exempting the `@opensrp/pkg-config`)
- Packages will have the locales needed. Where the locales are missing or not what you want; you could load your own resource files into the configured `i18n` instance that you pass to the configs

**Configuration**

Opensrp-web packages uses 2 configuration options to fully configure MLS: `configs.languageCode` and `configs.projectLanguageCode`.

The default language is english. To set a different language, configure the config option `languageCode` with values of the ISO code of the language you want to use e.g

```tsx
import { setConfig } from `@opensrp/pkg-config`;

setConfig('languageCode', 'fr');
```

**N/B** The language should be internally available in the package of interest. If you are not sure of this check the [Adding a new language section](#adding-a-new-language)

consider where you have a certain key e.g. `Plans` that should translate to `Plans` for a certain use-case implementation but display as `Missions` in another implementation. How do we configure that in the packages. In other words how can we support different translation values for the same language

This is where the `projectLanguageCode` comes in, helpes further define what set of translations for a certain language should be used

**Why not use namespaces?**

- we are still in the initial stages of MLS, and we will continue to refine the translation workflows in the near future.

## Contributors/Maintainers

This section targets developers interested in enhancing, supporting or maintaining MLS-enabled packages.

Things to cover(in no particular order):

- Structure and Organization of the translation keys
- How the translation keys are used in the components
- Updating the locales files

the translation workflow in each package requires 2 files:

- the `src/mls`. this file is responsible for loading the locale .json files, creating a resource object and adding them to the configured `i18n` instance
- the `src/lang`. this file contains constant declarations of translatable strings. This file is a remnant of our previous MLS workflows and we might remove it in the future, by having the strings written inside the components. _Do we really need this file?_

### Adding a translatable string

For each translatable string, make sure you add the string in `app/src/lang.ts` e.g

To add a new translatable string

Before:

```tsx
<div>Just simple content</div>
```

Add the string in `app/src/lang.ts`

```ts
import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ERROR_OCCURRED = i18n.t(`An error occurred`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
// This will re-evaluate the translation string,
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
```

Reference this constant in your component e.g

```tsx
import lang from '../../../lang';
import {useTranslation} from 'react-i18next'

useTranslation()
<div>{lang.JUST_SIMPLE_CONTENT}</div>;
```

Extract the translations or add the new string to existing translations by running the command `extractTranslations` defined in `app/package.json`. In the directory `app` run the command

`yarn extractTranslations`

The new string will be added in each of the translation json files located in `src/locales/core/`. Each file in `src/locales/core` corresponds to each of the languages supported by the project as defined in the file `i18next-parser.config.js` found at the root of the project.

Upload the modified files to transifex for translation then updated each of the files with the translated strings from transifex

### Configuration at package level

To configure MLS at the package level:

1. Install `i18next-parser` as a dev dependency
2. The packages get the active `i18n` instance from `pkg-config`, they have the responsibility to then load their own resources into the i18n instance
3. Add the command `"extractTranslations": "yarn i18next 'src/**/*.{ts,tsx}' -c ../../i18next-parser.config.js"` to your package.json's `scripts` section

```json
 "scripts": {
		"extractTranslations": "yarn i18next 'src/**/*.{ts,tsx}' -c ../../i18next-parser.config.js"
	}
```

3. Create your configuration file in your package e.g `touch packages/<package-name>/src/mls.tsx` that will
   be used to load resources into `i18n`. This file contains reference to the resources that your package supports

```tsx
import i18n from 'i18next';
import { loadLanguageResources } from '@opensrp/pkg-config';

// Swahili configuration
const coreSwJson = require('../locales/core/sw.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources: LanguageResources = {
  sw_core: {
    translation: coreSwJson,
  },
};

loadLanguageResources(i18n, resources);

export default i18n;
```

Whoa!!! wait a minute, I do not have a `locales/core/sw.json` file. That's right, `packages/<package-name>/locales/core/sw.json` references the Swahili translation file but it does not exist yet. We are soon going to generate it.

`resources` is an object that defines which language resources will be available for the package. The keys are named by the format `<languageCode>_<projectCode` where `languageCode` is the ISO language code of the language to make available. `projectCode` is an alias to the the project to use or to be deployed. This is because MLS for OpenSRP can be configured at project level.

For the most part, you should always use `core` which is the default configuration unless you would like to use translations specific to a particular project. `LanguageResources` interface specifies `<languageCode>_<projectCode` language resources supported by OpenSRP Web.

4. Extract the translations or add the new string to existing translations by running the command `extractTranslations` defined in `<package-name>/package.json`. At the root of your package, run the command

`yarn extractTranslations`

The new string will be added in each of the translation json files located in `locales/core/`. Each file in `locales/core` corresponds to each of the languages supported by the project as defined in the file `i18next-parser.config.js` found at the root of the project.

5. Upload the modified files to transifex for translation then updated each of the files with the translated strings from transifex

## Configuring MLS at project level

OpenSRP Web supports MLS at project level. This is helpful if a particular project would require the strings translated differently for a particular language e.g The default name for an OpenSRP plan is **Plan** but a project may want to refer to a plan as **Mission**

To extract the translations for a project named **foo**

1. Open `18next-parser.config.js` and find the key `output`.

```js

output: 'locales/core/$LOCALE.json`
```

This attribute specifies the default location of the json files created after extracting translations.

2. Modify the output value to

```js

output: 'locales/foo/$LOCALE.json`
```

3. Change directory into each package used by project **foo** that has components with translatable strings and run the extract translations command

`yarn extractTranslations`

This will create the translations for each language in `<locales/foo/`

5. Edit `src/mls.tsx` file in each of the packages where translations were extracted and add include the newly
   added translation files to resources

Before:

```tsx
import i18n from 'i18next';
import { loadLanguageResources } from '@opensrp/pkg-config';

// Swahili configuration
const coreSwJson = require('../locales/core/sw.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources: LanguageResources = {
  sw_core: {
    translation: coreSwJson,
  },
};

loadLanguageResources(i18n, resources);

export default i18n;
```

After:

```tsx
import i18n from 'i18next';
import { loadLanguageResources } from '@opensrp/pkg-config';

// Swahili configuration
const coreSwJson = require('../locales/core/sw.json');
const fooSwJson = require('../locales/foo/sw.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources: LanguageResources = {
  sw_core: {
    translation: coreSwJson,
  },
  sw_foo: {
    translation: fooSwJson,
  },
};

loadLanguageResources(i18n, resources);

export default i18n;
```

6. Change into directory `app` and edit `18next-parser.config.js`

Before:

```js
const configs = require('../i18next-parser.config');

module.exports = {
  ...configs,
  output: 'src/locales/core/$LOCALE.json',
};
```

After:

```js
const configs = require('../i18next-parser.config');

module.exports = {
  ...configs,
  output: 'src/locales/foo/$LOCALE.json',
};
```

7. Run the command to extract the translations:

`yarn extractTranslations`

The translations for the project will be created in `src/locales/foo/`

8. Configure the config option `projectLanguageCode`

```tsx
import { setAllConfigs } from '@opensrp/pkg-config';

setAllConfigs({ projectLanguageCode: 'foo' });
```

9. Upload the modified files to transifex for translation then updated each of the files with the translated strings from transifex

When you run the client, the client display the translated strings specific to project **foo**

**N/B** Revert the changes made to `output` in `i18next-parser.config.js` and `app/i18next-parser.config.js` to `locales/core/$LOCALE.json` and `src/locales/core/$LOCALE.json` respectively as they were before.

## Adding a new language

Supported languages are defined in the `i18next-parser.config.js` found at the root of the project.

```js
...

locales: ['en', 'sw', 'fr', 'ar'],

...

```

To add a language, edit the `locales` array in `i18next-parser.config.js` and add your ISO language code.
e.g To add German

```js
...

locales: ['en', 'sw', 'fr', 'ar', 'de'],

...

```

When the command `yarn extractTranslations` is ran, a translation file for the new language will be generated
e.g `de.json` Do this for `app` and all packages that will support the new language.
