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
import { Switch, Route, Redirect, RouteProps, RouteComponentProps, } from 'react-router';
import Loading from '../components/page/Loading';
import { CustomLogout } from '../components/Logout';
import {
  WEBSITE_NAME,
  BACKEND_ACTIVE,
  KEYCLOAK_API_BASE_URL,
  DISABLE_LOGIN_PROTECTION,
} from '../configs/env';
import {
  REACT_CALLBACK_PATH,
  URL_BACKEND_CALLBACK,
  URL_BACKEND_LOGIN,
  BACKEND_CALLBACK_PATH,
  URL_REACT_LOGIN,
  URL_LOGOUT,
} from '../constants';
import { providers } from '../configs/settings';
import ConnectedHeader from '../containers/ConnectedHeader';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
import NotFound from '../components/NotFound';
import '@opensrp/user-management/dist/index.css';
import {
  ConnectedUserList,
  ConnectedCreateEditUser,
  ConnectedUserCredentials,
  URL_ADMIN,
  URL_USER_EDIT,
  ROUTE_PARAM_USER_ID,
  URL_USER_CREATE,
  URL_USER_CREDENTIALS,
} from '@opensrp/user-management';
import ConnectedHomeComponent from '../containers/pages/Home/Home';
import './App.css';

const { Content } = Layout;

interface ComponentProps extends Partial<RouteProps> {
  component: any;
  redirectPath: string;
  disableLoginProtection: boolean;
  path: string;
}

export const PrivateComponent = ({ component: Component, ...rest }: ComponentProps) => {
  return (<ConnectedPrivateRoute
            {...rest} 
            component={(props: any) => <Component {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL}/>} />
    );
};

export const PublicComponent = ({ component: Component, ...rest}: Partial<ComponentProps>) => {
  return (<Route {...rest} component={(props: any) => <Component {...props}/> }/>)
}

export const CallbackComponent = (routeProps: any) => {
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
}

const App: React.FC = () => {
  const APP_CALLBACK_URL = BACKEND_ACTIVE ? URL_BACKEND_CALLBACK : URL_REACT_LOGIN;
  const { IMPLICIT, AUTHORIZATION_CODE } = AuthorizationGrantType;
  const AuthGrantType = BACKEND_ACTIVE ? AUTHORIZATION_CODE : IMPLICIT;
  const APP_LOGIN_URL = BACKEND_ACTIVE ? URL_BACKEND_LOGIN : URL_REACT_LOGIN;
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
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path="/"
              component={ConnectedHomeComponent}
            />
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_ADMIN}
              component={ConnectedUserList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_USER_EDIT}/:${ROUTE_PARAM_USER_ID}`}
              component={ConnectedCreateEditUser}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_USER_CREATE}
              component={ConnectedCreateEditUser}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_USER_CREDENTIALS}/:${ROUTE_PARAM_USER_ID}`}
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
            <PublicComponent
              exact
              path={APP_CALLBACK_PATH}
              component={CallbackComponent}
            />
            {/* tslint:enable jsx-no-lambda */}
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_LOGOUT}
              // tslint:disable-next-line: jsx-no-lambda
              component={CustomLogout}
            />
            <Route exact component={NotFound} />
          </Switch>
        </Content>
      </div>
    </Layout>
  );
};

export default App;
