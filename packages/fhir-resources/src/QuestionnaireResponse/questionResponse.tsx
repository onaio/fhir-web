import type { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';

// parse R4 specific fields
const R4Parse = (resource: IQuestionnaireResponse) => {
  const {
    item: rootItems,
    id,
    basedOn,
    partOf,
    questionnaire,
    subject,
    authored: authoredDateTime,
    author,
    source,
  } = resource;

  const questionnaireURl = resource.questionnaire;
  const splitPath = questionnaireURl?.split('/') ?? [];
  const historyPathIndex = splitPath.findIndex((value) => value === '_history');
  let questionnaireVersion = 'Current';
  if (historyPathIndex > 0) {
    questionnaireVersion = splitPath[historyPathIndex + 1];
  }
  return {
    id,
    basedOn,
    partOf,
    questionnaire,
    subject,
    authoredDateTime,
    author,
    source,
    rootItems,
    questionnaireVersion,
  };
};

export const parseQuestionnaireResponse = (resource: IQuestionnaireResponse) => {
  return { ...R4Parse(resource) };
};

export type ParsedQuestionnaireResponse = ReturnType<typeof parseQuestionnaireResponse>;
