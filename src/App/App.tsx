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
import SideMenu from '../components/page/SideMenu';
import { SiteFooter } from '../containers/pages/Footer';

const { Content, Header } = Layout;

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
        <SideMenu />
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
          <SiteFooter />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
