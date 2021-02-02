# Multi-language Support (MLS)

OpenSRP Web supports mult-language using [react.i18next](https://react.i18next.com/). The configuration
is supported at the client level and the package level

## Setting the language

The default language for a project if not set is english. To set a different language, configure the environmental variable `REACT_APP_LANGUAGE_CODE` with values of the ISO code of the language you want to use

```sh
REACT_APP_LANGUAGE_CODE=fr
```

**N/B** The language should be available in `i18next-parser.config.js` and translations extracted and updated. If you are not sure of this check the [Adding a new language section](#adding-a-new-language)

## Adding a translatable string at the client level

For each translatable string, make sure you add the string in `app/src/lang.ts` e.g

To add a new translatable string

Before:

```tsx
<div>Just simple content</div>
```

1. Add the string in `app/src/lang.ts`

```ts
export const JUST_SIMPLE_CONTENT = i18n.t('Just simple content');
```

2. Reference this constant in your component e.g

```tsx
import { JUST_SIMPLE_CONTENT } from '../../../lang';

<div>{JUST_SIMPLE_CONTENT}</div>;
```

3. Extract the translations or add the new string to existing translations by running the command `extractTranslations` defined in `app/package.json`. In the directory `app` run the command

`yarn extractTranslations`

The new string will be added in each of the translation json files located in `src/locales/core/`. Each file in `src/locales/core` corresponds to each of the languages supported by the project as defined in the file `i18next-parser.config.js` found at the root of the project.

4. Upload the modified files to transifex for translation then updated each of the files with the translated strings from transifex

## Configuration at package level

To configure MLS at the package level:

1. Install `i18next` as a dependencies in your package and `i18next-parser` as a dev dependency

2. Add the command `"extractTranslations": "yarn i18next 'src/**/*.{ts,tsx}' -c ../../i18next-parser.config.js"` to your package.json's `scripts` section

```json
 "scripts": {
		"extractTranslations": "yarn i18next 'src/**/*.{ts,tsx}' -c ../../i18next-parser.config.js"
	}
```

3. Create your configuration file in your package e.g `touch packages/<package-name>/src/mls.tsx` that will
   be used to initialize `18ln`. This file contains reference to the resources that your package supports

```tsx
import i18n from 'i18next';
import { initializei18n, LanguageResources } from '@opensrp/pkg-config';

// Swahili configuration
const coreSwJson = require('../locales/core/sw.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources: LanguageResources = {
  sw_core: {
    translation: coreSwJson,
  },
};

initializei18n(i18n, resources);

export default i18n;
```

Whoa!!! wait a minute, I do not have a `locales/core/sw.json` file. That's right, `packages/<package-name>/locales/core/sw.json` references the Swahili translation file but it does not exist yet. We are soon going to generate it.

`resources` is an object that defines which language resources will be available for the package. The keys are named by the format `<languageCode>_<projectCode` where `languageCode` is the ISO language code of the language to make available. `projectCode` is an alias to the the project to use or to be deployed. This is because MLS for OpenSRP can be configured at project level.

For the most part, you should always use `core` which is the default configuration unless you would like to use translations specific to a particular project. `LanguageResources` interface specifies `<languageCode>_<projectCode` language resources supported by OpenSRP Web.

4. To add a translatable string

Before:

```tsx
<div>Just simple content</div>
```

Add the string in `<package-name>/src/lang.ts`

```ts
export const JUST_SIMPLE_CONTENT = i18n.t('Just simple content');
```

5. Reference this constant in your component e.g

After:

```tsx
import { JUST_SIMPLE_CONTENT } from '../../../lang';

<div>{JUST_SIMPLE_CONTENT}</div>;
```

6. Extract the translations or add the new string to existing translations by running the command `extractTranslations` defined in `<package-name>/package.json`. At the root of your package, run the command

`yarn extractTranslations`

The new string will be added in each of the translation json files located in `locales/core/`. Each file in `locales/core` corresponds to each of the languages supported by the project as defined in the file `i18next-parser.config.js` found at the root of the project.

7. Upload the modified files to transifex for translation then updated each of the files with the translated strings from transifex

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
import { initializei18n, LanguageResources } from '@opensrp/pkg-config';

// Swahili configuration
const coreSwJson = require('../locales/core/sw.json');

// the format to load the resource files: <languageCode>_<projectCode>. in small
const resources: LanguageResources = {
  sw_core: {
    translation: coreSwJson,
  },
};

initializei18n(i18n, resources);

export default i18n;
```

After:

```tsx
import i18n from 'i18next';
import { initializei18n, LanguageResources } from '@opensrp/pkg-config';

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

initializei18n(i18n, resources);

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

8. Configure the environmental variable `REACT_APP_PROJECT_LANGUAGE_CODE`

```sh
REACT_APP_PROJECT_LANGUAGE_CODE=foo
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
