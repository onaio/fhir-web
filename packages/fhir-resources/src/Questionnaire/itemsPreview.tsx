/** read only display of a questionnaires items */
import React from 'react';
import type { QuestionnaireItem } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/questionnaireItem';
import { Typography, Tag } from 'antd';
import { useTranslation } from '../mls';

const { Text } = Typography;

interface GroupProps {
  qItems?: QuestionnaireItem[];
}

export const QItems = (props: GroupProps) => {
  const { qItems } = props;
  const { t } = useTranslation();
  if (!Array.isArray(qItems) || qItems.length === 0) {
    return null;
  }
  return (
    <>
      {qItems.map((item, i) => {
        const linkId = item.linkId ?? '';

        const text = item.text;
        const nestedItems = item.item ?? [];
        const isGroup = item.type === 'group';
        return (
          <ul key={`item-${i}`} className="questionnaireItemsList">
            <li className="questionnaireItemsList-title" data-testid={`linkId-${item.linkId}`}>
              <Text>{text}</Text>
              &nbsp;
              <Tag color="default">{t('linkId: {{linkId}}', { linkId })}</Tag>
              <Tag color="default">{t('type: {itemType}', { itemType: item.type })}</Tag>
            </li>
            {!isGroup && (
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              <li>{<Questions questions={nestedItems} />}</li>
            )}
            {isGroup && (
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              <li>
                <QItems qItems={nestedItems} />
              </li>
            )}
          </ul>
        );
      })}
    </>
  );
};

interface QuestionProps {
  questions: QuestionnaireItem[];
}

const Questions = (props: QuestionProps) => {
  const { questions } = props;
  const { t } = useTranslation();
  if (!Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  return (
    <ul className="questionnaireItemsList__questions-list">
      {questions.map((item, i) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const hasLinkId = item.linkId === undefined || item.linkId === null;
        const type = item.type;
        const text = item.text;
        return (
          <li key={`item-${i}`} data-testid={`linkId-${item.linkId}`}>
            {text}
            {hasLinkId ? (
              <>
                &nbsp;
                <Tag color="default">{t('linkId: {{linkId}}', { linkId: item.linkId })}</Tag>
                <Tag color="default">{t('type: {itemType}', { itemType: type })}</Tag>
              </>
            ) : null}
            {item.item ? <QItems qItems={item.item} /> : null}
          </li>
        );
      })}
    </ul>
  );
};
