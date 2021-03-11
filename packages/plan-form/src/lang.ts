import i18n from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.A1_DESCRIPTION = i18n.t('Indigenous case recorded within the last year.');
  lang.A1_NAME = i18n.t('Active');
  lang.A2_DESCRIPTION = i18n.t(
    'No indigenous case during the last year, but withing the last 3 years.'
  );
  lang.A2_NAME = i18n.t('Residual Non-Active');
  lang.B1_DESCRIPTION = i18n.t('Receptive area but no indigenous cases within the last 3 years.');
  lang.B1_NAME = i18n.t('Cleared Receptive');
  lang.B2_DESCRIPTION = i18n.t('Non-receptive area.');
  lang.B2_NAME = i18n.t('Cleared Non-Receptive');

  lang.BCC_ACTIVITY = i18n.t('Behaviour Change Communication');
  lang.BCC_ACTIVITY_DESCRIPTION = i18n.t('Conduct BCC activity');
  lang.BCC_GOAL_DESCRIPTION = i18n.t('Complete at least 1 BCC activity for the operational area');
  lang.BCC_GOAL_MEASURE = i18n.t('BCC Activities Complete');

  lang.IRS_ACTIVITY = i18n.t('Spray Structures');
  lang.IRS_ACTIVITY_DESCRIPTION = i18n.t(
    'Visit each structure in the operational area and attempt to spray'
  );
  lang.IRS_GOAL_DESCRIPTION = i18n.t('Spray structures in the operational area');
  lang.IRS_GOAL_MEASURE = i18n.t('Percent of structures sprayed');
  lang.BEDNET_ACTIVITY = i18n.t('Bednet Distribution');
  lang.BEDNET_ACTIVITY_DESCRIPTION = i18n.t(
    'Visit 100% of residential structures in the operational area and provide nets'
  );
  lang.BEDNET_GOAL_MEASURE = i18n.t('Percent of residential structures received nets');
  lang.BLOOD_SCREENING_ACTIVITY = i18n.t('Blood screening');
  lang.BLOOD_SCREENING_ACTIVITY_DESCRIPTION = i18n.t(
    'Visit all residential structures (100% within a 1 km radius of a confirmed index case and test each registered person'
  );
  lang.BLOOD_SCREENING_GOAL_MEASURE = i18n.t('Number of registered people tested');
  lang.CASE_CONFIRMATION_ACTIVITY = i18n.t('Case Confirmation');
  lang.CASE_CONFIRMATION_ACTIVITY_DESCRIPTION = i18n.t('Confirm the index case');
  lang.CASE_CONFIRMATION_ACTIVITY_GOAL_MEASURE = i18n.t('Number of cases confirmed');

  lang.REGISTER_FAMILY_ACTIVITY = i18n.t('Family Registration');
  lang.REGISTER_FAMILY_ACTIVITY_DESCRIPTION = i18n.t(
    'Register all families & family members in all residential structures enumerated (100% within the operational area'
  );
  lang.REGISTER_FAMILY_ACTIVITY_GOAL_MEASURE = i18n.t(
    'Percent of residential structures with full family registration'
  );
  lang.LARVAL_DIPPING_ACTIVITY = i18n.t('Larval Dipping');
  lang.LARVAL_DIPPING_ACTIVITY_DESCRIPTION = i18n.t(
    'Perform a minimum of three larval dipping activities in the operational area'
  );
  lang.LARVAL_DIPPING_GOAL_MEASURE = i18n.t('Number of larval dipping activities completed');

  lang.MOSQUITO_COLLECTION_ACTIVITY = i18n.t('Mosquito Collection');
  lang.MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION = i18n.t(
    'Set a minimum of three mosquito collection traps and complete the mosquito collection process'
  );
  lang.MOSQUITO_COLLECTION_GOAL_MEASURE = i18n.t(
    'Number of mosquito collection activities completed'
  );

  lang.PRODUCT_CHECK_ACTIVITY = i18n.t('Product Check');
  lang.PRODUCT_CHECK_ACTIVITY_DESCRIPTION = i18n.t(
    'Check for all products (100% within the jurisdiction)'
  );
  lang.PRODUCT_CHECK_GOAL_MEASURE = i18n.t('Percent of products checked');

  lang.FIX_PRODUCT_PROBLEM_ACTIVITY = i18n.t('Fix Product Problem');
  lang.FIX_PRODUCT_PROBLEM_ACTIVITY_DESCRIPTION = i18n.t(
    'Fix problems for all products (100% within the jurisdiction)'
  );
  lang.FIX_PRODUCT_PROBLEM_GOAL_MEASURE = i18n.t('Percent of product problems fixed');

  lang.RECORD_GPS_ACTIVITY = i18n.t('Record GPS');
  lang.RECORD_GPS_ACTIVITY_DESCRIPTION = i18n.t(
    'Record GPS for all service points without GPS within the jurisdiction'
  );
  lang.RECORD_GPS_GOAL_MEASURE = i18n.t('Percent of GPS recorded');

  lang.SERVICE_POINT_CHECK_ACTIVITY = i18n.t('Service Point');
  lang.SERVICE_POINT_CHECK_ACTIVITY_DESCRIPTION = i18n.t(
    'Conduct checks for all service points (100% within the jurisdiction)'
  );
  lang.SERVICE_POINT_CHECK_GOAL_MEASURE = i18n.t('Percent of service points checked');

  lang.MDA_POINT_DISPENSE_ACTIVITY_DESCRIPTION = i18n.t(
    'Dispense medication to each eligible person'
  );
  lang.MDA_POINT_DISPENSE_COLLECTION_GOAL = i18n.t('Percent of eligible people');
  lang.MDA_POINT_ADVERSE_EFFECT_ACTIVITY_DESCRIPTION = i18n.t(
    'Report any adverse events from medication'
  );
  lang.MDA_POINT_ADVERSE_EFFECT_COLLECTION_GOAL = i18n.t(
    'Percent of people who reported adverse events'
  );
  lang.GOAL_UNIT_ACTIVITY = i18n.t('activit(y|ies');
  lang.GOAL_UNIT_CASE = i18n.t('case(s');
  lang.GOAL_UNIT_PERCENT = i18n.t('Percent');
  lang.GOAL_UNIT_PERSON = i18n.t('Person(s');
  lang.GOAL_UNIT_UNKNOWN = i18n.t('unknown');

  lang.PLAN_STATUS_ACTIVE = i18n.t('active');
  lang.PLAN_STATUS_COMPLETE = i18n.t('complete');
  lang.PLAN_STATUS_DRAFT = i18n.t('draft');
  lang.PLAN_STATUS_RETIRED = i18n.t('retired');

  lang.DISTRICT = i18n.t('District');
  lang.CANTON = i18n.t('Canton');
  lang.VILLAGE = i18n.t('Village');
  lang.LOW_PRIORITY_LABEL = i18n.t('Low Priority');
  lang.MEDIUM_PRIORITY_LABEL = i18n.t('Medium Priority');
  lang.HIGH_PRIORITIY_LABEL = i18n.t('High Priority');

  lang.INVESTIGATION = i18n.t('Investigation');
  lang.PROVINCE = i18n.t('Province');
  lang.ROUTINE_TITLE = i18n.t('Routine');
  lang.CASE_TRIGGERED_TITLE = i18n.t('Case Triggered');

  lang.ACTION = i18n.t('Action');
  lang.ACTIVITIES_LABEL = i18n.t('Activities');
  lang.ADD = i18n.t('Add');
  lang.ADD_ACTIVITY = i18n.t('Add Activity');
  lang.ADD_CODED_ACTIVITY = i18n.t('Add %s Activity');
  lang.AN_ERROR_OCCURRED = i18n.t('An Error Occurred');
  lang.AND = i18n.t('and');
  lang.CASE_NUMBER = i18n.t('Case Number');
  lang.CONDITIONS_LABEL = i18n.t('Conditions');
  lang.DESCRIPTION_LABEL = i18n.t('Description');
  lang.DYNAMIC_FI_TITLE = i18n.t('Dynamic FI');
  lang.DYNAMIC_IRS_TITLE = i18n.t('Dynamic IRS');
  lang.DYNAMIC_MDA_TITLE = i18n.t('Dynamic MDA');
  lang.SUPPLY_MANAGEMENT_TITLE = i18n.t('Supply Management');
  lang.START_DATE = i18n.t('Start Date');
  lang.END_DATE = i18n.t('End Date');
  lang.FOCUS_AREA_HEADER = i18n.t('Focus Area');
  lang.FOCUS_CLASSIFICATION_LABEL = i18n.t('Focus Classification');
  lang.FOCUS_INVESTIGATION_STATUS_REASON = i18n.t('Focus Investigation Reason');
  lang.GOAL_LABEL = i18n.t('Goal');
  lang.ADD_FOCUS_INVESTIGATION = i18n.t('Add Focus Investigation');
  lang.INTERVENTION_TYPE_LABEL = i18n.t('Intervention Type');
  lang.IRS_TITLE = i18n.t('IRS');
  lang.LOCATIONS = i18n.t('Locations');
  lang.MDA_POINT_TITLE = i18n.t('MDA Point');
  lang.PLAN_TITLE_LABEL = i18n.t('Plan Title');
  lang.PLAN_START_DATE_LABEL = i18n.t('Plan Start Date');
  lang.PLAN_END_DATE_LABEL = i18n.t('Plan End Date');
  lang.QUANTITY_LABEL = i18n.t('Quantity');
  lang.PRIORITY_LABEL = i18n.t('Priority');
  lang.REASON_HEADER = i18n.t('Reason');
  lang.SAVE_PLAN = i18n.t('Save Plan');
  lang.SELECT_PLACHOLDER = i18n.t('Select %s');
  lang.STATUS_HEADER = i18n.t('Status');
  lang.TRIGGERS_LABEL = i18n.t('Triggers');
  lang.FOCUS_INVESTIGATION = i18n.t('Focus Investigation');
  lang.DATE_IS_REQUIRED = i18n.t('Date is Required');
  lang.NAME_IS_REQUIRED = i18n.t('Name is Required');
  lang.REQUIRED = i18n.t('Required');
  lang.EXPRESSION_LABEL = i18n.t('Expression');
  lang.NAME = i18n.t('Name');
  lang.SUCCESSFULLY_UPDATED = i18n.t('Successfully Updated');
  lang.SUCCESSFULLY_CREATED = i18n.t('Successfully Created');
  lang.ACTIVE_DATE_RANGE_LABEL = i18n.t('Active date range');
  lang.ADD_JURISDICTION = i18n.t('Add Jurisdiction');
  lang.CANCEL = i18n.t('Cancel');
  lang.PLAN_TITLE_PLACEHOLDER = i18n.t("Enter the plan's name");
  lang.DESCRIPTION_PLACEHOLDER = i18n.t("Enter the plan's description");
  lang.DYNAMIC_VALUE_LEGEND_TITLE = i18n.t('Dynamic Value');
  lang.PATH_LABEL = i18n.t('Path');
  lang.YES = i18n.t('yes');
  lang.NO = i18n.t('no');
  lang.SETTING_STATUS_TO_DRAFT = i18n.t('Are you sure? status will be set to draft');
  lang.SETTING_STATUS_TO_ACTIVE = i18n.t(
    "Are you sure? you won't be able to change the status back to draft"
  );
  lang.SETTING_STATUS_TO_COMPLETE = i18n.t(
    "Are you sure? you won't be able to change the status for complete plans"
  );
  lang.SETTING_STATUS_TO_RETIRED = i18n.t(
    "Are you sure? you won't be able to change the status for retired plans"
  );
  lang.OK = i18n.t('OK');
  lang.CANNOT_ACTIVATE_PLAN_WITH_NO_JURISDICTIONS = i18n.t(
    'Assign jurisdictions to the Plan, to enable activating it'
  );
  lang.PLAN_NAME_CANNOT_CONTAIN_SLASHES = i18n.t("Plan name cannot contain '/'");
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on('languageChanged', () => {
  fill();
});

// the const
export default lang;
