import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.A1_DESCRIPTION = i18n.t(`Indigenous case recorded within the last year.`, { ns: namespace });
  lang.A1_NAME = i18n.t(`Active`, { ns: namespace });
  lang.A2_DESCRIPTION = i18n.t(
    `No indigenous case during the last year, but withing the last 3 years.`,
    { ns: namespace }
  );
  lang.A2_NAME = i18n.t(`Residual Non-Active`, { ns: namespace });
  lang.B1_DESCRIPTION = i18n.t(`Receptive area but no indigenous cases within the last 3 years.`, {
    ns: namespace,
  });
  lang.B1_NAME = i18n.t(`Cleared Receptive`, { ns: namespace });
  lang.B2_DESCRIPTION = i18n.t(`Non-receptive area.`, { ns: namespace });
  lang.B2_NAME = i18n.t(`Cleared Non-Receptive`, { ns: namespace });

  lang.BCC_ACTIVITY = i18n.t(`Behaviour Change Communication`, { ns: namespace });
  lang.BCC_ACTIVITY_DESCRIPTION = i18n.t(`Conduct BCC activity`, { ns: namespace });
  lang.BCC_GOAL_DESCRIPTION = i18n.t(`Complete at least 1 BCC activity for the operational area`, {
    ns: namespace,
  });
  lang.BCC_GOAL_MEASURE = i18n.t(`BCC Activities Complete`, { ns: namespace });

  lang.IRS_ACTIVITY = i18n.t(`Spray Structures`, { ns: namespace });
  lang.IRS_ACTIVITY_DESCRIPTION = i18n.t(
    `Visit each structure in the operational area and attempt to spray`,
    { ns: namespace }
  );
  lang.IRS_GOAL_DESCRIPTION = i18n.t(`Spray structures in the operational area`, { ns: namespace });
  lang.IRS_GOAL_MEASURE = i18n.t(`Percent of structures sprayed`, { ns: namespace });
  lang.BEDNET_ACTIVITY = i18n.t(`Bednet Distribution`, { ns: namespace });
  lang.BEDNET_ACTIVITY_DESCRIPTION = i18n.t(
    `Visit 100% of residential structures in the operational area and provide nets`,
    { ns: namespace }
  );
  lang.BEDNET_GOAL_MEASURE = i18n.t(`Percent of residential structures received nets`, {
    ns: namespace,
  });
  lang.BLOOD_SCREENING_ACTIVITY = i18n.t(`Blood screening`, { ns: namespace });
  lang.BLOOD_SCREENING_ACTIVITY_DESCRIPTION = i18n.t(
    `Visit all residential structures (100% within a 1 km radius of a confirmed index case and test each registered person`,
    { ns: namespace }
  );
  lang.BLOOD_SCREENING_GOAL_MEASURE = i18n.t(`Number of registered people tested`, {
    ns: namespace,
  });
  lang.CASE_CONFIRMATION_ACTIVITY = i18n.t(`Case Confirmation`, { ns: namespace });
  lang.CASE_CONFIRMATION_ACTIVITY_DESCRIPTION = i18n.t(`Confirm the index case`, { ns: namespace });
  lang.CASE_CONFIRMATION_ACTIVITY_GOAL_MEASURE = i18n.t(`Number of cases confirmed`, {
    ns: namespace,
  });

  lang.REGISTER_FAMILY_ACTIVITY = i18n.t(`Family Registration`, { ns: namespace });
  lang.REGISTER_FAMILY_ACTIVITY_DESCRIPTION = i18n.t(
    `Register all families & family members in all residential structures enumerated (100% within the operational area`,
    { ns: namespace }
  );
  lang.REGISTER_FAMILY_ACTIVITY_GOAL_MEASURE = i18n.t(
    `Percent of residential structures with full family registration`,
    { ns: namespace }
  );
  lang.LARVAL_DIPPING_ACTIVITY = i18n.t(`Larval Dipping`, { ns: namespace });
  lang.LARVAL_DIPPING_ACTIVITY_DESCRIPTION = i18n.t(
    `Perform a minimum of three larval dipping activities in the operational area`,
    { ns: namespace }
  );
  lang.LARVAL_DIPPING_GOAL_MEASURE = i18n.t(`Number of larval dipping activities completed`, {
    ns: namespace,
  });

  lang.MOSQUITO_COLLECTION_ACTIVITY = i18n.t(`Mosquito Collection`, { ns: namespace });
  lang.MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION = i18n.t(
    `Set a minimum of three mosquito collection traps and complete the mosquito collection process`,
    { ns: namespace }
  );
  lang.MOSQUITO_COLLECTION_GOAL_MEASURE = i18n.t(
    `Number of mosquito collection activities completed`,
    { ns: namespace }
  );

  lang.PRODUCT_CHECK_ACTIVITY = i18n.t(`Product Check`, { ns: namespace });
  lang.PRODUCT_CHECK_ACTIVITY_DESCRIPTION = i18n.t(
    `Check for all products (100% within the jurisdiction)`,
    { ns: namespace }
  );
  lang.PRODUCT_CHECK_GOAL_MEASURE = i18n.t(`Percent of products checked`, { ns: namespace });

  lang.FIX_PRODUCT_PROBLEM_ACTIVITY = i18n.t(`Fix Product Problem`, { ns: namespace });
  lang.FIX_PRODUCT_PROBLEM_ACTIVITY_DESCRIPTION = i18n.t(
    `Fix problems for all products (100% within the jurisdiction)`,
    { ns: namespace }
  );
  lang.FIX_PRODUCT_PROBLEM_GOAL_MEASURE = i18n.t(`Percent of product problems fixed`, {
    ns: namespace,
  });

  lang.RECORD_GPS_ACTIVITY = i18n.t(`Record GPS`, { ns: namespace });
  lang.RECORD_GPS_ACTIVITY_DESCRIPTION = i18n.t(
    `Record GPS for all service points without GPS within the jurisdiction`,
    { ns: namespace }
  );
  lang.RECORD_GPS_GOAL_MEASURE = i18n.t(`Percent of GPS recorded`, { ns: namespace });

  lang.SERVICE_POINT_CHECK_ACTIVITY = i18n.t(`Service Point`, { ns: namespace });
  lang.SERVICE_POINT_CHECK_ACTIVITY_DESCRIPTION = i18n.t(
    `Conduct checks for all service points (100% within the jurisdiction)`,
    { ns: namespace }
  );
  lang.SERVICE_POINT_CHECK_GOAL_MEASURE = i18n.t(`Percent of service points checked`, {
    ns: namespace,
  });

  lang.MDA_POINT_DISPENSE_ACTIVITY_DESCRIPTION = i18n.t(
    `Dispense medication to each eligible person`,
    { ns: namespace }
  );
  lang.MDA_POINT_DISPENSE_COLLECTION_GOAL = i18n.t(`Percent of eligible people`, { ns: namespace });
  lang.MDA_POINT_ADVERSE_EFFECT_ACTIVITY_DESCRIPTION = i18n.t(
    `Report any adverse events from medication`,
    { ns: namespace }
  );
  lang.MDA_POINT_ADVERSE_EFFECT_COLLECTION_GOAL = i18n.t(
    `Percent of people who reported adverse events`,
    { ns: namespace }
  );
  lang.GOAL_UNIT_ACTIVITY = i18n.t(`activit(y|ies`, { ns: namespace });
  lang.GOAL_UNIT_CASE = i18n.t(`case(s`, { ns: namespace });
  lang.GOAL_UNIT_PERCENT = i18n.t(`Percent`, { ns: namespace });
  lang.GOAL_UNIT_PERSON = i18n.t(`Person(s`, { ns: namespace });
  lang.GOAL_UNIT_UNKNOWN = i18n.t(`unknown`, { ns: namespace });

  lang.PLAN_STATUS_ACTIVE = i18n.t(`active`, { ns: namespace });
  lang.PLAN_STATUS_COMPLETE = i18n.t(`complete`, { ns: namespace });
  lang.PLAN_STATUS_DRAFT = i18n.t(`draft`, { ns: namespace });
  lang.PLAN_STATUS_RETIRED = i18n.t(`retired`, { ns: namespace });

  lang.DISTRICT = i18n.t(`District`, { ns: namespace });
  lang.CANTON = i18n.t(`Canton`, { ns: namespace });
  lang.VILLAGE = i18n.t(`Village`, { ns: namespace });
  lang.LOW_PRIORITY_LABEL = i18n.t(`Low Priority`, { ns: namespace });
  lang.MEDIUM_PRIORITY_LABEL = i18n.t(`Medium Priority`, { ns: namespace });
  lang.HIGH_PRIORITIY_LABEL = i18n.t(`High Priority`, { ns: namespace });

  lang.INVESTIGATION = i18n.t(`Investigation`, { ns: namespace });
  lang.PROVINCE = i18n.t(`Province`, { ns: namespace });
  lang.ROUTINE_TITLE = i18n.t(`Routine`, { ns: namespace });
  lang.CASE_TRIGGERED_TITLE = i18n.t(`Case Triggered`, { ns: namespace });

  lang.ACTION = i18n.t(`Action`, { ns: namespace });
  lang.ACTIVITIES_LABEL = i18n.t(`Activities`, { ns: namespace });
  lang.ADD = i18n.t(`Add`, { ns: namespace });
  lang.ADD_ACTIVITY = i18n.t(`Add Activity`, { ns: namespace });
  lang.ADD_CODED_ACTIVITY = i18n.t(`Add %s Activity`, { ns: namespace });
  lang.AN_ERROR_OCCURRED = i18n.t(`An Error Occurred`, { ns: namespace });
  lang.AND = i18n.t(`and`, { ns: namespace });
  lang.CASE_NUMBER = i18n.t(`Case Number`, { ns: namespace });
  lang.CONDITIONS_LABEL = i18n.t(`Conditions`, { ns: namespace });
  lang.DESCRIPTION_LABEL = i18n.t(`Description`, { ns: namespace });
  lang.DYNAMIC_FI_TITLE = i18n.t(`Dynamic FI`, { ns: namespace });
  lang.DYNAMIC_IRS_TITLE = i18n.t(`Dynamic IRS`, { ns: namespace });
  lang.DYNAMIC_MDA_TITLE = i18n.t(`Dynamic MDA`, { ns: namespace });
  lang.SUPPLY_MANAGEMENT_TITLE = i18n.t(`Supply Management`, { ns: namespace });
  lang.START_DATE = i18n.t(`Start Date`, { ns: namespace });
  lang.END_DATE = i18n.t(`End Date`, { ns: namespace });
  lang.FOCUS_AREA_HEADER = i18n.t(`Focus Area`, { ns: namespace });
  lang.FOCUS_CLASSIFICATION_LABEL = i18n.t(`Focus Classification`, { ns: namespace });
  lang.FOCUS_INVESTIGATION_STATUS_REASON = i18n.t(`Focus Investigation Reason`, { ns: namespace });
  lang.GOAL_LABEL = i18n.t(`Goal`, { ns: namespace });
  lang.ADD_FOCUS_INVESTIGATION = i18n.t(`Add Focus Investigation`, { ns: namespace });
  lang.INTERVENTION_TYPE_LABEL = i18n.t(`Intervention Type`, { ns: namespace });
  lang.IRS_TITLE = i18n.t(`IRS`, { ns: namespace });
  lang.LOCATIONS = i18n.t(`Locations`, { ns: namespace });
  lang.MDA_POINT_TITLE = i18n.t(`MDA Point`, { ns: namespace });
  lang.PLAN_TITLE_LABEL = i18n.t(`Plan Title`, { ns: namespace });
  lang.PLAN_START_DATE_LABEL = i18n.t(`Plan Start Date`, { ns: namespace });
  lang.PLAN_END_DATE_LABEL = i18n.t(`Plan End Date`, { ns: namespace });
  lang.QUANTITY_LABEL = i18n.t(`Quantity`, { ns: namespace });
  lang.PRIORITY_LABEL = i18n.t(`Priority`, { ns: namespace });
  lang.REASON_HEADER = i18n.t(`Reason`, { ns: namespace });
  lang.SAVE_PLAN = i18n.t(`Save Plan`, { ns: namespace });
  lang.SELECT_PLACHOLDER = i18n.t(`Select %s`, { ns: namespace });
  lang.STATUS_HEADER = i18n.t(`Status`, { ns: namespace });
  lang.TRIGGERS_LABEL = i18n.t(`Triggers`, { ns: namespace });
  lang.FOCUS_INVESTIGATION = i18n.t(`Focus Investigation`, { ns: namespace });
  lang.DATE_IS_REQUIRED = i18n.t(`Date is Required`, { ns: namespace });
  lang.NAME_IS_REQUIRED = i18n.t(`Name is Required`, { ns: namespace });
  lang.REQUIRED = i18n.t(`Required`, { ns: namespace });
  lang.EXPRESSION_LABEL = i18n.t(`Expression`, { ns: namespace });
  lang.NAME = i18n.t(`Name`, { ns: namespace });
  lang.SUCCESSFULLY_UPDATED = i18n.t(`Successfully Updated`, { ns: namespace });
  lang.SUCCESSFULLY_CREATED = i18n.t(`Successfully Created`, { ns: namespace });
  lang.ACTIVE_DATE_RANGE_LABEL = i18n.t(`Active date range`, { ns: namespace });
  lang.ADD_JURISDICTION = i18n.t(`Add Jurisdiction`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.PLAN_TITLE_PLACEHOLDER = i18n.t(`Enter the plan's name`, { ns: namespace });
  lang.DESCRIPTION_PLACEHOLDER = i18n.t(`Enter the plan's description`, { ns: namespace });
  lang.DYNAMIC_VALUE_LEGEND_TITLE = i18n.t(`Dynamic Value`, { ns: namespace });
  lang.PATH_LABEL = i18n.t(`Path`, { ns: namespace });
  lang.YES = i18n.t(`yes`, { ns: namespace });
  lang.NO = i18n.t(`no`, { ns: namespace });
  lang.SETTING_STATUS_TO_DRAFT = i18n.t(`Are you sure? status will be set to draft`, {
    ns: namespace,
  });
  lang.SETTING_STATUS_TO_ACTIVE = i18n.t(
    `Are you sure? you won't be able to change the status back to draft`,
    { ns: namespace }
  );
  lang.SETTING_STATUS_TO_COMPLETE = i18n.t(
    `Are you sure? you won't be able to change the status for complete plans`,
    { ns: namespace }
  );
  lang.SETTING_STATUS_TO_RETIRED = i18n.t(
    `Are you sure? you won't be able to change the status for retired plans`,
    { ns: namespace }
  );
  lang.OK = i18n.t(`OK`, { ns: namespace });
  lang.CANNOT_ACTIVATE_PLAN_WITH_NO_JURISDICTIONS = i18n.t(
    `Assign jurisdictions to the Plan, to enable activating it`,
    { ns: namespace }
  );
  lang.PLAN_NAME_CANNOT_CONTAIN_SLASHES = i18n.t(`Plan name cannot contain '/'`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// the const
export default lang;
