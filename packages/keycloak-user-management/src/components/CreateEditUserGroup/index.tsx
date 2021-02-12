import React from 'react';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { defaultInitialValues, UserGroupFormProps } from './Form';
import { ROUTE_PARAM_USER_GROUP_ID, KEYCLOAK_URL_USER_GROUPS } from '../../constants';
import { ERROR_OCCURED } from '../../lang';
import {
  reducer as keycloakUserGroupsReducer,
  reducerName as keycloakUserGroupsReducerName,
  fetchKeycloakUserGroups,
  makeKeycloakUserGroupsSelector,
  KeycloakUserGroup,
} from '../../ducks/userGroups';
import { UserGroupForm } from './Form';

reducerRegistry.register(keycloakUserGroupsReducerName, keycloakUserGroupsReducer);

// Define selector instance
const userGroupsSelector = makeKeycloakUserGroupsSelector();

/** props for editing a user view */
export interface EditUserGroupProps {
  keycloakBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type CreateEditGroupPropTypes = EditUserGroupProps & RouteComponentProps;

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
  const dispatch = useDispatch();
  const params = useParams<{ [ROUTE_PARAM_USER_GROUP_ID]: string }>();
  const userGroupId = params[ROUTE_PARAM_USER_GROUP_ID];
  const keycloakUserGroup = useSelector((state) =>
    userGroupsSelector(state, { id: [userGroupId] })
  );
  const initialValues = keycloakUserGroup.length ? keycloakUserGroup[0] : defaultInitialValues;

  /**
   * Fetch group incase the user group is not available e.g when page is refreshed
   */
  React.useEffect(() => {
    if (userGroupId) {
      const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
      setIsLoading(true);
      serve
        .read(userGroupId)
        .then((response: KeycloakUserGroup) => {
          dispatch(fetchKeycloakUserGroups([response]));
        })
        .catch((_: Error) => {
          sendErrorNotification(ERROR_OCCURED);
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Spin size="large" />;
  }

  const userGroupFormProps: UserGroupFormProps = {
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
