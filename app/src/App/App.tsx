import React from 'react';
import { Resource404, PrivateComponent, PublicComponent } from '@opensrp/react-utils';
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
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import { Spin } from 'antd';
import { CustomLogout } from '../components/Logout';
import {
  WEBSITE_NAME,
  BACKEND_ACTIVE,
  DISABLE_LOGIN_PROTECTION,
  OPENSRP_ROLES,
} from '../configs/env';
import {
  REACT_CALLBACK_PATH,
  URL_BACKEND_CALLBACK,
  BACKEND_CALLBACK_PATH,
  URL_REACT_LOGIN,
  URL_LOGOUT,
  URL_LOCATION_UNIT,
  URL_HOME,
  URL_TEAMS_EDIT,
  URL_TEAMS_ADD,
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
  URL_TEAM_ASSIGNMENT,
  URL_USER_GROUPS,
  URL_USER_ROLES,
} from '../constants';
import { providers } from '../configs/settings';
import ConnectedHeader from '../containers/ConnectedHeader';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
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
  UserGroupsList,
  UserRolesList,
  URL_USER,
  URL_USER_EDIT,
  ROUTE_PARAM_USER_ID,
  ROUTE_PARAM_USER_GROUP_ID,
  URL_USER_GROUP_EDIT,
  URL_USER_GROUP_CREATE,
  URL_USER_CREATE,
  URL_USER_CREDENTIALS,
  CreateEditUserGroup,
} from '@opensrp/user-management';
import { TeamAssignmentView } from '@opensrp/team-assignment';
import { DownloadClientData } from '@opensrp/card-support';
import {
  UploadForm,
  FileList,
  ROUTE_PARAM_FORM_ID,
  DrafFileList,
  ReleaseList,
  ROUTE_PARAM_FORM_VERSION,
} from '@opensrp/form-config-antd';
import ConnectedHomeComponent from '../containers/pages/Home/Home';
import ConnectedSidebar from '../containers/ConnectedSidebar';
import { TeamsView, TeamsAddEdit } from '@opensrp/team-management';
import {
  LocationUnitList,
  LocationUnitGroupAddEdit,
  LocationUnitGroupList,
  NewLocationUnit,
  EditLocationUnit,
} from '@opensrp/location-management';
import {
  BaseProps,
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
  teamAssignmentProps,
  inventoryServiceProps,
  inventoryItemAddEditProps,
  editLocationProps,
  newLocationUnitProps,
} from './utils';
import './App.css';
import {
  INVENTORY_SERVICE_POINT_LIST_VIEW,
  INVENTORY_SERVICE_POINT_PROFILE_VIEW,
  INVENTORY_SERVICE_POINT_PROFILE_PARAM,
  ConnectedServicePointList,
  ConnectedInventoryAddEdit,
  ServicePointProfile,
  INVENTORY_EDIT_SERVICE_POINT,
  INVENTORY_ADD_SERVICE_POINT,
  ServicePointEdit,
  ServicePointsAdd,
  BulkUpload,
  INVENTORY_BULK_UPLOAD_URL,
  ROUTE_PARAM_SERVICE_POINT_ID,
  ROUTE_PARAM_INVENTORY_ID,
  URL_INVENTORY_EDIT,
  URL_INVENTORY_ADD,
} from '@opensrp/inventory';

import '@opensrp/plans/dist/index.css';
import '@opensrp/team-assignment/dist/index.css';
import '@opensrp/user-management/dist/index.css';
import '@opensrp/product-catalogue/dist/index.css';
import '@opensrp/inventory/dist/index.css';

import { APP_LOGIN_URL } from '../dispatchConfig';

const { Content } = Layout;

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
  const APP_CALLBACK_PATH = BACKEND_ACTIVE ? BACKEND_CALLBACK_PATH : REACT_CALLBACK_PATH;
  const { OpenSRP } = useOAuthLogin({ providers, authorizationGrantType: AuthGrantType });
  const activeRoles = OPENSRP_ROLES;
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
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              exact
              path={URL_USER}
              component={ConnectedUserList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              exact
              path={URL_USER_GROUPS}
              component={UserGroupsList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_USER_ROLES}
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              component={UserRolesList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_USER_GROUPS}/:${ROUTE_PARAM_USER_GROUP_ID}`}
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              component={UserGroupsList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
              exact
              path={URL_TEAMS}
              component={TeamsView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
              exact
              path={URL_TEAM_ASSIGNMENT}
              {...teamAssignmentProps}
              component={TeamAssignmentView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.PRODUCT_CATALOGUE && activeRoles.PRODUCT_CATALOGUE.split(',')
              }
              exact
              path={CATALOGUE_LIST_VIEW_URL}
              {...BaseProps}
              component={ConnectedProductCatalogueList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.PLANS && activeRoles.PLANS.split(',')}
              exact
              path={ACTIVE_PLANS_LIST_VIEW_URL}
              {...plansListProps}
              {...activePlansListStatusProp}
              component={ConnectedPlansList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.PLANS && activeRoles.PLANS.split(',')}
              exact
              path={DRAFT_PLANS_LIST_VIEW_URL}
              {...plansListProps}
              {...draftPlansListStatusProp}
              component={ConnectedPlansList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.PLANS && activeRoles.PLANS.split(',')}
              exact
              path={COMPLETE_PLANS_LIST_VIEW_URL}
              {...plansListProps}
              {...completedPlansListStatusProp}
              component={ConnectedPlansList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.PLANS && activeRoles.PLANS.split(',')}
              exact
              path={TRASH_PLANS_LIST_VIEW_URL}
              {...plansListProps}
              {...trashPlansListStatusProp}
              component={ConnectedPlansList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.PLANS && activeRoles.PLANS.split(',')}
              exact
              path={`${PLANS_ASSIGNMENT_VIEW_URL}/:planId`}
              {...plansListProps}
              {...missionAssignmentProps}
              component={ConnectedPlanAssignment}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.PRODUCT_CATALOGUE && activeRoles.PRODUCT_CATALOGUE.split(',')
              }
              exact
              path={`${CATALOGUE_LIST_VIEW_URL}/:${PRODUCT_ID_ROUTE_PARAM}`}
              {...BaseProps}
              component={ConnectedProductCatalogueList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.PRODUCT_CATALOGUE && activeRoles.PRODUCT_CATALOGUE.split(',')
              }
              exact
              path={CATALOGUE_CREATE_VIEW_URL}
              {...BaseProps}
              component={CreateProductView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.PRODUCT_CATALOGUE && activeRoles.PRODUCT_CATALOGUE.split(',')
              }
              exact
              path={`${CATALOGUE_EDIT_VIEW_URL}/:${PRODUCT_ID_ROUTE_PARAM}`}
              {...BaseProps}
              component={ConnectedEditProductView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.PLANS && activeRoles.PLANS.split(',')}
              exact
              path={PLANS_CREATE_VIEW_URL}
              {...planCreateProps}
              component={CreatePlanView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.INVENTORY && activeRoles.INVENTORY.split(',')}
              exact
              path={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/:${INVENTORY_SERVICE_POINT_PROFILE_PARAM}`}
              {...inventoryServiceProps}
              component={ServicePointProfile}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.INVENTORY && activeRoles.INVENTORY.split(',')}
              exact
              path={INVENTORY_SERVICE_POINT_LIST_VIEW}
              {...inventoryServiceProps}
              component={ConnectedServicePointList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.INVENTORY && activeRoles.INVENTORY.split(',')}
              exact
              {...BaseProps}
              path={INVENTORY_ADD_SERVICE_POINT}
              component={ServicePointsAdd}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.INVENTORY && activeRoles.INVENTORY.split(',')}
              exact
              path={INVENTORY_BULK_UPLOAD_URL}
              {...inventoryServiceProps}
              component={BulkUpload}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.INVENTORY && activeRoles.INVENTORY.split(',')}
              exact
              {...BaseProps}
              path={`${INVENTORY_EDIT_SERVICE_POINT}/:id`}
              component={ServicePointEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.PLANS && activeRoles.PLANS.split(',')}
              exact
              path={`${PLANS_EDIT_VIEW_URL}/:planId`}
              {...planEditProps}
              component={ConnectedEditPlanView}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              exact
              path={`${URL_USER_EDIT}/:${ROUTE_PARAM_USER_ID}`}
              component={ConnectedCreateEditUser}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              exact
              path={`${URL_USER_GROUP_EDIT}/:${ROUTE_PARAM_USER_GROUP_ID}`}
              component={CreateEditUserGroup}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              exact
              path={URL_USER_GROUP_CREATE}
              component={CreateEditUserGroup}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              exact
              path={URL_USER_CREATE}
              component={ConnectedCreateEditUser}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
              exact
              path={`${URL_USER_CREDENTIALS}/:${ROUTE_PARAM_USER_ID}`}
              component={ConnectedUserCredentials}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
              exact
              path={URL_TEAMS_ADD}
              component={TeamsAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
              exact
              path={`${URL_TEAMS_EDIT}/:id`}
              component={TeamsAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.CARD_SUPPORT && activeRoles.CARD_SUPPORT.split(',')}
              exact
              path={URL_DOWNLOAD_CLIENT_DATA}
              component={DownloadClientData}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={false}
              activeRoles={
                activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')
              }
              path={URL_UPLOAD_JSON_VALIDATOR}
              component={UploadForm}
              {...jsonValidatorFormProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')
              }
              exact
              path={`${URL_UPLOAD_JSON_VALIDATOR}/:${ROUTE_PARAM_FORM_ID}`}
              component={UploadForm}
              {...jsonValidatorFormProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')
              }
              exact
              path={URL_JSON_VALIDATOR_LIST}
              component={FileList}
              {...jsonValidatorListProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')
              }
              exact
              path={URL_UPLOAD_DRAFT_FILE}
              component={UploadForm}
              {...draftFormProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')
              }
              exact
              path={`${URL_UPLOAD_DRAFT_FILE}/:${ROUTE_PARAM_FORM_ID}`}
              component={UploadForm}
              {...draftFormProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')
              }
              exact
              path={URL_DRAFT_FILE_LIST}
              component={DrafFileList}
              {...draftListProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')
              }
              exact
              path={URL_MANIFEST_RELEASE_LIST}
              component={ReleaseList}
              {...releaseListProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={
                activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')
              }
              exact
              path={`${URL_MANIFEST_RELEASE_LIST}/:${ROUTE_PARAM_FORM_VERSION}`}
              component={FileList}
              {...releaseViewProps}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
              exact
              path={URL_LOCATION_UNIT}
              component={LocationUnitList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
              exact
              path={URL_LOCATION_UNIT_ADD}
              {...newLocationUnitProps}
              component={NewLocationUnit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
              exact
              path={URL_LOCATION_UNIT_EDIT}
              {...editLocationProps}
              component={EditLocationUnit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
              exact
              path={URL_LOCATION_UNIT_GROUP}
              component={LocationUnitGroupList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
              exact
              path={URL_LOCATION_UNIT_GROUP_ADD}
              component={LocationUnitGroupAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
              exact
              path={URL_LOCATION_UNIT_GROUP_EDIT}
              component={LocationUnitGroupAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.INVENTORY && activeRoles.INVENTORY.split(',')}
              path={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/:${ROUTE_PARAM_SERVICE_POINT_ID}${URL_INVENTORY_ADD}`}
              {...inventoryItemAddEditProps}
              component={ConnectedInventoryAddEdit}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              activeRoles={activeRoles.INVENTORY && activeRoles.INVENTORY.split(',')}
              path={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/:${ROUTE_PARAM_SERVICE_POINT_ID}${URL_INVENTORY_EDIT}/:${ROUTE_PARAM_INVENTORY_ID}`}
              {...inventoryItemAddEditProps}
              component={ConnectedInventoryAddEdit}
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
