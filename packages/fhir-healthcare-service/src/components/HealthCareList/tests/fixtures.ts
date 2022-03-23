export const healthCareServicePage1 = {
  resourceType: 'Bundle',
  id: '2f53e838-6e1f-470f-8e2b-ad520c5c3f7a',
  meta: {
    lastUpdated: '2022-03-23T15:36:55.433+00:00',
  },
  type: 'searchset',
  total: 61,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/HealthcareService/_search?_count=2&_format=json&_getpageoffset=0',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=2f53e838-6e1f-470f-8e2b-ad520c5c3f7a&_getpagesoffset=2&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/HealthcareService/323',
      resource: {
        resourceType: 'HealthcareService',
        id: '323',
        meta: {
          versionId: '7',
          lastUpdated: '2022-01-27T12:01:49.392+00:00',
          source: '#c723e5c4096511bb',
        },
        identifier: [
          {
            use: 'official',
            value: '323',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/366',
        },
        name: 'testing  Healthcare Jan27',
        comment: 'test',
        extraDetails: 'test',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/HealthcareService/313',
      resource: {
        resourceType: 'HealthcareService',
        id: '313',
        meta: {
          versionId: '5',
          lastUpdated: '2021-06-16T20:30:54.480+00:00',
          source: '#555f2c7540f52c91',
        },
        identifier: [
          {
            use: 'official',
            value: '313',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/319',
        },
        name: 'ANC Service',
        comment: 'ANC Service',
        extraDetails: 'ANC Service',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const healthCareServicePage2 = {
  resourceType: 'Bundle',
  id: '7b920edf-a52a-4940-a4aa-6391aa43f0c3',
  meta: {
    lastUpdated: '2022-03-23T15:42:41.021+00:00',
  },
  type: 'searchset',
  total: 61,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/HealthcareService/_search?_count=2&_format=json&_getpageoffset=2',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=7b920edf-a52a-4940-a4aa-6391aa43f0c3&_getpagesoffset=2&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/HealthcareService/323',
      resource: {
        resourceType: 'HealthcareService',
        id: '323',
        meta: {
          versionId: '7',
          lastUpdated: '2022-01-27T12:01:49.392+00:00',
          source: '#c723e5c4096511bb',
        },
        identifier: [
          {
            use: 'official',
            value: '323',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/366',
        },
        name: 'testing  Healthcare Jan27',
        comment: 'test',
        extraDetails: 'test',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/HealthcareService/313',
      resource: {
        resourceType: 'HealthcareService',
        id: '313',
        meta: {
          versionId: '5',
          lastUpdated: '2021-06-16T20:30:54.480+00:00',
          source: '#555f2c7540f52c91',
        },
        identifier: [
          {
            use: 'official',
            value: '313',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/319',
        },
        name: 'ANC Service',
        comment: 'ANC Service',
        extraDetails: 'ANC Service',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const healthCareServiceSearch = {
  resourceType: 'Bundle',
  id: '6f05f498-ab20-45e1-8d3e-4440a9e8f28a',
  meta: {
    lastUpdated: '2022-03-23T15:46:47.502+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/HealthcareService/_search?_count=2&_format=json&_getpageoffset=2&name%3Acontains=testing%20%20Healthcare%20Jan27',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/HealthcareService/323',
      resource: {
        resourceType: 'HealthcareService',
        id: '323',
        meta: {
          versionId: '7',
          lastUpdated: '2022-01-27T12:01:49.392+00:00',
          source: '#c723e5c4096511bb',
        },
        identifier: [
          {
            use: 'official',
            value: '323',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/366',
        },
        name: 'testing  Healthcare Jan27',
        comment: 'test',
        extraDetails: 'test',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
