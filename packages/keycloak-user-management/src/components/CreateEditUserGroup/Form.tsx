import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Input, Transfer } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { KEYCLOAK_URL_USER_GROUPS, URL_USER_GROUPS } from '../../constants';
import {
  CANCEL,
  SAVE,
  SAVING,
  NAME_REQUIRED,
  NAME,
  EDIT_USER_GROUP,
  MESSAGE_USER_GROUP_EDITED,
  MESSAGE_USER_GROUP_CREATED,
  ADD_USER_GROUP,
} from '../../lang';
import { KeycloakUserGroup } from '../../ducks/userGroups';
import { fetchAssignedRoles, fetchAvailableRoles } from './utils';
/** Interface for practitioner json object */
export interface Practitioner {
  active: boolean;
  identifier: string;
  name: string;
  userId: string;
  username: string;
}
/** props for editing a user view */
export interface UserGroupFormProps {
  initialValues: KeycloakUserGroup;
  keycloakBaseURL: string;
}
/** default form initial values */
export const defaultInitialValues: KeycloakUserGroup = {
  access: {
    view: false,
    manage: false,
    manageMembership: false,
  },
  attributes: {},
  clientRoles: {},
  id: '',
  name: '',
  path: '',
  realmRoles: [],
  subGroups: [],
};
/** default props for editing user component */
export const defaultProps: Partial<UserGroupFormProps> = {
  initialValues: defaultInitialValues,
  keycloakBaseURL: '',
};
const UserGroupForm: React.FC<UserGroupFormProps> = (props: UserGroupFormProps) => {
  const { initialValues, keycloakBaseURL } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [availableRoles, setAvailableRoles] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState(null);
  const history = useHistory();
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 2, span: 10 },
      md: { offset: 0, span: 8 },
      lg: { offset: 0, span: 6 },
    },
    wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 12 }, lg: { span: 10 } },
  };
  const tailLayout = {
    wrapperCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 12, span: 24 },
      md: { offset: 8, span: 16 },
      lg: { offset: 6, span: 14 },
    },
  };

  /** Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initiaValues is updated
   * **/
  React.useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
    });
  }, [form, initialValues]);

  React.useEffect(() => {
    fetchAvailableRoles(initialValues.id, keycloakBaseURL, setAvailableRoles);
  }, [initialValues.id, keycloakBaseURL]);

  React.useEffect(() => {
    fetchAssignedRoles(initialValues.id, keycloakBaseURL, setAssignedRoles);
  }, [initialValues.id, keycloakBaseURL]);

  return (
    <Row className="layout-content">
      {/** If email is provided render edit user otherwise add user */}
      <h5 className="mb-3 header-title">
        {props.initialValues.id ? `${EDIT_USER_GROUP} | ${initialValues.name}` : ADD_USER_GROUP}
      </h5>
      <Col className="bg-white p-3" span={24}>
        <Form
          {...layout}
          form={form}
          initialValues={{
            ...initialValues,
          }}
          onFinish={(values: KeycloakUserGroup) => {
            setIsSubmitting(true);
            if (initialValues.id) {
              const serve = new KeycloakService(
                `${KEYCLOAK_URL_USER_GROUPS}/${initialValues.id}`,
                keycloakBaseURL
              );
              serve
                .update(values)
                .then(() => sendSuccessNotification(MESSAGE_USER_GROUP_EDITED))
                .catch((error: Error) => sendErrorNotification(`${error}`))
                .finally(() => setIsSubmitting(false));
            } else {
              const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
              serve
                .create({ name: values.name })
                .then(() => sendSuccessNotification(MESSAGE_USER_GROUP_CREATED))
                .catch((error: Error) => sendErrorNotification(`${error}`))
                .finally(() => setIsSubmitting(false));
            }
          }}
        >
          <Form.Item
            name="name"
            id="name"
            label={NAME}
            rules={[{ required: true, message: NAME_REQUIRED }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="roles"
            id="roles"
            label="Realm Roles"
            rules={[{ required: true, message: 'Role Required' }]}
          >
            <Transfer
              dataSource={[]}
              titles={['Source', 'Target']}
              targetKeys={[]}
              selectedKeys={[]}
              render={() => <div>Test</div>}
              disabled={false}
              locale={{
                itemUnit: 'article',
                itemsUnit: 'articles',
                notFoundContent: 'The list is empty',
                searchPlaceholder: 'Search here',
              }}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="create-group">
              {isSubmitting ? SAVING : SAVE}
            </Button>
            <Button onClick={() => history.push(URL_USER_GROUPS)} className="cancel-group">
              {CANCEL}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
UserGroupForm.defaultProps = defaultProps;
export { UserGroupForm };
