import { Meta } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/meta';

/**
 * From T, convert a set of keys to optional, that are in the union K.
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

/**
 * From T, convert a set of keys to required, that are in the union K.
 */
export type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** interface for FHIR response */
export interface FHIRResponse<T> {
  resourceType: string;
  id: string;
  meta?: Meta;
  type: string;
  total: number;
  link: { relation: string; url: string }[];
  entry: {
    fullUrl: string;
    resource: T;
    search: { mode: string };
  }[];
}
