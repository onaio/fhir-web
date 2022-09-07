import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { Rule } from 'rc-field-form/lib/interface';
import { v4 } from 'uuid';
import { getObjLike, IdentifierUseCodes, FHIRServiceClass } from '@opensrp/react-utils';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { capitalize, get, set, values } from 'lodash';
import {
  active,
  groupResourceType,
  id,
  identifier,
  type,
  unitOfMeasure,
  name,
} from '../../constants';
import type { TFunction } from '@opensrp/i18n';
import {
  characteristicUnitMeasureCode,
  getUnitMeasureCharacteristic,
  snomedCodeSystem,
  supplyMgSnomedCode,
} from '../../helpers/utils';

export enum UnitOfMeasure {
  Pieces = 'pieces',
  Tablets = 'tablets',
  Ampoules = 'ampoules',
  Strips = 'strips',
  Cycles = 'cycles',
  Bottles = 'bottles',
}

export enum TypeOfGroup {
  Medication = 'medication',
  Decive = 'device',
}

export interface GroupFormFields {
  [id]?: string;
  [identifier]?: string;
  [active]?: boolean;
  [name]?: string;
  [type]?: string;
  [unitOfMeasure]?: IGroup['type'];
  initialObject?: IGroup;
}

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
export const validationRulesFactory = (t: TFunction) => ({
  [id]: [{ type: 'string' }] as Rule[],
  [identifier]: [{ type: 'string' }] as Rule[],
  [name]: [
    { type: 'string', message: t('Must be a valid string') },
    { required: true, message: t('Required') },
  ] as Rule[],
  [active]: [{ type: 'boolean' }, { required: true, message: t('Required') }] as Rule[],
  [type]: [{ type: 'enum', enum: Object.values(TypeOfGroup), required: true }] as Rule[],
  [unitOfMeasure]: [{ type: 'enum', enum: Object.values(UnitOfMeasure), required: true }] as Rule[],
});

/**
 * Converts group resource to initial values
 *
 * @param obj - the group resource
 */
export const getGroupFormFields = (obj?: IGroup) => {
  if (!obj) {
    return { initialObject: { code: defaultCode } } as GroupFormFields;
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

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * get select options for group types
 *
 */
export const getGroupTypeOptions = () => {
  return values(TypeOfGroup).map((group) => {
    return {
      value: group,
      label: capitalize(group),
    };
  });
};

/**
 * get select options for group units of measure
 *
 */
export const getUnitOfMeasureOptions = () => {
  return values(UnitOfMeasure).map((measure) => {
    return {
      value: measure,
      label: capitalize(measure),
    };
  });
};

/**
 * filter select options
 *
 * @param inputValue search term
 * @param option select option to filter against
 */
export const groupSelectfilterFunction = (inputValue: string, option?: SelectOption) => {
  return !!option?.label.toLowerCase().includes(inputValue.toLowerCase());
};

/**
 * either posts or puts a group resource payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the organization payload
 */
export const postPutGroup = (baseUrl: string, payload: IGroup) => {
  const { id } = payload;
  const isEdit = !!id;
  const serve = new FHIRServiceClass<IGroup>(baseUrl, groupResourceType);
  if (isEdit) {
    return serve.update(payload);
  }
  return serve.create(payload);
};
