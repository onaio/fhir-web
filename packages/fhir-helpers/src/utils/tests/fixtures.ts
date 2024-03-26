export const characteristics = [
  {
    code: {
      coding: [
        {
          system: 'http://smartregister.org/',
          code: '98734231',
          display: 'Unicef Section',
        },
      ],
    },
    valueCodeableConcept: {
      coding: [
        {
          system: 'http://smartregister.org/CodeSystem/eusm-unicef-sections',
          code: 'Health',
          display: 'Health',
        },
      ],
      text: 'Health',
    },
  },
  {
    code: {
      coding: [
        {
          system: 'http://smartregister.org/',
          code: '45647484',
          display: 'Donor',
        },
      ],
    },
    valueCodeableConcept: {
      coding: [
        {
          system: 'http://smartregister.org/CodeSystem/eusm-donors',
          code: 'GAVI',
          display: 'GAVI',
        },
      ],
      text: 'GAVI',
    },
  },
];
