import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import { Rule } from 'rc-field-form/lib/interface';
import { v4 } from 'uuid';
import { getObjLike, IdentifierUseCodes, FHIRServiceClass } from '@opensrp/react-utils';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { cloneDeep, get, set } from 'lodash';
import {
  active,
  groupResourceType,
  id,
  identifier,
  type,
  unitOfMeasure,
  name,
  listResourceType,
} from '../../../constants';
import type { TFunction } from '@opensrp/i18n';
import {
  characteristicUnitMeasureCode,
  getUnitMeasureCharacteristic,
  snomedCodeSystem,
  supplyMgSnomedCode,
} from '../../../helpers/utils';
import { TypeOfGroup, UnitOfMeasure } from '../../ProductForm/utils';
import { GroupFormFields } from '../../ProductForm/types';

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
    [name]: [
      { type: 'string', message: t('Must be a valid string') },
      { required: true, message: t('Required') },
    ] as Rule[],
    [active]: [{ type: 'boolean' }, { required: true, message: t('Required') }] as Rule[],
    [type]: [{ type: 'enum', enum: Object.values(TypeOfGroup), required: true }] as Rule[],
    [unitOfMeasure]: [
      { type: 'enum', enum: Object.values(UnitOfMeasure), required: true },
    ] as Rule[],
  };
};

/**
 * Converts group resource to initial values
 *
 * @param obj - the group resource
 */
export const getGroupFormFields = (obj?: IGroup) => {
  if (!obj) {
    return { initialObject: { code: defaultCode }, active: true } as GroupFormFields;
  }
  const { id, name, active, identifier, type } = obj;

  const identifierObj = getObjLike(identifier, 'use', IdentifierUseCodes.OFFICIAL) as Identifier[];
  const unitMeasureCharacteristic = getUnitMeasureCharacteristic(obj);
  const formFields: GroupFormFields = {
    initialObject: obj,
    id,
    identifier: get(identifierObj, '0.value'),
    active,
    name,
    type,
    unitOfMeasure: get(unitMeasureCharacteristic, 'valueCodeableConcept.text', undefined),
  };
  return formFields;
};

/**
 * Regenerates group payload from form values
 *
 * @param values - form values
 * @param initialValues - initial form values
 */
export const generateGroupPayload = (
  values: GroupFormFields,
  initialValues: GroupFormFields
): IGroup => {
  const { id, identifier: rawIdentifier, active, name, type, unitOfMeasure } = values;
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

  if (unitOfMeasure) {
    const unitMeasureBackBone = getUnitMeasureCharacteristic(payload);
    if (unitMeasureBackBone) {
      // mutable operation
      set(unitMeasureBackBone, 'valueCodeableConcept.text', unitOfMeasure);
    } else {
      // we add a wholly new unit of measure characteristic
      const updatedCharacteristic = set(
        defaultCharacteristic,
        'valueCodeableConcept.text',
        unitOfMeasure
      );
      payload.characteristic = [...(payload.characteristic ?? []), updatedCharacteristic];
    }
  }

  return payload;
};

/**
 * either posts or puts a group resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the organization payload
 */
export const postPutGroup = (baseUrl: string, payload: IGroup) => {
  // check if we are creating, then update the list url, where do we get the list url from, can add a form hook as a postSubmit action.
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
  (baseUrl: string, listId: string) => async (group: IGroup, edited: boolean) => {
    if (edited) {
      return;
    }
    const commoditiesListResource = await getOrCreateList(baseUrl, listId);
    // TODO - make data immutable across the application
    const payload = cloneDeep(commoditiesListResource);
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
