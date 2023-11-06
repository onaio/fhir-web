import { LocationUnit } from '@opensrp/location-management/src/ducks/location-units';

export const madagascar = {
  type: 'Feature',
  id: '03176924-6b3c-4b74-bccd-32afcceebabd',
  properties: { status: 'Active', name: 'Madagascar', geographicLevel: 0, version: 0 },
  serverVersion: 2968,
  locationTags: [{ id: 1, name: 'Country' }],
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const madagascarTree = require('./madagascar.json');

export const structure1 = {
  type: 'Feature',
  id: 'f3199af5-2eaf-46df-87c9-40d59606a2fb',
  properties: {
    type: 'Water Point',
    status: 'Active',
    parentId: '8e74d042-4a71-4694-a652-bc3ba6369101',
    name: 'EPP Ambodisatrana 2',
    geographicLevel: 0,
    version: 0,
    AdminLevelTag: 'Commune',
  },
  serverVersion: 18479,
} as LocationUnit;
export const structure2 = {
  type: 'Feature',
  id: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
  properties: {
    type: 'Water Point',
    status: 'Active',
    parentId: '663d7935-35e7-4ccf-aaf5-6e16f2042570',
    name: 'Ambatoharanana',
    geographicLevel: 0,
    version: 0,
    AdminLevelTag: 'Commune',
  },
  serverVersion: 18480,
};
export const structure3 = {
  type: 'Feature',
  id: '45e4bd97-fe11-458b-b481-294b7d7e8270',
  properties: {
    type: 'Water Point',
    status: 'Active',
    parentId: 'c38e0c1e-3d72-424b-ac37-29e8d3e82026',
    name: 'Ambahoabe',
    geographicLevel: 0,
    version: 0,
    AdminLevelTag: 'Commune',
  },
  serverVersion: 18481,
};
export const structures = [structure1, structure2, structure3] as LocationUnit[];

export const fetchCalls = [
  [
    'https://mg-eusm-staging.smartregister.org/opensrp/rest/location/countAll?serverVersion=0&is_jurisdiction=false&includeInactive=false',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer iLoveOov',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://mg-eusm-staging.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer iLoveOov',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://mg-eusm-staging.smartregister.org/opensrp/rest/location/getAll?serverVersion=0&is_jurisdiction=false&includeInactive=false&limit=3',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer iLoveOov',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://mg-eusm-staging.smartregister.org/opensrp/rest/location/hierarchy/03176924-6b3c-4b74-bccd-32afcceebabd?return_structure_count=false',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer iLoveOov',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
];
