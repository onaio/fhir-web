/** Displays a questionnaire details, more like meta information about the resource */
import { Avatar } from 'antd';
import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { KeyValueGrid, SingleKeyNestedValue } from '@opensrp/react-utils';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import { useTranslation } from '../mls';

export interface QuestionnaireDetailsProps {
  version?: string;
  subjectType?: string;
  publisher?: string;
  effectivePeriod?: Period;
  lastReviewDate?: string;
  title?: string;
  date?: string;
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
  const { t } = useTranslation();
  const keyValuePairs: Record<string, unknown> = {};
  if (date) {
    keyValuePairs[t('Last Changed:')] = t('{{val, datetime}}', { val: new Date(date) });
  }
  if (version) {
    keyValuePairs[t('Version:')] = version;
  }
  if (subjectType) {
    keyValuePairs[t('Subject type:')] = subjectType;
  }
  if (publisher) {
    keyValuePairs[t('Publisher:')] = publisher;
  }
  if (effectivePeriod?.start) {
    keyValuePairs[t('Effective period start:')] = t('{{val, datetime}}', {
      val: new Date(effectivePeriod.start),
    });
  }
  if (effectivePeriod?.end) {
    keyValuePairs[t('Effective period end:')] = t('{{val, datetime}}', {
      val: new Date(effectivePeriod.end),
    });
  }
  if (lastReviewDate) {
    keyValuePairs[t('Last reviewed date:')] = t('{{val, datetime}}', {
      val: new Date(lastReviewDate),
    });
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
