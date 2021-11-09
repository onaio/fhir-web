import React from 'react';
import { Row, PageHeader, Col } from 'antd';
import { Link } from 'react-router-dom';
import { BrokenPage, TableLayout } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { questionnaireResourceType } from '../../constants';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { Questionnaire } from '@helsenorge/skjemautfyller/types/fhir';

/** props for the PlansList view */
interface QuestionnaireListProps {
  fhirBaseURL: string;
}

const defaultProps = {};

/** component that renders plans */

const QuestionnaireList = (props: QuestionnaireListProps) => {
  const { fhirBaseURL } = props;

  const { isLoading, data, error } = useQuery(
    [questionnaireResourceType],
    () => new FHIRServiceClass(fhirBaseURL, questionnaireResourceType).list(),
    {
      select: (res) => res.entry,
    }
  );

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error && !data) {
    return <BrokenPage errorMessage={'Problem loading data'} />;
  }

  const tableDataSource = data?.map((dt) => dt.resource) ?? [];
  const pageTitle = 'Questionnaire list view';
  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>

      <Row className={'list-view pt-0'}>
        <Col className={'main-content'}>
          <TableLayout
            datasource={tableDataSource}
            columns={[
              {
                title: 'Questionnaire Title',
                key: 'title',
                defaultSortOrder: 'descend',
                // eslint-disable-next-line react/display-name
                render: (item: Questionnaire) => {
                  return <Link to={`/quest/${item.id}`}>{item.title ?? item.id}</Link>;
                },
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};

QuestionnaireList.defaultProps = defaultProps;

export { QuestionnaireList };
