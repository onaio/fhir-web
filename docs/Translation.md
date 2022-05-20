# Multi-language Support (MLS)

OpenSRP Web supports multi-language using [react.i18next](https://react.i18next.com/). This document is divided into 2 sections

1. Usage - contains instructions on how people can configure MLS when using packages.
2. Contributors - Targets developers with the intent of either adding packages that should support MlS or maintaining packages that already support MLS

## Usage
Install the i18n and pkg-config packages.

```sh
yarn add @opensrp/i18n @opensrp/pkg-config
```

Pass the required configs to pkg-config at the earliest point possible in your code. This should be before you import any other @opensrp packages

```typescript
// dispatch-configs.ts
import { setAllConfigs } from '@opensrp/pkg-config';

setAllConfigs({
  languageCode: 'en',
  projectCode: 'core'
})
```

```typescript
// index.js
import './dispatch-configs';
import 
```

**Configuration**

Opensrp-web packages uses 2 configuration options to fully configure MLS i.e. `languageCode` and `projectCode`.

The default language is english. To set a different language, configure the config option `languageCode` with values of the ISO code of the language you want to use. This can be done during initialization as shown above or during runtime as shown below.

```tsx
import { setConfig } from `@opensrp/pkg-config`;

setConfig('languageCode', 'fr');
```

**N/B** The language should be internally available in the package of interest. If you are not sure of this check the [Adding a new language section](#adding-a-new-language)

consider where you have a certain string e.g. `Plans` that should translate to `Plans` for a certain use-case implementation but display as `Missions` in another implementation. In other words how can we support different translation values for the same language

This is where the `projectCode` comes in, helps further define what set of translations for a certain language should be used

**Why not use namespaces?**

- we are still in the initial stages of MLS, and we will continue to refine the translation workflows in the near future.

## Contributors/Maintainers

This section targets developers interested in enhancing, supporting or maintaining MLS-enabled packages.

### MLS architecture

The `@opensrp/i18n` package includes the translation resources as static strings, it also exposes an [i18n](github.com/i18next/) instance that is
preloaded with the string resources and a context provider that provisions the `i18n` instance to you render tree. The `i18n` package relies on
`@opensrp/pkg-config` to get the initial configured language.

### Adding translatable strings

To Update the translateable strings:

Check that the strings are wrapped by a the `i18next` translator function `t`.
Run the string extraction command.

```sh
TBD
```

This should parse the code, get all transleatable strings and updated the respective json locale files in `packages/i18n`.
From here, you can use your favourite translation tools to get the translations as json files, add them to the right folders in `packages/i18n`, 
and then shoot us a PR.

### Adding a Localized package

To add a package with localization support, you only need 2 things.
1. the new package should have a peerDependency on the `@opensrp/i18n` package
2. Add a `src/mls.ts` file with the below content.

```typescript
import { useTranslation as useOrigTranslation, UseTranslationOptions } from '@opensrp/i18n';

export const namespace = '<package-folder-name>';

export const useTranslation = (ns?: string, options?: UseTranslationOptions) => {
  return useOrigTranslation(ns ? ns : namespace, options);
};
```

This hook abstraction helps add the namespace scope to the `@opensrp/i18n.useTranslation` 

## Adding a new language

Add it to package-config to propert typing.

Then run the extraction command while specifying the locale option.

```sh
TBD
```
