export const sampleQr = {
  resourceType: 'QuestionnaireResponse',
  status: 'in-progress',
  item: [
    {
      linkId: 'PR',
      text: 'Client Info',
      item: [
        {
          linkId: 'PR-name',
          item: [
            {
              linkId: 'PR-name-given',
              text: 'First Name',
              answer: [
                {
                  valueString: 'Joey',
                },
              ],
            },
            {
              linkId: 'PR-name-family',
              text: 'Family Name',
              answer: [
                {
                  valueString: 'Tribbiani',
                },
              ],
            },
          ],
        },
        {
          linkId: 'patient-0-birth-date',
          text: 'Date of Birth',
          answer: [
            {
              valueDate: '2021-11-11',
            },
          ],
        },
        {
          linkId: 'patient-0-gender',
          text: 'Gender',
          answer: [
            {
              valueCoding: {
                code: 'male',
                display: 'Male',
              },
            },
          ],
        },
        {
          linkId: 'PR-telecom',
          item: [
            {
              linkId: 'PR-telecom-system',
              text: 'system',
              answer: [
                {
                  valueString: 'phone',
                },
              ],
            },
            {
              linkId: 'PR-telecom-value',
              text: 'Phone Number',
            },
          ],
        },
        {
          linkId: 'PR-address',
          item: [
            {
              linkId: 'PR-address-city',
              text: 'City',
            },
            {
              linkId: 'PR-address-country',
              text: 'Country',
              answer: [
                {
                  valueString: 'USA',
                },
              ],
            },
          ],
        },
        {
          linkId: 'PR-active',
          text: 'Is Active?',
          answer: [
            {
              valueBoolean: true,
            },
          ],
        },
      ],
    },
    {
      linkId: 'RP',
      text: 'Related person',
      item: [
        {
          linkId: 'RP-family-name',
          text: 'Family name',
          answer: [
            {
              valueString: 'Chandler Muriel Bing',
            },
          ],
        },
        {
          linkId: 'RP-first-name',
          text: 'First name',
          answer: [
            {
              valueString: 'Chandler',
            },
          ],
        },
        {
          linkId: 'RP-relationship',
          text: 'Relationship to patient',
          answer: [
            {
              valueString: 'Roommate',
            },
          ],
        },
        {
          linkId: 'RP-contact-1',
          text: 'Phone number',
        },
        {
          linkId: 'RP-contact-alternate',
          text: 'Alternative phone number',
        },
      ],
    },
  ],
};
