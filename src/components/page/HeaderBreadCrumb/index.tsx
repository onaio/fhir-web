import * as React from 'react';
import { Breadcrumb } from 'antd';

export const HeaderBreadCrumb = (): JSX.Element => {
  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>Users</Breadcrumb.Item>
    </Breadcrumb>
    // <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  );
};

export default HeaderBreadCrumb;
