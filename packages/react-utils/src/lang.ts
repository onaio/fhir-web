import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.SEARCH = i18n.t(`${namespace}::Search`);
  lang.FORBIDDEN_PAGE_STATUS = i18n.t(`${namespace}::403`);
  lang.SOMETHING_WENT_WRONG = i18n.t(`${namespace}::Something went wrong`);
  lang.YOU_ARE_UNAUTHORIZED = i18n.t(
    `${namespace}::Sorry, you are not authorized to access this page`
  );
  lang.ERROR = i18n.t(`${namespace}::Error`);
  lang.TITLE_404 = i18n.t(`${namespace}::404`);
  lang.RESOURCE_DOES_NOT_EXIST = i18n.t(
    `${namespace}::Sorry, the resource you requested for, does not exist`
  );
  lang.GO_HOME = i18n.t(`${namespace}::Go home`);
  lang.GO_BACK = i18n.t(`${namespace}::Go back`);
  lang.SESSION_EXPIRED_TEXT = i18n.t(`${namespace}::Session Expired`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
