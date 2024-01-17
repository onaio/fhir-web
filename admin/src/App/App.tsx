import React from 'react';
import { Helmet } from 'react-helmet';
import { Layout, Spin } from 'antd';
import { WEBSITE_NAME } from '../configs/env';
import ConnectedHeader from '../containers/ConnectedHeader';
import ConnectedSidebar from '../containers/ConnectedSidebar';
import './App.css';
import { BACKEND_ACTIVE, DISABLE_LOGIN_PROTECTION } from '../configs/env';
import { BACKEND_CALLBACK_PATH, REACT_CALLBACK_PATH, URL_BACKEND_CALLBACK, URL_HOME, URL_LOGOUT, URL_REACT_LOGIN } from '../constants';
import { Home } from '../containers/pages/Home/Home';
import { useTranslation } from '@opensrp/i18n';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { PublicComponent, Resource404 } from '@opensrp/react-utils';
import { CustomLogout } from '../components/Logout';
import { APP_LOGIN_URL } from '../configs/dispatchConfig';
import { AuthorizationGrantType, ConnectedOauthCallback, OauthCallbackProps, RouteParams, getOpenSRPUserInfo, useOAuthLogin } from '@onaio/gatekeeper';
import { providers } from '../configs/settings';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
// import { FHIRApps } from './fhir-apps';

const { Content } = Layout;


/** Util function that renders Oauth2 callback components
 *
 * @param routeProps - Component route props object
 */

export const LoadingComponent = () => <Spin size="large" className="custom-spinner" />;
export const SuccessfulLoginComponent = () => {
  return <Redirect to="/" />;
};

export const CallbackComponent = (routeProps: RouteComponentProps<RouteParams>) => {
  const props = {
    SuccessfulLoginComponent,
    LoadingComponent,
    providers,
    oAuthUserInfoGetter: getOpenSRPUserInfo,
    ...routeProps,
    // ts bug - default props not working, ts asking for default props to be repassed https://github.com/microsoft/TypeScript/issues/31247
  } as unknown as OauthCallbackProps<RouteParams>;

  if (BACKEND_ACTIVE) {
    return <CustomConnectedAPICallBack {...routeProps} />;
  }

  return <ConnectedOauthCallback {...props} />;
};


const App: React.FC = () => {

  const APP_CALLBACK_URL = BACKEND_ACTIVE ? URL_BACKEND_CALLBACK : URL_REACT_LOGIN;
  const { IMPLICIT, AUTHORIZATION_CODE } = AuthorizationGrantType;
  const AuthGrantType = BACKEND_ACTIVE ? AUTHORIZATION_CODE : IMPLICIT;
  const APP_CALLBACK_PATH = BACKEND_ACTIVE ? BACKEND_CALLBACK_PATH : REACT_CALLBACK_PATH;
  const { OpenSRP } = useOAuthLogin({ providers, authorizationGrantType: AuthGrantType });

  useTranslation();

  return (

    <Layout>
      <Helmet titleTemplate={`%s | ${WEBSITE_NAME}`} defaultTitle="" />
      <ConnectedSidebar />
      <div className="body-wrapper">
        <ConnectedHeader />
        <Content>
          <Switch>
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_HOME}
              component={Home}
            />
            <Route
              exact
              path={APP_LOGIN_URL}
              render={() => {
                console.log("Rendered")
                window.location.href = OpenSRP;
                return <></>;
              }}
            />
            <PublicComponent exact path={APP_CALLBACK_PATH} component={CallbackComponent} />
            {/* tslint:enable jsx-no-lambda */}
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_LOGOUT}
              // tslint:disable-next-line: jsx-no-lambda
              component={CustomLogout}
            />
            <Route exact component={Resource404} />
          </Switch>
        </Content>
      </div>
    </Layout>
  );
};

export default App;
