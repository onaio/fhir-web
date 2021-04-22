import { FhirObject, FHIRResponse, Identifier, IdentifierObject } from './types';

export function ProcessFHIRResponse<T>(res: FHIRResponse<T>) {
  return ProcessFHIRObjects(res.entry.map((e) => e.resource));
}

export function ProcessFHIRObjects<T>(
  object: FhirObject<T>[]
): (Omit<T, 'identifier'> & { identifier: IdentifierObject })[] {
  return object.map((e) => ProcessFHIRObject(e));
}

export function ProcessFHIRObject<T>(object: FhirObject<T>) {
  let identifier: IdentifierObject = {} as IdentifierObject; // only keep those value that have offical identifier
  (object.identifier as Identifier[]).forEach((e) => (identifier[e.use] = e));
  return { ...object, identifier: identifier };
}
