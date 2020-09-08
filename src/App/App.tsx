import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {
  AuthorizationGrantType,
  ConnectedOauthCallback,
  OauthLogin,
  getOpenSRPUserInfo,
} from '@onaio/gatekeeper';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import { Switch, Route, Redirect } from 'react-router';
import Loading from '../components/page/Loading';
import { CustomLogout } from '../components/Logout';
import { WEBSITE_NAME } from '../configs/env';
import { LOGIN_PROMPT, REACT_CALLBACK_PATH } from '../constants';
import { providers } from '../configs/settings';
import ConnectedHeader from '../containers/ConnectedHeader';
import Home from '../containers/pages/Home/Home';

import './App.css';

const { Content } = Layout;

library.add(faUser);

const App = (): JSX.Element => {
  const { IMPLICIT } = AuthorizationGrantType;
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
              redirectPath="/login"
              disableLoginProtection={false}
              exact
              path="/"
              component={Home}
            />
            <Route
              exact
              path="/login"
              render={(routeProps) => (
                <OauthLogin
                  providers={providers}
                  authorizationGrantType={IMPLICIT}
                  OAuthLoginPromptMessage={LOGIN_PROMPT}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={REACT_CALLBACK_PATH}
              render={(routeProps) => {
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
              redirectPath="/login"
              disableLoginProtection={false}
              exact
              path="/logout"
              // tslint:disable-next-line: jsx-no-lambda
              component={() => {
                return <CustomLogout />;
              }}
            />
          </Switch>
        </Content>
      </div>
    </Layout>
  );
};

export default App;
