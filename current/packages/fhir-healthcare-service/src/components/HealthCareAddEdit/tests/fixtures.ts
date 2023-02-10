import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IHealthcareService } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IHealthcareService';

export const allOrgs = {
  resourceType: 'Bundle',
  id: '7f08e705-bb29-49c4-bf95-1defa13161ce',
  meta: {
    lastUpdated: '2022-03-24T06:54:59.830+00:00',
  },
  type: 'searchset',
  total: 227,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Organization?_count=5&_format=json',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=7f08e705-bb29-49c4-bf95-1defa13161ce&_getpagesoffset=5&_count=5&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Organization/363',
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
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Organization/364',
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
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Organization/365',
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
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Organization/366',
      resource: {
        resourceType: 'Organization',
        id: '366',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:35:11.315+00:00',
          source: '#87395375150eac4b',
        },
        identifier: [
          {
            use: 'official',
            value: '7b83dd9c-ae06-4e1e-b45f-719e6d6af376',
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
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Organization/361',
      resource: {
        resourceType: 'Organization',
        id: '361',
        meta: {
          versionId: '2',
          lastUpdated: '2022-03-07T07:20:24.938+00:00',
          source: '#738ba913cab0fce1',
        },
        identifier: [
          {
            use: 'official',
            value: 'a741cd5e-5737-4731-908b-957afa91878d',
          },
        ],
        active: true,
        name: 'Test Team One',
        alias: ['test'],
      },
      search: {
        mode: 'match',
      },
    },
  ],
} as unknown as IBundle;

export const healthCare313 = {
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
} as IHealthcareService;

export const createdHealthCareService = {
  resourceType: 'HealthcareService',
  active: true,
  name: 'Good doctor',
  id: '9b782015-8392-4847-b48c-50c11638656b',
  identifier: [{ value: '9b782015-8392-4847-b48c-50c11638656b', use: 'official' }],
  providedBy: { reference: 'Organization/361', display: 'Test Team One' },
  extraDetails: 'Treatment using cutting-edge stuff',
  comment: 'Best services ever',
};

export const editedHealthCare = {
  resourceType: 'HealthcareService',
  id: '313',
  identifier: [{ value: '313', use: 'official' }],
  active: false,
  providedBy: { reference: 'Organization/363', display: 'Test Team 4' },
  name: 'Medieval healers',
  comment: 'Eat shrubs',
  extraDetails: 'ANC Service',
};
