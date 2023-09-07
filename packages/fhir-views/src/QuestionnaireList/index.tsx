import React from 'react';
import { Link } from 'react-router-dom';
import { BrokenPage, SearchForm, TableLayout } from '@opensrp/react-utils';
import {
  questionnaireResourceType,
  QUEST_FORM_VIEW_URL,
  QUEST_RESPONSE_VIEW_URL,
} from '../constants';
import { Column } from '@opensrp/react-utils';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { useSimpleTabularView } from '@opensrp/react-utils';
import { PageHeader } from '@opensrp/react-utils';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { ParsedQuestionnaire, parseQuestionnaire } from '@opensrp/fhir-resources';
import { useTranslation } from '../mls';
import type { TFunction } from '@opensrp/i18n';
import './index.css';
import { RbacCheck, UserRole, useUserRole } from '@opensrp/rbac';

/** props for the PlansList view */
interface QuestionnaireListProps {
  fhirBaseURL: string;
}

export const NamesColumnCustomRenderLink: Column<ParsedQuestionnaire>['render'] = (
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

export const NamesColumnCustomRender: Column<ParsedQuestionnaire>['render'] = (
  record: IQuestionnaire
) => {
  return <>{record.title ?? record.id ?? ''}</>;
};

/**
 * generates columns for questionnaire rendering component
 *
 * @param t - translator function
 * @param userRole - role of logged in user
 */
export const getColumns = (t: TFunction, userRole: UserRole): Column<ParsedQuestionnaire>[] => {
  const columns: Column<ParsedQuestionnaire>[] = [
    {
      title: t('Name/Id'),
      render: userRole.hasPermissions('QuestionnaireResponse.create')
        ? NamesColumnCustomRenderLink
        : NamesColumnCustomRender,
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
      render: (value) => t('{{val, datetime}}', { val: new Date(value) }),
    },
    {
      title: t('Actions'),
      render: (record: IQuestionnaire) => {
        return (
          <RbacCheck permissions={['QuestionnaireResponse.read']}>
            <Link to={`${QUEST_RESPONSE_VIEW_URL}/${record.id}`}>
              {t('View Questionnaire Responses')}
            </Link>
          </RbacCheck>
        );
      },
      width: '20%',
    },
  ];
  return columns;
};

const getSearchParams = (search: string | null) => {
  if (search) {
    return { [`title:contains`]: `${search},name:contains=${search}` };
  }
  return {};
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
    questionnaireResourceType,
    getSearchParams
  );
  const userRole = useUserRole();
  const { data, isFetching, isLoading, error } = queryValues;

  const columns = getColumns(t, userRole);
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
      <PageHeader title={pageTitle} />

      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} data-testid="search-form" />
            <RbacCheck permissions={['QuestionnaireResponse.create']}>
              <Button type="primary" disabled={true}>
                <PlusOutlined />
                {t('Create questionnaire')}
              </Button>
            </RbacCheck>
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </div>
  );
};

export { QuestionnaireList };
