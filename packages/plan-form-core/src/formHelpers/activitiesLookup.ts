import {
  BCC_CODE,
  INVESTIGATION,
  MEDIUM_PRIORITY,
  IRS_CODE,
  ROUTINE,
  BEDNET_DISTRIBUTION_CODE,
  BLOOD_SCREENING_CODE,
  CASE_CONFIRMATION_CODE,
  APPLICABILITY_CONDITION_KIND,
  PLAN_ACTIVATION_TRIGGER_NAME,
  NAMED_EVENT_TRIGGER_TYPE,
  CREATE_TYPE,
  MDA_ADHERENCE_CODE,
  MDA_POINT_DISPENSE_CODE,
  RACD_REGISTER_FAMILY_CODE,
  LARVAL_DIPPING_CODE,
  MOSQUITO_COLLECTION_CODE,
  MDA_POINT_ADVERSE_EFFECTS_CODE,
  PRODUCT_CHECK_ACTIVITY_CODE,
  PRODUCT_CHECK_CODE,
  FIX_PRODUCT_PROBLEM_ACTIVITY_CODE,
  FIX_PRODUCT_PROBLEMS_CODE,
  RECORD_GPS_ACTIVITY_CODE,
  RECORD_GPS_CODE,
  SERVICE_POINT_CHECK_ACTIVITY_CODE,
  SERVICE_POINT_CHECK_CODE,
  LOOKS_GOOD_ACTIVITY_CODE,
  COMPLETE_FIX_PROBLEM_ACTIVITY_CODE,
  COMPLETE_FLAG_PROBLEM_ACTIVITY_CODE,
  COMPLETE_RECORD_GPS_ACTIVITY_CODE,
  COMPLETE_SERVICE_CHECK_ACTIVITY_CODE,
  LOOKS_GOOD_CODE,
  UPDATE_TYPE,
  COMPLETE_FIX_PROBLEM_CODE,
  COMPLETE_FLAG_PROBLEM_CODE,
  COMPLETE_RECORD_GPS_CODE,
  COMPLETE_SERVICE_CHECK_CODE,
} from './constants/stringConstants';
import {
  BCC_ACTIVITY_DESCRIPTION,
  BCC_ACTIVITY,
  BCC_GOAL_DESCRIPTION,
  BCC_GOAL_MEASURE,
  IRS_ACTIVITY_DESCRIPTION,
  IRS_ACTIVITY,
  IRS_GOAL_DESCRIPTION,
  IRS_GOAL_MEASURE,
  BEDNET_ACTIVITY_DESCRIPTION,
  BEDNET_ACTIVITY,
  BEDNET_GOAL_MEASURE,
  BLOOD_SCREENING_ACTIVITY_DESCRIPTION,
  BLOOD_SCREENING_ACTIVITY,
  BLOOD_SCREENING_GOAL_MEASURE,
  CASE_CONFIRMATION_ACTIVITY_DESCRIPTION,
  CASE_CONFIRMATION_ACTIVITY,
  CASE_CONFIRMATION_ACTIVITY_GOAL_MEASURE,
  REGISTER_FAMILY_ACTIVITY_DESCRIPTION,
  REGISTER_FAMILY_ACTIVITY,
  REGISTER_FAMILY_ACTIVITY_GOAL_MEASURE,
  LARVAL_DIPPING_ACTIVITY_DESCRIPTION,
  LARVAL_DIPPING_ACTIVITY,
  LARVAL_DIPPING_GOAL_MEASURE,
  MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION,
  MOSQUITO_COLLECTION_ACTIVITY,
  MOSQUITO_COLLECTION_GOAL_MEASURE,
  MDA_POINT_ADVERSE_EFFECT_ACTIVITY_DESCRIPTION,
  MDA_POINT_ADVERSE_EFFECT_COLLECTION_GOAL,
  MDA_POINT_DISPENSE_ACTIVITY_DESCRIPTION,
  MDA_POINT_DISPENSE_COLLECTION_GOAL,
  PRODUCT_CHECK_ACTIVITY_DESCRIPTION,
  PRODUCT_CHECK_GOAL_MEASURE,
  FIX_PRODUCT_PROBLEM_ACTIVITY_DESCRIPTION,
  FIX_PRODUCT_PROBLEM_GOAL_MEASURE,
  RECORD_GPS_ACTIVITY_DESCRIPTION,
  RECORD_GPS_GOAL_MEASURE,
  SERVICE_POINT_CHECK_ACTIVITY_DESCRIPTION,
  SERVICE_POINT_CHECK_GOAL_MEASURE,
  PRODUCT_CHECK_ACTIVITY,
  COMPLETE_LOOKS_GOOD_TITLE,
  COMPLETE_LOOKS_GOOD_DESCRIPTION,
  COMPLETE_FIX_PROBLEM_GOAL_DESCRIPTION,
  COMPLETE_FIX_PROBLEM_GOAL_MEASURE,
  COMPLETE_FIX_PROBLEM_DESCRIPTION,
  COMPLETE_FIX_PROBLEM_TASK,
  COMPLETE_FLAG_PROBLEM_TITLE,
  COMPLETE_FLAG_PROBLEM_DESCRIPTION,
  FIX_PRODUCT_PROBLEM_ACTIVITY,
  RECORD_GPS_ACTIVITY,
  RECORD_GPS_GOAL_DESCRIPTION,
  COMPLETE_RECORD_GPS_DESCRIPTION,
  COMPLETE_RECORD_GPS_TITLE,
  COMPLETE_SERVICE_CHECK_DESCRIPTION,
  COMPLETE_SERVICE_POINT_CHECK_TITLE,
  COMPLETE_SERVICE_CHECK_GOAL_DESCRIPTION,
} from './constants/lang';
import { PlanActivities } from './types';
import { GoalUnit } from './constants/enumsAndCodeConstants';

/** default plan activities */
export const planActivities: PlanActivities = {
  BCC: {
    action: {
      code: BCC_CODE,
      description: BCC_ACTIVITY_DESCRIPTION,
      goalId: 'BCC_Focus',
      identifier: '',
      prefix: 99,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Jurisdiction',
      },
      taskTemplate: 'BCC_Focus',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: BCC_ACTIVITY,
    },
    goal: {
      description: BCC_GOAL_DESCRIPTION,
      id: 'BCC_Focus',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 1,
            },
          },
          due: '',
          measure: BCC_GOAL_MEASURE,
        },
      ],
    },
  },
  IRS: {
    action: {
      code: IRS_CODE,
      description: IRS_ACTIVITY_DESCRIPTION,
      goalId: 'IRS',
      identifier: '',
      prefix: 7,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'Spray_Structures',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: IRS_ACTIVITY,
    },
    goal: {
      description: IRS_GOAL_DESCRIPTION,
      id: 'IRS',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 90,
            },
          },
          due: '',
          measure: IRS_GOAL_MEASURE,
        },
      ],
    },
  },
  bednetDistribution: {
    action: {
      code: BEDNET_DISTRIBUTION_CODE,
      description: BEDNET_ACTIVITY_DESCRIPTION,
      goalId: 'RACD_bednet_distribution',
      identifier: '',
      prefix: 4,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'Bednet_Distribution',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: BEDNET_ACTIVITY,
    },
    goal: {
      description: BEDNET_ACTIVITY_DESCRIPTION,
      id: 'RACD_bednet_distribution',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
          measure: BEDNET_GOAL_MEASURE,
        },
      ],
    },
  },
  bloodScreening: {
    action: {
      code: BLOOD_SCREENING_CODE,
      description: BLOOD_SCREENING_ACTIVITY_DESCRIPTION,
      goalId: 'RACD_Blood_Screening',
      identifier: '',
      prefix: 3,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Person',
      },
      taskTemplate: 'RACD_Blood_Screening',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: BLOOD_SCREENING_ACTIVITY,
    },
    goal: {
      description: BLOOD_SCREENING_ACTIVITY_DESCRIPTION,
      id: 'RACD_Blood_Screening',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERSON,
              value: 100,
            },
          },
          due: '',
          measure: BLOOD_SCREENING_GOAL_MEASURE,
        },
      ],
    },
  },
  caseConfirmation: {
    action: {
      code: CASE_CONFIRMATION_CODE,
      description: CASE_CONFIRMATION_ACTIVITY_DESCRIPTION,
      goalId: 'Case_Confirmation',
      identifier: '',
      prefix: 1,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Jurisdiction',
      },
      taskTemplate: 'Case_Confirmation',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: CASE_CONFIRMATION_ACTIVITY,
    },
    goal: {
      description: CASE_CONFIRMATION_ACTIVITY_DESCRIPTION,
      id: 'Case_Confirmation',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.CASE,
              value: 1,
            },
          },
          due: '',
          measure: CASE_CONFIRMATION_ACTIVITY_GOAL_MEASURE,
        },
      ],
    },
  },
  dynamicBCC: {
    action: {
      code: BCC_CODE,
      condition: [
        {
          expression: {
            description: 'Jurisdiction type location',
            expression: "Location.physicalType.text = 'jdn'",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'behaviour_change_communication.json',
      description: BCC_ACTIVITY_DESCRIPTION,
      goalId: 'BCC_Focus',
      identifier: '',
      prefix: 101,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Jurisdiction',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: BCC_ACTIVITY,
      trigger: [
        {
          name: PLAN_ACTIVATION_TRIGGER_NAME,
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description: BCC_GOAL_DESCRIPTION,
      id: 'BCC_Focus',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 1,
            },
          },
          due: '',
          measure: BCC_GOAL_MEASURE,
        },
      ],
    },
  },
  dynamicBednetDistribution: {
    action: {
      code: BEDNET_DISTRIBUTION_CODE,
      condition: [
        {
          expression: {
            description: 'Structure is residential or type does not exist',
            expression:
              "$this.is(FHIR.QuestionnaireResponse) or (($this.type.where(id='locationType').exists().not() or $this.type.where(id='locationType').text = 'Residential Structure') and $this.contained.exists())",
            subjectCodableConcept: {
              text: 'Family',
            },
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'bednet_distribution.json',
      description: BEDNET_ACTIVITY_DESCRIPTION,
      goalId: 'RACD_bednet_distribution',
      identifier: '',
      prefix: 4,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Location',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: BEDNET_ACTIVITY,
      trigger: [
        {
          name: PLAN_ACTIVATION_TRIGGER_NAME,
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
        {
          expression: {
            description: 'Trigger when a Family Registration event is submitted',
            expression: "questionnaire = 'Family_Registration'",
          },
          name: 'event-submission',
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description: BEDNET_ACTIVITY_DESCRIPTION,
      id: 'RACD_bednet_distribution',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
          measure: BEDNET_GOAL_MEASURE,
        },
      ],
    },
  },
  dynamicBloodScreening: {
    action: {
      code: BLOOD_SCREENING_CODE,
      condition: [
        {
          expression: {
            description:
              'Person is older than 5 years or person associated with questionnaire response if older than 5 years',
            expression:
              "($this.is(FHIR.Patient) and $this.birthDate <= today() - 5 'years') or ($this.contained.where(Patient.birthDate <= today() - 5 'years').exists())",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'blood_screening.json',
      description: BLOOD_SCREENING_ACTIVITY_DESCRIPTION,
      goalId: 'RACD_Blood_Screening',
      identifier: '',
      prefix: 3,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Person',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: BLOOD_SCREENING_ACTIVITY,
      trigger: [
        {
          name: PLAN_ACTIVATION_TRIGGER_NAME,
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
        {
          expression: {
            description: 'Trigger when a Family Member Registration event is submitted',
            expression: "questionnaire = 'Family_Member_Registration'",
          },
          name: 'event-submission',
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description: BLOOD_SCREENING_ACTIVITY_DESCRIPTION,
      id: 'RACD_Blood_Screening',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERSON,
              value: 100,
            },
          },
          due: '',
          measure: BLOOD_SCREENING_GOAL_MEASURE,
        },
      ],
    },
  },
  dynamicCommunityAdherenceMDA: {
    action: {
      code: MDA_ADHERENCE_CODE,
      condition: [
        {
          expression: {
            description: 'The person fully received the dispense activity',
            expression:
              "$this.item.where(linkId='business_status').answer.value = 'Fully Received'",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'mda_adherence.json',
      description:
        'Visit all residential structures (100%) and confirm adherence of each registered person',
      goalId: 'MDA_Adherence',
      identifier: '',
      prefix: 11,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Person',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: MDA_ADHERENCE_CODE,
      trigger: [
        {
          expression: {
            description: 'Trigger when a MDA Dispense event is submitted',
            expression: "questionnaire = 'mda_dispense'",
          },
          name: 'event-submission',
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description:
        'Visit all residential structures (100%) and confirm adherence of each registered person',
      id: 'MDA_Adherence',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
          measure: 'Percent of dispense recipients',
        },
      ],
    },
  },
  dynamicCommunityDispenseMDA: {
    action: {
      code: MDA_POINT_DISPENSE_CODE,
      condition: [
        {
          expression: {
            description:
              'Person or person associated with questionaire response is older than 5 years and younger than 15 years',
            expression:
              "($this.is(FHIR.Patient) and $this.birthDate <= today() - 5 'years' and $this.birthDate > today() - 15 'years') or ($this.contained.where(Patient.birthDate <= today() - 5 'years' and $this.birthDate > today() - 15 'years').exists())",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'mda_dispense.json',
      description:
        'Visit all residential structures (100%) and dispense prophylaxis to each registered person',
      goalId: 'MDA_Dispense',
      identifier: '',
      prefix: 10,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Person',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: 'Distribute Drugs',
      trigger: [
        {
          name: PLAN_ACTIVATION_TRIGGER_NAME,
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
        {
          expression: {
            description:
              'Trigger when a Family Registration or Family Member Registration event is submitted',
            expression:
              "questionnaire = 'Family_Registration' or questionnaire = 'Family_Member_Registration'",
          },
          name: 'event-submission',
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description:
        'Visit all residential structures (100%) dispense prophylaxis to each registered person',
      id: 'MDA_Dispense',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 75,
            },
          },
          due: '',
          measure: 'Percent of Registered person(s)',
        },
      ],
    },
  },
  dynamicFamilyRegistration: {
    action: {
      code: RACD_REGISTER_FAMILY_CODE,
      condition: [
        {
          expression: {
            description: 'Structure is residential or type does not exist',
            expression:
              "$this.is(FHIR.QuestionnaireResponse) or (($this.type.where(id='locationType').exists().not() or $this.type.where(id='locationType').text = 'Residential Structure') and $this.contained.exists().not())",
            subjectCodableConcept: {
              text: 'Family',
            },
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
        {
          expression: {
            description: 'Apply to residential structures in Register_Structure questionnaires',
            expression:
              "$this.is(FHIR.Location) or (questionnaire = 'Register_Structure' and $this.item.where(linkId='structureType').answer.value ='Residential Structure')",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'family_register.json',
      description: REGISTER_FAMILY_ACTIVITY_DESCRIPTION,
      goalId: 'RACD_register_families',
      identifier: '',
      prefix: 2,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Location',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: REGISTER_FAMILY_ACTIVITY,
      trigger: [
        {
          name: PLAN_ACTIVATION_TRIGGER_NAME,
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
        {
          expression: {
            description: 'Trigger when a Register_Structure event is submitted',
            expression: "questionnaire = 'Register_Structure' or questionnaire = 'Archive_Family'",
          },
          name: 'event-submission',
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description: REGISTER_FAMILY_ACTIVITY_DESCRIPTION,
      id: 'RACD_register_families',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
          measure: REGISTER_FAMILY_ACTIVITY_GOAL_MEASURE,
        },
      ],
    },
  },
  dynamicIRS: {
    action: {
      code: IRS_CODE,
      condition: [
        {
          expression: {
            description: 'Structure is residential or type does not exist',
            expression:
              "$this.is(FHIR.QuestionnaireResponse) or $this.type.where(id='locationType').exists().not() or $this.type.where(id='locationType').text = 'Residential Structure'",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
        {
          expression: {
            description: 'Apply to residential structures in Register_Structure questionnaires',
            expression:
              "$this.is(FHIR.Location) or (questionnaire = 'Register_Structure' and $this.item.where(linkId='structureType').answer.value ='Residential Structure')",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'spray_form.json',
      description: IRS_ACTIVITY_DESCRIPTION,
      goalId: 'IRS',
      identifier: '',
      prefix: 7,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Location',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: IRS_ACTIVITY,
      trigger: [
        {
          name: PLAN_ACTIVATION_TRIGGER_NAME,
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
        {
          expression: {
            description: 'Trigger when a Register_Structure event is submitted',
            expression: "questionnaire = 'Register_Structure'",
          },
          name: 'event-submission',
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description: IRS_GOAL_DESCRIPTION,
      id: 'IRS',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 90,
            },
          },
          due: '',
          measure: IRS_GOAL_MEASURE,
        },
      ],
    },
  },
  dynamicLarvalDipping: {
    action: {
      code: LARVAL_DIPPING_CODE,
      condition: [
        {
          expression: {
            description: 'Structure is a larval breeding site',
            expression:
              "$this.is(FHIR.QuestionnaireResponse) or $this.type.where(id='locationType').text = 'Larval Breeding Site'",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
        {
          expression: {
            description: 'Apply to larval breeding sites in Register_Structure questionnaires',
            expression:
              "$this.is(FHIR.Location) or (questionnaire = 'Register_Structure' and $this.item.where(linkId='structureType').answer.value ='Larval Breeding Site')",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'larval_dipping_form.json',
      description: LARVAL_DIPPING_ACTIVITY_DESCRIPTION,
      goalId: 'Larval_Dipping',
      identifier: '',
      prefix: 5,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Location',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: LARVAL_DIPPING_ACTIVITY,
      trigger: [
        {
          name: PLAN_ACTIVATION_TRIGGER_NAME,
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
        {
          expression: {
            description: 'Trigger when a Register_Structure event is submitted',
            expression: "questionnaire = 'Register_Structure'",
          },
          name: 'event-submission',
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description: LARVAL_DIPPING_ACTIVITY_DESCRIPTION,
      id: 'Larval_Dipping',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 3,
            },
          },
          due: '',
          measure: LARVAL_DIPPING_GOAL_MEASURE,
        },
      ],
    },
  },
  dynamicMosquitoCollection: {
    action: {
      code: MOSQUITO_COLLECTION_CODE,
      condition: [
        {
          expression: {
            description: 'Structure is a mosquito collection point',
            expression:
              "$this.is(FHIR.QuestionnaireResponse) or $this.type.where(id='locationType').text = 'Mosquito Collection Point'",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
        {
          expression: {
            description: 'Apply to mosquito collection point in Register_Structure questionnaires',
            expression:
              "$this.is(FHIR.Location) or (questionnaire = 'Register_Structure' and $this.item.where(linkId='structureType').answer.value ='Mosquito Collection Point')",
          },
          kind: APPLICABILITY_CONDITION_KIND,
        },
      ],
      definitionUri: 'mosquito_collection_form.json',
      description: MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION,
      goalId: 'Mosquito_Collection',
      identifier: '',
      prefix: 6,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Location',
      },
      timingPeriod: {
        end: '',
        start: '',
      },
      title: MOSQUITO_COLLECTION_ACTIVITY,
      trigger: [
        {
          name: PLAN_ACTIVATION_TRIGGER_NAME,
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
        {
          expression: {
            description: 'Trigger when a Register_Structure event is submitted',
            expression: "questionnaire = 'Register_Structure'",
          },
          name: 'event-submission',
          type: NAMED_EVENT_TRIGGER_TYPE,
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description: MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION,
      id: 'Mosquito_Collection',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 3,
            },
          },
          due: '',
          measure: MOSQUITO_COLLECTION_GOAL_MEASURE,
        },
      ],
    },
  },
  familyRegistration: {
    action: {
      code: RACD_REGISTER_FAMILY_CODE,
      description: REGISTER_FAMILY_ACTIVITY_DESCRIPTION,
      goalId: 'RACD_register_families',
      identifier: '',
      prefix: 2,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'RACD_register_families',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: REGISTER_FAMILY_ACTIVITY,
    },
    goal: {
      description: REGISTER_FAMILY_ACTIVITY_DESCRIPTION,
      id: 'RACD_register_families',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
          measure: REGISTER_FAMILY_ACTIVITY_GOAL_MEASURE,
        },
      ],
    },
  },
  larvalDipping: {
    action: {
      code: LARVAL_DIPPING_CODE,
      description: LARVAL_DIPPING_ACTIVITY_DESCRIPTION,
      goalId: 'Larval_Dipping',
      identifier: '',
      prefix: 5,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'Larval_Dipping',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: LARVAL_DIPPING_ACTIVITY,
    },
    goal: {
      description: LARVAL_DIPPING_ACTIVITY_DESCRIPTION,
      id: 'Larval_Dipping',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 3,
            },
          },
          due: '',
          measure: LARVAL_DIPPING_GOAL_MEASURE,
        },
      ],
    },
  },
  mosquitoCollection: {
    action: {
      code: MOSQUITO_COLLECTION_CODE,
      description: MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION,
      goalId: 'Mosquito_Collection',
      identifier: '',
      prefix: 6,
      reason: INVESTIGATION,
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'Mosquito_Collection_Point',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: MOSQUITO_COLLECTION_ACTIVITY,
    },
    goal: {
      description: MOSQUITO_COLLECTION_ACTIVITY_DESCRIPTION,
      id: 'Mosquito_Collection',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 3,
            },
          },
          due: '',
          measure: MOSQUITO_COLLECTION_GOAL_MEASURE,
        },
      ],
    },
  },
  pointAdverseMDA: {
    action: {
      code: MDA_POINT_ADVERSE_EFFECTS_CODE,
      description: MDA_POINT_ADVERSE_EFFECT_ACTIVITY_DESCRIPTION,
      goalId: 'Point_adverse_effect_MDA',
      identifier: '',
      prefix: 9,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'MDA_Point_Adverse_Event',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: MDA_POINT_ADVERSE_EFFECTS_CODE,
    },
    goal: {
      description: MDA_POINT_ADVERSE_EFFECT_ACTIVITY_DESCRIPTION,
      id: 'Point_adverse_effect_MDA',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '<=',
              unit: GoalUnit.PERCENT,
              value: 2,
            },
          },
          due: '',
          measure: MDA_POINT_ADVERSE_EFFECT_COLLECTION_GOAL,
        },
      ],
    },
  },
  pointDispenseMDA: {
    action: {
      code: MDA_POINT_DISPENSE_CODE,
      description: MDA_POINT_DISPENSE_ACTIVITY_DESCRIPTION,
      goalId: 'Point_dispense_MDA',
      identifier: '',
      prefix: 8,
      reason: ROUTINE,
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'MDA_Point_Dispense',
      timingPeriod: {
        end: '',
        start: '',
      },
      title: MDA_POINT_DISPENSE_CODE,
    },
    goal: {
      description: MDA_POINT_DISPENSE_ACTIVITY_DESCRIPTION,
      id: 'Point_dispense_MDA',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 75,
            },
          },
          due: '',
          measure: MDA_POINT_DISPENSE_COLLECTION_GOAL,
        },
      ],
    },
  },
  [PRODUCT_CHECK_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 10, // TODO :what does prefix mean
      title: PRODUCT_CHECK_ACTIVITY,
      description: PRODUCT_CHECK_ACTIVITY_DESCRIPTION,
      code: PRODUCT_CHECK_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: PRODUCT_CHECK_CODE,
      subjectCodableConcept: {
        text: 'Device',
      },
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: PLAN_ACTIVATION_TRIGGER_NAME,
        },
      ],
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.Bundle)',
          },
        },
      ],
      dynamicValue: [
        {
          path: 'structureId',
          expression: {
            expression: '$this.entry.resource.as(Device).location.reference.substring(9)',
          },
        },
      ],
      definitionUri: 'product_check.json',
      type: CREATE_TYPE,
    },
    goal: {
      description: PRODUCT_CHECK_ACTIVITY_DESCRIPTION,
      id: PRODUCT_CHECK_CODE,
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
          measure: PRODUCT_CHECK_GOAL_MEASURE,
        },
      ],
    },
  },
  [LOOKS_GOOD_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 11, // TODO :what does prefix mean
      title: COMPLETE_LOOKS_GOOD_TITLE,
      description: COMPLETE_LOOKS_GOOD_DESCRIPTION,
      code: LOOKS_GOOD_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: LOOKS_GOOD_CODE,
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Looks Good event is submitted',
            expression: "questionnaire = 'looks_good'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'Visited'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
          },
        },
      ],
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'looks_good.json',
      type: UPDATE_TYPE,
    },
    goal: {
      id: LOOKS_GOOD_CODE,
      description: 'Check for all products (100%) within jurisdiction',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          measure: 'Percent of products in good condition',
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
        },
      ],
    },
  },
  [COMPLETE_FIX_PROBLEM_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 12, // TODO :what does prefix mean
      title: COMPLETE_FIX_PROBLEM_TASK,
      description: COMPLETE_FIX_PROBLEM_DESCRIPTION,
      code: COMPLETE_FIX_PROBLEM_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: COMPLETE_FIX_PROBLEM_CODE,
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Fix Problem event is submitted',
            expression: "questionnaire = 'fix_problem'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'Visited'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
          },
        },
      ],
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Problem Fixed',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'fix_problem.json',
      type: UPDATE_TYPE,
    },
    goal: {
      id: COMPLETE_FIX_PROBLEM_CODE,
      description: COMPLETE_FIX_PROBLEM_GOAL_DESCRIPTION,
      priority: MEDIUM_PRIORITY,
      target: [
        {
          measure: COMPLETE_FIX_PROBLEM_GOAL_MEASURE,
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
        },
      ],
    },
  },
  [COMPLETE_FLAG_PROBLEM_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 13, // TODO :what does prefix mean
      title: COMPLETE_FLAG_PROBLEM_TITLE,
      description: COMPLETE_FLAG_PROBLEM_DESCRIPTION,
      code: COMPLETE_FLAG_PROBLEM_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: COMPLETE_FLAG_PROBLEM_CODE,
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Flag Problem event is submitted',
            expression: "questionnaire = 'flag_problem'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'has_problem'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
          },
        },
      ],
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Problem Flagged',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'flag_problem.json',
      type: UPDATE_TYPE,
    },
    goal: {
      id: 'complete_flag_problem',
      description: 'Completes Flag problem form for a product within the jurisdiction',
      priority: MEDIUM_PRIORITY,
      target: [
        {
          measure: 'Percent of products problems found',
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
        },
      ],
    },
  },
  [FIX_PRODUCT_PROBLEM_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 14, // TODO :what does prefix mean
      title: FIX_PRODUCT_PROBLEM_ACTIVITY,
      description: FIX_PRODUCT_PROBLEM_ACTIVITY_DESCRIPTION,
      code: FIX_PRODUCT_PROBLEMS_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: FIX_PRODUCT_PROBLEMS_CODE,
      subjectCodableConcept: {
        text: 'Device',
      },
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Fix Product event is submitted',
            expression: "questionnaire = 'flag_problem'",
          },
        },
      ],
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'fix_problem.json',
      type: CREATE_TYPE,
    },
    goal: {
      description: FIX_PRODUCT_PROBLEM_ACTIVITY_DESCRIPTION,
      id: FIX_PRODUCT_PROBLEMS_CODE,
      priority: MEDIUM_PRIORITY,
      target: [
        {
          measure: FIX_PRODUCT_PROBLEM_GOAL_MEASURE,
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
        },
      ],
    },
  },
  [RECORD_GPS_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 15, // TODO :what does prefix mean
      title: RECORD_GPS_ACTIVITY,
      description: RECORD_GPS_ACTIVITY_DESCRIPTION,
      code: RECORD_GPS_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: RECORD_GPS_CODE,
      subjectCodableConcept: {
        text: 'Location.Stock',
      },
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: 'plan-activation',
        },
      ],
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Service point does not have geometry',
            expression:
              "Bundle.entry.resource.ofType(Location).identifier.where(system='hasGeometry').value='false'",
          },
        },
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Check if service point has stock',
            expression: 'Bundle.entry.resource.ofType(SupplyDelivery).exists()',
          },
        },
      ],
      dynamicValue: [
        {
          path: 'structureId',
          expression: {
            expression: '$this.id',
          },
        },
      ],
      definitionUri: 'record_gps.json',
      type: CREATE_TYPE,
    },
    goal: {
      description: RECORD_GPS_GOAL_DESCRIPTION,
      id: RECORD_GPS_CODE,
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
          measure: RECORD_GPS_GOAL_MEASURE,
        },
      ],
    },
  },
  [COMPLETE_RECORD_GPS_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 16, // TODO :what does prefix mean
      title: COMPLETE_RECORD_GPS_TITLE,
      description: COMPLETE_RECORD_GPS_DESCRIPTION,
      code: COMPLETE_RECORD_GPS_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: COMPLETE_RECORD_GPS_CODE,
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Record Gps event is submitted',
            expression: "questionnaire = 'record_gps'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'Visited'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
          },
        },
      ],
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'GPS recorded',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'record_gps.json',
      type: 'update',
    },
    goal: {
      description: 'Complete Record GPS for a particular service point',
      id: COMPLETE_RECORD_GPS_CODE,
      priority: MEDIUM_PRIORITY,
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
          measure: RECORD_GPS_GOAL_MEASURE,
        },
      ],
    },
  },
  [SERVICE_POINT_CHECK_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 17, // TODO :what does prefix mean
      description: SERVICE_POINT_CHECK_ACTIVITY_DESCRIPTION,
      code: SERVICE_POINT_CHECK_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: SERVICE_POINT_CHECK_CODE,
      subjectCodableConcept: {
        text: 'Location.Stock',
      },
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'All service points',
            expression: '$this.is(FHIR.Bundle)',
          },
        },
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Check if service point has stock',
            expression: 'Bundle.entry.resource.ofType(SupplyDelivery).exists()',
          },
        },
      ],
      dynamicValue: [
        {
          path: 'structureId',
          expression: {
            expression: '$this.id',
          },
        },
      ],
      definitionUri: 'service_point_check.json',
      title: 'Service Point Check',
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: 'plan-activation',
        },
      ],
      type: CREATE_TYPE,
    },
    goal: {
      description: SERVICE_POINT_CHECK_ACTIVITY_DESCRIPTION,
      id: SERVICE_POINT_CHECK_CODE,
      priority: MEDIUM_PRIORITY,
      target: [
        {
          measure: SERVICE_POINT_CHECK_GOAL_MEASURE,
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
        },
      ],
    },
  },
  [COMPLETE_SERVICE_CHECK_ACTIVITY_CODE]: {
    action: {
      identifier: '',
      prefix: 18, // TODO :what does prefix mean
      title: COMPLETE_SERVICE_POINT_CHECK_TITLE,
      description: COMPLETE_SERVICE_CHECK_DESCRIPTION,
      code: COMPLETE_SERVICE_CHECK_CODE,
      timingPeriod: {
        end: '',
        start: '',
      },
      reason: ROUTINE,
      goalId: COMPLETE_SERVICE_CHECK_CODE,
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: NAMED_EVENT_TRIGGER_TYPE,
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Service Point Check event is submitted',
            expression: "questionnaire = 'service_point_check'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'Visited'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
          },
        },
      ],
      condition: [
        {
          kind: APPLICABILITY_CONDITION_KIND,
          expression: {
            description: 'Service Point Checked',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'service_point_check.json',
      type: 'update',
    },
    goal: {
      description: COMPLETE_SERVICE_CHECK_GOAL_DESCRIPTION,
      id: COMPLETE_SERVICE_CHECK_CODE,
      priority: MEDIUM_PRIORITY,
      target: [
        {
          measure: 'Percent of service points checked',
          detail: {
            detailQuantity: {
              comparator: '>',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '',
        },
      ],
    },
  },
};
