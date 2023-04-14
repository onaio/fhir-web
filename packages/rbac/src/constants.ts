/** fhir resources, key should be in caps, and the value in camelCase as it is for the server endpoints */
export enum FhirResourceType {
  PATIENT = 'Patient',
  PRACTITIONER = 'Practitioner',
  OBSERVATION = 'Observation',
  APPOINTMENT = 'Appointment',
}

export enum VerbPermission {
  CREATE = 0b0001,
  READ = 0b0010,
  UPDATE = 0b0100,
  DELETE = 0b1000,
  MANAGE = 0b1111,
}
