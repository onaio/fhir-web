export const updateResponse = {
  ok: true,
  redirected: false,
  status: 201,
  statusText: 'Created',
  type: 'cors',
  url: 'https://reveal-stage.smartregister.org/opensrp/rest/plans',
};
export const plansListResponse = [
  {
    identifier: '0e85c238-39c1-4cea-a926-3d89f0c98427',
    version: '1',
    name: 'A1-KUM_BANG-Focus_01',
    title: 'A1 - KUM BANG - Focus 01',
    status: 'active',
    date: '2019-06-18',
    effectivePeriod: {
      start: '2019-06-18',
      end: '2019-07-30',
    },
    useContext: [
      {
        code: 'interventionType',
        valueCodableConcept: 'FI',
      },
      {
        code: 'fiStatus',
        valueCodableConcept: 'B1',
      },
      {
        code: 'fiReason',
        valueCodableConcept: 'Case Triggered',
      },
    ],
    jurisdiction: [
      {
        code: 'd4b0c760-0711-40bc-b417-9c810184131c',
      },
    ],
    serverVersion: 1563303122515,
    goal: [
      {
        id: 'Case_Confirmation',
        description: 'Confirm the index case',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Number of case confirmation forms complete',
            detail: {
              detailQuantity: {
                value: 1.0,
                comparator: '\u003e\u003d',
                unit: 'form(s)',
              },
            },
            due: '2019-06-19',
          },
        ],
      },
      {
        id: 'RACD_register_all_families',
        description:
          'Register all families and family members in all residential structures enumerated or added (100%) within operational area',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Percent of residential structures with full family registration',
            detail: {
              detailQuantity: {
                value: 100.0,
                comparator: '\u003e\u003d',
                unit: 'Percent',
              },
            },
            due: '2019-06-27',
          },
        ],
      },
      {
        id: 'RACD_blood_screening_1km_radius',
        description:
          'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Number of registered people tested',
            detail: {
              detailQuantity: {
                value: 50.0,
                comparator: '\u003e\u003d',
                unit: 'person(s)',
              },
            },
            due: '2019-07-26',
          },
        ],
      },
      {
        id: 'Larval_Dipping_Min_3_Sites',
        description: 'Perform a minimum of three larval dipping activities in the operational area',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Number of larval dipping forms submitted',
            detail: {
              detailQuantity: {
                value: 3.0,
                comparator: '\u003e\u003d',
                unit: 'form(s)',
              },
            },
            due: '2019-07-10',
          },
        ],
      },
      {
        id: 'Mosquito_Collection_Min_3_Traps',
        description:
          'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Number of mosquito collection forms submitted',
            detail: {
              detailQuantity: {
                value: 3.0,
                comparator: '\u003e\u003d',
                unit: 'form(s)',
              },
            },
            due: '2019-07-09',
          },
        ],
      },
    ],
    action: [
      {
        identifier: '79556121-104f-43c9-b95b-eb9af99c4c12',
        prefix: 1,
        title: 'Case Confirmation',
        description: 'Confirm the index case',
        code: 'Case Confirmation',
        timingPeriod: {
          start: '2019-06-18',
          end: '2019-06-19',
        },
        reason: 'Investigation',
        goalId: 'Case_Confirmation',
        subjectCodableConcept: {
          text: 'Person',
        },
        taskTemplate: 'Case_Confirmation',
      },
      {
        identifier: '50034336-6116-4d59-8063-c088b31a3fa4',
        prefix: 2,
        title: 'Family Registration',
        description:
          'Register all families \u0026 famiy members in all residential structures enumerated (100%) within the operational area',
        code: 'RACD Register Family',
        timingPeriod: {
          start: '2019-06-18',
          end: '2019-06-27',
        },
        reason: 'Investigation',
        goalId: 'RACD_register_all_families',
        subjectCodableConcept: {
          text: 'Residential_Structure',
        },
        taskTemplate: 'RACD_register_families',
      },
      {
        identifier: '962c12eb-2ba7-4cac-bea9-8047e76c7eb3',
        prefix: 3,
        title: 'RACD Blood screening',
        description:
          'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
        code: 'Blood Screening',
        timingPeriod: {
          start: '2019-06-18',
          end: '2019-07-26',
        },
        reason: 'Investigation',
        goalId: 'RACD_blood_screening_1km_radius',
        subjectCodableConcept: {
          text: 'Person',
        },
        taskTemplate: 'RACD_Blood_Screening',
      },
      {
        identifier: '65a96d56-2cc6-4de0-969e-58e33470322c',
        prefix: 4,
        title: 'Larval Dipping',
        description: 'Perform a minimum of three larval dipping activities in the operational area',
        code: 'Larval Dipping',
        timingPeriod: {
          start: '2019-06-18',
          end: '2019-07-10',
        },
        reason: 'Investigation',
        goalId: 'Larval_Dipping_Min_3_Sites',
        subjectCodableConcept: {
          text: 'Breeding_Site',
        },
        taskTemplate: 'Larval_Dipping',
      },
      {
        identifier: '63ea7027-1296-4db1-80b4-4b700a0f0004',
        prefix: 5,
        title: 'Mosquito Collection',
        description:
          'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
        code: 'Mosquito Collection',
        timingPeriod: {
          start: '2019-06-18',
          end: '2019-07-09',
        },
        reason: 'Investigation',
        goalId: 'Mosquito_Collection_Min_3_Traps',
        subjectCodableConcept: {
          text: 'Mosquito_Collection_Point',
        },
        taskTemplate: 'Mosquito_Collection_Point',
      },
    ],
  },
  {
    identifier: '356b6b84-fc36-4389-a44a-2b038ed2f38d',
    version: '1',
    name: 'A2-Lusaka_Akros_Focus_2',
    title: 'A2-Lusaka Akros Test Focus 2',
    status: 'active',
    date: '2019-05-19',
    effectivePeriod: {
      start: '2019-05-20',
      end: '2019-08-30',
    },
    useContext: [
      {
        code: 'interventionType',
        valueCodableConcept: 'FI',
      },
      {
        code: 'fiStatus',
        valueCodableConcept: 'A2',
      },
      {
        code: 'fiReason',
        valueCodableConcept: 'Case Triggered',
      },
    ],
    jurisdiction: [
      {
        code: '3952',
      },
    ],
    serverVersion: 1563303150422,
    goal: [
      {
        id: 'Case_Confirmation',
        description: 'Confirm the index case',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Number of case confirmation forms complete',
            detail: {
              detailQuantity: {
                value: 1.0,
                comparator: '\u003e\u003d',
                unit: 'form(s)',
              },
            },
            due: '2019-05-21',
          },
        ],
      },
      {
        id: 'RACD_register_all_families',
        description:
          'Register all families and family members in all residential structures enumerated or added (100%) within operational area',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Percent of residential structures with full family registration',
            detail: {
              detailQuantity: {
                value: 100.0,
                comparator: '\u003e\u003d',
                unit: 'Percent',
              },
            },
            due: '2019-08-30',
          },
        ],
      },
      {
        id: 'RACD_bednet_dist_1km_radius',
        description:
          'Visit 100% of residential structures in the operational area and provide nets',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Percent of residential structures received nets',
            detail: {
              detailQuantity: {
                value: 100.0,
                comparator: '\u003e\u003d',
                unit: 'Percent',
              },
            },
            due: '2019-08-30',
          },
        ],
      },
      {
        id: 'RACD_blood_screening_1km_radius',
        description:
          'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Percent of registered people tested',
            detail: {
              detailQuantity: {
                value: 100.0,
                comparator: '\u003e\u003d',
                unit: 'Percent',
              },
            },
            due: '2019-05-28',
          },
        ],
      },
      {
        id: 'Larval_Dipping_Min_3_Sites',
        description: 'Perform a minimum of three larval dipping activities in the operational area',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Number of larval dipping forms submitted',
            detail: {
              detailQuantity: {
                value: 3.0,
                comparator: '\u003e\u003d',
                unit: 'form(s)',
              },
            },
            due: '2019-05-28',
          },
        ],
      },
      {
        id: 'Mosquito_Collection_Min_3_Traps',
        description:
          'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Number of mosquito collection forms submitted',
            detail: {
              detailQuantity: {
                value: 3.0,
                comparator: '\u003e\u003d',
                unit: 'form(s)',
              },
            },
            due: '2019-05-28',
          },
        ],
      },
      {
        id: 'BCC_Focus',
        description: 'Complete at least 1 BCC activity for the operational area',
        priority: 'medium-priority',
        target: [
          {
            measure: 'Number of BCC forms submitted',
            detail: {
              detailQuantity: {
                value: 1.0,
                comparator: '\u003e\u003d',
                unit: 'form(s)',
              },
            },
            due: '2019-06-21',
          },
        ],
      },
    ],
    action: [
      {
        identifier: 'c711ae51-6432-4b68-84c3-d2b5b1fd1948',
        prefix: 1,
        title: 'Case Confirmation',
        description: 'Confirm the index case',
        code: 'Case Confirmation',
        timingPeriod: {
          start: '2019-05-21',
          end: '2019-05-24',
        },
        reason: 'Investigation',
        goalId: 'Case_Confirmation',
        subjectCodableConcept: {
          text: 'Person',
        },
        taskTemplate: 'Case_Confirmation',
      },
      {
        identifier: '402b8c13-6774-4515-929f-48e71a61a379',
        prefix: 2,
        title: 'Family Registration',
        description:
          'Register all families \u0026 famiy members in all residential structures enumerated (100%) within the operational area',
        code: 'RACD Register Family',
        timingPeriod: {
          start: '2019-05-21',
          end: '2019-08-30',
        },
        reason: 'Investigation',
        goalId: 'RACD_register_all_families',
        subjectCodableConcept: {
          text: 'Residential_Structure',
        },
        taskTemplate: 'RACD_register_families',
      },
      {
        identifier: '1bd830ea-50e3-44dc-b855-9d5e9339e2be',
        prefix: 3,
        title: 'Bednet Distribution',
        description:
          'Visit 100% of residential structures in the operational area and provide nets',
        code: 'Bednet Distribution',
        timingPeriod: {
          start: '2019-05-21',
          end: '2019-08-30',
        },
        reason: 'Routine',
        goalId: 'RACD_bednet_dist_1km_radius',
        subjectCodableConcept: {
          text: 'Residential_Structure',
        },
        taskTemplate: 'ITN_Visit_Structures',
      },
      {
        identifier: '2303a70e-4e3f-4fb9-a430-f0476010bfb5',
        prefix: 4,
        title: 'RACD Blood screening',
        description:
          'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
        code: 'Blood Screening',
        timingPeriod: {
          start: '2019-05-21',
          end: '2019-05-28',
        },
        reason: 'Investigation',
        goalId: 'RACD_blood_screening_1km_radius',
        subjectCodableConcept: {
          text: 'Person',
        },
        taskTemplate: 'RACD_Blood_Screening',
      },
      {
        identifier: '2482dfd7-8284-43c6-bea1-a03dcda71ff4',
        prefix: 5,
        title: 'Larval Dipping',
        description: 'Perform a minimum of three larval dipping activities in the operational area',
        code: 'Larval Dipping',
        timingPeriod: {
          start: '2019-05-21',
          end: '2019-05-28',
        },
        reason: 'Investigation',
        goalId: 'Larval_Dipping_Min_3_Sites',
        subjectCodableConcept: {
          text: 'Breeding_Site',
        },
        taskTemplate: 'Larval_Dipping',
      },
      {
        identifier: '423f6665-5367-40be-855e-7c5e6941a0c3',
        prefix: 6,
        title: 'Mosquito Collection',
        description:
          'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
        code: 'Mosquito Collection',
        timingPeriod: {
          start: '2019-05-21',
          end: '2019-05-28',
        },
        reason: 'Investigation',
        goalId: 'Mosquito_Collection_Min_3_Traps',
        subjectCodableConcept: {
          text: 'Mosquito_Collection_Point',
        },
        taskTemplate: 'Mosquito_Collection_Point',
      },
      {
        identifier: 'c8fc89a9-cdd2-4746-8272-650883ae380e',
        prefix: 7,
        title: 'Behaviour Change Communication',
        description: 'Conduct BCC activity',
        code: 'BCC',
        timingPeriod: {
          start: '2019-05-21',
          end: '2019-06-21',
        },
        reason: 'Investigation',
        goalId: 'BCC_Focus',
        subjectCodableConcept: {
          text: 'Operational_Area',
        },
        taskTemplate: 'BCC_Focus',
      },
    ],
  },
];

export const createPlan = {
  identifier: '0e85c238-39c1-4cea-a926-3d89f0c98428',
  name: 'mosh-test',
  title: 'A Test By Mosh',
  status: 'draft',
  date: '2019-05-19',
  effectivePeriod: {
    start: '2019-05-20',
    end: '2019-08-30',
  },
  useContext: [
    {
      code: 'interventionType',
      valueCodableConcept: 'FI',
    },
    {
      code: 'fiStatus',
      valueCodableConcept: 'A2',
    },
    {
      code: 'fiReason',
      valueCodableConcept: 'Case Triggered',
    },
  ],
  jurisdiction: [
    {
      code: '3952',
    },
  ],
  goal: [],
  action: [],
};
