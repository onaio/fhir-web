/** interface for a Practitioner object */
interface PractitionerCoding {
  text: string;
}

/** interface for a Practitioner object */
export interface Practitioner {
  identifier: string;
  active: boolean;
  name: string;
  userId: string;
  username: string;
  code?: PractitionerCoding;
}
