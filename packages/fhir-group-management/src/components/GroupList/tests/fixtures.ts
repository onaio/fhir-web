export const firstFiftygroups = {
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
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/7c5c3eb6-0382-4c7b-8c2d-3abfb31d29f4',
      resource: {
        resourceType: 'Group',
        id: '7c5c3eb6-0382-4c7b-8c2d-3abfb31d29f4',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:11:04.405+00:00',
          source: '#fdf04150dcf9dc32',
        },
        identifier: [
          {
            use: 'official',
            value: '60024533670',
          },
          {
            use: 'secondary',
            value: '9264ad6e-dd55-49de-b72a-fd3ce78c1268',
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
        name: 'AS (50mg) + AQ (135mg) ( 1-5years) Tablets',
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
        'https://fhir.labs.smartregister.org/fhir/Group/9aa4d38c-1c8c-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '9aa4d38c-1c8c-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:11:25.174+00:00',
          source: '#9e68399ed24c29c9',
        },
        identifier: [
          {
            use: 'official',
            value: '52443245336',
          },
          {
            use: 'secondary',
            value: 'b5fa1f67-b57d-46f0-88ee-95fa5b68ee18',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Dispensing Bags for Tablets (s)',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/3e5529c8-1c8d-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '3e5529c8-1c8d-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:11:42.203+00:00',
          source: '#ed5fd0ce92608473',
        },
        identifier: [
          {
            use: 'official',
            value: '14345336452',
          },
          {
            use: 'secondary',
            value: 'f6520c3c-9385-4a34-a4f5-fed040bf6213',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Dispensing Envelopes',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/1a06dc73-575f-4cff-9424-c95605ba7c30',
      resource: {
        resourceType: 'Group',
        id: '1a06dc73-575f-4cff-9424-c95605ba7c30',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:11:57.209+00:00',
          source: '#d5f7c8c9711078d3',
        },
        identifier: [
          {
            use: 'official',
            value: '33432452456',
          },
          {
            use: 'secondary',
            value: 'ea875abe-1c8c-11ed-861d-0242ac120002',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Disposable Gloves',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/961eb18c-1c8e-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '961eb18c-1c8e-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:12:22.358+00:00',
          source: '#a1c46f8cde629cbc',
        },
        identifier: [
          {
            use: 'official',
            value: '32146453453',
          },
          {
            use: 'secondary',
            value: 'c27becb2-3aba-4727-849a-3be40d12c0d8',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Examination Gloves (Nitrile) Large',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/23c0fed8-1c8e-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '23c0fed8-1c8e-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:12:38.605+00:00',
          source: '#bddaf6d5d84e82c9',
        },
        identifier: [
          {
            use: 'official',
            value: '21464534533',
          },
          {
            use: 'secondary',
            value: 'f5022dde-6f91-4173-bb26-8adb0fadd3ee',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Examination Gloves (Nitrile) Medium',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/8e6fc3e6-1c8d-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '8e6fc3e6-1c8d-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:12:55.303+00:00',
          source: '#9edc513b5e780319',
        },
        identifier: [
          {
            use: 'official',
            value: '64521434533',
          },
          {
            use: 'secondary',
            value: 'b1737e41-04f9-45f3-8d97-1f706ca0f2bc',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Examination Gloves (Nitrile) Small',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/75a7f6ec-1c8f-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '75a7f6ec-1c8f-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:13:18.233+00:00',
          source: '#839cc2f03dafdef9',
        },
        identifier: [
          {
            use: 'official',
            value: '21341421353',
          },
          {
            use: 'secondary',
            value: 'deb44760-70a6-4cc9-9e93-bec2871f476d',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Face Mask, Surgical',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/3b603f72-22b1-40f9-b2e0-5e9c3df7003f',
      resource: {
        resourceType: 'Group',
        id: '3b603f72-22b1-40f9-b2e0-5e9c3df7003f',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:13:39.148+00:00',
          source: '#33d624162b79e9c5',
        },
        identifier: [
          {
            use: 'official',
            value: '32142113453',
          },
          {
            use: 'secondary',
            value: 'd6b91066-1c8e-11ed-861d-0242ac120002',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Face Shield (Flexible, Disposable)',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/21fc9958-1c8f-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '21fc9958-1c8f-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:14:13.494+00:00',
          source: '#80cdd5f88cbee79e',
        },
        identifier: [
          {
            use: 'official',
            value: '14213213453',
          },
          {
            use: 'secondary',
            value: 'e6950619-2c25-4cbc-b78c-bf61c03cb31c',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Goggles',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/6e7d2b70-1c90-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '6e7d2b70-1c90-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:14:29.274+00:00',
          source: '#e3c0c78873252c3b',
        },
        identifier: [
          {
            use: 'official',
            value: '44523161353',
          },
          {
            use: 'secondary',
            value: 'dc2ffddb-443f-4b7d-99f1-c915529ef5d4',
          },
        ],
        active: true,
        type: 'substance',
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
        name: 'Hand sanitizer gel 250ml w/ pump',
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
              text: 'Bottles',
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
        'https://fhir.labs.smartregister.org/fhir/Group/951da426-1506-4cab-b03e-5583bdf0ca76',
      resource: {
        resourceType: 'Group',
        id: '951da426-1506-4cab-b03e-5583bdf0ca76',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:14:48.719+00:00',
          source: '#e5bd2c1cd7c9736a',
        },
        identifier: [
          {
            use: 'official',
            value: '80004533643',
          },
          {
            use: 'secondary',
            value: 'bfd0e53d-62e4-4d13-bac6-15fe28a8f7e1',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Male Condoms',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/f2734756-a6bb-4e90-bbc6-1c34f51d3d5c',
      resource: {
        resourceType: 'Group',
        id: 'f2734756-a6bb-4e90-bbc6-1c34f51d3d5c',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:15:13.553+00:00',
          source: '#3e76e58e7815c00b',
        },
        identifier: [
          {
            use: 'official',
            value: '20004533643',
          },
          {
            use: 'secondary',
            value: '70c81d86-3e2b-4cc6-9d78-848ed3ceac7c',
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
        name: 'Microgynon',
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
              text: 'Cycles',
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
        'https://fhir.labs.smartregister.org/fhir/Group/9738f1b3-dac8-4c71-bcaf-f1d7959b0681',
      resource: {
        resourceType: 'Group',
        id: '9738f1b3-dac8-4c71-bcaf-f1d7959b0681',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:15:34.612+00:00',
          source: '#0c5affcd20186e19',
        },
        identifier: [
          {
            use: 'official',
            value: '20204533643',
          },
          {
            use: 'secondary',
            value: 'dc3edaeb-00cf-4243-acb6-777c1e181df3',
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
        name: 'Microlut',
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
              text: 'Cycles',
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
        'https://fhir.labs.smartregister.org/fhir/Group/3af23539-850a-44ed-8fb1-d4999e2145ff',
      resource: {
        resourceType: 'Group',
        id: '3af23539-850a-44ed-8fb1-d4999e2145ff',
        meta: {
          versionId: '2',
          lastUpdated: '2022-08-16T09:15:52.994+00:00',
          source: '#37d9b080de8aa1a6',
        },
        identifier: [
          {
            use: 'official',
            value: '84524533643',
          },
          {
            use: 'secondary',
            value: 'bdd113fb-0f09-4eed-89f2-4608437dd20f',
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
        name: 'MNP',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/d1ad8a94-ba92-4f78-903d-0653ebd41336',
      resource: {
        resourceType: 'Group',
        id: 'd1ad8a94-ba92-4f78-903d-0653ebd41336',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:16:10.367+00:00',
          source: '#71254972ee243888',
        },
        identifier: [
          {
            use: 'official',
            value: '10524533622',
          },
          {
            use: 'secondary',
            value: '0c7902d0-ceca-4cdc-a716-ab4d5dc8d4f5',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'MUAC Strap',
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
              text: 'Sachets',
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
        'https://fhir.labs.smartregister.org/fhir/Group/6a59c142-1c87-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '6a59c142-1c87-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:16:25.449+00:00',
          source: '#f3f438741f6dc153',
        },
        identifier: [
          {
            use: 'official',
            value: '32452453364',
          },
          {
            use: 'secondary',
            value: 'f4292581-aef3-4484-bae0-cc0bcb92119e',
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
        name: 'Oral Rehydration Salt 20.5g/L',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/567ec5f2-db90-4fac-b578-6e07df3f48de',
      resource: {
        resourceType: 'Group',
        id: '567ec5f2-db90-4fac-b578-6e07df3f48de',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:16:41.045+00:00',
          source: '#33f8025083126f96',
        },
        identifier: [
          {
            use: 'official',
            value: '43245245336',
          },
          {
            use: 'secondary',
            value: 'ee979468-1c8a-11ed-861d-0242ac120002',
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
        name: 'Paracetamol 100mg Tablets',
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
              text: 'Tablets',
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
        'https://fhir.labs.smartregister.org/fhir/Group/197faa30-1c90-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '197faa30-1c90-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:16:56.184+00:00',
          source: '#c2449bed305092bc',
        },
        identifier: [
          {
            use: 'official',
            value: '41422131353',
          },
          {
            use: 'secondary',
            value: 'f77746b0-562b-44fd-85dc-5283d2ae3b43',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'PPE Suit - Coverall, L',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/09a63acb-81d1-4117-b61d-a59dfdc177fa',
      resource: {
        resourceType: 'Group',
        id: '09a63acb-81d1-4117-b61d-a59dfdc177fa',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:17:11.472+00:00',
          source: '#1524ad1fef612b8e',
        },
        identifier: [
          {
            use: 'official',
            value: '21341421353',
          },
          {
            use: 'secondary',
            value: 'dddd1fbc-1c8f-11ed-861d-0242ac120002',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'PPE Suit - Coverall, M',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/24dcbee9-a665-4b3e-b97d-61b3ff675589',
      resource: {
        resourceType: 'Group',
        id: '24dcbee9-a665-4b3e-b97d-61b3ff675589',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:17:30.306+00:00',
          source: '#35fafb4705765116',
        },
        identifier: [
          {
            use: 'official',
            value: '40204533693',
          },
          {
            use: 'secondary',
            value: '5cdd9be7-9e95-41a3-a606-1c76a17cc25d',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Rapid Diagnostic Test (RDT)',
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
              text: 'Tests',
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
        'https://fhir.labs.smartregister.org/fhir/Group/853341c8-1c91-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '853341c8-1c91-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:17:46.723+00:00',
          source: '#0e05f99fed601c98',
        },
        identifier: [
          {
            use: 'official',
            value: '13445231653',
          },
          {
            use: 'secondary',
            value: 'dc136e6e-0c1a-463b-9384-6071526ddb7a',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Safety Boxes',
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
              text: 'Pieces',
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
        'https://fhir.labs.smartregister.org/fhir/Group/2265f6c0-610d-45f4-b023-c5b7fd5eb546',
      resource: {
        resourceType: 'Group',
        id: '2265f6c0-610d-45f4-b023-c5b7fd5eb546',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:18:00.950+00:00',
          source: '#6852d10cd58bda70',
        },
        identifier: [
          {
            use: 'official',
            value: '30204033600',
          },
          {
            use: 'secondary',
            value: 'e1e9f990-3fbc-40d0-9ce7-d0b0890d620e',
          },
        ],
        active: true,
        type: 'device',
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
        name: 'Sayana Press',
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
              text: 'Ampoules',
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
        'https://fhir.labs.smartregister.org/fhir/Group/6815d390-1c8b-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '6815d390-1c8b-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:18:18.593+00:00',
          source: '#00e7564035006483',
        },
        identifier: [
          {
            use: 'official',
            value: '43245336452',
          },
          {
            use: 'secondary',
            value: 'a3a26fdc-408a-4a18-9612-2b1f013b5fb0',
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
        name: 'Zinc Sulfate 20mg Tablets',
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
              text: 'Tablets',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/143661',
      resource: {
        resourceType: 'Group',
        id: '143661',
        meta: {
          versionId: '2',
          lastUpdated: '2022-09-08T08:58:47.686+00:00',
          source: '#e581c653297ad416',
        },
        identifier: [
          {
            use: 'official',
            value: '51ad3dde-08b4-42ec-b7e7-48425f8d40cd',
          },
        ],
        active: true,
        type: 'medication',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Drug 12/34',
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
              text: 'cycles',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/143174',
      resource: {
        resourceType: 'Group',
        id: '143174',
        meta: {
          versionId: '4',
          lastUpdated: '2022-09-09T06:59:24.848+00:00',
          source: '#9f9b86631445633e',
        },
        identifier: [
          {
            use: 'official',
            value: '20ccbae3-bd38-4774-ba0a-2c5a45aa617f',
          },
        ],
        active: true,
        type: 'medication',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Test Commodity2',
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
              text: 'ampoules',
            },
          },
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
              text: 'strips',
            },
          },
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
              text: 'tablets',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145482',
      resource: {
        resourceType: 'Group',
        id: '145482',
        meta: {
          versionId: '1',
          lastUpdated: '2022-09-28T08:04:18.098+00:00',
          source: '#5528df9ff6386998',
        },
        identifier: [
          {
            use: 'official',
            value: '123aa49f-771c-4b34-a313-cf8378bf1561',
          },
        ],
        active: true,
        type: 'medication',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'test comodity',
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
              text: 'bottles',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145716',
      resource: {
        resourceType: 'Group',
        id: '145716',
        meta: {
          versionId: '1',
          lastUpdated: '2022-10-13T01:39:43.720+00:00',
          source: '#ad3bf81925e24a97',
        },
        identifier: [
          {
            use: 'official',
            value: 'c2d4ee97-3511-4050-bbda-d43e467fdcac',
          },
          {
            use: 'secondary',
            value: '7f5d1800-e1c2-4c31-b01d-d084b8c96bb0',
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
        name: 'Blue Test',
        member: [
          {
            entity: {
              reference: 'Practitioner/105166',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145835',
      resource: {
        resourceType: 'Group',
        id: '145835',
        meta: {
          versionId: '1',
          lastUpdated: '2022-10-13T01:40:49.867+00:00',
          source: '#64c6db8dd9526654',
        },
        identifier: [
          {
            use: 'official',
            value: 'd6d32fad-e94f-48ad-95d2-c2f31e39b156',
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
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145837',
      resource: {
        resourceType: 'Group',
        id: '145837',
        meta: {
          versionId: '1',
          lastUpdated: '2022-10-13T01:41:09.426+00:00',
          source: '#7db563b3e979abaa',
        },
        identifier: [
          {
            use: 'official',
            value: '51aa866f-4d4a-4227-85b3-b9abd09cdfaa',
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
              reference: 'Practitioner/145836',
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
