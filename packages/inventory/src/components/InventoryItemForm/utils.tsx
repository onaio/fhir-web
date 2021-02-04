import {
  C4D,
  CHILD_PROTECTION,
  DRR,
  EDUCATION,
  HEALTH,
  NUTRITION,
  SOCIAL_POLICY,
  WASH,
} from '../../lang';

/** enum representing the possible UNICEF sections */
export enum UNICEFSection {
  HEALTH = 'Health',
  WASH = 'Wash',
  NUTRITION = 'Nutrition',
  EDUCATION = 'Education',
  CHILD_PROTECTION = 'Child Protection',
  SOCIAL_POLICY = 'Social Policy',
  C4D = 'C4D',
  DRR = 'DRR',
}

/**
 * UNICEF section select field options
 */
export const getUnicefSectionOptions = () => [
  {
    value: UNICEFSection.HEALTH,
    name: HEALTH,
  },
  {
    value: UNICEFSection.WASH,
    name: WASH,
  },
  {
    value: UNICEFSection.NUTRITION,
    name: NUTRITION,
  },
  {
    value: UNICEFSection.EDUCATION,
    name: EDUCATION,
  },
  {
    value: UNICEFSection.CHILD_PROTECTION,
    name: CHILD_PROTECTION,
  },
  {
    value: UNICEFSection.SOCIAL_POLICY,
    name: SOCIAL_POLICY,
  },
  {
    value: UNICEFSection.C4D,
    name: C4D,
  },
  {
    value: UNICEFSection.DRR,
    name: DRR,
  },
];
