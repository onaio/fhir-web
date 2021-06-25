import { Require, convertToObject } from '@opensrp/react-utils';
import { Identifier as FhirIdentifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { Meta } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/meta';

/** interface for FHIR response */
export interface FHIRResponse<T> {
  resourceType: string;
  id: string;
  meta?: Meta;
  type: string;
  total: number;
  link: [{ relation: string; url: string }];
  entry: {
    fullUrl: string;
    resource: FhirObject<T>;
    search: { mode: string };
  }[];
}

export type FhirObject<T> = Omit<T, 'identifier'> & { identifier: FhirIdentifier[] };

export type Identifier = Require<FhirIdentifier, 'use' | 'value'>;
export type IdentifierObject = Record<FhirIdentifier.UseEnum, Identifier>;

export function ProcessFHIRResponse<T>(res: FHIRResponse<T>) {
  return ProcessFHIRObjects(res.entry.map((e) => e.resource));
}

export function ProcessFHIRObjects<T>(object: FhirObject<T>[]) {
  return object.map((e) => ProcessFHIRObject(e));
}

export function ProcessFHIRObject<T>(object: FhirObject<T>): T {
  return ({
    ...object,
    ...(object.identifier && {
      identifier: convertToObject<FhirIdentifier, FhirIdentifier.UseEnum>(object.identifier, 'use'),
    }),
  } as unknown) as T;
}
