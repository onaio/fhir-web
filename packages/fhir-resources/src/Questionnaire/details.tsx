/** Displays a questionnaire details, more like meta information about the resource */
import { Avatar } from 'antd';
import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { KeyValueGrid, SingleKeyNestedValue } from '@opensrp/react-utils';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';

export interface QuestionnaireDetailsProps {
  version?: string;
  subjectType?: string;
  publisher?: string;
  effectivePeriod?: Period;
  lastReviewDate?: string;
  title?: string;
  date?: Date;
  description?: string;
}

export const QuestionnaireDetails = (props: QuestionnaireDetailsProps) => {
  const {
    date,
    title,
    version,
    subjectType,
    publisher,
    effectivePeriod,
    lastReviewDate,
    description,
  } = props;
  const keyValuePairs: Record<string, unknown> = {};
  if (date) {
    keyValuePairs['Last Changed:'] = date;
  }
  if (version) {
    keyValuePairs['Version'] = version;
  }
  if (subjectType) {
    keyValuePairs['Subject type:'] = subjectType;
  }
  if (publisher) {
    keyValuePairs['Publisher:'] = publisher;
  }
  if (effectivePeriod?.start) {
    keyValuePairs['Effective period start:'] = effectivePeriod.start;
  }
  if (effectivePeriod?.end) {
    keyValuePairs['Effective period end:'] = effectivePeriod.end;
  }
  if (lastReviewDate) {
    keyValuePairs['Last reviewed date:'] = lastReviewDate;
  }

  return (
    <div className="resourceDetails">
      <div className="resourceDetails-avatar">
        <Avatar
          /**Find the right icon */
          icon={<FormOutlined />}
          className="resourceDetails-avatar__icon"
        />
      </div>
      <div className="resourceDetails-info">
        <h4>{title}</h4>
        <div className="resourceDetails-meta">
          <div className="resourceDetails-info__key-value">
            <KeyValueGrid {...keyValuePairs} />
          </div>
        </div>
        {description ? (
          <div className="resourceDetails-description">
            <SingleKeyNestedValue Description={description} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
