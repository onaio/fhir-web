/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';

/** interface for Objects */

export interface Groups extends Require<IfhirR4.IGroup, 'id' | 'identifier' | 'active' | 'name'> {
  resourceType: 'Group';
}

export type GroupDetail = Groups & {};
