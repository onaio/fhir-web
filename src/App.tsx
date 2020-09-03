import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Providers } from '@onaio/gatekeeper';
import { Route, Switch } from 'react-router-dom';
import { OauthLogin, ConnectedOauthCallback, getOpenSRPUserInfo } from '@onaio/gatekeeper';

const providers: Providers = {
  OpenSRP: {
    accessTokenUri: 'https://keycloak-stage.smartregister.org/auth/realms/reveal-stage/protocol/openid-connect/token',
    authorizationUri: 'https://keycloak-stage.smartregister.org/auth/realms/reveal-stage/protocol/openid-connect/auth',
    clientId: 'reveal-stage-server',
    redirectUri: 'http://localhost:3000/oauth/callback/OpenSRP/',
    scopes: ['read', 'write'],
    state: 'opensrp',
    userUri: 'https://reveal-stage.smartregister.org/opensrp/user-details',
  }
};

const Home = () => {
  return (
    <div>
      <a href="https://keycloak-stage.smartregister.org/auth/realms/reveal-stage/protocol/openid-connect/auth?client_id=reveal-stage-server&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fcallback%2FOpenSRP%2F&response_type=token&state=opensrp&scope=read%20write">Login</a>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Switch>
          <Route
            exact={true}
            path="/login"
            render={routeProps => <OauthLogin providers={providers} {...routeProps} />}
          />
          <Route
            exact={true}
            path="/oauth/callback/:id"
            render={
              routeProps => <ConnectedOauthCallback providers={providers} oAuthUserInfoGetter={getOpenSRPUserInfo} {...routeProps} />}
          />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </header>
    </div>
  );
}

export default App;
