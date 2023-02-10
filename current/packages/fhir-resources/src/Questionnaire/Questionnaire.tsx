import type { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import React from 'react';
import { QuestionnaireDetails, QuestionnaireDetailsProps } from './details';
import { QItems } from './itemsPreview';
import './index.css';
import { Collapse } from 'antd';
import parse from 'html-react-parser';

const { Panel } = Collapse;

const commonParse = (resource: IQuestionnaire) => {
  const { status, date: dateTime } = resource;
  return { status, dateTime };
};

const R4Parse = (resource: IQuestionnaire) => {
  const {
    item: rootItems,
    id,
    text,
    version,
    subjectType: subjectTypeCodes,
    publisher,
    effectivePeriod,
    lastReviewDate,
    date,
    description,
  } = resource;
  let narrativePreview: string | undefined;
  if (text?.status === 'generated') {
    narrativePreview = text.div;
  }
  let { title } = resource;
  title = title ?? id;
  return {
    id,
    narrativePreview,
    title,
    rootItems,
    version,
    subjectType: subjectTypeCodes?.join(','),
    publisher,
    effectivePeriod: effectivePeriod,
    lastReviewDate: lastReviewDate,
    date: date,
    description,
  };
};

export const parseQuestionnaire = (resource: IQuestionnaire) => {
  return { ...commonParse(resource), ...R4Parse(resource) };
};

export type ParsedQuestionnaire = ReturnType<typeof parseQuestionnaire>;

interface QuestionnaireProps {
  resource: IQuestionnaire;
}
export const Questionnaire = (props: QuestionnaireProps) => {
  const { resource } = props;

  const {
    title,
    narrativePreview,
    publisher,
    description,
    date,
    version,
    subjectType,
    lastReviewDate,
    effectivePeriod,
  } = parseQuestionnaire(resource);
  const questionnaireDetailProps: QuestionnaireDetailsProps = {
    title,
    publisher,
    description,
    date: date as string | undefined,
    version,
    subjectType,
    lastReviewDate,
    effectivePeriod,
  };
  return (
    <>
      <QuestionnaireDetails {...questionnaireDetailProps} />
      <Collapse className="questionnaireItemPreview">
        <Panel header="Preview items" key="1">
          {narrativePreview ? parse(narrativePreview) : <QItems qItems={resource.item}></QItems>}
        </Panel>
      </Collapse>
    </>
  );
};
