export const dataPage1 = {
  resourceType: 'Bundle',
  id: 'c19781e5-ebaa-45c2-bc9b-c64b502a5672',
  meta: {
    lastUpdated: '2022-01-13T15:23:21.950+00:00',
  },
  type: 'searchset',
  total: 55,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/_search?_count=2&_format=json&_getpagesoffset=0',
    },
    {
      relation: 'next',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=c19781e5-ebaa-45c2-bc9b-c64b502a5672&_getpagesoffset=2&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/214',
      resource: {
        resourceType: 'Questionnaire',
        id: '214',
        title: 'NSW Government My Personal Health Record',
        status: 'draft',
        subjectType: ['Patient'],
        date: '2013-02-19',
        publisher: 'New South Wales Department of Health',
        jurisdiction: [
          {
            coding: [
              {
                system: 'urn:iso:std:iso:3166',
                code: 'AU',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/219',
      resource: {
        resourceType: 'Questionnaire',
        id: '219',
        title: '219 - title',
        subjectType: ['Patient'],
        date: '2021-04-21T07:24:47.111Z',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const dataPage2 = {
  resourceType: 'Bundle',
  id: '91cb3828-8e1f-4063-b8f3-552b111f917d',
  meta: {
    lastUpdated: '2022-01-13T15:24:56.723+00:00',
  },
  type: 'searchset',
  total: 55,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/_search?_count=2&_format=json&_getpagesoffset=2',
    },
    {
      relation: 'next',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=91cb3828-8e1f-4063-b8f3-552b111f917d&_getpagesoffset=4&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
    {
      relation: 'previous',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=91cb3828-8e1f-4063-b8f3-552b111f917d&_getpagesoffset=0&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/426',
      resource: {
        resourceType: 'Questionnaire',
        id: '426',
        title: '426 - title',
        url: 'http://hl7.org/fhir/Questionnaire/f201',
        status: 'active',
        subjectType: ['Patient'],
        date: '2010',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/427',
      resource: {
        resourceType: 'Questionnaire',
        id: '427',
        url: 'http://hl7.org/fhir/Questionnaire/bb',
        title: 'NSW Government My Personal Health Record',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const searchData = {
  resourceType: 'Bundle',
  id: '46ca50b7-f272-4a4e-b1a7-65e35086d2f7',
  meta: {
    lastUpdated: '2022-02-28T20:39:07.382+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Questionnaire?_format=json&name%3Acontains=sample',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/14159',
      resource: {
        resourceType: 'Questionnaire',
        id: '14159',
        language: 'en',
        name: 'birth-notification-crvs-sample',
        title: 'Birth Notification CRVS sample',
        status: 'draft',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
