import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

const lang: Dictionary<string> = {};

/** recompute values */
function fill() {
  lang.NAME = i18n.t(`Name`, { ns: namespace });
  lang.VIEW = i18n.t(`View`, { ns: namespace });

  lang.MISSIONS = i18n.t(`Missions`, { ns: namespace });
  lang.NEW_MISSION = i18n.t(` + New Mission`, { ns: namespace });

  // plans table columns
  lang.DATE = i18n.t(`Date created`, { ns: namespace });
  lang.ACTIONS = i18n.t(`Actions`, { ns: namespace });

  //loader texts
  lang.MESSAGE = i18n.t(`Fetching Plans`, { ns: namespace });
  lang.DESCRIPTION = i18n.t(`Please wait, as we fetch the plans.`, { ns: namespace });
  lang.TIP = i18n.t(`Loading...`, { ns: namespace });

  lang.EDIT_PLAN = i18n.t(`Edit mission`, { ns: namespace });
  lang.CREATE_PLAN = i18n.t(`Create new mission`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.START_DATE = i18n.t(`Start Date`, { ns: namespace });
  lang.END_DATE = i18n.t(`End Date`, { ns: namespace });

  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.EDIT_TEAMS = i18n.t(`Edit teams`, { ns: namespace });
  lang.EDIT_AREAS = i18n.t(`Edit areas`, { ns: namespace });
  lang.SELECT = i18n.t(`Select`, { ns: namespace });
  lang.SELECT_TEAMS = i18n.t(`Select teams`, { ns: namespace });
  lang.SELECT_AREAS = i18n.t(`Select areas`, { ns: namespace });
  lang.ACTIVATE_MISSION = i18n.t(`Activate mission`, { ns: namespace });
  lang.SUCCESSFULLY_ACTIVATED_MISSION = i18n.t(`Successfully activated mission`, { ns: namespace });
  lang.FAILED_TO_ACTIVATE_MISSION = i18n.t(`Activating mission failed`, { ns: namespace });
  lang.COULD_NOT_LOAD_ASSIGNMENTS = i18n.t(`Could not load Assignments`, { ns: namespace });

  lang.MISSION_DATA = i18n.t(`Mission data`, { ns: namespace });
  lang.DOWNLOAD_MISSION_DATA = i18n.t(`Download mission data`, { ns: namespace });
  lang.SERVICE_POINTS_VISITED = i18n.t(`Service points visited`, { ns: namespace });
  lang.PRODUCTS_CHECKED = i18n.t(`Products checked`, { ns: namespace });
  lang.NUMBER_OF_FLAGGED_PRODUCTS = i18n.t(`Number of flagged products`, { ns: namespace });
  lang.FETCHING_MISSION_INDICATORS_DATA = i18n.t(`Fetching mission indicators data`, {
    ns: namespace,
  });
  lang.CANNOT_ACTIVATE_PLAN_WITH_NO_JURISDICTIONS = i18n.t(
    `Assign jurisdictions to the Plan, to enable activating it`,
    { ns: namespace }
  );
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
