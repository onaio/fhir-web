export const resourceEntriesCount = {
  resourceType: 'Bundle',
  id: '3eaa135c-9c14-42fe-b8d2-ef49433df4b0',
  meta: {
    lastUpdated: '2024-05-21T11:17:09.771+00:00',
    tag: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
        code: 'SUBSETTED',
        display: 'Resource encoded in summary mode',
      },
    ],
  },
  type: 'searchset',
  total: 1,
};

export const patientCarePlans = {
  resourceType: 'Bundle',
  id: 'af38769d-f360-459e-bb6e-f847b23f473b',
  meta: {
    lastUpdated: '2024-05-21T11:20:31.528+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/CarePlan/_search?_count=5&_format=json&_getpagesoffset=0&_total=accurate&subject%3APatient=1',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/CarePlan/131386',
      resource: {
        resourceType: 'CarePlan',
        id: '131386',
        meta: {
          versionId: '2',
          lastUpdated: '2023-04-03T06:52:38.201+00:00',
          source: '#f54fd89f7239e443',
        },
        identifier: [
          {
            use: 'official',
            value: 'ee7a758e-9cb4-4146-b864-1857a1593bc3',
          },
        ],
        instantiatesCanonical: ['PlanDefinition/131372'],
        status: 'completed',
        intent: 'plan',
        title: 'Child Routine visit Plan',
        description: 'This defines the schedule of care for patients under 5 years old',
        subject: {
          reference: 'Patient/1',
        },
        period: {
          start: '2022-05-26T00:00:00',
          end: '2025-05-14T00:00:00',
        },
        created: '2022-05-26T03:24:04+05:00',
        author: {
          reference: 'Practitioner/94398',
        },
        activity: [
          {
            outcomeReference: [
              {
                reference: 'Task/61002532-e414-4223-9ea7-747ebe71f75e',
              },
            ],
            detail: {
              kind: 'Task',
              code: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation',
                    code: 'MO',
                    display: 'MO',
                  },
                ],
                text: 'MO',
              },
              status: 'in-progress',
              scheduledTiming: {
                event: ['2022-06-01T00:00:00'],
                repeat: {
                  count: 36,
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
              performer: [
                {
                  reference: 'Practitioner/94398',
                },
              ],
              description: 'Child Monthly Routine Visit',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const patientConditions = {
  resourceType: 'Bundle',
  id: '3109b334-7b7d-4d16-881d-7ade9f65beba',
  meta: {
    lastUpdated: '2024-05-22T09:46:56.785+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Condition/_search?_count=5&_format=json&_getpagesoffset=0&_total=accurate&subject%3APatient=1',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Condition/349d8947-3009-4fb3-b3d5-99ff30aa5614',
      resource: {
        resourceType: 'Condition',
        id: '349d8947-3009-4fb3-b3d5-99ff30aa5614',
        meta: {
          versionId: '2',
          lastUpdated: '2022-06-27T03:23:29.601+00:00',
          source: '#c6f633c24d9e6c4b',
        },
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'confirmed',
            },
          ],
        },
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '77386006',
            },
          ],
          text: 'Pregnant',
        },
        subject: {
          reference: 'Patient/1',
        },
        recordedDate: '2021-12-14T19:40:38+05:00',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const patientTask = {
  resourceType: 'Bundle',
  id: 'b8d0ad5e-c704-4dd9-abcd-0c6e880691bf',
  meta: {
    lastUpdated: '2024-05-22T09:56:08.452+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Task/_search?_count=5&_format=json&_getpagesoffset=0&_total=accurate&patient=1',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Task/14205',
      resource: {
        resourceType: 'Task',
        id: '14205',
        meta: {
          versionId: '5',
          lastUpdated: '2022-03-18T02:30:02.570+00:00',
          source: '#56a6c66e48be94ca',
        },
        text: {
          status: 'generated',
        },
        status: 'completed',
        intent: 'order',
        code: {
          text: 'Hygiene Visit',
        },
        description: 'Hygiene Visit',
        focus: {
          reference: 'MedicationRequest/6751',
        },
        for: {
          reference: 'Patient/1',
        },
        executionPeriod: {
          start: '2021-10-01T08:45:05+10:00',
          end: '2021-10-02T09:45:05+10:00',
        },
        authoredOn: '2016-03-10T22:39:32-04:00',
        lastModified: '2016-03-10T22:39:32-04:00',
        requester: {
          reference: 'Patient/1',
        },
        owner: {
          reference: 'Practitioner/6744',
        },
        restriction: {
          repetitions: 1,
          period: {
            end: '2021-10-02T09:45:05+10:00',
          },
        },
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const patientEncounters = {
  resourceType: 'Bundle',
  id: 'a07d33ef-8b10-4730-9aff-6446589a71fa',
  meta: {
    lastUpdated: '2024-05-22T10:06:16.259+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Encounter/_search?_count=5&_getpagesoffset=0&_total=accurate&subject%3APatient=1',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Encounter/a1f3a048-8863-42b7-9d2e-2e9efbbca9a8',
      resource: {
        resourceType: 'Encounter',
        id: 'a1f3a048-8863-42b7-9d2e-2e9efbbca9a8',
        meta: {
          versionId: '1',
          lastUpdated: '2021-12-14T14:42:59.368+00:00',
          source: '#0d61522716e890ad',
        },
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
        },
        serviceType: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/service-type',
              code: '581',
            },
          ],
        },
        subject: {
          reference: 'Patient/1',
        },
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const patientImmunization = {
  resourceType: 'Bundle',
  id: 'd315d516-567b-4a17-8991-f7f51ddacc52',
  meta: {
    lastUpdated: '2024-05-22T10:13:38.052+00:00',
  },
  type: 'searchset',
  total: 2,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Immunization/_search?_count=5&_getpagesoffset=0&_total=accurate&patient=969',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Immunization/979',
      resource: {
        resourceType: 'Immunization',
        id: '979',
        meta: {
          versionId: '39',
          lastUpdated: '2021-08-10T13:42:24.928+00:00',
          source: '#6da071bfda380f5f',
        },
        status: 'completed',
        vaccineCode: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '1119349007',
              display: 'SARSCoV2  mRNA vaccine',
            },
          ],
          text: 'Moderna',
        },
        patient: {
          reference: 'Patient/969',
        },
        encounter: {
          reference: 'Encounter/974',
        },
        occurrenceDateTime: '2021-07-08',
        recorded: '2021-07-29T12:37:03+03:00',
        primarySource: true,
        reportOrigin: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/immunization-origin',
              code: 'record',
            },
          ],
          text: 'Written Record - Paper card',
        },
        location: {
          reference: 'Location/971',
        },
        manufacturer: {
          reference: 'Organization/973',
        },
        lotNumber: 'PT123F.11',
        expirationDate: '2018-12-15',
        site: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ActSite',
              code: 'LA',
              display: 'left arm',
            },
          ],
        },
        route: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration',
              code: 'IM',
              display: 'Injection, intramuscular',
            },
          ],
        },
        doseQuantity: {
          value: 5,
          system: 'http://unitsofmeasure.org',
          code: 'mg',
        },
        performer: [
          {
            function: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0443',
                  code: 'OP',
                },
              ],
            },
            actor: {
              reference: 'Practitioner/970',
            },
          },
        ],
        protocolApplied: [
          {
            series: '2-dose',
            targetDisease: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '840539006',
                    display: 'COVID 19',
                  },
                ],
              },
            ],
            doseNumberPositiveInt: 1,
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
