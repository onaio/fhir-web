export const groupspage1 = {
  resourceType: 'Bundle',
  id: 'd5221d0e-158c-4f2c-8a4f-94f5853e4d60',
  meta: {
    lastUpdated: '2022-03-24T11:19:12.342+00:00',
  },
  type: 'searchset',
  total: 51,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Group/?_count=2&_format=json&_getpageoffset=0',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=d5221d0e-158c-4f2c-8a4f-94f5853e4d60&_getpagesoffset=2&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Group/49779',
      resource: {
        resourceType: 'Group',
        id: '49779',
        meta: {
          versionId: '1',
          lastUpdated: '2022-01-27T08:00:03.370+00:00',
          source: '#e05e196245eae741',
        },
        identifier: [
          {
            use: 'official',
            value: '4cfe25c5-d91d-4064-a62d-8d1af8ced1c4',
          },
        ],
        active: true,
        name: 'Jan27',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Group/49778',
      resource: {
        resourceType: 'Group',
        id: '49778',
        meta: {
          versionId: '1',
          lastUpdated: '2022-01-27T07:59:28.742+00:00',
          source: '#568257df6991c951',
        },
        identifier: [
          {
            use: 'official',
            value: '2c4459b0-5f8b-4e50-85c2-e715ffd4860b',
          },
        ],
        active: true,
        name: 'Jan27Test',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
