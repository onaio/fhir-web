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
  OPENSRP_API_BASE_URL,
} from '../configs/env';
import {
  REACT_CALLBACK_PATH,
  URL_BACKEND_CALLBACK,
  URL_BACKEND_LOGIN,
  BACKEND_CALLBACK_PATH,
  URL_REACT_LOGIN,
  URL_LOGOUT,
  URL_LOCATION_UNIT,
  URL_HOME,
  URL_TEAM_EDIT,
  URL_TEAM_ADD,
  URL_TEAMS,
  URL_DOWNLOAD_CLIENT_DATA,
  URL_LOCATION_UNIT_ADD,
  URL_LOCATION_UNIT_GROUP,
  URL_LOCATION_UNIT_GROUP_ADD,
  URL_LOCATION_UNIT_GROUP_EDIT,
  URL_LOCATION_UNIT_EDIT,
  URL_UPLOAD_JSON_VALIDATOR,
  URL_JSON_VALIDATOR_LIST,
  URL_UPLOAD_DRAFT_FILE,
  URL_DRAFT_FILE_LIST,
  URL_MANIFEST_RELEASE_LIST,
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
  ConnectedPlansList,
  ACTIVE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  TRASH_PLANS_LIST_VIEW_URL,
  ConnectedEditPlanView,
  CreatePlanView,
  PLANS_CREATE_VIEW_URL,
  PLANS_EDIT_VIEW_URL,
  ConnectedPlanAssignment,
  PLANS_ASSIGNMENT_VIEW_URL,
} from '@opensrp/plans';
import {
  ConnectedUserList,
  ConnectedCreateEditUser,
  ConnectedUserCredentials,
  URL_USER,
  URL_USER_EDIT,
  ROUTE_PARAM_USER_ID,
  URL_USER_CREATE,
  URL_USER_CREDENTIALS,
} from '@opensrp/user-management';
import { DownloadClientData } from '@opensrp/card-support';
import {
  AntdUploadForm,
  AntdFilesList,
  ROUTE_PARAM_FORM_ID,
  AntdDraftFileList,
  AntdReleaseList,
  ROUTE_PARAM_FORM_VERSION,
} from '@opensrp/form-config';
import ConnectedHomeComponent from '../containers/pages/Home/Home';
import './App.css';
import ConnectedSidebar from '../containers/ConnectedSidebar';
import { TeamsView, TeamsAddEdit } from '@opensrp/team-management';
import {
  LocationUnitAddEdit,
  LocationUnitView,
  LocationUnitGroupAddEdit,
  LocationUnitGroupView,
} from '@opensrp/location-management';
import '@opensrp/product-catalogue/dist/index.css';
import {
  productCatalogueProps,
  jsonValidatorListProps,
  jsonValidatorFormProps,
  draftFormProps,
  draftListProps,
  releaseListProps,
  releaseViewProps,
  plansListProps,
  planEditProps,
  planCreateProps,
  activePlansListStatusProp,
  draftPlansListStatusProp,
  completedPlansListStatusProp,
  trashPlansListStatusProp,
  missionAssignmentProps,
  inventoryServiceProps,
} from './utils';
import '@opensrp/plans/dist/index.css';
import '@opensrp/plan-form/dist/index.css';
import {
  INVENTORY_SERVICE_POINT_LIST_VIEW,
  ConnectedServicePointList,
  ConnectedServicePointProfile,
} from '@opensrp/inventory';
import '@opensrp/inventory/dist/index.css';

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

export const PrivateComponent = (props: ComponentProps) => {
  //  props to pass on to Connected Private Route
  const CPRProps = {
    ...props,
    keycloakBaseURL: KEYCLOAK_API_BASE_URL,
    opensrpBaseURL: OPENSRP_API_BASE_URL,
  };
  return <ConnectedPrivateRoute {...CPRProps} />;
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

export const LoadingComponent = () => <Spin size="large" />;
export const SuccessfulLoginComponent = () => <Redirect to="/" />;

export const CallbackComponent = (routeProps: RouteComponentProps<RouteParams>) => {
  if (BACKEND_ACTIVE) {
    return <CustomConnectedAPICallBack {...routeProps} />;
  }

  return (
    <ConnectedOauthCallback
      SuccessfulLoginComponent={SuccessfulLoginComponent}
      LoadingComponent={LoadingComponent}
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
              path={URL_USER}
              component={ConnectedUserList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_TEAMS}
              component={TeamsView}
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
              path={ACTIVE_PLANS_LIST_VIEW_URL}
              {...plansListProps}
              {...activePlansListStatusProp}
              component={ConnectedPlansList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={DRAFT_PLANS_LIST_VIEW_URL}
              {...plansListProps}
              {...draftPlansListStatusProp}
              component={ConnectedPlansList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={COMPLETE_PLANS_LIST_VIEW_URL}
              {...plansListProps}
              {...completedPlansListStatusProp}
              component={ConnectedPlansList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={TRASH_PLANS_LIST_VIEW_URL}
              {...plansListProps}
              {...trashPlansListStatusProp}
              component={ConnectedPlansList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${PLANS_ASSIGNMENT_VIEW_URL}/:planId`}
              {...plansListProps}
              {...missionAssignmentProps}
              component={ConnectedPlanAssignment}
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
              path={PLANS_CREATE_VIEW_URL}
              {...planCreateProps}
              component={CreatePlanView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${INVENTORY_SERVICE_POINT_LIST_VIEW}/:servicePointId`}
              {...inventoryServiceProps}
              component={ConnectedServicePointProfile}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={INVENTORY_SERVICE_POINT_LIST_VIEW}
              {...inventoryServiceProps}
              component={ConnectedServicePointList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${PLANS_EDIT_VIEW_URL}/:planId`}
              {...planEditProps}
              component={ConnectedEditPlanView}
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
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_TEAM_ADD}
              component={TeamsAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_TEAM_EDIT}
              component={TeamsAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_DOWNLOAD_CLIENT_DATA}
              component={DownloadClientData}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={false}
              path={URL_UPLOAD_JSON_VALIDATOR}
              component={AntdUploadForm.UploadForm}
              {...jsonValidatorFormProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_UPLOAD_JSON_VALIDATOR}/:${ROUTE_PARAM_FORM_ID}`}
              component={AntdUploadForm.UploadForm}
              {...jsonValidatorFormProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_JSON_VALIDATOR_LIST}
              component={AntdFilesList.FileList}
              {...jsonValidatorListProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_UPLOAD_DRAFT_FILE}
              component={AntdUploadForm.UploadForm}
              {...draftFormProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_UPLOAD_DRAFT_FILE}/:${ROUTE_PARAM_FORM_ID}`}
              component={AntdUploadForm.UploadForm}
              {...draftFormProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_DRAFT_FILE_LIST}
              component={AntdDraftFileList.DrafFileList}
              {...draftListProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_MANIFEST_RELEASE_LIST}
              component={AntdReleaseList.ReleaseList}
              {...releaseListProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_MANIFEST_RELEASE_LIST}/:${ROUTE_PARAM_FORM_VERSION}`}
              component={AntdFilesList.FileList}
              {...releaseViewProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_LOCATION_UNIT}
              component={LocationUnitView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_LOCATION_UNIT_ADD}
              component={LocationUnitAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_LOCATION_UNIT_EDIT}
              component={LocationUnitAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_LOCATION_UNIT_GROUP}
              component={LocationUnitGroupView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_LOCATION_UNIT_GROUP_ADD}
              component={LocationUnitGroupAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_LOCATION_UNIT_GROUP_EDIT}
              component={LocationUnitGroupAddEdit}
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
