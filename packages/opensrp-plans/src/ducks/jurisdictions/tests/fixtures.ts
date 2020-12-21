import { Jurisdiction } from '..';

export const jurisdiction1 = {
  type: 'Feature',
  id: '03176924-6b3c-4b74-bccd-32afcceebabd',
  properties: { status: 'Active', name: 'Madagascar', geographicLevel: 0, version: 0 },
  serverVersion: 2968,
  locationTags: [{ id: 1, name: 'Country' }],
};

export const jurisdiction2 = {
  type: 'Feature',
  id: 'bb30770a-d039-4bfa-9c02-a32d0f32af42',
  properties: {
    status: 'Active',
    parentId: '03176924-6b3c-4b74-bccd-32afcceebabd',
    name: 'ANALANJIROFO',
    geographicLevel: 0,
    version: 0,
  },
  serverVersion: 2969,
  locationTags: [{ id: 2, name: 'Region' }],
};

export const jurisdiction3 = {
  type: 'Feature',
  id: 'ef3db216-0816-4cef-b108-706c17c2b40a',
  properties: {
    status: 'Active',
    parentId: '03176924-6b3c-4b74-bccd-32afcceebabd',
    name: 'ATSIMO ATSINANANA',
    geographicLevel: 0,
    version: 0,
  },
  serverVersion: 2970,
  locationTags: [{ id: 2, name: 'Region' }],
};

export const jurisdictions = [jurisdiction1, jurisdiction2, jurisdiction3] as Jurisdiction[];
