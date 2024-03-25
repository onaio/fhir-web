import { ValueSetContains } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetContains';
import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import { DefaultOptionType } from 'antd/lib/select';
import { Dictionary } from '@onaio/utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { FHIRServiceClass, IdentifierUseCodes, SelectOption } from '@opensrp/react-utils';
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

const codeSystem = 'http://smartregister.org/codes';
const unicefCharacteristicCode = '98734231';
const donorCharacteristicCode = '45981276';
const quantityCharacteristicCode = '33467722';
const supplyInventoryCode = '78991122';
const poNumberDisplay = 'PO Number';
const poNumberCode = 'PONUM';
const serialNumberDisplay = 'Serial Number';
const serialNumberCode = 'SERNUM';

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
 * get select options value
 *
 * @param record - valuesets
 * @returns returns select option value stringfied
 */
const getValueSetOptionsValue = (record: ValueSetContains) => {
  return JSON.stringify({
    code: record.code,
    display: record.display,
    system: record.system,
  });
};

/**
 * get options from valueset data
 *
 * @param data - valueset data
 * @returns returns select options
 */
export function getValuesetSelectOptions<TData extends IValueSet>(data: TData) {
  const valuesetsByCode: Dictionary<ValueSetContains> = {};
  data.compose?.include.forEach((item) => {
    item.concept?.forEach((record) => {
      const code = record.code as string;
      valuesetsByCode[code] = { ...record, system: item.system };
    });
  });
  data.expansion?.contains?.forEach((item) => {
    const code = item.code as string;
    valuesetsByCode[code] = { ...item };
  });
  const valuesets = Object.values(valuesetsByCode);
  const options: DefaultOptionType[] = valuesets.map((record) => ({
    value: getValueSetOptionsValue(record),
    label: record.display,
  }));
  return options;
}

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
 */
export async function createListResource(baseUrl: string, listId: string, entries?: ListEntry[]) {
  const serve = new FHIRServiceClass<IList>(baseUrl, listResourceType);
  const listResource = createSupplyManagementList(listId, entries);
  return serve.update(listResource);
}

/**
 * save location resource and it's list resources
 *
 * @param baseUrl - api base url
 * @param payload - location inventory payload
 * @param editMode - editing data?
 * @param listResourceId - env location list resource uuid
 */
export async function postLocationInventory(
  baseUrl: string,
  payload: IGroup,
  editMode: boolean,
  listResourceId: string
) {
  const groupResource = await postPutGroup(baseUrl, payload);
  if (!editMode) {
    const groupResourceId = groupResource.id as string;
    const listId = v4();
    const entries = [{ item: { reference: `${groupResourceType}/${groupResourceId}` } }];
    await createListResource(baseUrl, listId, entries);
    if (listResourceId) {
      const combinedListResource = updateListReferencesFactory(baseUrl, listResourceId);
      await combinedListResource(groupResourceId, listId, editMode);
    }
  }
  return groupResource;
}

/**
 * @param baseUrl - the api base url
 * @param listId - list resource id to add the group to
 */
export const updateListReferencesFactory =
  (baseUrl: string, listId: string) =>
  async (groupResourceId: string, listResourceId: string, editingGroup: boolean) => {
    const commoditiesListResource = await getOrCreateList(baseUrl, listId);
    const payload = cloneDeep(commoditiesListResource);

    const existingEntries = payload.entry ?? [];
    if (!editingGroup) {
      existingEntries.push(
        { item: { reference: `${groupResourceType}/${groupResourceId}` } },
        { item: { reference: `${listResourceType}/${listResourceId}` } }
      );
    }
    if (existingEntries.length) {
      payload.entry = existingEntries;
    }

    const serve = new FHIRServiceClass<IList>(baseUrl, listResourceType);
    return serve.update(payload);
  };

/**
 * Creates a very specific list resource that will curate a set of commodities to be used on the client.
 * This is so that the list resource can then be used when configuring the fhir mobile client
 *
 * @param id - externally defined id that will be the id of the new list resource
 * @param entries - list of resource entries
 */
export function createSupplyManagementList(id: string, entries?: ListEntry[]): IList {
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
    mode: 'working',
    title: 'Supply Chain commodities',
    code: {
      coding: [
        {
          system: 'https://ona.io',
          code: 'supply-chain',
          display: 'Supply Chain Commodity',
        },
      ],
      text: 'Supply Chain Commodity',
    },
    entry: entries || [],
  };
}

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
        initialValues.unicefSection = getValueSetOptionsValue(coding);
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
 */
export const validationRulesFactory = (t: TFunction) => {
  return {
    [product]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [unicefSection]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [deliveryDate]: [
      { type: 'date', message: t('Must be a valid date') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [accountabilityEndDate]: [
      { type: 'date', message: t('Must be a valid date') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [serialNumber]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [PONumber]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('Required') },
    ] as Rule[],
  };
};
