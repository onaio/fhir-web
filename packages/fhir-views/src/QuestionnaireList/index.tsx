import React from 'react';
import { Link } from 'react-router-dom';
import { BrokenPage, SearchForm, TableLayout, intlFormatDateStrings } from '@opensrp/react-utils';
import {
  questionnaireResourceType,
  QUEST_FORM_VIEW_URL,
  QUEST_RESPONSE_VIEW_URL,
} from '../constants';
import { Column } from '@opensrp/react-utils';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { useSimpleTabularView } from '@opensrp/react-utils';
import { PageHeader, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { ParsedQuestionnaire, parseQuestionnaire } from '@opensrp/fhir-resources';
import { useTranslation } from '../mls';
import type { TFunction } from '@opensrp/i18n';
import './index.css';

/** props for the PlansList view */
interface QuestionnaireListProps {
  fhirBaseURL: string;
}

/**
 * component rendered in the action column of the table
 *
 * @param record - each data item
 */
export const ActionsColumnCustomRender: Column<ParsedQuestionnaire>['render'] = (
  record: IQuestionnaire
) => {
  const { t } = useTranslation();
  return (
    <>
      <Link to={`${QUEST_RESPONSE_VIEW_URL}/${record.id}`}>
        {t('View Questionnaire Responses')}
      </Link>
    </>
  );
};

export const NamesColumnCustomRender: Column<ParsedQuestionnaire>['render'] = (
  record: IQuestionnaire
) => {
  return (
    <>
      <Link to={`${QUEST_FORM_VIEW_URL}/${record.id}/${questionnaireResourceType}`}>
        {record.title ?? record.id ?? ''}
      </Link>
    </>
  );
};

/**
 * generates columns for questionnaire rendering component
 *
 * @param t
 */
export const getColumns = (t: TFunction): Column<ParsedQuestionnaire>[] => {
  const columns: Column<ParsedQuestionnaire>[] = [
    {
      title: t('Name/Id'),
      render: NamesColumnCustomRender,
      width: '20%',
    },
    {
      title: t('Status'),
      dataIndex: 'status' as const,
    },
    {
      title: t('Publisher'),
      dataIndex: 'publisher' as const,
    },
    {
      title: t('Version'),
      dataIndex: 'version' as const,
    },
    {
      title: t('date'),
      dataIndex: 'date' as const,
      render: (value) => intlFormatDateStrings(value),
    },
    {
      title: t('Actions'),
      render: ActionsColumnCustomRender,
      width: '20%',
    },
  ];
  return columns;
};

/**
 * api paginated table view listing questionnaires
 *
 * @param props - component props
 */
const QuestionnaireList = (props: QuestionnaireListProps) => {
  const { fhirBaseURL } = props;
  const { t } = useTranslation();

  const { searchFormProps, tablePaginationProps, queryValues } = useSimpleTabularView(
    fhirBaseURL,
    questionnaireResourceType
  );
  const { data, isFetching, isLoading, error } = queryValues;

  const columns = getColumns(t);
  const dataSource = ((data?.records ?? []) as IQuestionnaire[]).map(parseQuestionnaire);
  const tableProps = {
    datasource: dataSource,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }
  const pageTitle = t('Questionnaire list view');

  return (
    <div className="content-section fhir-resource-container">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>

      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} data-testid="search-form" />
            <Link to={'#'}>
              <Button type="primary" disabled={true}>
                <PlusOutlined />
                {t('Create questionnaire')}
              </Button>
            </Link>
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </div>
  );
};

export { QuestionnaireList };
