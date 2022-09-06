export const commoditiesPage1 = {
  resourceType: 'Bundle',
  id: '5a49c8b4-a371-4f1c-8bdc-5588099fa0e2',
  meta: {
    lastUpdated: '2022-09-06T08:43:42.235+00:00',
  },
  type: 'searchset',
  total: 30,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Group/_search?_count=5&_getpagesoffset=0&code=http%3A%2F%2Fsnomed.info%2Fsct%7C386452003',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=5a49c8b4-a371-4f1c-8bdc-5588099fa0e2&_getpagesoffset=5&_count=5&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Group/6f3980e0-d1d6-4a7a-a950-939f3ca7b301',
      resource: {
        resourceType: 'Group',
        id: '6f3980e0-d1d6-4a7a-a950-939f3ca7b301',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:07:04.048+00:00',
          source: '#400cbd0d840d8a44',
        },
        identifier: [
          {
            use: 'official',
            value: '14524533622',
          },
          {
            use: 'secondary',
            value: '9b54d1cd-42cc-4dd4-ba7f-1c1245e5b30c',
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
        name: 'Albendazole 400mg Tablets',
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
        'https://fhir.labs.smartregister.org:443/fhir/Group/e50eb835-7827-4001-b233-e1dda721d4e8',
      resource: {
        resourceType: 'Group',
        id: 'e50eb835-7827-4001-b233-e1dda721d4e8',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:07:34.850+00:00',
          source: '#93e54b68e75b87c0',
        },
        identifier: [
          {
            use: 'official',
            value: '64524533643',
          },
          {
            use: 'secondary',
            value: '47c086f5-2877-470f-8a69-03f0270a7350',
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
        name: 'Amoxicillin 250mg Tablets',
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
        'https://fhir.labs.smartregister.org:443/fhir/Group/90b10fdb-592c-47b6-a265-c8806a15d77c',
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
        'https://fhir.labs.smartregister.org:443/fhir/Group/dde1cd4f-bef4-4d2b-ad1b-f63b639ed254',
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
        'https://fhir.labs.smartregister.org:443/fhir/Group/592181bc-0a68-47bc-8275-ac853bba1b09',
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
  ],
};
