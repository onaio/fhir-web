import React from 'react';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import { WEBSITE_NAME } from '../configs/env';
import ConnectedHeader from '../containers/ConnectedHeader';
import ConnectedSidebar from '../containers/ConnectedSidebar';
import './App.css';
import { FHIRApps } from './fhir-apps';
import { Link } from 'react-router-dom';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Helmet titleTemplate={`%s | ${WEBSITE_NAME}`} defaultTitle="" />
      <ConnectedSidebar />
      <div className="body-wrapper">
        <ConnectedHeader />
        <Content>
          <Link to="/close-flags/1a3a0d65-b6ad-40af-b6cd-2e8801614de9">
            Close product related Flag
          </Link>
          <Link to="/close-flags/17952f75-646f-4087-83bc-6af98dd40938">Close location Flag</Link>
          <FHIRApps />
        </Content>
      </div>
    </Layout>
  );
};

export default App;
