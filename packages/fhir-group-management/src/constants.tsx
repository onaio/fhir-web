// url
export const ADD_EDIT_GROUP_URL = '/group/add-edit';
export const ADD_EDIT_COMMODITY_URL = '/commodity/add-edit';
export const LIST_GROUP_URL = '/groups/list';
export const LIST_COMMODITY_URL = '/commodity/list';
export const ADD_LOCATION_INVENTORY = '/location/inventory';

// unicef and donor endpoints
export const UNICEF_SECTION_ENDPOINT = '2826/$expand';
export const DONOR_SECTION_ENDPOINT = '2826/$expand';

// magic strings
export const groupResourceType = 'Group';
export const listResourceType = 'List';
export const binaryResourceType = 'Binary';
export const valuesetResourceType = 'ValueSet';

// product form constants
export const id = 'id' as const;
export const identifier = 'identifier' as const;
export const name = 'name' as const;
export const active = 'active' as const;
export const type = 'type' as const;
export const unitOfMeasure = 'unitOfMeasure' as const;
export const materialNumber = 'materialNumber' as const;
export const isAttractiveItem = 'isAttractiveItem' as const;
export const availability = 'availability' as const;
export const condition = 'condition' as const;
export const appropriateUsage = 'appropriateUsage' as const;
export const accountabilityPeriod = 'accountabilityPeriod' as const;
export const productImage = 'productImage' as const;

// location inventory form constants
export const productName = 'product_name' as const;
export const quantity = 'quantity' as const;
export const deliveryDate = 'delivery_date' as const;
export const accountabilityEndDate = 'accountability_end_date' as const;
export const expiryDate = 'expiry_date' as const;
export const unicefSection = 'unicef_section' as const;
export const serialNumber = 'serial_number' as const;
export const donor = 'donor' as const;
export const PONumber = 'po_number' as const;
