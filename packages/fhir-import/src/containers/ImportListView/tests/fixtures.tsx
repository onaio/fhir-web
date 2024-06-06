export const careTeams = {
  resourceType: 'Bundle',
  id: '1439f945-5b56-4266-8b77-275b4064c41f',
  meta: {
    lastUpdated: '2021-06-16T16:41:07.075+00:00',
  },
  type: 'searchset',
  total: 6,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/CareTeam/?_format=json',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/308',
      resource: {
        resourceType: 'CareTeam',
        id: '308',
        meta: {
          versionId: '1',
          lastUpdated: '2021-05-26T17:01:25.732+00:00',
          source: '#6bff87efcf99dd47',
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
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/103',
            },
          },
          {
            member: {
              reference: 'Practitioner/103',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/325',
      resource: {
        resourceType: 'CareTeam',
        id: '325',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-15T10:36:55.950+00:00',
          source: '#591451bd58b50292',
        },
        identifier: [
          {
            use: 'official',
          },
        ],
        status: 'active',
        name: 'Care Team Three',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/206',
            },
          },
          {
            member: {
              reference: 'Practitioner/213',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/327',
      resource: {
        resourceType: 'CareTeam',
        id: '327',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-16T07:30:52.596+00:00',
          source: '#35008db18c465048',
        },
        identifier: [
          {
            use: 'official',
          },
        ],
        status: 'active',
        name: 'Care Team Five',
        subject: {
          reference: 'Group/307',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/104',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/330',
      resource: {
        resourceType: 'CareTeam',
        id: '330',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-16T10:00:25.773+00:00',
          source: '#7b8049d36db19777',
        },
        identifier: [
          {
            use: 'official',
            value: '42174efd-6d78-486d-8202-937207e91e6a',
          },
        ],
        status: 'active',
        name: 'test 33',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/213',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/328',
      resource: {
        resourceType: 'CareTeam',
        id: '328',
        meta: {
          versionId: '4',
          lastUpdated: '2021-06-16T11:40:25.092+00:00',
          source: '#8a2ef39038f9ea59',
        },
        identifier: [
          {
            use: 'official',
            value: 'c6d3dfb3-750f-4fc8-9426-774ac2a04cf9',
          },
        ],
        status: 'active',
        name: 'Care Team Six',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/104',
            },
          },
          {
            member: {
              reference: 'Practitioner/115',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/326',
      resource: {
        resourceType: 'CareTeam',
        id: '326',
        meta: {
          versionId: '2',
          lastUpdated: '2021-06-16T16:25:42.857+00:00',
          source: '#ecd5a0cf910e949b',
        },
        identifier: [
          {
            use: 'official',
            value: '42c338c1-382d-4a5a-9070-80ea41cb85df',
          },
        ],
        status: 'active',
        name: 'Care Team Four',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/118',
            },
          },
          {
            member: {
              reference: 'Practitioner/104',
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

export const careTeam4214 = {
  resourceType: 'CareTeam',
  id: '4214',
  meta: {
    versionId: '2',
    lastUpdated: '2021-11-01T12:46:15.815+00:00',
    source: '#10e9551bdff81a82',
  },
  text: {
    status: 'generated',
    div: '<div xmlns="http://www.w3.org/1999/xhtml">Care Team</div>',
  },
  contained: [
    {
      resourceType: 'Practitioner',
      id: '4206',
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
  name: 'Peter Charlmers Care team',
  subject: {
    reference: 'Patient/4208',
    display: 'Peter James Chalmers',
  },
  encounter: {
    reference: 'Encounter/4210',
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
        reference: 'Patient/4208',
        display: 'Peter James Chalmers',
      },
    },
    {
      role: [
        {
          text: 'responsiblePerson',
        },
      ],
      member: {
        reference: '#pr1',
        display: 'Dorothy Dietition',
      },
      onBehalfOf: {
        reference: 'Organization/f001',
      },
      period: {
        end: '2013-01-01',
      },
    },
  ],
  managingOrganization: [
    {
      reference: 'Organization/4203',
    },
  ],
};
