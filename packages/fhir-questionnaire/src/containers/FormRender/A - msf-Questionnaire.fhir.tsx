/* eslint-disable @typescript-eslint/no-explicit-any */
export const msf = {
  resourceType: 'Questionnaire',
  id: '3748',
  language: 'en',
  name: 'GMSF Questionnaire',
  title: 'MSF Questionnaire',
  status: 'active',
  subjectType: ['Patient'],
  publisher: 'ONA',
  useContext: [
    {
      code: {
        system: 'http://hl7.org/fhir/codesystem-usage-context-type.html',
        code: 'focus',
      },
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://fhir.ona.io',
            code: '000002',
            display: 'MSF Questionnaire',
          },
        ],
      },
    },
  ],
  item: [
    {
      linkId: 'f8bbae2c-3b86-4067-8fbc-da1fb56a1762',
      code: [
        {
          id: '24d7f965-5b2e-47e9-b361-deb0f112dc52',
          system: 'urn:uuid:16b35fed-74c0-4c6b-c198-4332b7381e97',
        },
      ],
      text: 'Tender swelling behind the ear?',
      type: 'choice',
      required: false,
      answerOption: [
        {
          valueCoding: {
            id: 'c394fd23-3e20-4151-86e4-6b9fca5eb2a5',
            system: 'urn:uuid:5f1b1118-0c8c-49a6-b81f-969190639763',
            code: 'yes',
            display: 'Yes',
          },
        },
        {
          valueCoding: {
            id: '8e0ef783-8fe6-43b9-90fb-6b7e6a16d56f',
            system: 'urn:uuid:5f1b1118-0c8c-49a6-b81f-969190639763',
            code: 'no',
            display: 'No',
          },
        },
      ],
    },
    {
      linkId: 'f936d177-57a2-44df-b4b1-72f3f8e55655',
      text: '**Mastoiditis**\n\n**Pre-referral Treatment**\n\n*   blah\n*   blah blah',
      _text: {
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
            valueMarkdown:
              '**Mastoiditis**\n\n**Pre-referral Treatment**\n\n*   blah\n*   blah blah',
          },
        ],
      },
      type: 'display',
      enableWhen: [
        {
          question: 'f8bbae2c-3b86-4067-8fbc-da1fb56a1762',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:5f1b1118-0c8c-49a6-b81f-969190639763',
            code: 'yes',
          },
        },
      ],
      required: false,
    },
    {
      extension: [
        {
          url: 'http://helsenorge.no/fhir/StructureDefinition/sdf-sublabel',
          valueMarkdown: 'Is there pus dripping out?',
        },
      ],
      linkId: '651f38f5-d2d7-4400-8930-c5eca7af754c',
      text: 'Pus draining from the ear',
      type: 'choice',
      enableWhen: [
        {
          question: 'f8bbae2c-3b86-4067-8fbc-da1fb56a1762',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:5f1b1118-0c8c-49a6-b81f-969190639763',
            code: 'no',
          },
        },
      ],
      required: false,
      answerOption: [
        {
          valueCoding: {
            id: '18fb56a9-058a-4099-91c8-e9a421c471a4',
            system: 'urn:uuid:60569d03-0ef4-4e57-89b3-c0288ad7d606',
            code: 'yes',
            display: 'Yes',
          },
        },
        {
          valueCoding: {
            id: '3cf2bd7b-5853-4f7b-ce39-2a95a26fcf74',
            system: 'urn:uuid:60569d03-0ef4-4e57-89b3-c0288ad7d606',
            code: 'no',
            display: 'No',
          },
        },
      ],
    },
    {
      linkId: '1845f686-ac04-4dd9-dead-0c31bde05bc5',
      text: 'How long?',
      type: 'choice',
      enableWhen: [
        {
          question: '651f38f5-d2d7-4400-8930-c5eca7af754c',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:60569d03-0ef4-4e57-89b3-c0288ad7d606',
            code: 'yes',
          },
        },
      ],
      required: false,
      answerOption: [
        {
          valueCoding: {
            id: 'a66e9b58-c724-45ff-8dba-de47ff34a60c',
            system: 'urn:uuid:132ae8d2-c2d2-4f3e-85bc-aaa8bcba5484',
            code: 'less-than-14-days',
            display: 'Less than 14 days',
          },
        },
        {
          valueCoding: {
            id: '0fe11ba4-d91a-42ec-863d-94f30cd8cc58',
            system: 'urn:uuid:132ae8d2-c2d2-4f3e-85bc-aaa8bcba5484',
            code: '14-days-or-more',
            display: '14 days or more',
          },
        },
      ],
    },
    {
      linkId: '370bfd72-2ae6-4003-833d-6add8909f422',
      text: 'Ear pain',
      type: 'choice',
      enableWhen: [
        {
          question: '651f38f5-d2d7-4400-8930-c5eca7af754c',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:60569d03-0ef4-4e57-89b3-c0288ad7d606',
            code: 'no',
          },
        },
      ],
      required: false,
      answerOption: [
        {
          valueCoding: {
            id: '92f54911-ff2f-4c40-8abf-b82317b86dce',
            system: 'urn:uuid:8c9f6d3b-8e0a-4284-d3b4-e1c667f2422f',
            code: 'yes',
            display: 'Yes',
          },
        },
        {
          valueCoding: {
            id: '34936c2f-0baa-4048-e399-8caca35dac40',
            system: 'urn:uuid:8c9f6d3b-8e0a-4284-d3b4-e1c667f2422f',
            code: 'no',
            display: 'No',
          },
        },
      ],
    },
    {
      linkId: '7831f0d4-f984-4b0f-c094-2e4800c17645',
      text: 'Unclassified ear problem',
      type: 'display',
      enableWhen: [
        {
          question: '370bfd72-2ae6-4003-833d-6add8909f422',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:8c9f6d3b-8e0a-4284-d3b4-e1c667f2422f',
            code: 'no',
          },
        },
      ],
      required: false,
    },
    {
      linkId: 'd4881b3c-730f-4597-8042-e3a4a898bc2a',
      text: 'Age < 2 years?',
      type: 'choice',
      enableWhen: [
        {
          question: '370bfd72-2ae6-4003-833d-6add8909f422',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:8c9f6d3b-8e0a-4284-d3b4-e1c667f2422f',
            code: 'yes',
          },
        },
      ],
      required: false,
      answerOption: [
        {
          valueCoding: {
            id: 'f790d4e5-acbd-49ef-a682-b52b164bc005',
            system: 'urn:uuid:b17962ec-00b0-40f7-d81d-e0e3fd8af561',
            code: 'yes',
            display: 'Yes',
          },
        },
        {
          valueCoding: {
            id: 'daaac594-79ec-4342-e229-64817dbd0126',
            system: 'urn:uuid:b17962ec-00b0-40f7-d81d-e0e3fd8af561',
            code: 'no',
            display: 'No',
          },
        },
      ],
    },
    {
      linkId: 'b427a4cd-388a-49e9-8b30-735ba287243c',
      text: 'Acute ear infection',
      type: 'display',
      enableWhen: [
        {
          question: '1845f686-ac04-4dd9-dead-0c31bde05bc5',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:132ae8d2-c2d2-4f3e-85bc-aaa8bcba5484',
            code: 'less-than-14-days',
          },
        },
        {
          question: 'd4881b3c-730f-4597-8042-e3a4a898bc2a',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:b17962ec-00b0-40f7-d81d-e0e3fd8af561',
            code: 'yes',
          },
        },
        {
          question: 'd4881b3c-730f-4597-8042-e3a4a898bc2a',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:b17962ec-00b0-40f7-d81d-e0e3fd8af561',
            code: 'yes',
          },
        },
      ],
      required: false,
    },
    {
      linkId: '7a8fb5bc-d0eb-491f-ff72-ff858c01ad9c',
      text: 'Temperature > 39C or pain more then 2 days?',
      type: 'choice',
      enableWhen: [
        {
          question: 'd4881b3c-730f-4597-8042-e3a4a898bc2a',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:b17962ec-00b0-40f7-d81d-e0e3fd8af561',
            code: 'no',
          },
        },
      ],
      required: false,
      answerOption: [
        {
          valueCoding: {
            id: '26d980ad-54e6-4276-86e8-484ca2407e28',
            system: 'urn:uuid:d18364da-93ee-4fd7-85bc-9f6f606d12de',
            code: 'yes',
            display: 'Yes',
          },
        },
        {
          valueCoding: {
            id: 'fd1c76d2-8c43-4e03-8f88-61cae7421862',
            system: 'urn:uuid:d18364da-93ee-4fd7-85bc-9f6f606d12de',
            code: 'no',
            display: 'No',
          },
        },
      ],
    },
    {
      linkId: '3624c623-025a-441e-d900-d28782d7e923',
      text: 'Viral ear infection',
      type: 'display',
      enableWhen: [
        {
          question: '7a8fb5bc-d0eb-491f-ff72-ff858c01ad9c',
          operator: '=',
          answerCoding: {
            system: 'urn:uuid:d18364da-93ee-4fd7-85bc-9f6f606d12de',
            code: 'no',
          },
        },
      ],
      required: false,
    },
  ],
} as any;
