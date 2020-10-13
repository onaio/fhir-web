import React from 'react';

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
import {
  WEBSITE_NAME,
  BACKEND_ACTIVE,
  DEFAULT_LANGUAGE,
  KEYCLOAK_API_BASE_URL,
} from '../configs/env';
import { REACT_CALLBACK_PATH, URL_BACKEND_LOGIN, URL_REACT_LOGIN, URL_LOGOUT } from '../constants';
import { providers } from '../configs/settings';
import ConnectedHeader from '../containers/ConnectedHeader';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
import NotFound from '../components/NotFound';
import '@opensrp/user-management/dist/index.css';
import {
  ConnectedAdminView,
  ConnectedCreateEditUsers,
  ConnectedUserCredentials,
} from '@opensrp/user-management';
import ConnectedHomeComponent from '../containers/pages/Home/Home';
import './App.css';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Language from '../languages';

const { Content } = Layout;

const App: React.FC = () => {
  void i18n.use(initReactI18next).init({
    resources: Language,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'English',
    interpolation: { escapeValue: false },
  });

  const { IMPLICIT, AUTHORIZATION_CODE } = AuthorizationGrantType;
  const AuthGrantType = BACKEND_ACTIVE ? AUTHORIZATION_CODE : IMPLICIT;
  const APP_LOGIN_URL = BACKEND_ACTIVE ? URL_BACKEND_LOGIN : URL_REACT_LOGIN;
  const APP_CALLBACK_URL = BACKEND_ACTIVE ? REACT_CALLBACK_PATH : APP_LOGIN_URL;
  const APP_CALLBACK_PATH = BACKEND_ACTIVE ? REACT_CALLBACK_PATH : REACT_CALLBACK_PATH;
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
              render={(props: any) => (
                <ConnectedUserCredentials {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={false}
              exact
              path="/user/new"
              render={(props: any) => (
                <ConnectedCreateEditUsers {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={false}
              exact
              path="/user/credentials/:userId"
              render={(props: any) => (
                <ConnectedUserCredentials {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
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
              path={URL_LOGOUT}
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
