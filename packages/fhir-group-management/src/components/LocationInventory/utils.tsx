import { ValueSetContains } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetContains';
import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import { DefaultOptionType } from 'antd/lib/select';
import { Dictionary } from '@onaio/utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { FHIRServiceClass, IdentifierUseCodes, getResourcesFromBundle } from '@opensrp/react-utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
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
import type { TFunction } from '@opensrp/i18n';
import { Rule } from 'rc-field-form/lib/interface';

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
 * get options from products bundle data
 *
 * @param data - products bundle data
 * @returns returns select options
 */
export const projectOptions = (data: IBundle) => {
  const productsList = getResourcesFromBundle<IGroup>(data);
  const options: DefaultOptionType[] = productsList.map((prod: IGroup) => ({
    value: prod.id,
    label: prod.name,
  }));
  return options;
};

/**
 * get member data for group resource
 *
 * @param productId - selected products id
 * @param startDate - selected start date
 * @param endDate - selected end date
 * @returns returns group member
 */
const getMember = (productId: string, startDate: Date, endDate: Date): GroupMember[] => {
  return [
    {
      entity: {
        reference: `Group/${productId}`,
      },
      period: {
        start: startDate,
        end: endDate,
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
 * @returns returns characteristivs
 */
const generateCharacteristics = (unicefSection: ValueSetConcept, donor: ValueSetConcept) => {
  return [
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
        coding: [unicefSection],
        text: unicefSection.display,
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
        coding: [donor],
        text: donor.display,
      },
    },
  ];
};

/**
 * get payload data for group resource
 *
 * @param values - form values
 * @returns returns group resource payload
 */
export const getLocationInventoryPayload = (values: GroupFormFields): IGroup => {
  const donor = JSON.parse(values.donor);
  const unicefSection = JSON.parse(values.unicefSection);
  const payload: IGroup = {
    resourceType: groupResourceType,
    id: values.id || v4(),
    member: getMember(values.product, values.deliveryDate, values.accountabilityEndDate),
    characteristic: generateCharacteristics(unicefSection, donor),
  };
  if (values.active) payload.active = values.active;
  if (values.actual) payload.actual = values.actual;
  if (values.type) payload.type = values.type;
  if (values.identifier) payload.identifier = JSON.parse(values.identifier);
  if (values.name) payload.name = values.name;
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
      const listResource = createSupplyManagementList(listId);
      return serve.update(listResource);
    }
    throw err;
  });
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
 */
export function createSupplyManagementList(id: string): IList {
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
    entry: [],
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
      { type: 'number', message: t('Must be a valid number') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [PONumber]: [
      { type: 'integer', message: t('Must be a valid number') },
      { required: true, message: t('Required') },
    ] as Rule[],
  };
};
