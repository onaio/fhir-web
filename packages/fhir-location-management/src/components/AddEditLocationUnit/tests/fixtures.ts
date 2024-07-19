export const servicePointTypeValueSet = {
  resourceType: 'ValueSet',
  id: 'eusm-service-point-type',
  meta: {
    extension: [
      {
        url: 'http://hapifhir.io/fhir/StructureDefinition/valueset-expansion-message',
        valueString:
          'ValueSet was expanded using an expansion that was pre-calculated at 2024-03-27T11:11:34.863+00:00 (12 days ago)',
      },
    ],
    versionId: '2',
  },
  url: 'http://smartregister.org/ValueSet/eusm-service-point-type',
  status: 'active',
  compose: {
    include: [
      {
        system: 'http://smartregister.org/CodeSystem/eusm-service-point-type',
        concept: [
          {
            code: 'csb2',
            display: 'CSB2',
          },
          {
            code: 'bsd',
            display: 'BSD',
          },
          {
            code: 'chrd1',
            display: 'CHRD1',
          },
          {
            code: 'chrd2',
            display: 'CHRD2',
          },
          {
            code: 'chrr',
            display: 'CHRR',
          },
          {
            code: 'sdsp',
            display: 'SDSP',
          },
          {
            code: 'drsp',
            display: 'DRSP',
          },
          {
            code: 'msp',
            display: 'MSP',
          },
          {
            code: 'epp',
            display: 'EPP',
          },
          {
            code: 'ceg',
            display: 'CEG',
          },
          {
            code: 'warehouse',
            display: 'Warehouse',
          },
          {
            code: 'water point',
            display: 'Water Point',
          },
          {
            code: 'presco',
            display: 'Presco',
          },
          {
            code: 'meah',
            display: 'MEAH',
          },
          {
            code: 'dreah',
            display: 'DREAH',
          },
          {
            code: 'men',
            display: 'MEN',
          },
          {
            code: 'dren',
            display: 'DREN',
          },
          {
            code: 'mppspf',
            display: 'MPPSPF',
          },
          {
            code: 'drppspf',
            display: 'DRPPSPF',
          },
          {
            code: 'ngo partner',
            display: 'NGO Partner',
          },
          {
            code: 'site communautaire',
            display: 'Site Communautaire',
          },
          {
            code: 'drjs',
            display: 'DRJS',
          },
          {
            code: 'instat',
            display: 'INSTAT',
          },
          {
            code: 'mairie',
            display: 'Mairie',
          },
          {
            code: 'ecole privé',
            display: 'Ecole privé',
          },
          {
            code: 'ecole communautaire',
            display: 'Ecole communautaire',
          },
          {
            code: 'lycée',
            display: 'Lycée',
          },
          {
            code: 'chu',
            display: 'CHU',
          },
          {
            code: 'district ppspf',
            display: 'District PPSPF',
          },
        ],
      },
    ],
  },
  expansion: {
    identifier: '2b1c25ac-901c-4e2c-8d79-5a6e75f5010a',
    timestamp: '2024-04-08T13:01:17+00:00',
    total: 0,
    offset: 0,
    parameter: [
      {
        name: 'offset',
        valueInteger: 0,
      },
      {
        name: 'count',
        valueInteger: 1000,
      },
    ],
  },
};

export const createdLoc = {
  resourceType: 'Location',
  status: 'active',
  name: 'area51',
  partOf: { reference: 'Location/303', display: 'Ona Office Sub Location' },
  type: [
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'bu',
          display: 'Building',
        },
      ],
    },
    {
      coding: [
        {
          code: 'warehouse',
          display: 'Warehouse',
          system: 'http://smartregister.org/CodeSystem/eusm-service-point-type',
        },
      ],
    },
  ],
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'bu',
        display: 'Building',
      },
    ],
  },
  id: '13cafa46-7251-429a-8d19-8da0583c0c5a',
};

export const editedLoc = {
  resourceType: 'Location',
  status: 'active',
  name: 'River road',
  partOf: { reference: 'Location/303', display: 'Ona Office Sub Location' },
  id: '13cafa46-7251-429a-8d19-8da0583c0c5a',
  type: [
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'bu',
          display: 'Building',
        },
      ],
    },
    {
      coding: [
        {
          code: 'ceg',
          display: 'CEG',
          system: 'http://smartregister.org/CodeSystem/eusm-service-point-type',
        },
      ],
    },
  ],
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'bu',
        display: 'Building',
      },
    ],
  },
};
