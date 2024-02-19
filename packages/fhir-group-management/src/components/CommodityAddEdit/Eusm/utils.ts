import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import { Rule } from 'rc-field-form/lib/interface';
import { v4 } from 'uuid';
import { getObjLike, IdentifierUseCodes, FHIRServiceClass } from '@opensrp/react-utils';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { cloneDeep, get } from 'lodash';
import {
  active,
  groupResourceType,
  id,
  identifier,
  type,
  unitOfMeasure,
  name,
  listResourceType,
  accountabilityPeriod,
  appropriateUsage,
  condition,
  availability,
  isAttractiveItem,
  binaryResourceType,
  materialNumber,
} from '../../../constants';
import type { TFunction } from '@opensrp/i18n';
import {
  accountabilityCharacteristic,
  accountabilityCharacteristicCode,
  accountabilityCharacteristicCoding,
  appropriateUsageCharacteristic,
  appropriateUsageCharacteristicCode,
  appropriateUsageCharacteristicCoding,
  attractiveCharacteristic,
  attractiveCharacteristicCode,
  attractiveCharacteristicCoding,
  availabilityCharacteristic,
  availabilityCharacteristicCode,
  availabilityCharacteristicCoding,
  characteristicUnitMeasureCode,
  conditionCharacteristic,
  conditionCharacteristicCode,
  conditionCharacteristicCoding,
  getCharacteristicWithCoding,
  photoUploadCharacteristicCode,
  snomedCodeSystem,
  supplyMgSnomedCode,
  unitOfMeasureCharacteristicCoding,
  unitOfMeasureCharacteristic,
} from '../../../helpers/utils';
import { TypeOfGroup } from '../../ProductForm/utils';
import { GroupFormFields } from '../../ProductForm/types';
import { GroupCharacteristic } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/groupCharacteristic';
import { IBinary } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBinary';
import { UploadFile } from 'antd';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export type EusmGroupFormFields = GroupFormFields<{ group: IGroup; binary?: IBinary }>;

export const defaultCharacteristic = {
  code: {
    coding: [
      { system: snomedCodeSystem, code: characteristicUnitMeasureCode, display: 'Unit of measure' },
    ],
  },
  valueCodeableConcept: {
    coding: [{ system: snomedCodeSystem, code: '767525000', display: 'Unit' }],
    text: undefined,
  },
};

export const defaultCode = {
  coding: [{ system: snomedCodeSystem, code: supplyMgSnomedCode, display: 'Supply management' }],
};

/**
 * factory for validation rules for GroupForm component
 *
 * @param t - the translator function
 */
export const validationRulesFactory = (t: TFunction) => {
  return {
    [id]: [{ type: 'string' }] as Rule[],
    [identifier]: [{ type: 'string' }] as Rule[],
    [materialNumber]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [name]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [active]: [{ type: 'boolean' }, { required: true, message: t('Required') }] as Rule[],
    [type]: [{ type: 'enum', enum: Object.values(TypeOfGroup), required: true }] as Rule[],
    [isAttractiveItem]: [{ type: 'boolean' }] as Rule[],
    [availability]: [{ type: 'string' }, { required: true, message: t('Required') }] as Rule[],
    [condition]: [{ type: 'string' }] as Rule[],
    [appropriateUsage]: [{ type: 'string' }] as Rule[],
    [accountabilityPeriod]: [{ type: 'number' }] as Rule[],
  };
};

/**
 * @param characteristic - group characteristic
 */
function getValueFromCharacteristic(characteristic: GroupCharacteristic) {
  if (characteristic['valueCodeableConcept']) {
    return characteristic.valueCodeableConcept.text;
  }
  if (characteristic['valueBoolean']) {
    return characteristic.valueBoolean;
  }
  if (characteristic['valueQuantity']) {
    return characteristic.valueQuantity.value;
  }
  if (characteristic['valueReference']) {
    return characteristic.valueReference.reference;
  }
}

/**
 * Generates a group's characteristic payload
 *
 * @param existingCharacteristic - characteristic that exist for the group
 * @param values - form filled values.
 */
function generateCharacteristicPayload(
  existingCharacteristic: GroupCharacteristic[],
  values: EusmGroupFormFields
) {
  const knownCodes = [
    accountabilityCharacteristicCoding,
    appropriateUsageCharacteristicCoding,
    conditionCharacteristicCoding,
    availabilityCharacteristicCoding,
    attractiveCharacteristicCoding,
    unitOfMeasureCharacteristicCoding,
  ] as Coding[];
  const newCharacteristics = cloneDeep(existingCharacteristic);
  for (const coding of knownCodes) {
    updateCharacteristicForCode(newCharacteristics, coding, values);
  }
  return newCharacteristics;
}

/**
 * Updates the existing characteristics with the form field values.
 *
 * @param existingCharacteristics - array of existing characteristics to be mutably updated
 * @param codingCode - coding code of interest
 * @param values - form filled values
 */
function updateCharacteristicForCode(
  existingCharacteristics: GroupCharacteristic[],
  codingCode: Coding,
  values: EusmGroupFormFields
) {
  const checkCharacteristic = getCharacteristicWithCoding(existingCharacteristics, codingCode);

  switch (codingCode.code) {
    case characteristicUnitMeasureCode: {
      const { unitOfMeasure } = values;
      if (unitOfMeasure === undefined) {
        return;
      }
      if (checkCharacteristic) {
        (checkCharacteristic.valueCodeableConcept ?? {}).text = unitOfMeasure;
      } else
        existingCharacteristics.push({
          ...unitOfMeasureCharacteristic,
          valueCodeableConcept: {
            ...unitOfMeasureCharacteristic.valueCodeableConcept,
            text: unitOfMeasure,
          },
        });
      break;
    }
    case accountabilityCharacteristicCode: {
      const { accountabilityPeriod } = values;
      if (accountabilityPeriod === undefined) {
        return;
      }
      if (checkCharacteristic) {
        (checkCharacteristic.valueQuantity ?? {}).value = accountabilityPeriod;
      } else {
        existingCharacteristics.push({
          ...accountabilityCharacteristic,
          valueQuantity: {
            value: accountabilityPeriod,
          },
        });
      }
      break;
    }
    case appropriateUsageCharacteristicCode: {
      const { appropriateUsage } = values;
      if (appropriateUsage === undefined) {
        return;
      }
      if (checkCharacteristic) {
        (checkCharacteristic.valueCodeableConcept ?? {}).text = appropriateUsage;
      } else
        existingCharacteristics.push({
          ...appropriateUsageCharacteristic,
          valueCodeableConcept: {
            ...appropriateUsageCharacteristic.valueCodeableConcept,
            text: appropriateUsage,
          },
        });
      break;
    }
    case conditionCharacteristicCode: {
      const { condition } = values;
      if (condition === undefined) {
        return;
      }
      if (checkCharacteristic) {
        (checkCharacteristic.valueCodeableConcept ?? {}).text = condition;
      } else
        existingCharacteristics.push({
          ...conditionCharacteristic,
          valueCodeableConcept: {
            ...conditionCharacteristic.valueCodeableConcept,
            text: condition,
          },
        });
      break;
    }
    case availabilityCharacteristicCode: {
      const { availability } = values;
      if (availability === undefined) {
        return;
      }
      if (checkCharacteristic) {
        (checkCharacteristic.valueCodeableConcept ?? {}).text = availability;
      } else
        existingCharacteristics.push({
          ...availabilityCharacteristic,
          valueCodeableConcept: {
            ...availabilityCharacteristic.valueCodeableConcept,
            text: availability,
          },
        });
      break;
    }
    case attractiveCharacteristicCode: {
      const { isAttractiveItem } = values;
      if (isAttractiveItem === undefined) {
        return;
      }
      if (checkCharacteristic) {
        checkCharacteristic.valueBoolean = isAttractiveItem;
      } else
        existingCharacteristics.push({
          ...attractiveCharacteristic,
          valueBoolean: isAttractiveItem,
        });
      break;
    }
  }
}

/**
 * Converts a file object to a base 64 string
 *
 * @param file - file object
 */
function fileToBase64(file?: File): Promise<string | undefined> {
  if (!file) {
    return new Promise((r) => r(undefined));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

/**
 *  generates the binary payload for uploaded image
 *
 * @param values - current form field values
 * @param initialValues - initial form field values.
 */
export async function getProductImagePayload(
  values: EusmGroupFormFields,
  initialValues: EusmGroupFormFields
) {
  const initialImage = initialValues.productImage?.[0].originFileObj;
  const currentImage = values.productImage?.[0].originFileObj;
  // TODO - replace btoa with typed arrays.
  const currentImageb64 = await fileToBase64(currentImage);
  const initialImageb64 = await fileToBase64(initialImage);

  if (currentImageb64 === initialImageb64) {
    // This could mean it was not added or removed.
    return {
      changed: false,
    };
  } else if (currentImage === undefined) {
    return {
      changed: true,
    };
  } else {
    const id = v4();
    const payload: IBinary = {
      id,
      resourceType: binaryResourceType,
      contentType: currentImage.type,
      data: currentImageb64,
    };
    return {
      changed: true,
      payload,
    };
  }
}

/**
 * Converts group resource to initial values consumable by productForm
 *
 * @param obj - the group resource
 * @param binary - binary associated with the group
 */
export const getGroupFormFields = (obj?: IGroup, binary?: IBinary): EusmGroupFormFields => {
  if (!obj) {
    return { initialObject: { group: { code: defaultCode } }, active: true } as EusmGroupFormFields;
  }
  const { id, name, active, identifier, type } = obj;

  const identifierObj = getObjLike(identifier, 'use', IdentifierUseCodes.OFFICIAL) as Identifier[];

  const formFieldsFromCharacteristics: Record<string, unknown> = {};
  for (const characteristic of obj.characteristic ?? []) {
    const characteristicCoding = characteristic.code.coding ?? [];
    for (const coding of characteristicCoding) {
      // if we have a code hit in one of the codings.
      const codingSystem = coding.system?.toLowerCase();
      const codingCode = coding.code;
      if (codingSystem === snomedCodeSystem) {
        if (codingCode === characteristicUnitMeasureCode) {
          const val = getValueFromCharacteristic(characteristic);
          formFieldsFromCharacteristics[unitOfMeasure] = val;
        }
        if (codingCode === accountabilityCharacteristicCode) {
          const val = getValueFromCharacteristic(characteristic);
          formFieldsFromCharacteristics[accountabilityPeriod] = val;
        }
        if (codingCode === appropriateUsageCharacteristicCode) {
          const val = getValueFromCharacteristic(characteristic);
          formFieldsFromCharacteristics[appropriateUsage] = val;
        }
        if (codingCode === conditionCharacteristicCode) {
          const val = getValueFromCharacteristic(characteristic);
          formFieldsFromCharacteristics[condition] = val;
        }
        if (codingCode === availabilityCharacteristicCode) {
          const val = getValueFromCharacteristic(characteristic);
          formFieldsFromCharacteristics[availability] = val;
        }
        if (codingCode === attractiveCharacteristicCode) {
          const val = getValueFromCharacteristic(characteristic);
          formFieldsFromCharacteristics[isAttractiveItem] = val;
        }
      }
    }
  }

  let productImageFromUrl;

  if (binary?.data && binary.contentType) {
    productImageFromUrl = base64ToFile(binary.data, binary.contentType);
    productImageFromUrl = [{ uid: binary.id, originFileObj: productImageFromUrl } as UploadFile];
  }

  const formFields: EusmGroupFormFields = {
    initialObject: { group: obj, binary },
    id,
    identifier: get(identifierObj, '0.value'),
    materialNumber: get(identifierObj, '0.value'),
    active,
    name,
    type,
    ...formFieldsFromCharacteristics,
    productImage: productImageFromUrl,
  };

  return formFields;
};

// process photo url
/**
 * Converts a base 64 string to a File object
 *
 * @param base64String - b64 encoded string
 * @param mimeType - mime type for the file
 */
function base64ToFile(base64String: string, mimeType: string) {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  return new File([blob], '', { type: mimeType });
}

/**
 * Regenerates group payload from form values
 *
 * @param values - form values
 * @param initialValues - initial form values
 */
export const generateGroupPayload = async (
  values: EusmGroupFormFields,
  initialValues: EusmGroupFormFields
): Promise<{ group: IGroup; binary?: IBinary; binaryChanged: boolean }> => {
  const { id, materialNumber, active, name, type } = values;
  const { initialObject } = initialValues;
  const initialGroupObject = initialValues.initialObject?.group;
  let payload: IGroup = {
    resourceType: groupResourceType,
    active: !!active,
  };
  // preserve resource details that we are not interested in editing.
  if (initialObject) {
    const { meta, ...rest } = initialGroupObject ?? {};
    payload = {
      ...rest,
      ...payload,
    };
  }

  if (name) {
    payload.name = name;
  }
  if (id) {
    payload.id = id;
  } else {
    payload.id = v4();
  }

  if (materialNumber) {
    payload.identifier = [
      {
        value: materialNumber,
        use: IdentifierUseCodes.OFFICIAL,
      },
    ];
  }

  if (type) {
    payload.type = type as TypeOfGroup;
  }

  const existingCharacteristics = initialGroupObject?.characteristic ?? [];

  let newCharacteristics = generateCharacteristicPayload(existingCharacteristics, values);

  // image characteristic
  const { changed, payload: binaryPayload } = await getProductImagePayload(values, initialValues);

  if (changed) {
    const nonImageCharacterisitcs = newCharacteristics.filter(
      (stic) =>
        (stic.code.coding ?? [])
          .map((coding) => coding.code)
          .indexOf(photoUploadCharacteristicCode) < 0
    );
    if (binaryPayload) {
      // remove current binary. means should also be removed in list.
      const binaryResourceUrl = `${binaryResourceType}/${binaryPayload.id}`;
      const productImageCharacteristic = {
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '1231415',
              display: 'Product Image code',
            },
          ],
        },
        valueReference: {
          reference: binaryResourceUrl,
        },
      };
      newCharacteristics = [...nonImageCharacterisitcs, productImageCharacteristic];
    }
  }

  payload.characteristic = newCharacteristics;

  return { group: payload, binary: binaryPayload, binaryChanged: changed };
};

/**
 * either posts or puts a group resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the organization payload
 */
export const postPutGroup = (baseUrl: string, payload: IGroup) => {
  const serve = new FHIRServiceClass<IGroup>(baseUrl, groupResourceType);
  return serve.update(payload);
};

/**
 * either posts or puts a group resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the organization payload
 */
export const postPutBinary = (baseUrl: string, payload: IBinary) => {
  const serve = new FHIRServiceClass<IBinary>(baseUrl, binaryResourceType);
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
 * @param initialBinary - initial binary object associated with group
 */
export const updateListReferencesFactory =
  (baseUrl: string, listId: string, initialBinary?: IBinary) =>
  async (
    formResponses: { group: IGroup; binary?: IBinary; binaryChanged: boolean },
    edited: boolean
  ) => {
    const { group, binary, binaryChanged } = formResponses;
    if (edited && !binaryChanged) {
      return;
    }

    const commoditiesListResource = await getOrCreateList(baseUrl, listId);
    const payload = cloneDeep(commoditiesListResource);

    if (binaryChanged) {
      if (initialBinary) {
        // we are removing a reference in the list resource.
        const toRemoveBinaryRef = `${binaryResourceType}/${initialBinary.id}`;
        payload.entry = payload.entry?.filter((entry) => entry.item !== toRemoveBinaryRef);
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const toAddBinaryRef = `${binaryResourceType}/${binary!.id}`;
      payload.entry?.push({
        item: {
          reference: toAddBinaryRef,
        },
      });
    }
    if (payload.entry) {
      payload.entry.push({
        item: {
          reference: `${groupResourceType}/${group.id}`,
        },
      });
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
