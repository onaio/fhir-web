import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';

export const commodity1 = {
  resourceType: 'Group',
  id: '567ec5f2-db90-4fac-b578-6e07df3f48de',
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
} as IGroup;

export const createdCommodity = {
  resourceType: 'Group',
  active: true,
  code: {
    coding: [{ system: 'http://snomed.info/sct', code: '386452003', display: 'Supply management' }],
  },
  name: 'Dettol',
  id: '9b782015-8392-4847-b48c-50c11638656b',
  identifier: [{ value: '9b782015-8392-4847-b48c-50c11638656b', use: 'official' }],
  type: 'device',
  characteristic: [
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '767524001', display: 'Unit of measure' },
        ],
      },
      valueCodeableConcept: {
        coding: [{ system: 'http://snomed.info/sct', code: '767525000', display: 'Unit' }],
        text: 'Bottles',
      },
    },
  ],
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

export const createdCommodity1 = {
  code: {
    coding: [{ system: 'http://snomed.info/sct', code: '386452003', display: 'Supply management' }],
  },
  resourceType: 'Group',
  active: true,
  name: 'Dettol',
  id: '9b782015-8392-4847-b48c-50c11638656b',
  identifier: [{ value: '9b782015-8392-4847-b48c-50c11638656b', use: 'official' }],
  type: 'device',
  characteristic: [
    {
      code: {
        coding: [
          { system: 'http://snomed.info/sct', code: '767524001', display: 'Unit of measure' },
        ],
      },
      valueCodeableConcept: {
        coding: [{ system: 'http://snomed.info/sct', code: '767525000', display: 'Unit' }],
        text: 'Bottles',
      },
    },
  ],
};
