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
import { Dayjs } from 'dayjs';
import { TFunction } from '@opensrp/i18n';
import { Rule } from 'rc-field-form/lib/interface';
import { attractiveCharacteristicCode } from '../../helpers/utils';
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
    value: JSON.stringify({ code: record.code, display: record.display, system: record.system }),
    label: record.display,
  }));
  return options;
}

/**
 * get single product option
 *
 * @param project - product data
 * @returns returns single select option
 */
export const processProjectOptions = (project: IGroup) => {
  const attractive = project.characteristic?.some(
    (char) => char.code.coding?.[0]?.code === attractiveCharacteristicCode
  );
  return {
    value: JSON.stringify({ id: project.id, attractive }),
    label: project.name,
    ref: project,
  } as SelectOption<IGroup>;
};

/**
 * get member data for group resource
 *
 * @param productId - selected products id
 * @param startDate - selected start date
 * @param endDate - selected end date
 * @returns returns group member
 */
const getMember = (productId: string, startDate: Date, endDate: Date, expiryDate?: Date): GroupMember[] => {
  const startDateToString = new Date(startDate).toISOString();
  const endDateToString = new Date(endDate).toISOString();
  const expiryDateToString = expiryDate? new Date(expiryDate).toISOString : '';
  return [
    {
      entity: {
        reference: `Group/${productId}`,
      },
      period: {
        start: startDateToString as any,
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
 * @returns returns characteristivs
 */
const generateCharacteristics = (
  unicefSection: ValueSetConcept,
  donor?: ValueSetConcept,
  quantity?: number
): GroupCharacteristic[] => {
  const characteristics: GroupCharacteristic[] = [
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
 * @returns returns group identifier
 */
const generateIdentifier = (poId: string, serialId: string): Identifier[] => {
  return [
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
    {
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
    }
  ];
};

/**
 * get payload data for group resource
 *
 * @param values - form values
 * @returns returns group resource payload
 */
export const getLocationInventoryPayload = (values: GroupFormFields, editMode:boolean): IGroup => {
  const donor = values.donor ? JSON.parse(values.donor) : values.donor;
  const unicefSection = JSON.parse(values.unicefSection);
  const product = JSON.parse(values.product);
  const payload: IGroup = {
    resourceType: groupResourceType,
    id: values.id || v4(),
    active: true,
    actual: false,
    type: 'substance',
    identifier: generateIdentifier(values.poNumber, values.serialNumber),
    member: getMember(product.id, values.deliveryDate, values.accountabilityEndDate),
    characteristic: generateCharacteristics(unicefSection, donor),
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
  if(editMode) {
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
      return createList(baseUrl, listId);
    }
    throw err;
  });
}

/**
 * Gets list resource for given id, create it if it does not exist
 *
 * @param baseUrl - api base url
 * @param listId - list id
 */
export async function createList(baseUrl: string, listId: string) {
  const serve = new FHIRServiceClass<IList>(baseUrl, listResourceType);
  const listResource = createSupplyManagementList(listId);
  return serve.update(listResource);
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
 * @param entries
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
          system: 'http://ona.io',
          code: 'supply-chain',
          display: 'Supply Chain Commodity',
        },
      ],
      text: 'Supply Chain Commodity',
    },
    entry: entries || [],
  };
}

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
