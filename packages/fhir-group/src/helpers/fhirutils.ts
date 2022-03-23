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
    resource: T;
    search: { mode: string };
  }[];
}
