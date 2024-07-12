import React from 'react'
import { Helmet } from 'react-helmet';
import { ImporterFormInstructions } from './formInstructions';
import { BodyLayout } from '@opensrp/react-utils';
import { Row, Col } from 'antd'
import { DataImportForm } from './form';


export const StartDataImport = () => {
  const pageTitle = "Data imports"
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };
  return <>
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Row className="list-view">
        <Col className="main-content">
          <ImporterFormInstructions />
          <DataImportForm />
        </Col>
      </Row>
    </BodyLayout>
  </>
}
