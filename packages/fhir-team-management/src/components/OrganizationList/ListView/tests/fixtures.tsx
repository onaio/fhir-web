export const organizationsPage1 = {
  resourceType: 'Bundle',
  id: '4918ec94-22f4-484a-bb70-fe403359c07f',
  meta: {
    lastUpdated: '2022-02-16T09:17:38.813+00:00',
  },
  type: 'searchset',
  total: 219,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Organization/_search?_count=3&_format=json&_getpagesoffset=0',
    },
    {
      relation: 'next',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=4918ec94-22f4-484a-bb70-fe403359c07f&_getpagesoffset=3&_count=3&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/205',
      resource: {
        resourceType: 'Organization',
        id: '205',
        meta: {
          versionId: '2',
          lastUpdated: '2021-06-22T08:43:41.801+00:00',
          source: '#e4f4daada5b65d9b',
        },
        identifier: [
          {
            use: 'official',
            value: '205',
          },
        ],
        active: true,
        name: 'test 345',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/361',
      resource: {
        resourceType: 'Organization',
        id: '361',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T12:53:05.997+00:00',
          source: '#8617d3c21781d9a5',
        },
        identifier: [
          {
            use: 'official',
            value: 'a741cd5e-5737-4731-908b-957afa91878d',
          },
        ],
        active: true,
        name: 'Test Team One',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/362',
      resource: {
        resourceType: 'Organization',
        id: '362',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:00:54.421+00:00',
          source: '#30a45deb81923db9',
        },
        identifier: [
          {
            use: 'official',
            value: '6202b7b2-e45e-4616-b690-6d5d40fb8cc5',
          },
        ],
        active: true,
        name: 'Test Team 3',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const organizationsPage2 = {
  resourceType: 'Bundle',
  id: '4918ec94-22f4-484a-bb70-fe403359c07f',
  meta: {
    lastUpdated: '2022-02-16T09:17:38.813+00:00',
  },
  type: 'searchset',
  total: 219,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Organization/_search?_count=3&_format=json&_getpagesoffset=3',
    },
    {
      relation: 'next',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=4918ec94-22f4-484a-bb70-fe403359c07f&_getpagesoffset=6&_count=3&_format=json&_pretty=true&_bundletype=searchset',
    },
    {
      relation: 'previous',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=4918ec94-22f4-484a-bb70-fe403359c07f&_getpagesoffset=0&_count=3&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/363',
      resource: {
        resourceType: 'Organization',
        id: '363',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:08:22.510+00:00',
          source: '#3dc5c6e011022d8a',
        },
        identifier: [
          {
            use: 'official',
            value: '3255cf21-d2e2-4917-b780-02edefc18e5d',
          },
        ],
        active: true,
        name: 'Test Team 4',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/364',
      resource: {
        resourceType: 'Organization',
        id: '364',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:15:30.534+00:00',
          source: '#a2daabb58f6bbbd5',
        },
        identifier: [
          {
            use: 'official',
            value: 'e91fb7fd-5dd2-4edc-980f-2a8a47afabc0',
          },
        ],
        active: true,
        name: 'Test Team 5',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/365',
      resource: {
        resourceType: 'Organization',
        id: '365',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:15:36.882+00:00',
          source: '#ffb40bf381017dad',
        },
        identifier: [
          {
            use: 'official',
            value: 'a330d973-f144-42b4-b608-b5118ed21f4d',
          },
        ],
        active: true,
        name: 'Test Team 5',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
export const organizationSearchPage1 = {
  resourceType: 'Bundle',
  id: 'a283035a-17c5-4461-a6d8-248a93458771',
  meta: {
    lastUpdated: '2022-02-17T11:57:46.334+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Organization/_search?_count=10&_format=json&_getpagesoffset=0&name%3Acontains=345',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/205',
      resource: {
        resourceType: 'Organization',
        id: '205',
        meta: {
          versionId: '2',
          lastUpdated: '2021-06-22T08:43:41.801+00:00',
          source: '#e4f4daada5b65d9b',
        },
        identifier: [
          {
            use: 'official',
            value: '205',
          },
        ],
        active: true,
        name: 'test 345',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
