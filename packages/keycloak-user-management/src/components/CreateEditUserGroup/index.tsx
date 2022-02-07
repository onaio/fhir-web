import React from 'react';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import { RouteComponentProps } from 'react-router-dom';
import { defaultInitialValues, UserGroupFormProps } from './Form';
import {
  KEYCLOAK_URL_ASSIGNED_ROLES,
  KEYCLOAK_URL_AVAILABLE_ROLES,
  KEYCLOAK_URL_EFFECTIVE_ROLES,
  ROUTE_PARAM_USER_GROUP_ID,
} from '../../constants';
import lang from '../../lang';
import {
  reducer as keycloakUserGroupsReducer,
  reducerName as keycloakUserGroupsReducerName,
  makeKeycloakUserGroupsSelector,
  KeycloakUserGroup,
} from '../../ducks/userGroups';
import { UserGroupForm } from './Form';
import { fetchAllRoles } from '../UserRolesList/utils';
import { fetchRoleMappings, fetchSingleGroup } from './utils';
import { KeycloakUserRole, makeKeycloakUserRolesSelector } from '../../ducks/userRoles';

reducerRegistry.register(keycloakUserGroupsReducerName, keycloakUserGroupsReducer);

// Define user groups selector instance
const userGroupsSelector = makeKeycloakUserGroupsSelector();

// Define user roles selector instance
const userRolesSelector = makeKeycloakUserRolesSelector();

// Interface for route params
interface RouteParams {
  userGroupId: string;
}

/** props for editing a user view */
export interface EditUserGroupProps {
  keycloakBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type CreateEditGroupPropTypes = EditUserGroupProps & RouteComponentProps<RouteParams>;

/** default props for editing user component */
export const defaultEditUserGroupProps: EditUserGroupProps = {
  keycloakBaseURL: '',
};

/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditUserGroup: React.FC<CreateEditGroupPropTypes> = (
  props: CreateEditGroupPropTypes
) => {
  const { keycloakBaseURL } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [availableRoles, setAvailableRoles] = React.useState<KeycloakUserRole[]>([]);
  const [assignedRoles, setAssignedRoles] = React.useState<KeycloakUserRole[]>([]);
  const [effectiveRoles, setEffectiveRoles] = React.useState<KeycloakUserRole[]>([]);
  const dispatch = useDispatch();
  const userGroupId = props.match.params[ROUTE_PARAM_USER_GROUP_ID];
  const keycloakUserGroup = useSelector((state) =>
    userGroupsSelector(state, { id: [userGroupId] })
  );
  const allRoles = useSelector((state) => userRolesSelector(state, {}));
  const initialValues = keycloakUserGroup.length ? keycloakUserGroup[0] : defaultInitialValues;

  /**
   * Fetch group incase the user group is not available e.g when page is refreshed
   * also fetches all roles, available and assigned roles during edit mode
   */
  React.useEffect(() => {
    if (userGroupId) {
      setIsLoading(true);
      const groupPromise = fetchSingleGroup(userGroupId, keycloakBaseURL, dispatch);
      const allRolesPromise = fetchAllRoles(keycloakBaseURL, dispatch);
      const availableRolesPromise = fetchRoleMappings(
        userGroupId,
        keycloakBaseURL,
        KEYCLOAK_URL_AVAILABLE_ROLES,
        setAvailableRoles
      );
      const assignedRolesPromise = fetchRoleMappings(
        userGroupId,
        keycloakBaseURL,
        KEYCLOAK_URL_ASSIGNED_ROLES,
        setAssignedRoles
      );
      const effectiveRolesPromise = fetchRoleMappings(
        userGroupId,
        keycloakBaseURL,
        KEYCLOAK_URL_EFFECTIVE_ROLES,
        setEffectiveRoles
      );
      Promise.all([
        groupPromise,
        allRolesPromise,
        availableRolesPromise,
        assignedRolesPromise,
        effectiveRolesPromise,
      ])
        .catch(() => {
          sendErrorNotification(lang.ERROR_OCCURED);
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues.id, props.location]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  const userGroupFormProps: UserGroupFormProps = {
    allRoles,
    assignedRoles,
    availableRoles,
    effectiveRoles,
    initialValues: initialValues as KeycloakUserGroup,
    keycloakBaseURL,
  };

  return (
    <Row>
      <Col span={24}>
        <UserGroupForm {...userGroupFormProps} />
      </Col>
    </Row>
  );
};

CreateEditUserGroup.defaultProps = defaultEditUserGroupProps;

export { CreateEditUserGroup };
