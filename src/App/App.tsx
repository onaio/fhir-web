import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {
  AuthorizationGrantType,
  ConnectedOauthCallback,
  getOpenSRPUserInfo,
  useOAuthLogin,
} from '@onaio/gatekeeper';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Helmet } from 'react-helmet';
import {
  UserOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Switch, Route, Redirect } from 'react-router';
import Loading from '../components/page/Loading';
import { CustomLogout } from '../components/Logout';
import { BACKEND_ACTIVE, WEBSITE_NAME } from '../configs/env';
import {
  REACT_CALLBACK_PATH,
  BACKEND_CALLBACK_URL,
  BACKEND_LOGIN_URL,
  BACKEND_CALLBACK_PATH,
  REACT_LOGIN_URL,
  LOGOUT_URL,
} from '../constants';
import { providers } from '../configs/settings';
import ConnectedHeader from '../containers/ConnectedHeader';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
import NotFound from '../components/NotFound';
import ConnectedAdminView from '../containers/pages/Admin';
import ConnectedCreateEditUsers from '../containers/pages/Admin/CreateEditUser';
import ConnectedHomeComponent from '../containers/pages/Home/Home';
import './App.css';
import ConnectedUserCredentials from '../containers/pages/Admin/Credentials';
// import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Content, Header, Footer, Sider } = Layout;

library.add(faUser);

const App: React.FC = () => {
  const APP_CALLBACK_URL = BACKEND_ACTIVE ? BACKEND_CALLBACK_URL : REACT_LOGIN_URL;
  const { IMPLICIT, AUTHORIZATION_CODE } = AuthorizationGrantType;
  const AuthGrantType = BACKEND_ACTIVE ? AUTHORIZATION_CODE : IMPLICIT;
  const APP_LOGIN_URL = BACKEND_ACTIVE ? BACKEND_LOGIN_URL : REACT_LOGIN_URL;
  const APP_CALLBACK_PATH = BACKEND_ACTIVE ? BACKEND_CALLBACK_PATH : REACT_CALLBACK_PATH;
  const { OpenSRP } = useOAuthLogin({ providers, authorizationGrantType: AuthGrantType });
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Helmet titleTemplate={`%s | ${WEBSITE_NAME}`} defaultTitle="" />
      <ConnectedHeader />
      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            left: 0,
          }}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              Option 1
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Option 2
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />} />
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Switch>
                {/* tslint:disable jsx-no-lambda */}
                {/* Home Page view */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={false}
                  exact
                  path="/"
                  component={ConnectedHomeComponent}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={false}
                  exact
                  path="/admin"
                  component={ConnectedAdminView}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={false}
                  exact
                  path="/user/edit/:userId"
                  component={ConnectedCreateEditUsers}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={false}
                  exact
                  path="/user/new"
                  component={ConnectedCreateEditUsers}
                />
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={false}
                  exact
                  path="/user/credentials/:userId"
                  component={ConnectedUserCredentials}
                />
                <Route
                  exact
                  path={APP_LOGIN_URL}
                  render={() => {
                    window.location.href = OpenSRP;
                    return <></>;
                  }}
                />
                <Route
                  exact
                  path={APP_CALLBACK_PATH}
                  render={(routeProps) => {
                    if (BACKEND_ACTIVE) {
                      return <CustomConnectedAPICallBack {...routeProps} />;
                    }
                    return (
                      <ConnectedOauthCallback
                        SuccessfulLoginComponent={() => {
                          return <Redirect to="/" />;
                        }}
                        LoadingComponent={Loading}
                        providers={providers}
                        oAuthUserInfoGetter={getOpenSRPUserInfo}
                        {...routeProps}
                      />
                    );
                  }}
                />
                {/* tslint:enable jsx-no-lambda */}
                <ConnectedPrivateRoute
                  redirectPath={APP_CALLBACK_URL}
                  disableLoginProtection={false}
                  exact
                  path="/logout"
                  // tslint:disable-next-line: jsx-no-lambda
                  component={() => {
                    return <CustomLogout />;
                  }}
                />
                <Route exact component={NotFound} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
