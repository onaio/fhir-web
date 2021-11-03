import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.SEARCH = i18n.t(`Search`, { ns: namespace });
  lang.FORBIDDEN_PAGE_STATUS = i18n.t(`403`, { ns: namespace });
  lang.SOMETHING_WENT_WRONG = i18n.t(`Something went wrong`, { ns: namespace });
  lang.YOU_ARE_UNAUTHORIZED = i18n.t(`Sorry, you are not authorized to access this page`, {
    ns: namespace,
  });
  lang.ERROR = i18n.t(`Error`, { ns: namespace });
  lang.TITLE_404 = i18n.t(`404`, { ns: namespace });
  lang.RESOURCE_DOES_NOT_EXIST = i18n.t(`Sorry, the resource you requested for, does not exist`, {
    ns: namespace,
  });
  lang.GO_HOME = i18n.t(`Go home`, { ns: namespace });
  lang.GO_BACK = i18n.t(`Go back`, { ns: namespace });
  lang.SESSION_EXPIRED_TEXT = i18n.t(`Session Expired`, { ns: namespace });
  lang.ACTIONS = i18n.t(`Actions`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
