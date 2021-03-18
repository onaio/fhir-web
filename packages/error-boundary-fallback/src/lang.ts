import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

const lang: Dictionary<string> = {};

/** recompute values */
function fill() {
  lang.PAGE_TITLE = i18n.t(`${namespace}::An Error Occurred`);
  lang.PAGE_SUB_TITLE = i18n.t(
    `${namespace}::There has been an error. It’s been reported to the site administrators via email and should be fixed shortly. Thanks for your patience.'`
  );
  lang.BUTTON_TITLE = i18n.t(`${namespace}::Back Home`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
