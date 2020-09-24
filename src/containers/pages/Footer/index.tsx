import * as React from 'react';
import { Layout } from 'antd';
import Logo from '../../../assets/images/opensrp-logo-color.png';
const { Footer } = Layout;

export const SiteFooter: React.FC = () => (
  <Footer style={{ textAlign: 'center' }}>
    <img width={100} src={Logo} alt={'OpenSRP Web'} />
  </Footer>
);
