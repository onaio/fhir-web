import { Rule } from 'antd/es/form';
import { TFunction } from '@opensrp/i18n';
import {
  id,
  identifier,
  active,
  unitOfMeasure,
  name,
  type,
  materialNumber,
  isAttractiveItem,
  availability,
  condition,
  appropriateUsage,
  accountabilityPeriod,
  productImage,
} from '../../constants';
import { capitalize, values } from 'lodash';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

export enum UnitOfMeasure {
  Pieces = 'Pieces',
  Tablets = 'Tablets',
  Ampoules = 'Ampoules',
  Strips = 'Strips',
  Cycles = 'Cycles',
  Bottles = 'Bottles',
  TestKits = 'Test kits',
  Sachets = 'Sachets',
  Straps = 'Straps',
}

export enum TypeOfGroup {
  Medication = 'medication',
  Decive = 'device',
  Substance = 'substance',
}

/**
 * extract file from an input event
 *
 * @param e - event after a file upload
 */
export const normalizeFileInputEvent = (e: UploadChangeParam<UploadFile>) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e.fileList;
};

// TODO - Do we really need this.
/**
 * factory to create default validation rules
 *
 * @param t - translator function
 */
export function defaultValidationRulesFactory(t: TFunction) {
  return {
    [id]: [{ type: 'string' }] as Rule[],
    [identifier]: [{ type: 'string' }] as Rule[],
    [name]: [{ type: 'string', message: t('Must be a valid string') }] as Rule[],
    [active]: [{ type: 'boolean' }] as Rule[],
    [type]: [{ type: 'enum', enum: Object.values(TypeOfGroup) }] as Rule[],
    [unitOfMeasure]: [{ type: 'enum', enum: Object.values(UnitOfMeasure) }] as Rule[],
    [materialNumber]: [{ type: 'string' }] as Rule[],
    [isAttractiveItem]: [{ type: 'boolean' }] as Rule[],
    [availability]: [{ type: 'string' }] as Rule[],
    [condition]: [{ type: 'string' }] as Rule[],
    [appropriateUsage]: [{ type: 'string' }] as Rule[],
    [accountabilityPeriod]: [{ type: 'number' }] as Rule[],
    [productImage]: [{ type: 'array', max: 1 }] as Rule[],
  };
}

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
