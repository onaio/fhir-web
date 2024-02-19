import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';

export const commodity1 = {
  resourceType: 'Group',
  id: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
  identifier: [
    {
      use: 'secondary',
      value: '606109db-5632-48c5-8710-b726e1b3addf',
    },
    {
      use: 'official',
      value: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
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
            system: 'http://snomed.info/sct',
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
            system: 'http://snomed.info/sct',
            code: '34536373',
            display: 'Is it there code',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
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
            system: 'http://snomed.info/sct',
            code: '45647484',
            display: 'Is it in good condition? (optional)',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
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
            system: 'http://snomed.info/sct',
            code: '56758595',
            display: 'Is it being used appropriately? (optional)',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
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
            system: 'http://snomed.info/sct',
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
            system: 'http://snomed.info/sct',
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
} as IGroup;

export const editedCommodity1 = {
  resourceType: 'Group',
  id: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
  identifier: [
    { use: 'secondary', value: '606109db-5632-48c5-8710-b726e1b3addf' },
    { use: 'official', value: 'Bed nets' },
  ],
  active: true,
  type: 'substance',
  actual: false,
  code: {
    coding: [{ system: 'http://snomed.info/sct', code: '386452003', display: 'Supply management' }],
  },
  name: 'Bed nets',
  characteristic: [
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '23435363', display: 'Attractive Item code' },
        ],
      },
      valueBoolean: true,
    },
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '34536373', display: 'Is it there code' },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '34536373-1',
            display: 'Value entered on the It is there code',
          },
        ],
        text: 'could be better',
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '45647484',
            display: 'Is it in good condition? (optional)',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '45647484-1',
            display: 'Value entered on the Is it in good condition? (optional)',
          },
        ],
        text: 'as good as it can be',
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '56758595',
            display: 'Is it being used appropriately? (optional)',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '56758595-1',
            display: 'Value entered on the Is it being used appropriately? (optional)',
          },
        ],
        text: 'Define appropriately used.',
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '67869606',
            display: 'Accountability period (in months)',
          },
        ],
      },
      valueQuantity: { value: 12 },
    },
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '1231415', display: 'Product Image code' },
        ],
      },
      valueReference: { reference: 'Binary/9b782015-8392-4847-b48c-50c11638656b' },
    },
  ],
};

export const binary1 = {
  resourceType: 'Binary',
  id: '24d55827-fbd8-4b86-a47a-2f5b4598c515',
  contentType: 'image/jpg',
  data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
};

export const editedBinary1 = {
  id: '9b782015-8392-4847-b48c-50c11638656b',
  resourceType: 'Binary',
  contentType: 'image/png',
  data: 'aGVsbG8=',
};

export const editedCommodity = {
  resourceType: 'Group',
  id: '567ec5f2-db90-4fac-b578-6e07df3f48de',
  identifier: [{ value: '43245245336', use: 'official' }],
  active: false,
  type: 'medication',
  actual: false,
  code: {
    coding: [{ system: 'http://snomed.info/sct', code: '386452003', display: 'Supply management' }],
  },
  name: 'Dettol Strips',
  characteristic: [
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '767524001', display: 'Unit of measure' },
        ],
      },
      valueCodeableConcept: {
        coding: [{ system: 'http://snomed.info/sct', code: '767525000', display: 'Unit' }],
        text: 'Strips',
      },
    },
  ],
};

export const newList = {
  resourceType: 'List',
  id: 'list-resource-id',
  identifier: [{ use: 'official', value: 'list-resource-id' }],
  status: 'current',
  mode: 'working',
  title: 'Supply Chain commodities',
  code: {
    coding: [{ system: 'http://ona.io', code: 'supply-chain', display: 'Supply Chain Commodity' }],
    text: 'Supply Chain Commodity',
  },
  entry: [],
};

export const listEdited1 = {
  resourceType: 'List',
  id: 'list-resource-id',
  identifier: [{ use: 'official', value: 'list-resource-id' }],
  status: 'current',
  mode: 'working',
  title: 'Supply Chain commodities',
  code: {
    coding: [{ system: 'http://ona.io', code: 'supply-chain', display: 'Supply Chain Commodity' }],
    text: 'Supply Chain Commodity',
  },
  entry: [
    { item: { reference: 'Binary/9b782015-8392-4847-b48c-50c11638656b' } },
    { item: { reference: 'Group/9b782015-8392-4847-b48c-50c11638656b' } },
  ],
};

export const editResourceList = {
  resourceType: 'List',
  id: 'list-resource-id',
  identifier: [{ use: 'official', value: 'list-resource-id' }],
  status: 'current',
  mode: 'working',
  title: 'Supply Chain commodities',
  code: {
    coding: [{ system: 'http://ona.io', code: 'supply-chain', display: 'Supply Chain Commodity' }],
    text: 'Supply Chain Commodity',
  },
  entry: [
    { item: { reference: 'Binary/9b782015-8392-4847-b48c-50c11638656b' } },
    { item: { reference: 'Group/9b782015-8392-4847-b48c-50c11638656b' } },
    { item: { reference: 'Binary/9b782015-8392-4847-b48c-50c11638656b' } },
  ],
};

export const createdCommodity = {
  code: {
    coding: [{ system: 'http://snomed.info/sct', code: '386452003', display: 'Supply management' }],
  },
  resourceType: 'Group',
  active: true,
  name: 'Dettol',
  id: '9b782015-8392-4847-b48c-50c11638656b',
  identifier: [{ value: 'SKU001', use: 'official' }],
  type: 'substance',
  characteristic: [
    {
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '67869606',
            display: 'Accountability period (in months)',
          },
        ],
      },
      valueQuantity: { value: 12 },
    },
    {
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '56758595',
            display: 'Is it being used appropriately? (optional)',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '56758595-1',
            display: 'Value entered on the Is it being used appropriately? (optional)',
          },
        ],
        text: 'Define appropriately used.',
      },
    },
    {
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '45647484',
            display: 'Is it in good condition? (optional)',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '45647484-1',
            display: 'Value entered on the Is it in good condition? (optional)',
          },
        ],
        text: 'as good as it can be',
      },
    },
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '34536373', display: 'Is it there code' },
        ],
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '34536373-1',
            display: 'Value entered on the It is there code',
          },
        ],
        text: 'adimika',
      },
    },
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '23435363', display: 'Attractive Item code' },
        ],
      },
      valueBoolean: true,
    },
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '1231415', display: 'Product Image code' },
        ],
      },
      valueReference: { reference: 'Binary/9b782015-8392-4847-b48c-50c11638656b' },
    },
  ],
};

export const createdBinary = {
  id: '9b782015-8392-4847-b48c-50c11638656b',
  resourceType: 'Binary',
  contentType: 'image/png',
  data: 'aGVsbG8=',
};
