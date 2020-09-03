import React from 'react';
import {
  AuthorizationGrantType,
  ConnectedLogout,
  ConnectedOauthCallback,
  OauthLogin,
} from '@onaio/gatekeeper';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Col, Container, Row } from 'reactstrap';
import Loading from './components/page/Loading';
import { LogoutProps } from './components/Logout';
import { Helmet } from 'react-helmet';
import { WEBSITE_NAME, OPENSRP_LOGOUT_URL } from './configs/env';
import { Switch, Route, Redirect } from 'react-router';
import { LOGIN_PROMPT, REACT_CALLBACK_PATH } from './constants';
import { oAuthUserInfoGetter } from './helpers/utils';
import { providers } from './configs/settings';
import ConnectedHeader from './containers/ConnectedHeader';
import './App.css';
import Home from './containers/pages/Home/Home';

/** Interface defining component props */
interface AppProps {
  logoutComponent: (props: LogoutProps) => null;
}

const App = (props: any) => {
  const { IMPLICIT } = AuthorizationGrantType;
  return (
    <Container
      fluid={true}
      style={{
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <Helmet titleTemplate={`%s | ` + WEBSITE_NAME} defaultTitle="" />
      <div className="body-wrapper">
        <ConnectedHeader />
        <Container fluid={true}>
          <Row id="main-page-row">
            <Col>
              <Switch>
                {/* tslint:disable jsx-no-lambda */}
                {/* Home Page view */}
                <ConnectedPrivateRoute
                  redirectPath={'/login'}
                  disableLoginProtection={false}
                  exact={true}
                  path="/"
                  component={Home}
                />
                <Route
                  exact={true}
                  path={'/login'}
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
                  exact={true}
                  path={REACT_CALLBACK_PATH}
                  render={(routeProps) => {
                    return (
                      <ConnectedOauthCallback
                        SuccessfulLoginComponent={() => {
                          return <Redirect to={'/'} />;
                        }}
                        LoadingComponent={Loading}
                        providers={providers}
                        oAuthUserInfoGetter={oAuthUserInfoGetter}
                        {...routeProps}
                      />
                    );
                  }}
                />
                {/* tslint:enable jsx-no-lambda */}
                <ConnectedPrivateRoute
                  redirectPath={'/login'}
                  disableLoginProtection={false}
                  exact={true}
                  path={'/logout'}
                  // tslint:disable-next-line: jsx-no-lambda
                  component={() => {
                    return (
                      <ConnectedLogout
                        {...{
                          logoutURL: OPENSRP_LOGOUT_URL,
                        }}
                      />
                    );
                  }}
                />
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
};

export default App;
