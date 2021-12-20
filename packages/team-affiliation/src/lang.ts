import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Dictionary<string> = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_OCCURED = i18n.t(`An error occurred`, { ns: namespace });
  lang.ENTER_ORG_NAME = i18n.t(`Enter a Organization name`, { ns: namespace });
  lang.TEAMS = i18n.t(`Organizations`, { ns: namespace });
  lang.SUCCESSFULLY_ASSIGNED_ORGS = `Successfully Assigned Organizations`;

  // Table view strings
  lang.TEAM_AFFILIATION_PAGE_TITLE = i18n.t(`Team Affiliation`, { ns: namespace });
  lang.TEAM_AFFILIATION_MODAL_TITLE = i18n.t(`Assign/Unassign Organizations`, { ns: namespace });
  lang.NAME = i18n.t(`Name`, { ns: namespace });
  lang.ACTIONS = i18n.t(`Actions`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.ORGANIZATION = i18n.t(`Organizations`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
