import React from 'react';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import { WEBSITE_NAME } from '../configs/env';
import ConnectedHeader from '../containers/ConnectedHeader';
import ConnectedSidebar from '../containers/ConnectedSidebar';
import './App.css';
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
