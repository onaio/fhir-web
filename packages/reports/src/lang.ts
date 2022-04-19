import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  lang.DOWNLOAD_DISTRICT_REPORT = i18n.t(`Download District Report`, { ns: namespace });
  lang.LOCATION = i18n.t(`Location`, { ns: namespace });
  lang.ALL_LOCATIONS = i18n.t(`All Locations`, { ns: namespace });
  lang.REPORT_DATE = i18n.t(`Report Date`, { ns: namespace });
  lang.DATE_REQUIRED = i18n.t(`Date Required`, { ns: namespace });
  lang.USER_NOT_ASSIGNED_AND_USERS_TEAM_NOT_ASSIGNED = i18n.t(
    `Please confirm that the logged-in user is assigned to a team and the team is assigned to a location, otherwise contact system admin.`,
    {
      ns: namespace,
    }
  );
  lang.ERROR_OCCURRED = i18n.t(`An error occurred`, { ns: namespace });
  lang.DOWNLOADING = i18n.t(`Downloading`, { ns: namespace });
  lang.DOWNLOAD_REPORT = i18n.t(`Download Report`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
