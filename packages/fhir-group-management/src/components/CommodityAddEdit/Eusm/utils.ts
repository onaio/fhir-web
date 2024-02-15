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
  accountabilityCharacteristicCode,
  appropriateUsageCharacteristicCode,
  attractiveCharacteristicCode,
  availabilityCharacteristicCode,
  characteristicUnitMeasureCode,
  conditionCharacteristicCode,
  photoUploadCharacteristicCode,
  snomedCodeSystem,
  supplyMgSnomedCode,
} from '../../../helpers/utils';
import { TypeOfGroup } from '../../ProductForm/utils';
import { GroupFormFields } from '../../ProductForm/types';
import { GroupCharacteristic } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/groupCharacteristic';
import { IBinary } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBinary';
import { UploadFile } from 'antd';

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
  if (characteristic.hasOwnProperty('valueCodeableConcept')) {
    return characteristic.valueCodeableConcept?.text;
  }
  if (characteristic.hasOwnProperty('valueBoolean')) {
    return characteristic.valueBoolean;
  }
  if (characteristic.hasOwnProperty('valueQuantity')) {
    return characteristic.valueQuantity?.value;
  }
  if (characteristic.hasOwnProperty('valueReference')) {
    return characteristic.valueReference?.reference;
  }
}

/**
 * @param codingCode
 * @param values
 * @param existingCharacteristic
 */
function createCharacteristicForCode(
  codingCode: string,
  values: GroupFormFields,
  existingCharacteristic?: GroupCharacteristic
) {
  const exists = !!existingCharacteristic;
  switch (codingCode) {
    case characteristicUnitMeasureCode:
      const { unitOfMeasure } = values;
      if (unitOfMeasure === undefined) {
        return;
      }
      if (exists) {
        const newCharacteristic = cloneDeep(existingCharacteristic);
        (newCharacteristic.valueCodeableConcept ?? {}).text = unitOfMeasure;
        return newCharacteristic;
      } else
        return JSON.parse(`{
        "code": {
          "coding": [ {
            "system": "http://snomed.info/sct",
            "code": "767524001",
            "display": "Unit of measure"
          } ]
        },
        "valueCodeableConcept": {
          "coding": [ {
            "system": "http://snomed.info/sct",
            "code": "767525000",
            "display": "Unit"
          } ],
          "text": "${unitOfMeasure}"
        },
      }`);
    case accountabilityCharacteristicCode:
      const { accountabilityPeriod } = values;
      if (accountabilityPeriod === undefined) {
        return;
      }
      if (exists) {
        const newCharacteristic = cloneDeep(existingCharacteristic);
        (newCharacteristic.valueQuantity ?? {}).value = accountabilityPeriod;
        return newCharacteristic;
      } else
        return JSON.parse(`{
        "code": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "67869606",
              "display": "Accountability period (in months)"
            }
          ]
        },
        "valueQuantity": {
          "value": ${accountabilityPeriod}
        }
      }`);
    case appropriateUsageCharacteristicCode:
      const { appropriateUsage } = values;
      if (appropriateUsage === undefined) {
        return;
      }
      if (exists) {
        const newCharacteristic = cloneDeep(existingCharacteristic);
        (newCharacteristic.valueCodeableConcept ?? {}).text = appropriateUsage;
        return newCharacteristic;
      } else
        return JSON.parse(`{
          "code": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "56758595",
                "display": "Is it being used appropriately? (optional)"
              }
            ]
          },
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "56758595-1",
                "display": "Value entered on the Is it being used appropriately? (optional)"
              }
            ],
            "text": "${appropriateUsage}"
          }
        }`);
    case conditionCharacteristicCode:
      const { condition } = values;
      if (condition === undefined) {
        return;
      }
      if (exists) {
        const newCharacteristic = cloneDeep(existingCharacteristic);
        (newCharacteristic.valueCodeableConcept ?? {}).text = condition;
        return newCharacteristic;
      } else
        return JSON.parse(`{
            "code": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "45647484",
                  "display": "Is it in good condition? (optional)"
                }
              ]
            },
            "valueCodeableConcept": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "45647484-1",
                  "display": "Value entered on the Is it in good condition? (optional)"
                }
              ],
              "text": "${condition}"
            }
          }`);
    case availabilityCharacteristicCode:
      const { availability } = values;
      if (availability === undefined) {
        return;
      }
      if (exists) {
        const newCharacteristic = cloneDeep(existingCharacteristic);
        (newCharacteristic.valueCodeableConcept ?? {}).text = availability;
        return newCharacteristic;
      } else
        return JSON.parse(`{
              "code": {
                "coding": [
                  {
                    "system": "http://snomed.info/sct",
                    "code": "34536373",
                    "display": "Is it there code"
                  }
                ]
              },
              "valueCodeableConcept": {
                "coding": [
                  {
                    "system": "http://snomed.info/sct",
                    "code": "34536373-1",
                    "display": "Value entered on the It is there code"
                  }
                ],
                "text": "${availability}"
              }
            }`);
    case attractiveCharacteristicCode:
      const { isAttractiveItem } = values;
      if (isAttractiveItem === undefined) {
        return;
      }
      if (exists) {
        const newCharacteristic = cloneDeep(existingCharacteristic);
        newCharacteristic.valueBoolean = isAttractiveItem;
        return newCharacteristic;
      } else
        return JSON.parse(`{
                "code": {
                  "coding": [
                    {
                      "system": "http://snomed.info/sct",
                      "code": "23435363",
                      "display": "Attractive Item code"
                    }
                  ]
                },
                "valueBoolean": ${isAttractiveItem}
              }`);
  }
}

/**
 * @param file
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
 * @param values
 * @param initialValues
 */
export async function getProductImagePayload(
  values: GroupFormFields,
  initialValues: GroupFormFields
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
 * Converts group resource to initial values
 *
 * @param obj - the group resource
 * @param binary
 */
export const getGroupFormFields = (obj?: IGroup, binary?: IBinary) => {
  if (!obj) {
    return { initialObject: { code: defaultCode }, active: true } as GroupFormFields;
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
      // TODO - can we graph-map this.
      if (codingSystem === snomedCodeSystem && codingCode === characteristicUnitMeasureCode) {
        const val = getValueFromCharacteristic(characteristic);
        formFieldsFromCharacteristics[unitOfMeasure] = val;
      }
      if (codingSystem === snomedCodeSystem && codingCode === accountabilityCharacteristicCode) {
        const val = getValueFromCharacteristic(characteristic);
        formFieldsFromCharacteristics[accountabilityPeriod] = val;
      }
      if (codingSystem === snomedCodeSystem && codingCode === appropriateUsageCharacteristicCode) {
        const val = getValueFromCharacteristic(characteristic);
        formFieldsFromCharacteristics[appropriateUsage] = val;
      }
      if (codingSystem === snomedCodeSystem && codingCode === conditionCharacteristicCode) {
        const val = getValueFromCharacteristic(characteristic);
        formFieldsFromCharacteristics[condition] = val;
      }
      if (codingSystem === snomedCodeSystem && codingCode === availabilityCharacteristicCode) {
        const val = getValueFromCharacteristic(characteristic);
        formFieldsFromCharacteristics[availability] = val;
      }
      if (codingSystem === snomedCodeSystem && codingCode === attractiveCharacteristicCode) {
        const val = getValueFromCharacteristic(characteristic);
        formFieldsFromCharacteristics[isAttractiveItem] = val;
      }
    }
  }

  let productImageFromUrl;

  if (binary?.data && binary.contentType) {
    productImageFromUrl = base64ToFile(binary.data, binary.contentType);

    productImageFromUrl = productImageFromUrl
      ? [{ uid: binary.id, originFileObj: productImageFromUrl } as UploadFile]
      : [];
  }

  const formFields: GroupFormFields = {
    initialObject: obj,
    id,
    identifier: get(identifierObj, '0.value'),
    active,
    name,
    type,
    ...formFieldsFromCharacteristics,
    productImage: productImageFromUrl,
  };
  // TODO - question of photo url - what should be its type in GroupFormFields

  return formFields;
};

// process photo url
/**
 * @param base64String
 * @param mimeType
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
  values: GroupFormFields,
  initialValues: GroupFormFields
): Promise<{ group: IGroup; binary?: IBinary; binaryChanged: boolean }> => {
  const {
    id,
    identifier: rawIdentifier,
    active,
    name,
    type,
    unitOfMeasure,
    isAttractiveItem,
  } = values;
  const { initialObject } = initialValues;
  let payload: IGroup = {
    resourceType: groupResourceType,
    active: !!active,
  };
  // preserve resource details that we are not interested in editing.
  if (initialObject) {
    const { meta, ...rest } = initialObject;
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

  let identifier = rawIdentifier;
  if (!rawIdentifier) {
    identifier = v4();
  }
  payload.identifier = [
    {
      value: identifier,
      use: IdentifierUseCodes.OFFICIAL,
    },
  ];

  if (type) {
    payload.type = type as TypeOfGroup;
  }

  const existingCharacteristics = initialObject?.characteristic ?? [];

  // prepare existing characteristics so that they are not
  const knownCodes = [
    accountabilityCharacteristicCode,
    appropriateUsageCharacteristicCode,
    conditionCharacteristicCode,
    availabilityCharacteristicCode,
    attractiveCharacteristicCode,
    photoUploadCharacteristicCode,
    characteristicUnitMeasureCode,
  ];
  const knownCodeProcessedStor = knownCodes.reduce((acc, code) => {
    acc[code] = false;
    return acc;
  }, {} as Record<string, boolean>);
  const characteristicByCodingCode: Record<string, GroupCharacteristic> = {};
  let newCharacteristics: GroupCharacteristic[] = [];

  for (const obj of existingCharacteristics) {
    const characteristicCoding = obj.code.coding ?? [];
    for (const coding of characteristicCoding) {
      const thisCode = coding.code ?? '';
      characteristicByCodingCode[thisCode] = obj;
      if (knownCodes.includes(thisCode)) {
        break;
      }
    }
  }

  for (const [currCode, currCharacteristic] of Object.entries(characteristicByCodingCode)) {
    if (knownCodes.includes(currCode)) {
      const updatedCharacteristicforCode = createCharacteristicForCode(
        currCode,
        values,
        currCharacteristic
      );
      knownCodeProcessedStor[currCode] = true;
      if (updatedCharacteristicforCode) {
        newCharacteristics.push(updatedCharacteristicforCode);
      }
    } else {
      newCharacteristics.push(currCharacteristic);
    }
  }

  // add characteristics for not-yet processed codes
  for (const [code, processed] of Object.entries(knownCodeProcessedStor)) {
    if (!processed) {
      const updatedCharacteristicforCode = createCharacteristicForCode(code, values);

      knownCodeProcessedStor[code] = true;
      if (updatedCharacteristicforCode) {
        newCharacteristics.push(updatedCharacteristicforCode);
      }
    }
  }
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
 * @param initialBinary
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
    // TODO - make data immutable across the application
    const payload = cloneDeep(commoditiesListResource);

    if (binaryChanged) {
      if (initialBinary) {
        // we are removing a reference in the list resource.
        const toRemoveBinaryRef = `${binaryResourceType}/${initialBinary.id}`;
        payload.entry = payload.entry?.filter((entry) => entry.item !== toRemoveBinaryRef);
      }
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
