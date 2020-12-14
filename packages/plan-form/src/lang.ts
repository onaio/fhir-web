import i18n from './mls';

export const A1_DESCRIPTION = i18n.t('Indigenous case recorded within the last year.');
export const A1_NAME = i18n.t('Active');
export const A2_DESCRIPTION = i18n.t(
  'No indigenous case during the last year, but withing the last 3 years.'
);
export const A2_NAME = i18n.t('Residual Non-Active');
export const B1_DESCRIPTION = i18n.t(
  'Receptive area but no indigenous cases within the last 3 years.'
);
export const B1_NAME = i18n.t('Cleared Receptive');
export const B2_DESCRIPTION = i18n.t('Non-receptive area.');
export const B2_NAME = i18n.t('Cleared Non-Receptive');

export const BCC_ACTIVITY = i18n.t('Behaviour Change Communication');
export const BCC_ACTIVITY_DESCRIPTION = i18n.t('Conduct BCC activity');
export const BCC_GOAL_DESCRIPTION = i18n.t(
  'Complete at least 1 BCC activity for the operational area'
);
export const BCC_GOAL_MEASURE = i18n.t('BCC Activities Complete');

export const IRS_ACTIVITY = i18n.t('Spray Structures');
export const IRS_ACTIVITY_DESCRIPTION = i18n.t(
  'Visit each structure in the operational area and attempt to spray'
);
export const IRS_GOAL_DESCRIPTION = i18n.t('Spray structures in the operational area');
export const IRS_GOAL_MEASURE = i18n.t('Percent of structures sprayed');
export const BEDNET_ACTIVITY = i18n.t('Bednet Distribution');
export const BEDNET_ACTIVITY_DESCRIPTION = i18n.t(
  'Visit 100% of residential structures in the operational area and provide nets'
);
export const BEDNET_GOAL_MEASURE = i18n.t('Percent of residential structures received nets');
export const BLOOD_SCREENING_ACTIVITY = i18n.t('Blood screening');
export const BLOOD_SCREENING_ACTIVITY_DESCRIPTION = i18n.t(
  'Visit all residential structures (100% within a 1 km radius of a confirmed index case and test each registered person'
);
export const BLOOD_SCREENING_GOAL_MEASURE = i18n.t('Number of registered people tested');
export const CASE_CONFIRMATION_ACTIVITY = i18n.t('Case Confirmation');
export const CASE_CONFIRMATION_ACTIVITY_DESCRIPTION = i18n.t('Confirm the index case');
export const CASE_CONFIRMATION_ACTIVITY_GOAL_MEASURE = i18n.t('Number of cases confirmed');

export const REGISTER_FAMILY_ACTIVITY = i18n.t('Family Registration');
export const REGISTER_FAMILY_ACTIVITY_DESCRIPTION = i18n.t(
  'Register all families & family members in all residential structures enumerated (100% within the operational area'
);
export const REGISTER_FAMILY_ACTIVITY_GOAL_MEASURE = i18n.t(
  'Percent of residential structures with full family registration'
);
export const LARVAL_DIPPING_ACTIVITY = i18n.t('Larval Dipping');
export const LARVAL_DIPPING_ACTIVITY_DESCRIPTION = i18n.t(
  'Perform a minimum of three larval dipping activities in the operational area'
);
export const LARVAL_DIPPING_GOAL_MEASURE = i18n.t('Number of larval dipping activities completed');

export const MOSQUITO_COLLECTION_ACTIVITY = i18n.t('Mosquito Collection');
export const MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION = i18n.t(
  'Set a minimum of three mosquito collection traps and complete the mosquito collection process'
);
export const MOSQUITO_COLLECTION_GOAL_MEASURE = i18n.t(
  'Number of mosquito collection activities completed'
);

export const PRODUCT_CHECK_ACTIVITY = i18n.t('Product Check');
export const PRODUCT_CHECK_ACTIVITY_DESCRIPTION = i18n.t(
  'Check for all products (100% within the jurisdiction'
);
export const PRODUCT_CHECK_GOAL_MEASURE = i18n.t('Percent of products checked');

export const FIX_PRODUCT_PROBLEM_ACTIVITY = i18n.t('Fix Product Problem');
export const FIX_PRODUCT_PROBLEM_ACTIVITY_DESCRIPTION = i18n.t(
  'Fix problems for all products (100% within the jurisdiction'
);
export const FIX_PRODUCT_PROBLEM_GOAL_MEASURE = i18n.t('Percent of products problems fixed');

export const RECORD_GPS_ACTIVITY = i18n.t('Record GPS');
export const RECORD_GPS_ACTIVITY_DESCRIPTION = i18n.t(
  'Record GPS for all service points without GPS within the jurisdiction'
);
export const RECORD_GPS_GOAL_MEASURE = i18n.t('Percent of GPS recorded');

export const SERVICE_POINT_CHECK_ACTIVITY = i18n.t('Service Point');
export const SERVICE_POINT_CHECK_ACTIVITY_DESCRIPTION = i18n.t(
  'Conduct checks for all service point (100% within the Jurisdiction'
);
export const SERVICE_POINT_CHECK_GOAL_MEASURE = i18n.t('Percent of service points checked');

export const MDA_POINT_DISPENSE_ACTIVITY_DESCRIPTION = i18n.t(
  'Dispense medication to each eligible person'
);
export const MDA_POINT_DISPENSE_COLLECTION_GOAL = i18n.t('Percent of eligible people');
export const MDA_POINT_ADVERSE_EFFECT_ACTIVITY_DESCRIPTION = i18n.t(
  'Report any adverse events from medication'
);
export const MDA_POINT_ADVERSE_EFFECT_COLLECTION_GOAL = i18n.t(
  'Percent of people who reported adverse events'
);
export const GOAL_UNIT_ACTIVITY = i18n.t('activit(y|ies');
export const GOAL_UNIT_CASE = i18n.t('case(s');
export const GOAL_UNIT_PERCENT = i18n.t('Percent');
export const GOAL_UNIT_PERSON = i18n.t('Person(s');
export const GOAL_UNIT_UNKNOWN = i18n.t('unknown');

export const PLAN_STATUS_ACTIVE = i18n.t('active');
export const PLAN_STATUS_COMPLETE = i18n.t('complete');
export const PLAN_STATUS_DRAFT = i18n.t('draft');
export const PLAN_STATUS_RETIRED = i18n.t('retired');

export const DISTRICT = i18n.t('District');
export const CANTON = i18n.t('Canton');
export const VILLAGE = i18n.t('Village');
export const LOW_PRIORITY_LABEL = i18n.t('Low Priority');
export const MEDIUM_PRIORITY_LABEL = i18n.t('Medium Priority');
export const HIGH_PRIORITIY_LABEL = i18n.t('High Priority');

export const INVESTIGATION = i18n.t('Investigation');
export const PROVINCE = i18n.t('Province');
export const ROUTINE_TITLE = i18n.t('Routine');
export const CASE_TRIGGERED_TITLE = i18n.t('Case Triggered');

export const ACTION = i18n.t('Action');
export const ACTIVITIES_LABEL = i18n.t('Activities');
export const ADD = i18n.t('Add');
export const ADD_ACTIVITY = i18n.t('Add Activity');
export const ADD_CODED_ACTIVITY = i18n.t('Add %s Activity');
export const AN_ERROR_OCCURRED = i18n.t('An Error Ocurred');
export const AND = i18n.t('and');
export const CASE_NUMBER = i18n.t('Case Number');
export const CONDITIONS_LABEL = i18n.t('Conditions');
export const DEFINITION_URI = i18n.t('Definition Uri');
export const DESCRIPTION_LABEL = i18n.t('Description');
export const DYNAMIC_FI_TITLE = i18n.t('Dynamic FI');
export const DYNAMIC_IRS_TITLE = i18n.t('Dynamic IRS');
export const DYNAMIC_MDA_TITLE = i18n.t('Dynamic MDA');
export const SUPPLY_MANAGEMENT_TITLE = i18n.t('Supply Management');
export const START_DATE = i18n.t('Start Date');
export const END_DATE = i18n.t('End Date');
export const FOCUS_AREA_HEADER = i18n.t('Focus Area');
export const FOCUS_CLASSIFICATION_LABEL = i18n.t('Focus Classification');
export const FOCUS_INVESTIGATION_STATUS_REASON = i18n.t('Focus Investigation Reason');
export const GOAL_LABEL = i18n.t('Goal');
export const ADD_FOCUS_INVESTIGATION = i18n.t('Add Focus Investigation');
export const INTERVENTION_TYPE_LABEL = i18n.t('Intervention Type');
export const IRS_TITLE = i18n.t('IRS');
export const LOCATIONS = i18n.t('Locations');
export const MDA_POINT_TITLE = i18n.t('MDA Point');
export const PLAN_TITLE_LABEL = i18n.t('Plan Title');
export const PLAN_START_DATE_LABEL = i18n.t('Plan Start Date');
export const PLAN_END_DATE_LABEL = i18n.t('Plan End Date');
export const QUANTITY_LABEL = i18n.t('Quantity');
export const PRIORITY_LABEL = i18n.t('Priority');
export const REASON_HEADER = i18n.t('Reason');
export const SAVE_PLAN = i18n.t('Save Plan');
export const SELECT_PLACHOLDER = i18n.t('Select %s');
export const STATUS_HEADER = i18n.t('Status');
export const TRIGGERS_LABEL = i18n.t('Triggers');
export const FOCUS_INVESTIGATION = i18n.t('Focus Investigation');
export const DATE_IS_REQUIRED = i18n.t('Date is Required');
export const NAME_IS_REQUIRED = i18n.t('Name is Required');
export const REQUIRED = i18n.t('Required');
export const EXPRESSION_LABEL = i18n.t('Expression');
export const NAME = i18n.t('Name');
export const SUCCESSFULLY_UPDATED = i18n.t('Successfully Updated');
export const SUCCESSFULLY_CREATED = i18n.t('Successfully Created');
export const ACTIVE_DATE_RANGE_LABEL = i18n.t('Active date range');
export const ADD_JURISDICTION = i18n.t('Add Jurisdiction');
export const CANCEL = i18n.t('Cancel');
export const PLAN_TITLE_PLACEHOLDER = i18n.t("Enter the Plan's name");
export const DESCRIPTION_PLACEHOLDER = i18n.t('Enter the plans Description');
