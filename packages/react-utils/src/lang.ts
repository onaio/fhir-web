import i18nInstance from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.SEARCH = i18nInstance.t('Search');
  lang.FORBIDDEN_PAGE_STATUS = i18nInstance.t('403');
  lang.SOMETHING_WENT_WRONG = i18nInstance.t('Something went wrong');
  lang.YOU_ARE_UNAUTHORIZED = i18nInstance.t('Sorry, you are not authorized to access this page');
  lang.ERROR = i18nInstance.t('Error');
  lang.TITLE_404 = i18nInstance.t('404');
  lang.RESOURCE_DOES_NOT_EXIST = i18nInstance.t(
    'Sorry, the resource you requested for, does not exist'
  );
  lang.GO_HOME = i18nInstance.t('Go home');
  lang.GO_BACK = i18nInstance.t('Go back');
  lang.SESSION_EXPIRED_TEXT = i18nInstance.t('Session Expired');
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18nInstance.on('languageChanged', () => {
  fill();
});

// export the const
export default lang;
