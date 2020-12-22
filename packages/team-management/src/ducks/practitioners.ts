/** interface for a Practitioner object */
interface PractitionerCoding {
  text: string;
}

/** interface for a Practitioner object */
export interface Practitioner {
  id?: string | number;
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
