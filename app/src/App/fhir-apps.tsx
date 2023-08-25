import React from 'react';
import { Resource404, PrivateComponent } from '@opensrp/react-utils';
import {
  AuthorizationGrantType,
  ConnectedOauthCallback,
  getOpenSRPUserInfo,
  RouteParams,
  useOAuthLogin,
  OauthCallbackProps,
} from '@onaio/gatekeeper';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Routes, Route, Navigate, Params, Outlet } from 'react-router';
import { Spin } from 'antd';
import { CustomLogout } from '../components/Logout';
import { BACKEND_ACTIVE, DISABLE_LOGIN_PROTECTION, OPENSRP_ROLES } from '../configs/env';
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
import '@opensrp/user-management/dist/index.css';
import { APP_LOGIN_URL } from '../configs/dispatchConfig';
import { AuthLayout } from './AuthLayout';

/** Util function that renders Oauth2 callback components
 *
 * @param routeProps - Component route props object
 */

export const LoadingComponent = () => <Spin size="large" className="custom-spinner" />;
export const SuccessfulLoginComponent = () => {
  return <Navigate to="/" />;
};

export const CallbackComponent = (routeProps: Params) => {
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
    <Routes>
      {/* tslint:disable jsx-no-lambda */}
      {/* Home Page view */}
      <Route
        path={URL_HOME}
        element={<AuthLayout />}
      >
        <Route
          path={`${QUEST_FORM_VIEW_URL}/:${resourceIdParam}/:${resourceTypeParam}`}
          element={
            <PrivateComponent
              activeRoles={activeRoles.QUEST && activeRoles.QUEST.split(',')}
              component={QuestRForm}
            />
          }
        />
        <Route
          path={`${QUEST_RESPONSE_VIEW_URL}/:${qrListRouteKey}`}
          element={
            <PrivateComponent
              activeRoles={activeRoles.QUEST && activeRoles.QUEST.split(',')}
              component={QuestionnaireResponseList}
            />
          }
        />
        <Route
          path={QUEST_VIEW_URL}
          element={<PrivateComponent
            activeRoles={activeRoles.QUEST && activeRoles.QUEST.split(',')}
            component={QuestionnaireList}
          />
          }
        />
        <Route
          path={URL_USER_GROUPS}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            component={UserGroupsList}
          />}
        />
        <Route
          path={`${LIST_PATIENTS_URL}/:${'id'}`}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            {...patientProps}
            component={PatientDetails}
          />}
        />
        <Route
          path={LIST_PATIENTS_URL}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            {...patientProps}
            component={PatientsList}
          />}
        />
        <Route
          path={URL_USER_ROLES}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            component={UserRolesList}
          />}
        />
        <Route
          path={URL_USER}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            {...usersListProps}
            component={FhirUserList}
          />}
        />
        <Route
          path={URL_FHIR_CARE_TEAM}
          element={<PrivateComponent
            activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
            component={CareTeamList}
          />}
        />
        <Route
          path={`${URL_EDIT_CARE_TEAM}/:${ROUTE_PARAM_CARE_TEAM_ID}`}
          element={<PrivateComponent
            activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
            component={CreateEditCareTeam}
          />}
        />
        <Route
          path={`${URL_USER_GROUP_EDIT}/:${ROUTE_PARAM_USER_GROUP_ID}`}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            component={CreateEditUserGroup}
          />}
        />
        <Route
          path={URL_CREATE_CARE_TEAM}
          element={<PrivateComponent
            activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
            component={CreateEditCareTeam}
          />}
        />
        <Route
          path={`${URL_USER_EDIT}/:${ROUTE_PARAM_USER_ID}`}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            {...fhirCreateEditUserProps}
            component={FHIRConnectedCreateEditUser}
          />}
        />
        <Route
          path={URL_USER_GROUP_CREATE}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            component={CreateEditUserGroup}
          />}
        />
        <Route
          path={URL_USER_CREATE}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            {...fhirCreateEditUserProps}
            component={FHIRConnectedCreateEditUser}
          />}
        />
        <Route
          path={`${URL_USER_CREDENTIALS}/:${ROUTE_PARAM_USER_ID}`}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            component={ConnectedUserCredentials}
          />}
        />
        <Route
          path={`${URL_USER}/:id`}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            {...usersListProps}
            component={FhirUserList}
          />}
        />
        <Route
          path={URL_TEAMS}
          element={<PrivateComponent
            activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
            {...teamAssignmentProps}
            component={FhirTeamsList}
          />}
        />
        <Route
          path={URL_TEAM_ASSIGNMENT}
          element={<PrivateComponent
            activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
            {...teamAffiliationProps}
            component={FhirTeamAssignment}
          />}
        />
        <Route
          path={URL_TEAMS_ADD}
          element={<PrivateComponent
            activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
            {...teamManagementProps}
            component={FhirTeamsAddEdit}
          />}
        />
        <Route
          path={`${URL_TEAMS_EDIT}/:id`}
          element={<PrivateComponent
            activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
            {...teamManagementProps}
            component={FhirTeamsAddEdit}
          />}
        />
        <Route
          path={`${URL_TEAMS}/:id`}
          element={<PrivateComponent
            activeRoles={activeRoles.TEAMS && activeRoles.TEAMS.split(',')}
            {...teamAffiliationProps}
            component={FhirTeamsList}
          />}
        />
        <Route
          path={URL_JSON_VALIDATOR_LIST}
          element={<PrivateComponent
            activeRoles={activeRoles.FORM_CONFIGURATION && activeRoles.FORM_CONFIGURATION.split(',')}
            component={FileList}
            {...jsonValidatorListProps}
          />}
        />
        <Route
          path={URL_LOCATION_UNIT}
          element={<PrivateComponent
            activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
            {...locationUnitProps}
            component={FHIRLocationUnitList}
          />}
        />
        <Route
          path={URL_LOCATION_UNIT_ADD}
          element={<PrivateComponent
            activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
            {...newLocationUnitProps}
            component={FHIRNewEditLocationUnit}
          />}
        />
        <Route
          path={URL_LOCATION_UNIT_EDIT}
          element={<PrivateComponent
            activeRoles={activeRoles.LOCATIONS && activeRoles.LOCATIONS.split(',')}
            {...editLocationProps}
            component={FHIRNewEditLocationUnit}
          />}
        />
        <Route
          path={`${ADD_EDIT_HEALTHCARE_SERVICE_URL}/:id`}
          element={<PrivateComponent
            activeRoles={activeRoles.HEALTHCARE_SERVICE && activeRoles.HEALTHCARE_SERVICE.split(',')}
            component={HealthCareAddEdit}
          />}
        />
        <Route
          path={ADD_EDIT_HEALTHCARE_SERVICE_URL}
          element={<PrivateComponent
            activeRoles={activeRoles.HEALTHCARE_SERVICE && activeRoles.HEALTHCARE_SERVICE.split(',')}
            component={HealthCareAddEdit}
          />}
        />
        <Route
          path={`${LIST_HEALTHCARE_URL}/:id`}
          element={<PrivateComponent
            activeRoles={activeRoles.HEALTHCARE_SERVICE && activeRoles.HEALTHCARE_SERVICE.split(',')}
            component={HealthCareList}
          />}
        />
        <Route
          path={LIST_HEALTHCARE_URL}
          element={<PrivateComponent
            activeRoles={activeRoles.HEALTHCARE_SERVICE && activeRoles.HEALTHCARE_SERVICE.split(',')}
            component={HealthCareList}
          />}
        />
        <Route
          path={`${ADD_EDIT_COMMODITY_URL}/:id`}
          element={<PrivateComponent
            activeRoles={activeRoles.GROUP && activeRoles.GROUP.split(',')}
            {...commmodityProps}
            component={CommodityAddEdit}
          />}
        />
        <Route
          path={ADD_EDIT_COMMODITY_URL}
          element={<PrivateComponent
            activeRoles={activeRoles.GROUP && activeRoles.GROUP.split(',')}
            {...commmodityProps}
            component={CommodityAddEdit}
          />}
        />
        <Route
          path={`${LIST_GROUP_URL}/:id`}
          element={<PrivateComponent
            activeRoles={activeRoles.GROUP && activeRoles.GROUP.split(',')}
            component={GroupList}
          />}
        />
        <Route
          path={`${LIST_COMMODITY_URL}/:id`}
          element={<PrivateComponent
            activeRoles={activeRoles.COMMODITY && activeRoles.COMMODITY.split(',')}
            {...commmodityProps}
            component={CommodityList}
          />}
        />
        <Route
          path={LIST_GROUP_URL}
          element={<PrivateComponent
            activeRoles={activeRoles.GROUP && activeRoles.GROUP.split(',')}
            component={GroupList}
          />}
        />
        <Route
          path={LIST_COMMODITY_URL}
          element={<PrivateComponent
            activeRoles={activeRoles.COMMODITY && activeRoles.COMMODITY.split(',')}
            {...commmodityProps}
            component={CommodityList}
          />}
        />

        <Route
          path={`${URL_USER_GROUPS}/:${ROUTE_PARAM_USER_GROUP_ID}`}
          element={<PrivateComponent
            activeRoles={activeRoles.USERS && activeRoles.USERS.split(',')}
            component={UserGroupsList}
          />}
        />
        <Route
          path={APP_LOGIN_URL}
          element={() => {
            window.location.href = OpenSRP;
            return <></>;
          }}
        />
        {/* <PublicComponent path={APP_CALLBACK_PATH} element={CallbackComponent} /> */}
        {/* tslint:enable jsx-no-lambda */}
      </Route>
      <Route element={Resource404} />
    </Routes>
  );
};

export { FHIRApps };
