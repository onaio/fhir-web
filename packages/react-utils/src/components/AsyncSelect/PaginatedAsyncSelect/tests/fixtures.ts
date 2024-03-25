export const organizationsPage1 = {
  resourceType: 'Bundle',
  id: 'b3fcfa95-cc95-4a44-8bf5-abd68292945e',
  meta: {
    lastUpdated: '2023-01-31T08:38:11.517+00:00',
  },
  type: 'searchset',
  link: [
    {
      relation: 'self',
      url: 'https://hapi.fhir.org/baseR4/Organization/?_count=5&_format=json&_getpagesoffset=0',
    },
    {
      relation: 'next',
      url: 'https://hapi.fhir.org/baseR4?_getpages=b3fcfa95-cc95-4a44-8bf5-abd68292945e&_getpagesoffset=5&_count=5&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/1839',
      resource: {
        resourceType: 'Organization',
        id: '1839',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-21T01:13:54.367+00:00',
          source: '#899bf40a941da002',
        },
        type: [
          {
            coding: [
              {
                system: 'http://hl7.org/fhir/organization-type',
                code: 'prov',
                display: 'Healthcare Provider',
              },
            ],
            text: 'Healthcare Provider',
          },
        ],
        name: '高雄榮民總醫院',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/22332',
      resource: {
        resourceType: 'Organization',
        id: '22332',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-22T19:20:50.546+00:00',
          source: '#f78620aca048d681',
        },
        identifier: [
          {
            system: 'https://10.181.20.21:9292/esb-fhir/fhir/identifiers/Organization',
            value: '15',
          },
        ],
        active: true,
        type: [
          {
            coding: [
              {
                system: 'https://www.cgm.com/clininet/fhir/dictionaries/orgUnitType',
                code: 'BLOCK',
                display: 'Blok zabiegowy',
              },
            ],
          },
        ],
        name: 'Blok Operacyjny Chirurgii Naczyń',
        alias: ['BOCHN'],
        address: [
          {
            use: 'work',
            type: 'both',
            text: 'Staszica 11',
            line: ['Staszica 11'],
            city: 'Lublin',
            state: 'LUBELSKIE',
            country: 'Polska',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/25194',
      resource: {
        resourceType: 'Organization',
        id: '25194',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-24T02:38:56.471+00:00',
          source: '#dfa49b27f7de6371',
        },
        name: 'Volunteer virtual hospital 志工虛擬醫院',
        telecom: [
          {
            system: 'phone',
            value: '+886 278565301',
            use: 'mobile',
          },
          {
            system: 'email',
            value: 'chhsiao@gms.tcu.edu.tw',
            use: 'work',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/25195',
      resource: {
        resourceType: 'Organization',
        id: '25195',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-24T02:43:33.482+00:00',
          source: '#02c4849bf768ed0c',
        },
        name: 'Volunteer virtual hospital 志工虛擬醫院',
        telecom: [
          {
            system: 'phone',
            value: '+886 278565301',
            use: 'mobile',
          },
          {
            system: 'phone',
            value: '+886 27301',
            use: 'home',
          },
          {
            system: 'email',
            value: 'chhsiao@gms.tcu.edu.tw',
            use: 'work',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/25196',
      resource: {
        resourceType: 'Organization',
        id: '25196',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-24T02:55:09.109+00:00',
          source: '#2e5e11e93ead85f9',
        },
        name: 'Volunteer virtual hospital 志工虛擬醫院',
        telecom: [
          {
            system: 'phone',
            value: '+886 278565301',
            use: 'mobile',
          },
          {
            system: 'email',
            value: 'chhsiao@gms.tcu.edu.tw',
            use: 'work',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const organizationsPage2 = {
  resourceType: 'Bundle',
  id: 'd6aa07e8-fda4-4b3d-ad68-ddbd918e2e01',
  meta: {
    lastUpdated: '2023-01-31T10:09:58.496+00:00',
  },
  type: 'searchset',
  link: [
    {
      relation: 'self',
      url: 'https://hapi.fhir.org/baseR4/Organization/?_count=5&_format=json&_getpagesoffset=5',
    },
    {
      relation: 'next',
      url: 'https://hapi.fhir.org/baseR4?_getpages=d6aa07e8-fda4-4b3d-ad68-ddbd918e2e01&_getpagesoffset=10&_count=5&_format=json&_pretty=true&_bundletype=searchset',
    },
    {
      relation: 'previous',
      url: 'https://hapi.fhir.org/baseR4?_getpages=d6aa07e8-fda4-4b3d-ad68-ddbd918e2e01&_getpagesoffset=0&_count=5&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/25341',
      resource: {
        resourceType: 'Organization',
        id: '25341',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-24T10:39:00.988+00:00',
          source: '#a270c14d630eedba',
        },
        identifier: [
          {
            system: 'http://scp-health.com/fhir/gfid',
            value: '6666',
          },
        ],
        name: 'Test',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/30099',
      resource: {
        resourceType: 'Organization',
        id: '30099',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-26T13:14:11.303+00:00',
          source: '#20dc8ea0e407f070',
        },
        active: true,
        name: 'Hospital Krel Tarron',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/30165',
      resource: {
        resourceType: 'Organization',
        id: '30165',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-26T14:34:41.185+00:00',
          source: '#8c99c9b0e07e31fd',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">clinFhir</div>',
        },
        identifier: [
          {
            system: 'http://fhir.hl7.org.nz/identifier',
            value: 'cf',
          },
        ],
        name: 'clinFHIR Sample creator',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/31862',
      resource: {
        resourceType: 'Organization',
        id: '31862',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-27T12:40:45.532+00:00',
          source: '#2a9855dc81e622f8',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">\n      Health Level Seven International\n      <br/>\n\t\t\t\t3300 Washtenaw Avenue, Suite 227\n      <br/>\n\t\t\t\tAnn Arbor, MI 48104\n      <br/>\n\t\t\t\tUSA\n      <br/>\n\t\t\t\t(+1) 734-677-7777 (phone)\n      <br/>\n\t\t\t\t(+1) 734-677-6622 (fax)\n      <br/>\n\t\t\t\tE-mail:  \n      <a href="mailto:hq@HL7.org">hq@HL7.org</a>\n    \n    </div>',
        },
        name: 'Health Level Seven International',
        alias: ['HL7 International'],
        telecom: [
          {
            system: 'phone',
            value: '(+1) 734-677-7777',
          },
          {
            system: 'fax',
            value: '(+1) 734-677-6622',
          },
          {
            system: 'email',
            value: 'hq@HL7.org',
          },
        ],
        address: [
          {
            line: ['3300 Washtenaw Avenue, Suite 227'],
            city: 'Ann Arbor',
            state: 'MI',
            postalCode: '48104',
            country: 'USA',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://hapi.fhir.org/baseR4/Organization/31863',
      resource: {
        resourceType: 'Organization',
        id: '31863',
        meta: {
          versionId: '1',
          lastUpdated: '2019-09-27T12:41:52.007+00:00',
          source: '#6b29cdf4ae6b69bd',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">\n      Health Level Seven International\n      <br/>\n\t\t\t\t3300 Washtenaw Avenue, Suite 227\n      <br/>\n\t\t\t\tAnn Arbor, MI 48104\n      <br/>\n\t\t\t\tUSA\n      <br/>\n\t\t\t\t(+1) 734-677-7777 (phone)\n      <br/>\n\t\t\t\t(+1) 734-677-6622 (fax)\n      <br/>\n\t\t\t\tE-mail:  \n      <a href="mailto:hq@HL7.org">hq@HL7.org</a>\n    \n    </div>',
        },
        name: 'Health Level Seven International',
        alias: ['HL7 International'],
        telecom: [
          {
            system: 'phone',
            value: '(+1) 734-677-7777',
          },
          {
            system: 'fax',
            value: '(+1) 734-677-6622',
          },
          {
            system: 'email',
            value: 'hq@HL7.org',
          },
        ],
        address: [
          {
            line: ['3300 Washtenaw Avenue, Suite 227'],
            city: 'Ann Arbor',
            state: 'MI',
            postalCode: '48104',
            country: 'USA',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const organizationsPage1Summary = {
  resourceType: 'Bundle',
  id: '73d0c5dd-8446-453f-a7be-badb4bac22c8',
  meta: {
    lastUpdated: '2023-01-31T09:06:30.352+00:00',
    tag: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
        code: 'SUBSETTED',
        display: 'Resource encoded in summary mode',
      },
    ],
  },
  type: 'searchset',
  total: 10,
};
