import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.A1_DESCRIPTION = i18n.t(`${namespace}::Indigenous case recorded within the last year.`);
  lang.A1_NAME = i18n.t(`${namespace}::Active`);
  lang.A2_DESCRIPTION = i18n.t(
    `${namespace}::No indigenous case during the last year, but withing the last 3 years.`
  );
  lang.A2_NAME = i18n.t(`${namespace}::Residual Non-Active`);
  lang.B1_DESCRIPTION = i18n.t(
    `${namespace}::Receptive area but no indigenous cases within the last 3 years.`
  );
  lang.B1_NAME = i18n.t(`${namespace}::Cleared Receptive`);
  lang.B2_DESCRIPTION = i18n.t(`${namespace}::Non-receptive area.`);
  lang.B2_NAME = i18n.t(`${namespace}::Cleared Non-Receptive`);

  lang.BCC_ACTIVITY = i18n.t(`${namespace}::Behaviour Change Communication`);
  lang.BCC_ACTIVITY_DESCRIPTION = i18n.t(`${namespace}::Conduct BCC activity`);
  lang.BCC_GOAL_DESCRIPTION = i18n.t(
    `${namespace}::Complete at least 1 BCC activity for the operational area`
  );
  lang.BCC_GOAL_MEASURE = i18n.t(`${namespace}::BCC Activities Complete`);

  lang.IRS_ACTIVITY = i18n.t(`${namespace}::Spray Structures`);
  lang.IRS_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Visit each structure in the operational area and attempt to spray`
  );
  lang.IRS_GOAL_DESCRIPTION = i18n.t(`${namespace}::Spray structures in the operational area`);
  lang.IRS_GOAL_MEASURE = i18n.t(`${namespace}::Percent of structures sprayed`);
  lang.BEDNET_ACTIVITY = i18n.t(`${namespace}::Bednet Distribution`);
  lang.BEDNET_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Visit 100% of residential structures in the operational area and provide nets`
  );
  lang.BEDNET_GOAL_MEASURE = i18n.t(
    `${namespace}::Percent of residential structures received nets`
  );
  lang.BLOOD_SCREENING_ACTIVITY = i18n.t(`${namespace}::Blood screening`);
  lang.BLOOD_SCREENING_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Visit all residential structures (100% within a 1 km radius of a confirmed index case and test each registered person`
  );
  lang.BLOOD_SCREENING_GOAL_MEASURE = i18n.t(`${namespace}::Number of registered people tested`);
  lang.CASE_CONFIRMATION_ACTIVITY = i18n.t(`${namespace}::Case Confirmation`);
  lang.CASE_CONFIRMATION_ACTIVITY_DESCRIPTION = i18n.t(`${namespace}::Confirm the index case`);
  lang.CASE_CONFIRMATION_ACTIVITY_GOAL_MEASURE = i18n.t(`${namespace}::Number of cases confirmed`);

  lang.REGISTER_FAMILY_ACTIVITY = i18n.t(`${namespace}::Family Registration`);
  lang.REGISTER_FAMILY_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Register all families & family members in all residential structures enumerated (100% within the operational area`
  );
  lang.REGISTER_FAMILY_ACTIVITY_GOAL_MEASURE = i18n.t(
    `${namespace}::Percent of residential structures with full family registration`
  );
  lang.LARVAL_DIPPING_ACTIVITY = i18n.t(`${namespace}::Larval Dipping`);
  lang.LARVAL_DIPPING_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Perform a minimum of three larval dipping activities in the operational area`
  );
  lang.LARVAL_DIPPING_GOAL_MEASURE = i18n.t(
    `${namespace}::Number of larval dipping activities completed`
  );

  lang.MOSQUITO_COLLECTION_ACTIVITY = i18n.t(`${namespace}::Mosquito Collection`);
  lang.MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Set a minimum of three mosquito collection traps and complete the mosquito collection process`
  );
  lang.MOSQUITO_COLLECTION_GOAL_MEASURE = i18n.t(
    `${namespace}::Number of mosquito collection activities completed`
  );

  lang.PRODUCT_CHECK_ACTIVITY = i18n.t(`${namespace}::Product Check`);
  lang.PRODUCT_CHECK_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Check for all products (100% within the jurisdiction)`
  );
  lang.PRODUCT_CHECK_GOAL_MEASURE = i18n.t(`${namespace}::Percent of products checked`);

  lang.FIX_PRODUCT_PROBLEM_ACTIVITY = i18n.t(`${namespace}::Fix Product Problem`);
  lang.FIX_PRODUCT_PROBLEM_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Fix problems for all products (100% within the jurisdiction)`
  );
  lang.FIX_PRODUCT_PROBLEM_GOAL_MEASURE = i18n.t(`${namespace}::Percent of product problems fixed`);

  lang.RECORD_GPS_ACTIVITY = i18n.t(`${namespace}::Record GPS`);
  lang.RECORD_GPS_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Record GPS for all service points without GPS within the jurisdiction`
  );
  lang.RECORD_GPS_GOAL_MEASURE = i18n.t(`${namespace}::Percent of GPS recorded`);

  lang.SERVICE_POINT_CHECK_ACTIVITY = i18n.t(`${namespace}::Service Point`);
  lang.SERVICE_POINT_CHECK_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Conduct checks for all service points (100% within the jurisdiction)`
  );
  lang.SERVICE_POINT_CHECK_GOAL_MEASURE = i18n.t(`${namespace}::Percent of service points checked`);

  lang.MDA_POINT_DISPENSE_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Dispense medication to each eligible person`
  );
  lang.MDA_POINT_DISPENSE_COLLECTION_GOAL = i18n.t(`${namespace}::Percent of eligible people`);
  lang.MDA_POINT_ADVERSE_EFFECT_ACTIVITY_DESCRIPTION = i18n.t(
    `${namespace}::Report any adverse events from medication`
  );
  lang.MDA_POINT_ADVERSE_EFFECT_COLLECTION_GOAL = i18n.t(
    `${namespace}::Percent of people who reported adverse events`
  );
  lang.GOAL_UNIT_ACTIVITY = i18n.t(`${namespace}::activit(y|ies`);
  lang.GOAL_UNIT_CASE = i18n.t(`${namespace}::case(s`);
  lang.GOAL_UNIT_PERCENT = i18n.t(`${namespace}::Percent`);
  lang.GOAL_UNIT_PERSON = i18n.t(`${namespace}::Person(s`);
  lang.GOAL_UNIT_UNKNOWN = i18n.t(`${namespace}::unknown`);

  lang.PLAN_STATUS_ACTIVE = i18n.t(`${namespace}::active`);
  lang.PLAN_STATUS_COMPLETE = i18n.t(`${namespace}::complete`);
  lang.PLAN_STATUS_DRAFT = i18n.t(`${namespace}::draft`);
  lang.PLAN_STATUS_RETIRED = i18n.t(`${namespace}::retired`);

  lang.DISTRICT = i18n.t(`${namespace}::District`);
  lang.CANTON = i18n.t(`${namespace}::Canton`);
  lang.VILLAGE = i18n.t(`${namespace}::Village`);
  lang.LOW_PRIORITY_LABEL = i18n.t(`${namespace}::Low Priority`);
  lang.MEDIUM_PRIORITY_LABEL = i18n.t(`${namespace}::Medium Priority`);
  lang.HIGH_PRIORITIY_LABEL = i18n.t(`${namespace}::High Priority`);

  lang.INVESTIGATION = i18n.t(`${namespace}::Investigation`);
  lang.PROVINCE = i18n.t(`${namespace}::Province`);
  lang.ROUTINE_TITLE = i18n.t(`${namespace}::Routine`);
  lang.CASE_TRIGGERED_TITLE = i18n.t(`${namespace}::Case Triggered`);

  lang.ACTION = i18n.t(`${namespace}::Action`);
  lang.ACTIVITIES_LABEL = i18n.t(`${namespace}::Activities`);
  lang.ADD = i18n.t(`${namespace}::Add`);
  lang.ADD_ACTIVITY = i18n.t(`${namespace}::Add Activity`);
  lang.ADD_CODED_ACTIVITY = i18n.t(`${namespace}::Add %s Activity`);
  lang.AN_ERROR_OCCURRED = i18n.t(`${namespace}::An Error Occurred`);
  lang.AND = i18n.t(`${namespace}::and`);
  lang.CASE_NUMBER = i18n.t(`${namespace}::Case Number`);
  lang.CONDITIONS_LABEL = i18n.t(`${namespace}::Conditions`);
  lang.DESCRIPTION_LABEL = i18n.t(`${namespace}::Description`);
  lang.DYNAMIC_FI_TITLE = i18n.t(`${namespace}::Dynamic FI`);
  lang.DYNAMIC_IRS_TITLE = i18n.t(`${namespace}::Dynamic IRS`);
  lang.DYNAMIC_MDA_TITLE = i18n.t(`${namespace}::Dynamic MDA`);
  lang.SUPPLY_MANAGEMENT_TITLE = i18n.t(`${namespace}::Supply Management`);
  lang.START_DATE = i18n.t(`${namespace}::Start Date`);
  lang.END_DATE = i18n.t(`${namespace}::End Date`);
  lang.FOCUS_AREA_HEADER = i18n.t(`${namespace}::Focus Area`);
  lang.FOCUS_CLASSIFICATION_LABEL = i18n.t(`${namespace}::Focus Classification`);
  lang.FOCUS_INVESTIGATION_STATUS_REASON = i18n.t(`${namespace}::Focus Investigation Reason`);
  lang.GOAL_LABEL = i18n.t(`${namespace}::Goal`);
  lang.ADD_FOCUS_INVESTIGATION = i18n.t(`${namespace}::Add Focus Investigation`);
  lang.INTERVENTION_TYPE_LABEL = i18n.t(`${namespace}::Intervention Type`);
  lang.IRS_TITLE = i18n.t(`${namespace}::IRS`);
  lang.LOCATIONS = i18n.t(`${namespace}::Locations`);
  lang.MDA_POINT_TITLE = i18n.t(`${namespace}::MDA Point`);
  lang.PLAN_TITLE_LABEL = i18n.t(`${namespace}::Plan Title`);
  lang.PLAN_START_DATE_LABEL = i18n.t(`${namespace}::Plan Start Date`);
  lang.PLAN_END_DATE_LABEL = i18n.t(`${namespace}::Plan End Date`);
  lang.QUANTITY_LABEL = i18n.t(`${namespace}::Quantity`);
  lang.PRIORITY_LABEL = i18n.t(`${namespace}::Priority`);
  lang.REASON_HEADER = i18n.t(`${namespace}::Reason`);
  lang.SAVE_PLAN = i18n.t(`${namespace}::Save Plan`);
  lang.SELECT_PLACHOLDER = i18n.t(`${namespace}::Select %s`);
  lang.STATUS_HEADER = i18n.t(`${namespace}::Status`);
  lang.TRIGGERS_LABEL = i18n.t(`${namespace}::Triggers`);
  lang.FOCUS_INVESTIGATION = i18n.t(`${namespace}::Focus Investigation`);
  lang.DATE_IS_REQUIRED = i18n.t(`${namespace}::Date is Required`);
  lang.NAME_IS_REQUIRED = i18n.t(`${namespace}::Name is Required`);
  lang.REQUIRED = i18n.t(`${namespace}::Required`);
  lang.EXPRESSION_LABEL = i18n.t(`${namespace}::Expression`);
  lang.NAME = i18n.t(`${namespace}::Name`);
  lang.SUCCESSFULLY_UPDATED = i18n.t(`${namespace}::Successfully Updated`);
  lang.SUCCESSFULLY_CREATED = i18n.t(`${namespace}::Successfully Created`);
  lang.ACTIVE_DATE_RANGE_LABEL = i18n.t(`${namespace}::Active date range`);
  lang.ADD_JURISDICTION = i18n.t(`${namespace}::Add Jurisdiction`);
  lang.CANCEL = i18n.t(`${namespace}::Cancel`);
  lang.PLAN_TITLE_PLACEHOLDER = i18n.t(`${namespace}::Enter the plan's name`);
  lang.DESCRIPTION_PLACEHOLDER = i18n.t(`${namespace}::Enter the plan's description`);
  lang.DYNAMIC_VALUE_LEGEND_TITLE = i18n.t(`${namespace}::Dynamic Value`);
  lang.PATH_LABEL = i18n.t(`${namespace}::Path`);
  lang.YES = i18n.t(`${namespace}::yes`);
  lang.NO = i18n.t(`${namespace}::no`);
  lang.SETTING_STATUS_TO_DRAFT = i18n.t(`${namespace}::Are you sure? status will be set to draft`);
  lang.SETTING_STATUS_TO_ACTIVE = i18n.t(
    `${namespace}::Are you sure? you won't be able to change the status back to draft`
  );
  lang.SETTING_STATUS_TO_COMPLETE = i18n.t(
    `${namespace}::Are you sure? you won't be able to change the status for complete plans`
  );
  lang.SETTING_STATUS_TO_RETIRED = i18n.t(
    `${namespace}::Are you sure? you won't be able to change the status for retired plans`
  );
  lang.OK = i18n.t(`${namespace}::OK`);
  lang.CANNOT_ACTIVATE_PLAN_WITH_NO_JURISDICTIONS = i18n.t(
    `${namespace}::Assign jurisdictions to the Plan, to enable activating it`
  );
  lang.PLAN_NAME_CANNOT_CONTAIN_SLASHES = i18n.t(`${namespace}::Plan name cannot contain '/'`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// the const
export default lang;
