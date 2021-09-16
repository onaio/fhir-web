export const model1Schema: any = {
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
      default: "Chuck",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10,
    },
  },
};

export const model1UiSchema = {
  firstName: {
    "ui:autofocus": true,
    "ui:emptyValue": "",
    "ui:autocomplete": "family-name",
  },
  lastName: {
    "ui:emptyValue": "",
    "ui:autocomplete": "given-name",
  },
  age: {
    "ui:widget": "updown",
    "ui:title": "Age of person",
    "ui:description": "(earthian year)",
  },
  bio: {
    "ui:widget": "textarea",
  },
  password: {
    "ui:widget": "password",
    "ui:help": "Hint: Make it strong!",
  },
  date: {
    "ui:widget": "alt-datetime",
  },
  telephone: {
    "ui:options": {
      inputType: "tel",
    },
  },
};

export const model1FormData = {
  firstName: "Chuck",
  lastName: "Norris",
  age: 75,
  bio: "Roundhouse kicking asses since 1940",
  password: "noneed",
};

export const easySchema = {
  title: "Guest",
  type: "object",
  properties: {
    date: { type: "string", format: "date-time" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    workExperience: {
      description: "Work experience in years",
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
  },
  required: ["firstName", "lastName"],
};

export const sampleJsonSchema = {
  meta: {
    profile: [
      "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire|2.7",
    ],
    tag: [{ display: "lformsVersion: 21.2.1" }],
  },
  date: "2020-04-11T22:01:37.262Z",
  version: "1",
  subjectType: ["Organization"],
  status: "draft",
  experimental: true,
  publisher: "Health eData Inc",
  description: "Healthcare Worker Staffing Pathway",
  copyright:
    "Content source: Centers for Disease Control and Prevention , National Center for Emerging and Zoonotic Infectious Diseases (NCEZID) , Division of Healthcare Quality Promotion (DHQP)",
  url: "http://example.org/healthcareworkerstaffingpathway",
  name: "HealthcareWorkerStaffingPathway",
  title: "Healthcare Worker Staffing Pathway",
  type: "object",
  properties: {
    "/G1": {
      type: "object",
      dataType: "SECTION",
      properties: {
        "/G1/Q1": {
          type: "string",
          dataType: "ST",
          prefix: "1",
          title: "Facility ID",
          codeList: [{ code: "Q1", display: "Facility ID", system: "Custom" }],
          questionCode: "Q1",
          questionCodeSystem: "Custom",
          linkId: "/G1/Q1",
          questionCardinality: { max: "1", min: "1" },
          answerCardinality: { min: "1" },
          codingInstructions:
            "The NHSN-assigned facility ID will be autoentered by the computer.",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "The NHSN-assigned facility ID will be autoentered by the computer.",
        },
      },

      title: "Facility MetaData",
      codeList: [
        { code: "G1", display: "Facility MetaData", system: "Custom" },
      ],
      questionCode: "G1",
      questionCodeSystem: "Custom",
      linkId: "/G1",
      questionCardinality: { max: "1", min: "1" },
    },
  },
  fhirVersion: "R4",
};

const res = {
  meta: {
    profile: [
      "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire|2.7",
    ],
    tag: [{ display: "lformsVersion: 21.2.1" }],
  },
  date: "2020-04-11T22:01:37.262Z",
  version: "1",
  subjectType: ["Organization"],
  status: "draft",
  experimental: true,
  publisher: "Health eData Inc",
  description:
    "CDC’s NHSN is supporting the nation’s COVID-19 response by introducing a new COVID-19 Module. COVID-19 Module consists of 3 pathways  -  Patient Impact and Hospital Capacity Pathway, Healthcare Worker Staffing Pathway and Healthcare Supply Pathway The COVID-19 Module consists of three pathways within NHSN’s Patient Safety Component:  This Questionnaire represent the Healthcare Worker Staffing Pathway Module.  More information about this module can be found here: https://www.cdc.gov/nhsn/acute-care-hospital/covid19/index.html",
  copyright:
    "Content source: Centers for Disease Control and Prevention , National Center for Emerging and Zoonotic Infectious Diseases (NCEZID) , Division of Healthcare Quality Promotion (DHQP)",
  url: "http://example.org/healthcareworkerstaffingpathway",
  $id: "http://example.org/healthcareworkerstaffingpathway",
  name: "HealthcareWorkerStaffingPathway",
  title: "Healthcare Worker Staffing Pathway",
  type: "object",
  fhirVersion: "R4",
  properties: {
    "/G1": {
      type: "object",
      dataType: "SECTION",
      title: "Facility MetaData",
      codeList: [
        { code: "G1", display: "Facility MetaData", system: "Custom" },
      ],
      questionCode: "G1",
      questionCodeSystem: "Custom",
      questionCodeDisplay: "Facility MetaData",
      linkId: "/G1",
      properties: {
        "/G1/Q1": {
          type: "string",
          dataType: "ST",
          prefix: "1",
          title: "Facility ID",
          codeList: [{ code: "Q1", display: "Facility ID", system: "Custom" }],
          questionCode: "Q1",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Facility ID",
          linkId: "/G1/Q1",
          properties: {},
          codingInstructions:
            "The NHSN-assigned facility ID will be autoentered by the computer.",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "The NHSN-assigned facility ID will be autoentered by the computer.",
        },
        "/G1/Q2": {
          type: "string",
          dataType: "ST",
          prefix: "2",
          title: "Summary Census #ID",
          codeList: [
            { code: "Q2", display: "Summary Census #ID", system: "Custom" },
          ],
          questionCode: "Q2",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Summary Census #ID",
          linkId: "/G1/Q2",
          readOnly: true,
          properties: {},
          codingInstructions: "Auto-generated by the computer.",
          codingInstructionsFormat: "text",
          codingInstructionsPlain: "Auto-generated by the computer.",
        },
        "/G1/Q3": {
          type: "string",
          dataType: "DT",
          format: "date",
          prefix: "3",
          title: "Effective Date",
          codeList: [
            { code: "Q3", display: "Effective Date", system: "Custom" },
          ],
          questionCode: "Q3",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Effective Date",
          linkId: "/G1/Q3",
          properties: {},
          codingInstructions:
            "Required. Select the date for which the recorded data was collected for the following questions.",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "Required. Select the date for which the recorded data was collected for the following questions.",
        },
        "/G1/Q4": {
          type: "array",
          dataType: "CNE",
          prefix: "4",
          title: "What pizza toppings would you like?",
          codeList: [
            {
              code: "Q4",
              display: "What pizza toppings would you like?",
              system: "Custom",
            },
          ],
          questionCode: "Q4",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "What pizza toppings would you like?",
          linkId: "/G1/Q4",
          properties: {},
          codingInstructions: "Favorite toppings",
          codingInstructionsFormat: "text",
          codingInstructionsPlain: "Favorite toppings",
          items: { type: "string" },
        },
      },
    },
    "/G2": {
      type: "object",
      dataType: "SECTION",
      prefix: "2",
      title: "Critical Staffing Shortage Today",
      codeList: [
        {
          code: "G2",
          display: "Critical Staffing Shortage Today",
          system: "Custom",
        },
      ],
      questionCode: "G2",
      questionCodeSystem: "Custom",
      questionCodeDisplay: "Critical Staffing Shortage Today",
      linkId: "/G2",
      properties: {
        "/G2/D1": {
          type: "string",
          dataType: "TITLE",
          title:
            "Does your organization consider that it has a critical staffing shortage in this group today? (Check appropriate box if answer is Yes)",
          questionCode: "D1",
          questionCodeSystem: "LinkId",
          linkId: "/G2/D1",
        },
        "/G2/Q1": {
          type: "boolean",
          dataType: "BL",
          prefix: "1",
          title: "Environmental services",
          codeList: [
            { code: "Q1", display: "Environmental services", system: "Custom" },
          ],
          questionCode: "Q1",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Environmental services",
          linkId: "/G2/Q1",
        },
        "/G2/Q2": {
          type: "boolean",
          dataType: "BL",
          prefix: "2",
          title: "Nurses",
          codeList: [{ code: "Q2", display: "Nurses", system: "Custom" }],
          questionCode: "Q2",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Nurses",
          linkId: "/G2/Q2",
          properties: {},
          codingInstructions: "registered nurses and licensed practical nurses",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "registered nurses and licensed practical nurses",
        },
        "/G2/Q3": {
          type: "boolean",
          dataType: "BL",
          prefix: "3",
          title: "Respiratory therapists",
          codeList: [
            { code: "Q3", display: "Respiratory therapists", system: "Custom" },
          ],
          questionCode: "Q3",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Respiratory therapists",
          linkId: "/G2/Q3",
        },
        "/G2/Q4": {
          type: "boolean",
          dataType: "BL",
          prefix: "4",
          title: "Pharmacists and pharmacy techs",
          codeList: [
            {
              code: "Q4",
              display: "Pharmacists and pharmacy techs",
              system: "Custom",
            },
          ],
          questionCode: "Q4",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Pharmacists and pharmacy techs",
          linkId: "/G2/Q4",
        },
        "/G2/Q5": {
          type: "boolean",
          dataType: "BL",
          prefix: "5",
          title: "Physicians",
          codeList: [{ code: "Q5", display: "Physicians", system: "Custom" }],
          questionCode: "Q5",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Physicians",
          linkId: "/G2/Q5",
          properties: {},
          codingInstructions: "attending physicians, fellows",
          codingInstructionsFormat: "text",
          codingInstructionsPlain: "attending physicians, fellows",
        },
        "/G2/Q6": {
          type: "boolean",
          dataType: "BL",
          prefix: "6",
          title: "Other licensed independent practitioners",
          codeList: [
            {
              code: "Q6",
              display: "Other licensed independent practitioners",
              system: "Custom",
            },
          ],
          questionCode: "Q6",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Other licensed independent practitioners",
          linkId: "/G2/Q6",
          properties: {},
          codingInstructions: "advanced practice nurses, physician assistants",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "advanced practice nurses, physician assistants",
        },
        "/G2/Q7": {
          type: "boolean",
          dataType: "BL",
          prefix: "7",
          title:
            "Temporary physicians, nurses, respiratory therapists, and pharmacists",
          codeList: [
            {
              code: "Q7",
              display:
                "Temporary physicians, nurses, respiratory therapists, and pharmacists",
              system: "Custom",
            },
          ],
          questionCode: "Q7",
          questionCodeSystem: "Custom",
          questionCodeDisplay:
            "Temporary physicians, nurses, respiratory therapists, and pharmacists",
          linkId: "/G2/Q7",
          properties: {},
          codingInstructions:
            "Includes “per diems,” “travelers,” retired, or other seasonal or intermittently contracted persons",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "Includes “per diems,” “travelers,” retired, or other seasonal or intermittently contracted persons",
        },
        "/G2/Q8": {
          type: "boolean",
          dataType: "BL",
          prefix: "8",
          title: "Other HCP†",
          codeList: [{ code: "Q8", display: "Other HCP†", system: "Custom" }],
          questionCode: "Q8",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Other HCP†",
          linkId: "/G2/Q8",
          properties: {},
          codingInstructions:
            "Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above. †Healthcare Personnel (HCP) is the plural of healthcare worker",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above. †Healthcare Personnel (HCP) is the plural of healthcare worker",
        },
      },
    },
    "/G3": {
      type: "object",
      dataType: "SECTION",
      prefix: "3",
      title: "Critical Staffing Shortage Within One Week",
      codeList: [
        {
          code: "G3",
          display: "Critical Staffing Shortage Within One Week",
          system: "Custom",
        },
      ],
      questionCode: "G3",
      questionCodeSystem: "Custom",
      questionCodeDisplay: "Critical Staffing Shortage Within One Week",
      linkId: "/G3",
      properties: {
        "/G3/D1": {
          type: "string",
          dataType: "TITLE",
          title:
            "Does your organization consider that it has a critical staffing shortage in this group within one week? (Check appropriate box if answer is Yes)",
          questionCode: "D1",
          questionCodeSystem: "LinkId",
          linkId: "/G3/D1",
        },
        "/G3/Q1": {
          type: "boolean",
          dataType: "BL",
          prefix: "1",
          title: "Environmental services",
          codeList: [
            { code: "Q1", display: "Environmental services", system: "Custom" },
          ],
          questionCode: "Q1",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Environmental services",
          linkId: "/G3/Q1",
        },
        "/G3/Q2": {
          type: "boolean",
          dataType: "BL",
          prefix: "2",
          title: "Nurses",
          codeList: [{ code: "Q2", display: "Nurses", system: "Custom" }],
          questionCode: "Q2",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Nurses",
          linkId: "/G3/Q2",
          properties: {},
          codingInstructions: "registered nurses and licensed practical nurses",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "registered nurses and licensed practical nurses",
        },
        "/G3/Q3": {
          type: "boolean",
          dataType: "BL",
          prefix: "3",
          title: "Respiratory therapists",
          codeList: [
            { code: "Q3", display: "Respiratory therapists", system: "Custom" },
          ],
          questionCode: "Q3",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Respiratory therapists",
          linkId: "/G3/Q3",
        },
        "/G3/Q4": {
          type: "boolean",
          dataType: "BL",
          prefix: "4",
          title: "Pharmacists and pharmacy techs",
          codeList: [
            {
              code: "Q4",
              display: "Pharmacists and pharmacy techs",
              system: "Custom",
            },
          ],
          questionCode: "Q4",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Pharmacists and pharmacy techs",
          linkId: "/G3/Q4",
        },
        "/G3/Q5": {
          type: "boolean",
          dataType: "BL",
          prefix: "5",
          title: "Physicians",
          codeList: [{ code: "Q5", display: "Physicians", system: "Custom" }],
          questionCode: "Q5",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Physicians",
          linkId: "/G3/Q5",
          properties: {},
          codingInstructions: "attending physicians, fellows",
          codingInstructionsFormat: "text",
          codingInstructionsPlain: "attending physicians, fellows",
        },
        "/G3/Q6": {
          type: "boolean",
          dataType: "BL",
          prefix: "6",
          title: "Other licensed independent practitioners",
          codeList: [
            {
              code: "Q6",
              display: "Other licensed independent practitioners",
              system: "Custom",
            },
          ],
          questionCode: "Q6",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Other licensed independent practitioners",
          linkId: "/G3/Q6",
          properties: {},
          codingInstructions: "advanced practice nurses, physician assistants",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "advanced practice nurses, physician assistants",
        },
        "/G3/Q7": {
          type: "boolean",
          dataType: "BL",
          prefix: "7",
          title:
            "Temporary physicians, nurses, respiratory therapists, and pharmacists",
          codeList: [
            {
              code: "Q7",
              display:
                "Temporary physicians, nurses, respiratory therapists, and pharmacists",
              system: "Custom",
            },
          ],
          questionCode: "Q7",
          questionCodeSystem: "Custom",
          questionCodeDisplay:
            "Temporary physicians, nurses, respiratory therapists, and pharmacists",
          linkId: "/G3/Q7",
          properties: {},
          codingInstructions:
            "Includes “per diems,” “travelers,” retired, or other seasonal or intermittently contracted persons",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "Includes “per diems,” “travelers,” retired, or other seasonal or intermittently contracted persons",
        },
        "/G3/Q8": {
          type: "boolean",
          dataType: "BL",
          prefix: "8",
          title: "Other HCP†",
          codeList: [{ code: "Q8", display: "Other HCP†", system: "Custom" }],
          questionCode: "Q8",
          questionCodeSystem: "Custom",
          questionCodeDisplay: "Other HCP†",
          linkId: "/G3/Q8",
          properties: {},
          codingInstructions:
            "Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above. †Healthcare Personnel (HCP) is the plural of healthcare worker",
          codingInstructionsFormat: "text",
          codingInstructionsPlain:
            "Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above. †Healthcare Personnel (HCP) is the plural of healthcare worker",
        },
      },
    },
  },
};
