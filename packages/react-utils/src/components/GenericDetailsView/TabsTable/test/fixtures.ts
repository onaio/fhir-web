export const patientEncounters = {
  resourceType: 'Bundle',
  id: 'a07d33ef-8b10-4730-9aff-6446589a71fa',
  meta: {
    lastUpdated: '2024-05-22T10:06:16.259+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Encounter/_search?_count=5&_getpagesoffset=0&_total=accurate&subject%3APatient=1',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Encounter/a1f3a048-8863-42b7-9d2e-2e9efbbca9a8',
      resource: {
        resourceType: 'Encounter',
        id: 'a1f3a048-8863-42b7-9d2e-2e9efbbca9a8',
        meta: {
          versionId: '1',
          lastUpdated: '2021-12-14T14:42:59.368+00:00',
          source: '#0d61522716e890ad',
        },
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
        },
        serviceType: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/service-type',
              code: '581',
            },
          ],
        },
        subject: {
          reference: 'Patient/1',
        },
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
