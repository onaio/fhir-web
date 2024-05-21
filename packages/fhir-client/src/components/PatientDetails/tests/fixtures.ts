export const patientResourceDetails = {
  resourceType: 'Patient',
  id: '1',
  meta: {
    versionId: '4',
    lastUpdated: '2021-03-10T13:27:48.632+00:00',
    source: '#14dfbe238f0933a5',
  },
  text: {
    status: 'generated',
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">John <b>DOE </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>213,One Pademore </span><br/><span>Nairobi </span><span>Kenya </span></td></tr><tr><td>Date of birth</td><td><span>04 August 1988</span></td></tr></tbody></table></div>',
  },
  name: [
    {
      use: 'official',
      family: 'Doe',
      given: ['John'],
    },
  ],
  telecom: [
    {
      system: 'phone',
      value: '+254722123456',
      use: 'mobile',
    },
    {
      system: 'email',
      value: 'jdoe@ona.io',
    },
  ],
  gender: 'male',
  birthDate: '1988-08-04',
  address: [
    {
      line: ['213,One Pademore'],
      city: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
    },
  ],
};

export const planDefinitionResource = {
  resourceType: 'PlanDefinition',
  id: '131372',
  meta: {
    versionId: '4',
    lastUpdated: '2022-05-25T22:12:58.587+00:00',
    source: '#1f80dc273b4a064e',
  },
  contained: [
    {
      resourceType: 'ActivityDefinition',
      id: 'careplan-activity',
      title: 'Child Monthly Routine Visit',
      status: 'active',
      description:
        'This action will performed every month for a patient < 5 years old. The start date with be next month after registration while the end date will be the 60th week after birth.',
      kind: 'Task',
      timingTiming: {
        repeat: {
          countMax: 59,
          duration: 2,
          durationMax: 4,
          durationUnit: 'h',
          frequency: 1,
          frequencyMax: 1,
          period: 1,
          periodMax: 1,
          periodUnit: 'mo',
        },
      },
    },
  ],
  name: 'Child Routine visit Plan',
  title: 'Child Routine visit Plan',
  status: 'active',
  description: 'This defines the schedule of care for patients under 5 years old',
  goal: [
    {
      category: {
        coding: [
          {
            system: 'https://www.hl7.org/fhir/codesystem-goal-category.html',
            code: 'nursing',
            display: 'Nursing',
          },
        ],
      },
      priority: {
        coding: [
          {
            system: 'https://www.hl7.org/fhir/codesystem-goal-priority.html',
            code: 'high-priority',
            display: 'High Priority',
          },
        ],
      },
      start: {
        coding: [
          {
            system: 'http://www.snomed.org/',
            code: '32485007',
            display: 'Admission to hospital',
          },
        ],
      },
    },
  ],
  action: [
    {
      prefix: '1',
      priority: 'routine',
      condition: [
        {
          kind: 'applicability',
          expression: {
            language: 'text/fhirpath',
            expression:
              "$this is Patient and %resource.entry.first().resource is Patient and (today() - 60 'months') <= $this.birthDate",
          },
        },
      ],
      participant: [
        {
          type: 'practitioner',
          role: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/practitioner-role',
                code: 'nurse',
                display: 'Nurse',
              },
            ],
          },
        },
      ],
      type: {
        coding: [
          {
            code: 'clinical-protocol',
            display: 'Clinical Protocol',
          },
        ],
      },
      definitionCanonical: '#careplan-activity',
      transform: 'https://fhir.labs.smartregister.org/fhir/StructureMap/131373',
    },
  ],
};
