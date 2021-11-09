import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_OCCURRED = i18n.t(`An error occurred`, { ns: namespace });
  lang.SETTINGS = i18n.t('settings', { ns: namespace });
  lang.INVALIDATE_ERROR = i18n.t('Cant Invalidate', { ns: namespace });
  lang.SUCCESSFULLY_UPDATED = i18n.t('Successfully Updated', { ns: namespace });
  lang.ACTIONS = i18n.t('Actions', { ns: namespace });
  lang.YES = i18n.t('Yes', { ns: namespace });
  lang.NO = i18n.t('No', { ns: namespace });
  lang.NAME = i18n.t('Name', { ns: namespace });
  lang.DESCRIPTION = i18n.t('Description', { ns: namespace });
  lang.SETTING = i18n.t('Setting', { ns: namespace });
  lang.INHERITED_FROM = i18n.t('Inherited from', { ns: namespace });
  lang.INHERIT = i18n.t('Inherit', { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
