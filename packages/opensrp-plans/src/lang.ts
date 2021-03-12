import i18n from './mls';
import { Dictionary } from '@onaio/utils';

const lang: Dictionary<string> = {};

/** recompute values */
function fill() {
  lang.NAME = i18n.t('Name');
  lang.VIEW = i18n.t('View');

  lang.MISSIONS = i18n.t('Missions');
  lang.NEW_MISSION = i18n.t(' + New Mission');

  // plans table columns
  lang.DATE = i18n.t('Date created');
  lang.ACTIONS = i18n.t('Actions');

  //loader texts
  lang.MESSAGE = i18n.t('Fetching Plans');
  lang.DESCRIPTION = i18n.t('Please wait, as we fetch the plans.');
  lang.TIP = i18n.t('Loading...');

  lang.EDIT_PLAN = `Edit mission`;
  lang.CREATE_PLAN = `Create new mission`;
  lang.NO_STATUS_FOUND = `No Status Found`;
  lang.EDIT = i18n.t('Edit');
  lang.START_DATE = i18n.t('Start Date');
  lang.END_DATE = i18n.t('End Date');

  lang.CANCEL = i18n.t('Cancel');
  lang.SAVE = i18n.t('Save');
  lang.EDIT_TEAMS = i18n.t('Edit teams');
  lang.EDIT_AREAS = i18n.t('Edit areas');
  lang.SELECT = i18n.t('Select');
  lang.SELECT_TEAMS = i18n.t('Select teams');
  lang.SELECT_AREAS = i18n.t('Select areas');
  lang.ACTIVATE_MISSION = i18n.t('Activate mission');
  lang.SUCCESSFULLY_ACTIVATED_MISSION = i18n.t('Successfully activated mission');
  lang.FAILED_TO_ACTIVATE_MISSION = i18n.t('Activating mission failed');
  lang.COULD_NOT_LOAD_ASSIGNMENTS = i18n.t('Could not load Assignments');

  lang.MISSION_DATA = i18n.t('Mission data');
  lang.DOWNLOAD_MISSION_DATA = i18n.t('Download mission data');
  lang.SERVICE_POINTS_VISITED = i18n.t('Service points visited');
  lang.PRODUCTS_CHECKED = i18n.t('Products checked');
  lang.NUMBER_OF_FLAGGED_PRODUCTS = i18n.t('Number of flagged products');
  lang.FETCHING_MISSION_INDICATORS_DATA = i18n.t('Fetching mission indicators data');
  lang.CANNOT_ACTIVATE_PLAN_WITH_NO_JURISDICTIONS = i18n.t(
    'Assign jurisdictions to the Plan, to enable activating it'
  );
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on('languageChanged', () => {
  fill();
});

// export the const
export default lang;
