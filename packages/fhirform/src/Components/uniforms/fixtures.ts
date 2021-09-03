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
