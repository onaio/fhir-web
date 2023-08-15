import React from 'react';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import { WEBSITE_NAME } from '../configs/env';
import ConnectedHeader from '../containers/ConnectedHeader';
import ConnectedSidebar from '../containers/ConnectedSidebar';
import './App.css';
import '@opensrp/plans/dist/index.css';
import '@opensrp/user-management/dist/index.css';
import '@opensrp/product-catalogue/dist/index.css';
import '@opensrp/inventory/dist/index.css';
import { FHIRApps } from './fhir-apps';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Helmet titleTemplate={`%s | ${WEBSITE_NAME}`} defaultTitle="" />
      <ConnectedSidebar />
      <div className="body-wrapper">
        <ConnectedHeader />
        <Content>
          <FHIRApps />
        </Content>
      </div>
    </Layout>
  );
};

export default App;
