export const patientResourceDetails = {
  resourceType: 'Patient',
  id: '1',
  meta: {
    versionId: '4',
    lastUpdated: '2021-03-10T13:27:48.632+00:00',
    source: '#14dfbe238f0933a5',
  },
  text: {
    status: 'generated',
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">John <b>DOE </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>213,One Pademore </span><br/><span>Nairobi </span><span>Kenya </span></td></tr><tr><td>Date of birth</td><td><span>04 August 1988</span></td></tr></tbody></table></div>',
  },
  name: [
    {
      use: 'official',
      family: 'Doe',
      given: ['John'],
    },
  ],
  telecom: [
    {
      system: 'phone',
      value: '+254722123456',
      use: 'mobile',
    },
    {
      system: 'email',
      value: 'jdoe@ona.io',
    },
  ],
  gender: 'male',
  birthDate: '1988-08-04',
  address: [
    {
      line: ['213,One Pademore'],
      city: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
    },
  ],
};
