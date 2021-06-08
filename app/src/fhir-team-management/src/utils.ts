import { FhirObject, FHIRResponse, Identifier, IdentifierObject } from './types';

export function ProcessFHIRResponse<T>(res: FHIRResponse<T>) {
  return ProcessFHIRObjects(res.entry.map((e) => e.resource));
}

export function ProcessFHIRObjects<T>(object: FhirObject<T>[]) {
  return object.map((e) => ProcessFHIRObject(e));
}

export function ProcessFHIRObject<T>(object: FhirObject<T>): T {
  const identifier: IdentifierObject = object.identifier.reduce((prev, id) => {
    const typesid = id as Identifier;
    return { ...prev, [typesid.use]: typesid.value };
  }, {}) as IdentifierObject;

  return ({ ...object, identifier: identifier } as unknown) as T;
}
