import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import {
  product,
  quantity,
  deliveryDate,
  accountabilityEndDate,
  expiryDate,
  unicefSection,
  serialNumber,
  donor,
  PONumber,
  id,
  identifier,
  active,
  name,
  type,
  actual,
} from '../../constants';
import { Group } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/group';

export interface CommonGroupFormFields {
  [id]?: string;
  [identifier]?: string;
  [active]?: boolean;
  [actual]?: boolean;
  [name]?: string;
  [type]?: Group.TypeEnum;
  [quantity]?: number;
  [deliveryDate]: Date;
  [accountabilityEndDate]: Date;
  [expiryDate]: Date;
  [serialNumber]: string;
  [PONumber]: string;
  [donor]?: string;
  [unicefSection]: string;
  [product]: string;
}

export interface GroupFormFields<InitialObjects = IGroup> extends CommonGroupFormFields {
  initialObject?: InitialObjects;
}
