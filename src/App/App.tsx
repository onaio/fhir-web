import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { AuthorizationGrantType, ConnectedOauthCallback, OauthLogin } from '@onaio/gatekeeper';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Col, Container, Row } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { Switch, Route, Redirect } from 'react-router';
import Loading from '../components/page/Loading';
import { CustomLogout } from '../components/Logout';
import { WEBSITE_NAME } from '../configs/env';
import { LOGIN_PROMPT, REACT_CALLBACK_PATH } from '../constants';
import { oAuthUserInfoGetter } from '../helpers/utils';
import { providers } from '../configs/settings';
import ConnectedHeader from '../containers/ConnectedHeader';
import './App.css';
import Home from '../containers/pages/Home/Home';

library.add(faUser);

const App = () => {
  const { IMPLICIT } = AuthorizationGrantType;
  return (
    <Container
      fluid
      style={{
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <Helmet titleTemplate={`%s | ${WEBSITE_NAME}`} defaultTitle="" />
      <div className="body-wrapper">
        <ConnectedHeader />
        <Container fluid>
          <Row id="main-page-row">
            <Col>
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
                        oAuthUserInfoGetter={oAuthUserInfoGetter}
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
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
};

export default App;
