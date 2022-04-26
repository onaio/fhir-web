import { Resource } from 'i18next';

// PS: process.env. __OPENSRP_WEB_LANG_RESOURCES__ is not a real environment variable
// its a placeholder for where we will insert the tranlsation string json files data during
// build.
export const resources = process.env.__OPENSRP_WEB_LANG_RESOURCES__ as unknown as Resource;
