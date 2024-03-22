export const firstTwentyEusmCommodities = {
  resourceType: 'Bundle',
  id: '9cdfbf16-0b4f-4b2d-9e39-10bb78c950f4',
  meta: {
    lastUpdated: '2023-03-09T13:03:23.084+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Group/_search?_count=50&_elements=name%2Cid&code=http%3A%2F%2Fsnomed.info%2Fsct%7C386452003',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/52cffa51-fa81-49aa-9944-5b45d9e4c117',
      resource: {
        resourceType: 'Group',
        id: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
        meta: {
          versionId: '1',
          lastUpdated: '2024-02-09T09:03:27.930+00:00',
          source: '#d38d9951b109b72f',
        },
        identifier: [
          {
            use: 'official',
            value: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
          },
          {
            use: 'secondary',
            value: '606109db-5632-48c5-8710-b726e1b3addf',
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
        name: 'Bed nets',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '23435363',
                  display: 'Attractive Item code',
                },
              ],
            },
            valueBoolean: false,
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373',
                  display: 'Is it there code',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373-1',
                  display: 'Value entered on the It is there code',
                },
              ],
              text: 'yes',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Is it in good condition? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484-1',
                  display: 'Value entered on the Is it in good condition? (optional)',
                },
              ],
              text: 'Yes, no tears, and inocuated',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595',
                  display: 'Is it being used appropriately? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595-1',
                  display: 'Value entered on the Is it being used appropriately? (optional)',
                },
              ],
              text: 'Hanged at correct height and covers averagely sized beds',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '67869606',
                  display: 'Accountability period (in months)',
                },
              ],
            },
            valueQuantity: {
              value: 12,
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '1231415',
                  display: 'Product Image code',
                },
              ],
            },
            valueReference: {
              reference: 'Binary/24d55827-fbd8-4b86-a47a-2f5b4598c515',
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

export const listResource = {
  resourceType: 'List',
  id: 'ea15c35a-8e8c-47ce-8122-c347cefa1b4a',
  identifier: [
    {
      use: 'official',
      value: 'ea15c35a-8e8c-47ce-8122-c347cefa1b4a',
    },
  ],
  status: 'current',
  mode: 'working',
  title: 'Supply Chain commodities',
  code: {
    coding: [
      {
        system: 'http://ona.io',
        code: 'supply-chain',
        display: 'Supply Chain Commodity',
      },
    ],
    text: 'Supply Chain Commodity',
  },
  entry: [
    {
      item: {
        reference: 'Group/52cffa51-fa81-49aa-9944-5b45d9e4c117',
      },
    },
    {
      item: {
        reference: 'Binary/24d55827-fbd8-4b86-a47a-2f5b4598c515',
      },
    },
  ],
};
