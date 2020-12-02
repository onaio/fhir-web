import React, { useState } from 'react';
import { Row, PageHeader, Col, Button, Table } from 'antd';
import { TeamAssignmentLoading, columns } from './utils';
import { Link } from 'react-router-dom';
import { BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { TEAM_ASSIGNMENT_CREATE_VIEW_URL } from '../../constants';

/** component that renders product catalogue */

const TeamAssignmentView = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { broken, errorMessage } = useHandleBrokenPage();

  if (loading) {
    return <TeamAssignmentLoading />;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  const pageTitle = `Team Assignment`;
  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
      <Row className={'list-view'}>
        <Col className={'main-content'}>
          <div className="main-content__header">
            <Link to={TEAM_ASSIGNMENT_CREATE_VIEW_URL}>
              <Button type="primary" size="large">
                {' + Assign Team'}
              </Button>
            </Link>
          </div>
          <Table dataSource={[]} columns={columns}></Table>
        </Col>
      </Row>
    </div>
  );
};

export { TeamAssignmentView };
