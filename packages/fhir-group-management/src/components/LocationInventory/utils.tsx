import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import {
  FHIRServiceClass,
  IdentifierUseCodes,
  SelectOption,
  getResourcesFromBundle,
} from '@opensrp/react-utils';
import { ValueSetConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetConcept';
import {
  PONumber,
  accountabilityEndDate,
  deliveryDate,
  groupResourceType,
  listResourceType,
  product,
  serialNumber,
  unicefSection,
} from '../../constants';
import { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import { cloneDeep } from 'lodash';
import { GroupFormFields } from './types';
import { GroupMember } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/groupMember';
import { v4 } from 'uuid';
import dayjs, { Dayjs } from 'dayjs';
import { TFunction } from '@opensrp/i18n';
import { Rule } from 'rc-field-form/lib/interface';
import {
  attractiveCharacteristicCode,
  accountabilityCharacteristicCode,
} from '../../helpers/utils';
import { GroupCharacteristic } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/groupCharacteristic';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { ListEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/listEntry';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { getValueSetOptionsValue } from '@opensrp/react-utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import {
  servicePointProfileInventoryListCoding,
  smartregisterSystemUri,
} from '@opensrp/fhir-helpers';

const codeSystem = 'http://smartregister.org/codes';
const unicefCharacteristicCode = '98734231';
const donorCharacteristicCode = '45981276';
const quantityCharacteristicCode = '33467722';
const supplyInventoryCode = '78991122';
const poNumberDisplay = 'PO Number';
const poNumberCode = 'PONUM';
const serialNumberDisplay = 'Serial Number';
const serialNumberCode = 'SERNUM';
const listSupplyInventoryCode = '22138876';

/**
 * Check if date in past
 *
 * @param current - given date
 * @returns returns if date in past
 */
export const handleDisabledPastDates = (current?: Dayjs) => {
  if (!current) return false;
  const today = new Date();
  return current.valueOf() < today.valueOf();
};

/**
 * check if date in future
 *
 * @param current - given date
 * @returns returns if date in future
 */
export const handleDisabledFutureDates = (current?: Dayjs) => {
  if (!current) return false;
  const today = new Date();
  return current.valueOf() >= today.valueOf();
};

/**
 * check if product is an atrractive item
 *
 * @param product - product data
 */
export const isAttractiveProduct = (product?: IGroup) => {
  if (!product) {
    return false;
  }
  const isAttractive = product.characteristic?.some(
    (char) => char.code.coding?.[0]?.code === attractiveCharacteristicCode
  );
  return isAttractive as boolean;
};

/**
 * check if product is an accounterbility period
 *
 * @param product - product data
 */
export const productAccountabilityMonths = (product?: IGroup) => {
  if (!product) {
    return undefined;
  }
  const characteristic = product.characteristic?.filter(
    (char) => char.code.coding?.[0]?.code === accountabilityCharacteristicCode
  );
  return characteristic?.[0]?.valueQuantity?.value;
};

/**
 * get single product option
 *
 * @param product - product data
 * @returns returns single select option
 */
export const processProductOptions = (product: IGroup) => {
  return {
    value: product.id,
    label: product.name,
    ref: product,
  } as SelectOption<IGroup>;
};

/**
 * get member data for group resource
 *
 * @param productId - selected products id
 * @param startDate - selected start date
 * @param endDate - selected end date
 * @param expiryDate - selected expiry date
 * @returns returns group member
 */
export const getMember = (
  productId: string,
  startDate: Dayjs,
  endDate: Dayjs,
  expiryDate?: Dayjs
): GroupMember[] => {
  const startDateToString = new Date(startDate.toDate()).toISOString();
  const endDateToString = new Date(endDate.toDate()).toISOString();
  const expiryDateToString = expiryDate ? new Date(expiryDate.toDate()).toISOString : '';
  return [
    {
      entity: {
        reference: `Group/${productId}`,
      },
      period: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        start: startDateToString as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        end: (endDateToString || expiryDateToString) as any,
      },
      inactive: false,
    },
  ];
};

/**
 * get characteristic data for group resource
 *
 * @param unicefSection - selected unicef section
 * @param donor - selected donor
 * @param quantity - product quantity
 * @param listResourceObj - resource object available on edit
 * @returns returns characteristivs
 */
export const generateCharacteristics = (
  unicefSection: ValueSetConcept,
  donor?: ValueSetConcept,
  quantity?: number,
  listResourceObj?: IGroup
): GroupCharacteristic[] => {
  const knownCodes = [
    unicefCharacteristicCode,
    donorCharacteristicCode,
    quantityCharacteristicCode,
  ];
  const unknownCharacteristics =
    listResourceObj?.characteristic?.filter((char) => {
      const code = char.code.coding?.[0].code;
      return !(code && knownCodes.includes(code));
    }) || [];
  const characteristics: GroupCharacteristic[] = [
    ...unknownCharacteristics,
    {
      code: {
        coding: [
          {
            system: codeSystem,
            code: unicefCharacteristicCode,
            display: 'Unicef Section',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [unicefSection],
        text: unicefSection.display,
      },
    },
  ];
  if (donor) {
    characteristics.push({
      code: {
        coding: [
          {
            system: codeSystem,
            code: donorCharacteristicCode,
            display: 'Donor',
          },
        ],
      },
      valueCodeableConcept: {
        coding: [donor],
        text: donor.display,
      },
    });
  }
  if (quantity) {
    characteristics.push({
      code: {
        coding: [
          {
            system: codeSystem,
            code: quantityCharacteristicCode,
            display: 'Quantity ',
          },
        ],
      },
      valueQuantity: { value: quantity },
    });
  }
  return characteristics;
};

/**
 * get identifier data for group resource
 *
 * @param poId - Po number
 * @param serialId - serial number
 * @param listResourceObj - resource object available on edit
 * @returns returns group identifier
 */
export const generateIdentifier = (
  poId: string,
  serialId?: string,
  listResourceObj?: IGroup
): Identifier[] => {
  const knownCodes = [poNumberCode, serialNumberCode];
  const unknownIdentifiers =
    listResourceObj?.identifier?.filter((identifier) => {
      const code = identifier.type?.coding?.[0].code;
      return !(code && knownCodes.includes(code));
    }) || [];
  const identifiers = [
    {
      use: IdentifierUseCodes.SECONDARY,
      type: {
        coding: [
          {
            system: codeSystem,
            code: poNumberCode,
            display: poNumberDisplay,
          },
        ],
        text: poNumberDisplay,
      },
      value: poId,
    },
    ...unknownIdentifiers,
  ];
  if (serialId) {
    identifiers.push({
      use: IdentifierUseCodes.OFFICIAL,
      type: {
        coding: [
          {
            system: codeSystem,
            code: serialNumberCode,
            display: serialNumberDisplay,
          },
        ],
        text: serialNumberDisplay,
      },
      value: serialId,
    });
  }
  return identifiers;
};

/**
 * get payload data for group resource
 *
 * @param values - form values
 * @param editMode - editing form?
 * @param listResourceObj - resource object available on edit
 * @returns returns group resource payload
 */
export const getLocationInventoryPayload = (
  values: GroupFormFields,
  editMode: boolean,
  listResourceObj?: IGroup
): IGroup => {
  const donor = values.donor ? JSON.parse(values.donor) : values.donor;
  const unicefSection = values.unicefSection ? JSON.parse(values.unicefSection) : {};
  const payload: IGroup = {
    resourceType: groupResourceType,
    id: values.id || v4(),
    active: true,
    actual: false,
    type: 'substance',
    identifier: generateIdentifier(values.poNumber, values.serialNumber, listResourceObj),
    member: getMember(values.product, values.deliveryDate, values.accountabilityEndDate),
    characteristic: generateCharacteristics(unicefSection, donor, values.quantity, listResourceObj),
    code: {
      coding: [
        {
          system: codeSystem,
          code: supplyInventoryCode,
          display: 'Supply Inventory',
        },
      ],
    },
  };
  if (editMode) {
    if (values.active) payload.active = values.active;
    if (values.actual) payload.actual = values.actual;
    if (values.type) payload.type = values.type;
    if (values.name) payload.name = values.name;
  }
  return payload;
};

/**
 * either posts or puts a location inventory group resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - location inventory payload
 */
export const postPutGroup = (baseUrl: string, payload: IGroup) => {
  const serve = new FHIRServiceClass<IGroup>(baseUrl, groupResourceType);
  return serve.update(payload);
};

/**
 * Gets list resource for given id, create it if it does not exist
 *
 * @param baseUrl - api base url
 * @param listId - list id
 */
export async function getOrCreateList(baseUrl: string, listId: string) {
  const serve = new FHIRServiceClass<IList>(baseUrl, listResourceType);
  return serve.read(listId).catch((err) => {
    if (err.statusCode === 404) {
      return createListResource(baseUrl, listId);
    }
    throw err;
  });
}

/**
 * Gets list resource for given id, create it if it does not exist
 *
 * @param baseUrl - api base url
 * @param listId - list id
 * @param entries - resource entries
 * @param listResource - a list resource
 */
export async function createListResource(
  baseUrl: string,
  listId: string,
  entries?: ListEntry[],
  listResource?: IList
) {
  const serve = new FHIRServiceClass<IList>(baseUrl, listResourceType);
  const listResourceToUse = listResource || createLocationServicePointList(listId, entries);
  return serve.update(listResourceToUse);
}

/**
 * save location resource and it's list resources
 *
 * @param baseUrl - api base url
 * @param payload - location inventory payload
 * @param editMode - editing data?
 * @param listResourceId - env location list resource uuid
 * @param servicePointObj - inventory service point object
 */
export async function postLocationInventory(
  baseUrl: string,
  payload: IGroup,
  editMode: boolean,
  listResourceId: string,
  servicePointObj: ILocation
) {
  // create group resource for inventory
  const groupResource = await postPutGroup(baseUrl, payload);
  if (!editMode) {
    const groupResourceId = groupResource.id as string;
    const listId = v4();
    // create group resource that links products to to a location.
    const locationInventoryListBundle = await new FHIRServiceClass<IBundle>(
      baseUrl,
      listResourceType
    ).list({
      subject: servicePointObj.id,
      code: `${smartregisterSystemUri}|${servicePointProfileInventoryListCoding.code}`,
    });
    let locationInventoryList = getResourcesFromBundle<IList>(locationInventoryListBundle)[0] as
      | IList
      | undefined;
    locationInventoryList = createUpdateLocationInventoryList(
      listId,
      groupResourceId,
      servicePointObj,
      locationInventoryList
    );
    await createListResource(baseUrl, listId, undefined, locationInventoryList);

    if (listResourceId) {
      const combinedListResource = updateListReferencesFactory(baseUrl, listResourceId);
      await combinedListResource(groupResourceId, locationInventoryList.id as string, editMode);
    }
  }
  return groupResource;
}

/**
 * Updates the global list that holds a reference to all other inventory groups
 * as well as the product groups assigned in the inventory groups.
 *
 * @param baseUrl - the api base url
 * @param globalInventoryListId - list resource id to add the group to
 */
export const updateListReferencesFactory =
  (baseUrl: string, globalInventoryListId: string) =>
  async (groupResourceId: string, locationInventoryListId: string, editingGroup: boolean) => {
    const commoditiesListResource = await getOrCreateList(baseUrl, globalInventoryListId);
    const payload = cloneDeep(commoditiesListResource);

    let existingEntries = payload.entry ?? [];
    // Issue: the list resource does not need to be added
    if (!editingGroup) {
      existingEntries.push(
        { item: { reference: `${groupResourceType}/${groupResourceId}` } },
        { item: { reference: `${listResourceType}/${locationInventoryListId}` } }
      );
    }
    existingEntries = Array.from(
      new Map(existingEntries.map((entry) => [entry.item.reference, entry])).values()
    );
    if (existingEntries.length) {
      payload.entry = existingEntries;
    }

    const serve = new FHIRServiceClass<IList>(baseUrl, listResourceType);
    return serve.update(payload);
  };

/**
 * Creates an object of list resource keys
 *
 * @param id - externally defined id that will be the id of the new list resource
 */
function createCommonListResource(id: string): IList {
  return {
    resourceType: listResourceType,
    id: id,
    identifier: [
      {
        use: IdentifierUseCodes.OFFICIAL,
        value: id,
      },
    ],
    status: 'current',
    code: {
      coding: [
        {
          system: codeSystem,
          code: listSupplyInventoryCode,
          display: 'Supply Inventory List',
        },
      ],
      text: 'Supply Inventory List',
    },
  };
}

/**
 * Creates a location inventory and service point list resource that will curate a set of commodities to be used on the client.
 * This is so that the list resource can then be used when configuring the fhir mobile client
 *
 * @param id - externally defined id that will be the id of the new list resource
 * @param entries - list of resource entries
 */
export function createLocationServicePointList(id: string, entries?: ListEntry[]): IList {
  const commonResources = createCommonListResource(id);
  return {
    ...commonResources,
    mode: 'working',
    title: 'Supply Chain commodities',
    entry: entries || [],
  };
}

/**
 * Creates a group resource that links a location to a series of products(group resources)
 * We create one such group for each location that has inventory regardless
 * of how many product groups are assigned to the location.
 *
 * @param id - externally defined id that will be the id of the new list resource
 * @param InventoryResourceId - location inventory id
 * @param servicePoint - service point object
 * @param currentLocationInventory - inventory for this location as subject if on exists
 */
export function createUpdateLocationInventoryList(
  id: string,
  InventoryResourceId: string,
  servicePoint: ILocation,
  currentLocationInventory?: IGroup
): IList {
  const existingLocationInventory = currentLocationInventory ?? {};
  const commonResources = createCommonListResource(id);
  const { name, id: servicePointId } = servicePoint;
  const now = new Date();
  const stringDate = now.toISOString();
  const newEntry: ListEntry = {
    flag: {
      coding: [
        {
          system: codeSystem,
          code: listSupplyInventoryCode,
          display: 'Supply Inventory List',
        },
      ],
      text: 'Supply Inventory List',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    date: stringDate as any,
    item: { reference: `${groupResourceType}/${InventoryResourceId}` },
  };
  const listPayload: IList = {
    ...commonResources,
    entry: [],
    title: name,
    subject: { reference: `Location/${servicePointId}` },
    ...existingLocationInventory,
  };
  listPayload.entry?.push(newEntry);
  return listPayload;
}

/**
 * generates form initial values
 *
 * @param inventory - location inventory group resource
 */
export const getInventoryInitialValues = (inventory: IGroup): GroupFormFields => {
  const initialValues = {
    id: inventory.id as string,
    active: inventory.active,
    type: inventory.type,
    actual: inventory.actual,
    name: inventory.name,
  } as GroupFormFields;
  inventory.identifier?.forEach((identifier) => {
    const code = identifier.type?.coding?.[0].code;
    if (code === poNumberCode) {
      initialValues.poNumber = identifier.value as string;
    }
    if (code === serialNumberCode) {
      initialValues.serialNumber = identifier.value as string;
    }
  });
  inventory.characteristic?.forEach((characteristic) => {
    const code = characteristic.code.coding?.[0].code;
    if (code === unicefCharacteristicCode) {
      const coding = characteristic.valueCodeableConcept?.coding?.[0];
      if (coding) {
        initialValues.unicefSection = getValueSetOptionsValue(coding) as string;
      }
    }
    if (code === donorCharacteristicCode) {
      const coding = characteristic.valueCodeableConcept?.coding?.[0];
      if (coding) {
        initialValues.donor = getValueSetOptionsValue(coding);
      }
    }
    if (code === quantityCharacteristicCode) {
      initialValues.quantity = characteristic.valueQuantity?.value;
    }
  });
  const member = inventory.member?.[0];
  const reference = member?.entity.reference;
  const { start, end } = member?.period || {};
  if (end) {
    initialValues.accountabilityEndDate = dayjs(end);
  }
  if (start) {
    initialValues.deliveryDate = dayjs(start);
  }
  if (reference) {
    const productId = reference.split('/')[1];
    initialValues.product = productId;
  }
  return initialValues;
};

/**
 * factory for validation rules for GroupForm component
 *
 * @param t - the translator function
 * @param isAttractiveProduct - tells us if serial number should be required
 */
export const validationRulesFactory = (t: TFunction, isAttractiveProduct: boolean) => {
  const rules = {
    [product]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('Product is required') },
    ] as Rule[],
    [unicefSection]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('UNICEF section is required') },
    ] as Rule[],
    [deliveryDate]: [
      { type: 'date', message: t('Must be a valid date') },
      { required: true, message: t('Delivery date is required') },
    ] as Rule[],
    [accountabilityEndDate]: [
      { type: 'date', message: t('Must be a valid date') },
      { required: true, message: t('Accountability end date is required') },
    ] as Rule[],
    [serialNumber]: [{ type: 'string', message: t('Must be a valid string') }] as Rule[],
    [PONumber]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('PO number is required') },
    ] as Rule[],
  };
  if (isAttractiveProduct) {
    rules[serialNumber].push({ required: true, message: t('Serial number is required') });
  }
  return rules;
};
