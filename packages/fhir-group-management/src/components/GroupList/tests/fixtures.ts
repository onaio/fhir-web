export const firstTwentygroups = {
  resourceType: 'Bundle',
  id: 'faf23986-d971-459f-8fa9-b31955197a1b',
  meta: {
    lastUpdated: '2023-03-14T06:58:17.714+00:00',
  },
  type: 'searchset',
  total: 109,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Group/_search?_count=50',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org/fhir?_getpages=faf23986-d971-459f-8fa9-b31955197a1b&_getpagesoffset=50&_count=50&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145838',
      resource: {
        resourceType: 'Group',
        id: '145838',
        meta: {
          versionId: '1',
          lastUpdated: '2022-10-13T01:42:39.638+00:00',
          source: '#ab0d2c3e94fa13d0',
        },
        identifier: [
          {
            use: 'official',
            value: '603d2262-b67d-4977-91a7-79f350794b9d',
          },
          {
            use: 'secondary',
            value: '99721323-671b-4f6a-bb6e-27cf64c4d6b1',
          },
        ],
        active: true,
        type: 'practitioner',
        actual: true,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '405623001',
              display: 'Assigned practitioner',
            },
          ],
        },
        name: 'chw malawi',
        member: [
          {
            entity: {
              reference: 'Practitioner/145834',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/49778',
      resource: {
        resourceType: 'Group',
        id: '49778',
        meta: {
          versionId: '2',
          lastUpdated: '2022-04-27T00:15:33.608+00:00',
          source: '#971d99b7c2c14ce6',
        },
        identifier: [
          {
            use: 'official',
            value: '2c4459b0-5f8b-4e50-85c2-e715ffd4860b',
          },
        ],
        active: false,
        name: 'Jan27Test',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/49779',
      resource: {
        resourceType: 'Group',
        id: '49779',
        meta: {
          versionId: '2',
          lastUpdated: '2022-04-27T00:19:31.139+00:00',
          source: '#f985a9e0f84f757a',
        },
        identifier: [
          {
            use: 'official',
            value: '4cfe25c5-d91d-4064-a62d-8d1af8ced1c4',
          },
        ],
        active: false,
        name: 'Jan27',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/968',
      resource: {
        resourceType: 'Group',
        id: '968',
        meta: {
          versionId: '2',
          lastUpdated: '2022-04-28T22:10:35.431+00:00',
          source: '#8c74dd01a22d03f7',
        },
        identifier: [
          {
            use: 'official',
            value: '8a220c11-f773-4a5f-9be3-6cb5cc0b31b6',
          },
        ],
        active: false,
        name: 'TEST group  1',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/1084',
      resource: {
        resourceType: 'Group',
        id: '1084',
        meta: {
          versionId: '2',
          lastUpdated: '2022-06-27T03:22:11.910+00:00',
          source: '#c6f633c24d9e6c4b',
        },
        identifier: [
          {
            use: 'official',
            value: '0a83de4e-aa1c-4a53-861a-e2b095a1d113',
          },
        ],
        active: true,
        name: 'Demo FHIR Groups',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/131410',
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
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/306',
      resource: {
        resourceType: 'Group',
        id: '306',
        meta: {
          versionId: '3',
          lastUpdated: '2022-06-27T03:22:29.082+00:00',
          source: '#c6f633c24d9e6c4b',
        },
        identifier: [
          {
            use: 'official',
            value: '306',
          },
        ],
        active: true,
        name: 'ANC patients',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/307',
      resource: {
        resourceType: 'Group',
        id: '307',
        meta: {
          versionId: '3',
          lastUpdated: '2022-06-27T03:22:29.289+00:00',
          source: '#c6f633c24d9e6c4b',
        },
        identifier: [
          {
            use: 'official',
            value: '307',
          },
        ],
        active: true,
        name: 'ANC patients',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/329',
      resource: {
        resourceType: 'Group',
        id: '329',
        meta: {
          versionId: '2',
          lastUpdated: '2022-06-27T03:22:29.496+00:00',
          source: '#c6f633c24d9e6c4b',
        },
        identifier: [
          {
            use: 'official',
            value: '98828c48-a0c7-42c0-9802-48c525a916d6',
          },
        ],
        active: true,
        name: 'TEST group ',
        quantity: 1,
        member: [
          {
            entity: {
              reference: 'Patient/3',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/134405',
      resource: {
        resourceType: 'Group',
        id: '134405',
        meta: {
          versionId: '1',
          lastUpdated: '2022-07-14T17:01:38.889+00:00',
          source: '#jvcDfvbfj0XHuZUS',
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
              reference: 'Patient/134404',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/135455',
      resource: {
        resourceType: 'Group',
        id: '135455',
        meta: {
          versionId: '1',
          lastUpdated: '2022-07-19T17:27:56.437+00:00',
          source: '#LcFTrebRvGyQXOGD',
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
              reference: 'Patient/135454',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/0dd7ecd8-b44b-49f0-a585-088d7de36916',
      resource: {
        resourceType: 'Group',
        id: '0dd7ecd8-b44b-49f0-a585-088d7de36916',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:18:26.093+00:00',
          source: '#b1f49c780840b653',
        },
        identifier: [
          {
            use: 'official',
            value: '7687768262',
          },
          {
            use: 'secondary',
            value: 'ddac6cae-70d2-4ef1-9705-a8ea11564d66',
          },
        ],
        active: true,
        type: 'medication',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '763158003',
              display: 'Medicinal product',
            },
          ],
        },
        name: 'Paracetamol 100mg tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/84b00e9d-5b37-4469-a473-99bcb69099a8',
      resource: {
        resourceType: 'Group',
        id: '84b00e9d-5b37-4469-a473-99bcb69099a8',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:19:57.403+00:00',
          source: '#1a46cc89a099acf8',
        },
        identifier: [
          {
            use: 'official',
            value: '878798798',
          },
          {
            use: 'secondary',
            value: '6aef8b4b-a758-4de6-9ad9-c98f9f66acb5',
          },
        ],
        active: true,
        type: 'medication',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '763158003',
              display: 'Medicinal product',
            },
          ],
        },
        name: 'Amoxicillin 250mg tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/a08d4942-5514-4950-819b-8d2beb0f187b',
      resource: {
        resourceType: 'Group',
        id: 'a08d4942-5514-4950-819b-8d2beb0f187b',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:21:12.004+00:00',
          source: '#fff679c711ada4c7',
        },
        identifier: [
          {
            use: 'official',
            value: '9877898942',
          },
          {
            use: 'secondary',
            value: '33c3c8f4-4678-495c-9fbf-50ad1e8dd8aa',
          },
        ],
        active: true,
        type: 'medication',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '763158003',
              display: 'Medicinal product',
            },
          ],
        },
        name: 'Zinc sulfate 20mg tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/b30b36f7-3a42-44a2-b445-3e9fdabbbc7a',
      resource: {
        resourceType: 'Group',
        id: 'b30b36f7-3a42-44a2-b445-3e9fdabbbc7a',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:22:44.400+00:00',
          source: '#45be2f1eaae019ba',
        },
        identifier: [
          {
            use: 'official',
            value: '786876781345',
          },
          {
            use: 'secondary',
            value: 'f19e7e12-79d2-4bb5-b8a7-bcccbf8032a4',
          },
        ],
        active: true,
        type: 'device',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '49062001',
              display: 'Device (physical object)',
            },
          ],
        },
        name: 'Male Condoms',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/f60f98bd-97fd-484a-871c-7d24f5d5e97e',
      resource: {
        resourceType: 'Group',
        id: 'f60f98bd-97fd-484a-871c-7d24f5d5e97e',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:23:13.253+00:00',
          source: '#11a543715acab95f',
        },
        identifier: [
          {
            use: 'official',
            value: '89797682342',
          },
          {
            use: 'secondary',
            value: 'ef603b5d-7685-4f67-a11a-c10a16a48cf0',
          },
        ],
        active: true,
        type: 'device',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '49062001',
              display: 'Device (physical object)',
            },
          ],
        },
        name: 'Female Condoms',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/90b10fdb-592c-47b6-a265-c8806a15d77c',
      resource: {
        resourceType: 'Group',
        id: '90b10fdb-592c-47b6-a265-c8806a15d77c',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:07:53.596+00:00',
          source: '#6436f8c5f4d5864a',
        },
        identifier: [
          {
            use: 'official',
            value: '24524533643',
          },
          {
            use: 'secondary',
            value: 'ba77168f-e448-4045-b0f7-eb190193785e',
          },
        ],
        active: true,
        type: 'medication',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Artemether 20mg + Lumefatrine 120mg (1x6) Tablets',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '767524001',
                  display: 'Unit of measure',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '767525000',
                  display: 'Unit',
                },
              ],
              text: 'Strips',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/dde1cd4f-bef4-4d2b-ad1b-f63b639ed254',
      resource: {
        resourceType: 'Group',
        id: 'dde1cd4f-bef4-4d2b-ad1b-f63b639ed254',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:09:10.103+00:00',
          source: '#9393ec2c3c90dbc6',
        },
        identifier: [
          {
            use: 'official',
            value: '44524533643',
          },
          {
            use: 'secondary',
            value: 'adb54332-39ef-40c4-aca1-1eda04c797bb',
          },
        ],
        active: true,
        type: 'medication',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Artemether 20mg + Lumefatrine 120mg (2x6) Tablets',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '767524001',
                  display: 'Unit of measure',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '767525000',
                  display: 'Unit',
                },
              ],
              text: 'Strips',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/592181bc-0a68-47bc-8275-ac853bba1b09',
      resource: {
        resourceType: 'Group',
        id: '592181bc-0a68-47bc-8275-ac853bba1b09',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:09:26.299+00:00',
          source: '#e3e8678f84456c49',
        },
        identifier: [
          {
            use: 'official',
            value: '12344033600',
          },
          {
            use: 'secondary',
            value: 'dfe5e24a-c300-4d99-8083-c32dbda3271f',
          },
        ],
        active: true,
        type: 'medication',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Artesunate 100mg Suppository Strips',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '767524001',
                  display: 'Unit of measure',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '767525000',
                  display: 'Unit',
                },
              ],
              text: 'Strips',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/b339a63b-84db-45e8-b357-7fcce3bddc34',
      resource: {
        resourceType: 'Group',
        id: 'b339a63b-84db-45e8-b357-7fcce3bddc34',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:09:49.669+00:00',
          source: '#28e6aad3168c2aab',
        },
        identifier: [
          {
            use: 'official',
            value: '54524533670',
          },
          {
            use: 'secondary',
            value: 'e180fbc9-236a-4804-b0b1-5e19c68d73c9',
          },
        ],
        active: true,
        type: 'medication',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'AS (25mg) + AQ (67.5mg) ( 2-11months) Tablets',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '767524001',
                  display: 'Unit of measure',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '767525000',
                  display: 'Unit',
                },
              ],
              text: 'Strips',
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

export const groupSearchResponse = {
  resourceType: 'Bundle',
  id: 'aa81a9b1-cba4-4cf1-866a-bd720368e794',
  meta: {
    lastUpdated: '2023-09-01T13:44:36.524+00:00',
  },
  type: 'searchset',
  total: 2,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Group/_search?_count=20&_getpagesoffset=0&_total=accurate&name%3Acontains=Jan27',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/49779',
      resource: {
        resourceType: 'Group',
        id: '49779',
        meta: {
          versionId: '2',
          lastUpdated: '2022-04-27T00:19:31.139+00:00',
          source: '#f985a9e0f84f757a',
        },
        identifier: [
          {
            use: 'official',
            value: '4cfe25c5-d91d-4064-a62d-8d1af8ced1c4',
          },
        ],
        active: false,
        name: 'Jan27',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/49778',
      resource: {
        resourceType: 'Group',
        id: '49778',
        meta: {
          versionId: '2',
          lastUpdated: '2022-04-27T00:15:33.608+00:00',
          source: '#971d99b7c2c14ce6',
        },
        identifier: [
          {
            use: 'official',
            value: '2c4459b0-5f8b-4e50-85c2-e715ffd4860b',
          },
        ],
        active: false,
        name: 'Jan27Test',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
