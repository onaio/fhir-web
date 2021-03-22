import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

const lang: Dictionary<string> = {};

/** recompute values */
function fill() {
  lang.NAME = i18n.t(`${namespace}::Name`);
  lang.VIEW = i18n.t(`${namespace}::View`);

  lang.MISSIONS = i18n.t(`${namespace}::Missions`);
  lang.NEW_MISSION = i18n.t(`${namespace}:: + New Mission`);

  // plans table columns
  lang.DATE = i18n.t(`${namespace}::Date created`);
  lang.ACTIONS = i18n.t(`${namespace}::Actions`);

  //loader texts
  lang.MESSAGE = i18n.t(`${namespace}::Fetching Plans`);
  lang.DESCRIPTION = i18n.t(`${namespace}::Please wait, as we fetch the plans.`);
  lang.TIP = i18n.t(`${namespace}::Loading...`);

  lang.EDIT_PLAN = i18n.t(`${namespace}::Edit mission`);
  lang.CREATE_PLAN = i18n.t(`${namespace}::Create new mission`);
  lang.NO_STATUS_FOUND = i18n.t(`${namespace}::No Status Found`);
  lang.EDIT = i18n.t(`${namespace}::Edit`);
  lang.START_DATE = i18n.t(`${namespace}::Start Date`);
  lang.END_DATE = i18n.t(`${namespace}::End Date`);

  lang.CANCEL = i18n.t(`${namespace}::Cancel`);
  lang.SAVE = i18n.t(`${namespace}::Save`);
  lang.EDIT_TEAMS = i18n.t(`${namespace}::Edit teams`);
  lang.EDIT_AREAS = i18n.t(`${namespace}::Edit areas`);
  lang.SELECT = i18n.t(`${namespace}::Select`);
  lang.SELECT_TEAMS = i18n.t(`${namespace}::Select teams`);
  lang.SELECT_AREAS = i18n.t(`${namespace}::Select areas`);
  lang.ACTIVATE_MISSION = i18n.t(`${namespace}::Activate mission`);
  lang.SUCCESSFULLY_ACTIVATED_MISSION = i18n.t(`${namespace}::Successfully activated mission`);
  lang.FAILED_TO_ACTIVATE_MISSION = i18n.t(`${namespace}::Activating mission failed`);
  lang.COULD_NOT_LOAD_ASSIGNMENTS = i18n.t(`${namespace}::Could not load Assignments`);

  lang.MISSION_DATA = i18n.t(`${namespace}::Mission data`);
  lang.DOWNLOAD_MISSION_DATA = i18n.t(`${namespace}::Download mission data`);
  lang.SERVICE_POINTS_VISITED = i18n.t(`${namespace}::Service points visited`);
  lang.PRODUCTS_CHECKED = i18n.t(`${namespace}::Products checked`);
  lang.NUMBER_OF_FLAGGED_PRODUCTS = i18n.t(`${namespace}::Number of flagged products`);
  lang.FETCHING_MISSION_INDICATORS_DATA = i18n.t(`${namespace}::Fetching mission indicators data`);
  lang.CANNOT_ACTIVATE_PLAN_WITH_NO_JURISDICTIONS = i18n.t(
    `${namespace}::Assign jurisdictions to the Plan, to enable activating it`
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
