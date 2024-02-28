import type { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import {
  id,
  identifier,
  active,
  unitOfMeasure,
  materialNumber,
  isAttractiveItem,
  availability,
  condition,
  appropriateUsage,
  accountabilityPeriod,
  productImage,
  type,
  name,
} from '../../constants';
import type { TFunction } from '@opensrp/i18n';
import { Rule } from 'antd/es/form';
import { UploadFile } from 'antd';

export interface CommonGroupFormFields {
  [id]?: string;
  [identifier]?: string;
  [active]?: boolean;
  [name]?: string;
  [type]?: string;
  [unitOfMeasure]?: IGroup['type'];
  [materialNumber]?: string;
  [isAttractiveItem]?: boolean;
  [availability]?: string;
  [condition]?: string;
  [appropriateUsage]?: string;
  [accountabilityPeriod]?: number;
  [productImage]?: UploadFile[];
}

export interface GroupFormFields<InitialObjects = IGroup> extends CommonGroupFormFields {
  initialObject?: InitialObjects;
}

export type ValidationRulesFactory = (t: TFunction) => { [key in keyof GroupFormFields]: Rule[] };
