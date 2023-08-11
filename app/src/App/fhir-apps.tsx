import React from 'react';
import { Resource404, PrivateComponent, PublicComponent } from '@opensrp/react-utils';
import {
  AuthorizationGrantType,
  ConnectedOauthCallback,
  getOpenSRPUserInfo,
  RouteParams,
  useOAuthLogin,
  OauthCallbackProps,
} from '@onaio/gatekeeper';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import { Spin } from 'antd';
import { CustomLogout } from '../components/Logout';
import {
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
  URL_LOCATION_UNIT_ADD,
  URL_LOCATION_UNIT_EDIT,
  URL_JSON_VALIDATOR_LIST,
  URL_USER_GROUPS,
  URL_USER_ROLES,
  URL_FHIR_CARE_TEAM,
  URL_TEAM_ASSIGNMENT,
} from '../constants';
import { providers } from '../configs/settings';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
import { PatientsList, PatientDetails, LIST_PATIENTS_URL } from '@opensrp/fhir-client';
import {
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
import {
  CareTeamList,
  ROUTE_PARAM_CARE_TEAM_ID,
  CreateEditCareTeam,
  URL_CREATE_CARE_TEAM,
  URL_EDIT_CARE_TEAM,
} from '@opensrp/fhir-care-team';
import {
  CreateEditUser as FHIRConnectedCreateEditUser,
  UserList as FhirUserList,
} from '@opensrp/fhir-user-management';
import { Home } from '../containers/pages/Home/Home';
import {
  HealthCareList,
  HealthCareAddEdit,
  LIST_HEALTHCARE_URL,
  ADD_EDIT_HEALTHCARE_SERVICE_URL,
} from '@opensrp/fhir-healthcare-service';
import {
  OrganizationList as FhirTeamsList,
  AddEditOrganization as FhirTeamsAddEdit,
  AffiliationList as FhirTeamAssignment,
} from '@opensrp/fhir-team-management';
import {
  LocationUnitList as FHIRLocationUnitList,
  NewEditLocationUnit as FHIRNewEditLocationUnit,
} from '@opensrp/fhir-location-management';
import {
  jsonValidatorListProps,
  teamAssignmentProps,
  teamAffiliationProps,
  editLocationProps,
  newLocationUnitProps,
  locationUnitProps,
  usersListProps,
  teamManagementProps,
  patientProps,
  fhirCreateEditUserProps,
  commmodityProps,
} from './utils';
import './App.css';
import {
  QuestionnaireList,
  QuestionnaireResponseList,
  QUEST_VIEW_URL,
  QUEST_RESPONSE_VIEW_URL,
  qrListRouteKey,
  QUEST_FORM_VIEW_URL,
} from '@opensrp/fhir-views';
import { QuestRForm, resourceTypeParam, resourceIdParam } from '@opensrp/fhir-quest-form';
import {
  CommodityList,
  ADD_EDIT_COMMODITY_URL,
  CommodityAddEdit,
  GroupList,
  LIST_COMMODITY_URL,
  LIST_GROUP_URL,
} from '@opensrp/fhir-group-management';
import { useTranslation } from '../mls';
import '@opensrp/plans/dist/index.css';
import '@opensrp/user-management/dist/index.css';
import '@opensrp/product-catalogue/dist/index.css';
import '@opensrp/inventory/dist/index.css';
import { APP_LOGIN_URL } from '../configs/dispatchConfig';

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

const FHIRApps = () => {
  const APP_CALLBACK_URL = BACKEND_ACTIVE ? URL_BACKEND_CALLBACK : URL_REACT_LOGIN;
  const { IMPLICIT, AUTHORIZATION_CODE } = AuthorizationGrantType;
  const AuthGrantType = BACKEND_ACTIVE ? AUTHORIZATION_CODE : IMPLICIT;
  const APP_CALLBACK_PATH = BACKEND_ACTIVE ? BACKEND_CALLBACK_PATH : REACT_CALLBACK_PATH;
  const { OpenSRP } = useOAuthLogin({ providers, authorizationGrantType: AuthGrantType });
  const activeRoles = OPENSRP_ROLES;

  useTranslation();

  return (
    <Switch>
      {/* tslint:disable jsx-no-lambda */}
      {/* Home Page view */}
      <ConnectedPrivateRoute
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_HOME}
        component={Home}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.QUEST && activeRoles.QUEST.split(',')}
        path={`${QUEST_FORM_VIEW_URL}/:${resourceIdParam}/:${resourceTypeParam}`}
        component={QuestRForm}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.QUEST && activeRoles.QUEST.split(',')}
        path={`${QUEST_RESPONSE_VIEW_URL}/:${qrListRouteKey}`}
        component={QuestionnaireResponseList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.QUEST && activeRoles.QUEST.split(',')}
        path={QUEST_VIEW_URL}
        component={QuestionnaireList}
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
        activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
        exact
        path={LIST_PATIENTS_URL}
        {...patientProps}
        component={PatientsList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${LIST_PATIENTS_URL}/:${'id'}`}
        activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
        {...patientProps}
        component={PatientDetails}
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
        activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
        exact
        path={URL_USER}
        {...usersListProps}
        component={FhirUserList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
        exact
        path={URL_FHIR_CARE_TEAM}
        component={CareTeamList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
        exact
        path={`${URL_EDIT_CARE_TEAM}/:${ROUTE_PARAM_CARE_TEAM_ID}`}
        component={CreateEditCareTeam}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
        exact
        path={URL_CREATE_CARE_TEAM}
        component={CreateEditCareTeam}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
        exact
        path={`${URL_USER_EDIT}/:${ROUTE_PARAM_USER_ID}`}
        {...(fhirCreateEditUserProps)}
        component={
          FHIRConnectedCreateEditUser
        }
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
        {...(fhirCreateEditUserProps)}
        component={
          FHIRConnectedCreateEditUser
        }
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
        activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
        exact
        path={`${URL_USER}/:id`}
        {...usersListProps}
        component={FhirUserList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
        exact
        path={URL_TEAMS}
        {...teamAssignmentProps}
        component={FhirTeamsList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
        exact
        path={URL_TEAM_ASSIGNMENT}
        {...teamAffiliationProps}
        component={FhirTeamAssignment}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
        exact
        path={URL_TEAMS_ADD}
        {...teamManagementProps}
        component={FhirTeamsAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
        exact
        path={`${URL_TEAMS_EDIT}/:id`}
        {...teamManagementProps}
        component={FhirTeamsAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
        exact
        path={`${URL_TEAMS}/:id`}
        {...teamAffiliationProps}
        component={FhirTeamsList}
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
        activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
        exact
        path={URL_LOCATION_UNIT}
        {...locationUnitProps}
        component={FHIRLocationUnitList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
        exact
        path={URL_LOCATION_UNIT_ADD}
        {...newLocationUnitProps}
        component={FHIRNewEditLocationUnit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
        exact
        path={URL_LOCATION_UNIT_EDIT}
        {...editLocationProps}
        component={FHIRNewEditLocationUnit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={
          activeRoles.HEALTHCARE_SERVICE && activeRoles.HEALTHCARE_SERVICE.split(',')
        }
        path={`${ADD_EDIT_HEALTHCARE_SERVICE_URL}/:id`}
        component={HealthCareAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={
          activeRoles.HEALTHCARE_SERVICE && activeRoles.HEALTHCARE_SERVICE.split(',')
        }
        path={ADD_EDIT_HEALTHCARE_SERVICE_URL}
        component={HealthCareAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={
          activeRoles.HEALTHCARE_SERVICE && activeRoles.HEALTHCARE_SERVICE.split(',')
        }
        path={`${LIST_HEALTHCARE_URL}/:id`}
        component={HealthCareList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={
          activeRoles.HEALTHCARE_SERVICE && activeRoles.HEALTHCARE_SERVICE.split(',')
        }
        path={LIST_HEALTHCARE_URL}
        component={HealthCareList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.GROUP && activeRoles.GROUP.split(',')}
        path={`${ADD_EDIT_COMMODITY_URL}/:id`}
        exact
        {...commmodityProps}
        component={CommodityAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.GROUP && activeRoles.GROUP.split(',')}
        path={ADD_EDIT_COMMODITY_URL}
        {...commmodityProps}
        exact
        component={CommodityAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.GROUP && activeRoles.GROUP.split(',')}
        path={`${LIST_GROUP_URL}/:id`}
        component={GroupList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.GROUP && activeRoles.GROUP.split(',')}
        path={LIST_GROUP_URL}
        component={GroupList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.COMMODITY && activeRoles.COMMODITY.split(',')}
        path={`${LIST_COMMODITY_URL}/:id`}
        {...commmodityProps}
        component={CommodityList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        activeRoles={activeRoles.COMMODITY && activeRoles.COMMODITY.split(',')}
        path={LIST_COMMODITY_URL}
        {...commmodityProps}
        component={CommodityList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_USER_GROUPS}/:${ROUTE_PARAM_USER_GROUP_ID}`}
        activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
        component={UserGroupsList}
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
  );
};

export { FHIRApps };
