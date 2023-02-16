export const careTeamWithIncluded = {
  resourceType: 'Bundle',
  id: '2fb071f1-cafc-4a84-9d0d-e7bdb2e7875e',
  meta: {
    lastUpdated: '2022-09-29T20:32:11.641+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/CareTeam/_search?_id=131411&_include=CareTeam%3A*',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/CareTeam/131411',
      resource: {
        resourceType: 'CareTeam',
        id: '131411',
        meta: {
          versionId: '1',
          lastUpdated: '2022-05-30T00:53:35.099+00:00',
          source: '#8pT6h5Axyf9VsdQq',
        },
        identifier: [
          {
            use: 'official',
            value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
          },
        ],
        status: 'active',
        name: 'Care Team One',
        subject: {
          reference: 'Group/131410',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/131406',
            },
          },
          {
            member: {
              reference: 'Practitioner/131406',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Group/131410',
      resource: {
        resourceType: 'Group',
        id: '131410',
        meta: {
          versionId: '2',
          lastUpdated: '2022-06-27T03:22:27.188+00:00',
          source: '#c6f633c24d9e6c4b',
        },
        identifier: [
          {
            use: 'official',
            value: '93bc9c3d-6321-41b0-9b93-1275d7114e34',
          },
        ],
        active: true,
        name: 'ANC patients',
        quantity: 1,
        member: [
          {
            entity: {
              reference: 'Patient/131408',
            },
          },
        ],
      },
      search: {
        mode: 'include',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/131406',
      resource: {
        resourceType: 'Practitioner',
        id: '131406',
        meta: {
          versionId: '1',
          lastUpdated: '2022-05-30T00:38:44.891+00:00',
          source: '#R1qpXIa2QDrDkBrn',
        },
        identifier: [
          {
            use: 'official',
            value: 'aace2e430b-64be-477e-9d86-b36c666c0211',
          },
          {
            use: 'secondary',
            value: '40353ad0-6fa0-4da3-9dd6-b2d9d5a09b6a',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'Tester family',
            given: ['Ward test hey', 'N test'],
          },
        ],
        telecom: [
          {
            system: 'email',
            value: 'reham.muzzamil@venturedive.com',
          },
        ],
      },
      search: {
        mode: 'include',
      },
    },
  ],
};

export const careTeam2 = {
  resourceType: 'Bundle',
  id: '11112110-5942-40cb-b8ca-80650821dba4',
  meta: {
    lastUpdated: '2022-09-30T06:13:08.311+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/CareTeam?_format=json&_id=142534&_include=CareTeam%3A*',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/CareTeam/142534',
      resource: {
        resourceType: 'CareTeam',
        id: '142534',
        meta: {
          versionId: '1',
          lastUpdated: '2022-09-01T12:44:38.522+00:00',
          source: '#532e59e3409867b3',
        },
        identifier: [
          {
            use: 'official',
            value: '99c4dde5-3aca-4a4b-8b33-b50142e05da6',
          },
        ],
        status: 'active',
        name: 'Brown Bag',
        participant: [
          {
            member: {
              reference: 'Practitioner/137469',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/137469',
      resource: {
        resourceType: 'Practitioner',
        id: '137469',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-10T13:16:53.838+00:00',
          source: '#2c648422b7a6e78e',
        },
        identifier: [
          {
            use: 'official',
            value: '175ceaa4-0f75-4ab3-a8a7-413cc225f761',
          },
          {
            use: 'secondary',
            value: 'b27939dd-4c8f-44c2-83dd-dc40e494f17d',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'Demo',
            given: ['AeHIN'],
          },
        ],
        telecom: [
          {
            system: 'email',
          },
        ],
      },
      search: {
        mode: 'include',
      },
    },
  ],
};

export const careTeam3500 = {
  resourceType: 'Bundle',
  id: '964d0cdc-3297-41fa-991f-47d639ff7635',
  meta: {
    lastUpdated: '2023-02-10T08:22:04.594+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/CareTeam/_search?_id=3500&_include=CareTeam%3A*',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/CareTeam/3500',
      resource: {
        resourceType: 'CareTeam',
        id: '3500',
        meta: {
          versionId: '1',
          lastUpdated: '2021-10-12T07:29:44.733+00:00',
          source: '#9837ac48046ef77c',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">Care Team</div>',
        },
        contained: [
          {
            resourceType: 'Practitioner',
            id: '3457',
            name: [
              {
                family: 'Careful',
                given: ['Adam'],
                prefix: ['Dr'],
              },
            ],
          },
        ],
        status: 'active',
        category: [
          {
            coding: [
              {
                system: 'http://loinc.org',
                code: 'LA27976-2',
                display: 'Encounter-focused care team',
              },
            ],
          },
        ],
        name: 'Peter James Charlmers Care team',
        subject: {
          reference: 'Patient/3455',
          display: 'Peter James Chalmers',
        },
        encounter: {
          reference: 'Encounter/3458',
        },
        period: {
          end: '2013-01-01',
        },
        participant: [
          {
            role: [
              {
                text: 'responsiblePerson',
              },
            ],
            member: {
              reference: 'Patient/3455',
              display: 'Peter James Chalmers',
            },
          },
          {
            role: [
              {
                text: 'adviser',
              },
            ],
            member: {
              reference: '#pr1',
              display: 'Dorothy Dietition',
            },
            onBehalfOf: {
              reference: 'Organization/0000',
            },
            period: {
              end: '2013-01-01',
            },
          },
        ],
        managingOrganization: [
          {
            reference: 'Organization/3461',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Encounter/3458',
      resource: {
        resourceType: 'Encounter',
        id: '3458',
        meta: {
          versionId: '2',
          lastUpdated: '2021-10-25T06:53:54.230+00:00',
          source: '#1350520584a57b46',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">Encounter with patient @example</div>',
        },
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'IMP',
          display: 'inpatient encounter to check on Obsesity',
        },
        subject: {
          reference: 'Patient/3455',
        },
      },
      search: {
        mode: 'include',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Patient/3455',
      resource: {
        resourceType: 'Patient',
        id: '3455',
        meta: {
          versionId: '3',
          lastUpdated: '2021-10-22T13:49:19.121+00:00',
          source: '#70532eaf6e0ba7df',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Peter James <b>CHALMERS </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>534 Erewhon St </span><br/><span>PleasantVille </span><span>Vic </span></td></tr><tr><td>Date of birth</td><td><span>25 December 1974</span></td></tr></tbody></table></div>',
        },
        active: true,
        name: [
          {
            use: 'official',
            family: 'Chalmers',
            given: ['Peter', 'James'],
          },
          {
            use: 'usual',
            given: ['Jim'],
          },
          {
            use: 'maiden',
            family: 'Windsor',
            given: ['Peter', 'James'],
            period: {
              end: '2002',
            },
          },
        ],
        telecom: [
          {
            use: 'home',
          },
          {
            system: 'phone',
            value: '(03) 5555 6473',
            use: 'work',
            rank: 1,
          },
          {
            system: 'phone',
            value: '(03) 3410 5613',
            use: 'mobile',
            rank: 2,
          },
          {
            system: 'phone',
            value: '(03) 5555 8834',
            use: 'old',
            period: {
              end: '2014',
            },
          },
        ],
        gender: 'male',
        birthDate: '1974-12-25',
        deceasedBoolean: false,
        address: [
          {
            use: 'home',
            type: 'both',
            text: '534 Erewhon St PeasantVille, Rainbow, Vic  3999',
            line: ['534 Erewhon St'],
            city: 'PleasantVille',
            district: 'Rainbow',
            state: 'Vic',
            postalCode: '3999',
            period: {
              start: '1974-12-25',
            },
          },
        ],
        contact: [
          {
            relationship: [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
                    code: 'N',
                  },
                ],
              },
            ],
            name: {
              family: 'du Marché',
              _family: {
                extension: [
                  {
                    url: 'http://hl7.org/fhir/StructureDefinition/humanname-own-prefix',
                    valueString: 'VV',
                  },
                ],
              },
              given: ['Bénédicte'],
            },
            telecom: [
              {
                system: 'phone',
                value: '+33 (237) 998327',
              },
            ],
            address: {
              use: 'home',
              type: 'both',
              line: ['534 Erewhon St'],
              city: 'PleasantVille',
              district: 'Rainbow',
              state: 'Vic',
              postalCode: '3999',
              period: {
                start: '1974-12-25',
              },
            },
            gender: 'female',
            period: {
              start: '2012',
            },
          },
        ],
        managingOrganization: {
          reference: 'Organization/3454',
        },
      },
      search: {
        mode: 'include',
      },
    },
  ],
};
