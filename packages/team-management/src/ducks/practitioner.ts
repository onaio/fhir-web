/** interface for Organizations coding property */
interface PractitionerCoding {
  text: string;
}

/** interface for the type key in an Practitioner Object */
interface PractitionerType {
  coding: PractitionerCoding[];
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

export interface PractitionerPOST {
  active: boolean;
  code: { text: 'Community Health Worker' };
  identifier: string; // --- uuid, auto generated
  organization: string; // --- team uuid
  practitioner: string; // --- practitioner uuid
}
