import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { BrokenPage, Resource404, TableLayout } from '@opensrp/react-utils';
import { FHIRServiceClass } from '@opensrp/react-utils';
import {
  questionnaireResourceType,
  questionnaireResponseResourceType,
  QUEST_FORM_VIEW_URL,
} from '../constants';
import { useQuery } from 'react-query';
import { Button, Col, Row, Spin } from 'antd';
import { Column } from '@opensrp/react-utils';
import {
  parseQuestionnaireResponse,
  Questionnaire,
  ParsedQuestionnaireResponse,
} from '@opensrp/fhir-resources';
import type { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { useSimpleTabularView } from '@opensrp/react-utils';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from '../mls';
import type { TFunction } from '@opensrp/i18n';

/** props for the PlansList view */
export interface QuestionnaireListProps {
  fhirBaseURL: string;
}

export const qrListRouteKey = 'id' as const;

export interface RouteProps {
  [qrListRouteKey]: string;
}

/**
 * generates columns for questionnaire rendering component
 *
 * @param t - translator function
 */
const getColumns = (t: TFunction): Column<ParsedQuestionnaireResponse>[] => {
  const columns: Column<ParsedQuestionnaireResponse>[] = [
    {
      title: t('Submission Id'),
      width: '30%',
      dataIndex: 'id' as const,
    },
    {
      title: t('Date authored'),
      dataIndex: 'authoredDateTime' as const,
      render: (value) => t('{{val, datetime}}', { val: new Date(value) }),
    },
    {
      title: t('QuestionnaireVersion'),
      dataIndex: 'questionnaireVersion' as const,
    },
    {
      title: t('Actions'),
      render: (record: ParsedQuestionnaireResponse) => {
        return (
          <>
            <Link to={`${QUEST_FORM_VIEW_URL}/${record.id}/${questionnaireResponseResourceType}`}>
              {t('Edit')}
            </Link>
          </>
        );
      },
      width: '20%',
    },
  ];
  return columns;
};

/** component that renders plans */

const QuestionnaireResponseList = (props: QuestionnaireListProps) => {
  const { fhirBaseURL } = props;
  const { id: questId } = useParams<RouteProps>();
  const { t } = useTranslation();

  const history = useHistory();

  const {
    isLoading: QuestLoading,
    data: questData,
    error: questError,
  } = useQuery(
    [questionnaireResourceType, questId],
    () => new FHIRServiceClass(fhirBaseURL, questionnaireResourceType).read(questId),
    { refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );

  const extraParams = { questionnaire: questId };
  const { tablePaginationProps, queryValues } = useSimpleTabularView(
    fhirBaseURL,
    questionnaireResponseResourceType,
    extraParams
  );
  const { data, isFetching, isLoading } = queryValues;

  if (QuestLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (questError && !questData) {
    return <BrokenPage errorMessage={t('Problem loading questionnaire')} />;
  }

  if (!questData) {
    return <Resource404 />;
  }

  const columns = getColumns(t);
  const dataSource = ((data?.records ?? []) as IQuestionnaireResponse[]).map(
    parseQuestionnaireResponse
  );
  const tableProps = {
    datasource: dataSource,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return (
    <div className="content-section fhir-resource-container">
      <Questionnaire resource={questData as IQuestionnaire} />,
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header flex-right">
            <Button type="primary" onClick={() => history.push(`${QUEST_FORM_VIEW_URL}/${questData.id as string}/${questionnaireResourceType}`)}>
              <PlusOutlined />
              {t('Fill form')}
            </Button>
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </div>
  );
};

export { QuestionnaireResponseList };
