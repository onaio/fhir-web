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
import { Layout } from 'antd';
import { Switch, Route, Redirect } from 'react-router';
import Loading from '../components/page/Loading';
import { CustomLogout } from '../components/Logout';
import { WEBSITE_NAME, BACKEND_ACTIVE } from '../configs/env';
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
import Home from '../containers/pages/Home/Home';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
import NotFound from '../components/NotFound';
import ConnectedAdminView from '../containers/pages/Admin';
import './App.css';
import ConnectedCreateEditUsers from '../containers/pages/Admin/CreateEditUser/Index';

const { Content } = Layout;

library.add(faUser);

const App: React.FC = () => {
  const APP_CALLBACK_URL = BACKEND_ACTIVE ? BACKEND_CALLBACK_URL : REACT_LOGIN_URL;
  const { IMPLICIT, AUTHORIZATION_CODE } = AuthorizationGrantType;
  const AuthGrantType = BACKEND_ACTIVE ? AUTHORIZATION_CODE : IMPLICIT;
  const APP_LOGIN_URL = BACKEND_ACTIVE ? BACKEND_LOGIN_URL : REACT_LOGIN_URL;
  const APP_CALLBACK_PATH = BACKEND_ACTIVE ? BACKEND_CALLBACK_PATH : REACT_CALLBACK_PATH;
  const { OpenSRP } = useOAuthLogin({ providers, authorizationGrantType: AuthGrantType });
  return (
    <Layout>
      <Helmet titleTemplate={`%s | ${WEBSITE_NAME}`} defaultTitle="" />
      <div className="body-wrapper">
        <ConnectedHeader />
        <Content>
          <Switch>
            {/* tslint:disable jsx-no-lambda */}
            {/* Home Page view */}
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={false}
              exact
              path="/"
              component={Home}
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
              path={LOGOUT_URL}
              // tslint:disable-next-line: jsx-no-lambda
              component={() => {
                return <CustomLogout />;
              }}
            />
            <Route exact component={NotFound} />
          </Switch>
        </Content>
      </div>
    </Layout>
  );
};

export default App;
