import React from 'react';

import {
  AuthorizationGrantType,
  ConnectedOauthCallback,
  getOpenSRPUserInfo,
  RouteParams,
  useOAuthLogin,
} from '@onaio/gatekeeper';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import { Switch, Route, Redirect, RouteProps, RouteComponentProps } from 'react-router';
import { Spin } from 'antd';
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
  URL_HOME,
} from '../constants';
import { providers } from '../configs/settings';
import ConnectedHeader from '../containers/ConnectedHeader';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
import NotFound from '../components/NotFound';
import '@opensrp/user-management/dist/index.css';
import {
  ConnectedProductCatalogueList,
  CATALOGUE_LIST_VIEW_URL,
  PRODUCT_ID_ROUTE_PARAM,
  CATALOGUE_CREATE_VIEW_URL,
  CreateProductView,
  CATALOGUE_EDIT_VIEW_URL,
  ConnectedEditProductView,
} from '@opensrp/product-catalogue';
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
import ConnectedSidebar from '../containers/ConnectedSidebar';
import '@opensrp/product-catalogue/dist/index.css';
import { productCatalogueProps } from './utils';

const { Content } = Layout;

interface ComponentProps extends Partial<RouteProps> {
  component: any;
  redirectPath: string;
  disableLoginProtection: boolean;
  path: string;
}

/** Util wrapper around ConnectedPrivateRoute to render components
 *  that use private routes/ require authentication
 *
 * @param props - Component props object
 */

export const PrivateComponent = ({ component: Component, ...rest }: ComponentProps) => {
  return (
    <ConnectedPrivateRoute
      {...rest}
      component={(props: RouteComponentProps) => (
        <Component {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
      )}
    />
  );
};

/** Util wrapper around Route for rendering components
 *  that use public routes/ dont require authentication
 *
 * @param props - Component props object
 */

export const PublicComponent = ({ component: Component, ...rest }: Partial<ComponentProps>) => {
  return <Route {...rest} component={(props: RouteComponentProps) => <Component {...props} />} />;
};

/** Util function that renders Oauth2 callback components
 *
 * @param routeProps - Component route props object
 */

export const CallbackComponent = (routeProps: RouteComponentProps<RouteParams>) => {
  if (BACKEND_ACTIVE) {
    return <CustomConnectedAPICallBack {...routeProps} />;
  }
  return (
    <ConnectedOauthCallback
      SuccessfulLoginComponent={() => {
        return <Redirect to="/" />;
      }}
      LoadingComponent={() => <Spin size="large" />}
      providers={providers}
      oAuthUserInfoGetter={getOpenSRPUserInfo}
      {...routeProps}
    />
  );
};

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
      <ConnectedSidebar />
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
              path={URL_HOME}
              component={ConnectedHomeComponent}
            />
            <PrivateComponent
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
              path={CATALOGUE_LIST_VIEW_URL}
              {...productCatalogueProps}
              component={ConnectedProductCatalogueList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${CATALOGUE_LIST_VIEW_URL}/:${PRODUCT_ID_ROUTE_PARAM}`}
              {...productCatalogueProps}
              component={ConnectedProductCatalogueList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={CATALOGUE_CREATE_VIEW_URL}
              {...productCatalogueProps}
              component={CreateProductView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${CATALOGUE_EDIT_VIEW_URL}/:${PRODUCT_ID_ROUTE_PARAM}`}
              {...productCatalogueProps}
              component={ConnectedEditProductView}
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
            <PublicComponent exact path={APP_CALLBACK_PATH} component={CallbackComponent} />
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
