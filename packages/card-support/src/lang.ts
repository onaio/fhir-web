import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ERROR_OCCURRED = i18n.t(`${namespace}::An error occurred`);
  lang.DOWNLOAD_CLIENT_DATA = i18n.t(`${namespace}::Download Client Data`);
  lang.CLIENT_LOCATION = i18n.t(`${namespace}::Client Location`);
  lang.ALL_LOCATIONS = i18n.t(`${namespace}::All Locations`);
  lang.CARD_STATUS = i18n.t(`${namespace}::Card Status`);
  lang.NEEDS_CARD = i18n.t(`${namespace}::Needs Card`);
  lang.CARD_NOT_NEEDED = i18n.t(`${namespace}::Card not needed`);
  lang.BOTH_NEEDS_CARD_CARD_NOT_NEEDED = i18n.t(
    `${namespace}::Both "Needs card" and "Card not needed"`
  );
  lang.CARD_ORDER_DATE = i18n.t(`${namespace}::Card Order Date`);
  lang.CARD_ORDER_DATE_REQUIRED = i18n.t(`${namespace}::Please enter start date and end date`);
  lang.SELECT_CARD_ORDER_DATE = i18n.t(`${namespace}::Select Card Order Date`);
  lang.DOWNLOADING = i18n.t(`${namespace}::Downloading`);
  lang.DOWNLOAD_CSV = i18n.t(`${namespace}::Download CSV`);
  lang.NO_DATA_FOUND = i18n.t(`${namespace}::No data found`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
