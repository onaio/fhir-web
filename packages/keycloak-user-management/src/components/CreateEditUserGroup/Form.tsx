import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Input, Transfer, PageHeader } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import { URL_USER_GROUPS } from '../../constants';
import { useTranslation } from '../../mls';
import { KeycloakUserGroup } from '../../ducks/userGroups';
import { assignRoles, removeAssignedRoles, submitForm } from './utils';
import {
  reducerName as keycloakUserRolesReducerName,
  reducer as keycloakUserRolesReducer,
  KeycloakUserRole,
} from '../../ducks/userRoles';
import type { TFunction } from '@opensrp/i18n';

/** Register reducer */
reducerRegistry.register(keycloakUserRolesReducerName, keycloakUserRolesReducer);

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
  allRoles: KeycloakUserRole[];
  assignedRoles: KeycloakUserRole[];
  availableRoles: KeycloakUserRole[];
  effectiveRoles: KeycloakUserRole[];
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
  allRoles: [],
  assignedRoles: [],
  availableRoles: [],
  effectiveRoles: [],
  initialValues: defaultInitialValues,
  keycloakBaseURL: '',
};

/**
 * Util function that updates assigned/available roles on keycloak
 *
 * @param {KeycloakUserGroup} initialValues - form initial values
 * @param {string[]} targetSelectedKeys - target choice box selected keys
 * @param {string[]} sourceSelectedKeys - source choice box selected keys
 * @param {string} keycloakBaseURL - keycloak api base url
 * @param {KeycloakUserRole[]} roles - list of all keycloak realm roles
 * @param t translator function
 */
export const handleTransferChange = async (
  initialValues: KeycloakUserGroup,
  targetSelectedKeys: string[],
  sourceSelectedKeys: string[],
  keycloakBaseURL: string,
  roles: KeycloakUserRole[],
  t: TFunction
) => {
  if (targetSelectedKeys.length) {
    await removeAssignedRoles(initialValues.id, keycloakBaseURL, roles, targetSelectedKeys, t);
  } else if (sourceSelectedKeys.length) {
    await assignRoles(initialValues.id, keycloakBaseURL, roles, sourceSelectedKeys, t);
  }
};

/**
 * User group form for editing/adding user groups
 *
 * @param {object} props - component props
 */
const UserGroupForm: React.FC<UserGroupFormProps> = (props: UserGroupFormProps) => {
  const {
    initialValues,
    keycloakBaseURL,
    assignedRoles,
    availableRoles,
    effectiveRoles,
    allRoles,
  } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState<string[]>([]);
  const [targetSelectedKeys, setTargetSelectedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const history = useHistory();
  const [form] = Form.useForm();
  const { t } = useTranslation();

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

  /**
   * Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initiaValues is updated
   *
   */
  React.useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
    });
  }, [form, initialValues]);

  const onChange = async (nextTargetKeys: string[]) => {
    // only add finally block since catch has already
    // been handled in function definition
    handleTransferChange(
      initialValues,
      targetSelectedKeys,
      sourceSelectedKeys,
      keycloakBaseURL,
      allRoles,
      t
    ).finally(() => setTargetKeys(nextTargetKeys));
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSourceSelectedKeys([...sourceSelectedKeys]);
    setTargetSelectedKeys([...targetSelectedKeys]);
  };

  const data = [...assignedRoles, ...availableRoles].map((item: KeycloakUserRole) => ({
    key: item.id,
    title: item.name,
  }));

  const { name } = initialValues;

  return (
    <Row className="content-section user-group">
      {/** If email is provided render edit group otherwise add group */}
      <PageHeader
        title={
          props.initialValues.id ? t('Edit User Group | {{name}}', { name }) : t('New User Group')
        }
        className="page-header"
      />
      <Col className="bg-white p-3" span={24}>
        <Form
          {...layout}
          form={form}
          initialValues={{
            ...initialValues,
          }}
          onFinish={(values: KeycloakUserGroup & { roles?: string[] }) => {
            // remove roles array from payload
            delete values.roles;
            setIsSubmitting(true);
            submitForm({ ...initialValues, ...values }, keycloakBaseURL, setIsSubmitting, t).catch(
              () => sendErrorNotification(t('An error occurred'))
            );
          }}
        >
          <Form.Item
            name="name"
            id="name"
            label={t('Name')}
            rules={[{ required: true, message: t('Name is required') }]}
          >
            <Input />
          </Form.Item>
          {initialValues.id ? (
            <Form.Item name="roles" id="roles" label={t('Realm Roles')}>
              <Transfer
                dataSource={data}
                titles={[t('Available Roles'), t('Assigned Roles')]}
                listStyle={{ flexGrow: 'inherit' }}
                targetKeys={
                  targetKeys.length
                    ? targetKeys
                    : assignedRoles.map((role: KeycloakUserRole) => role.id)
                }
                selectedKeys={[...sourceSelectedKeys, ...targetSelectedKeys]}
                render={(item) => <div>{item.title}</div>}
                disabled={false}
                onChange={onChange}
                onSelectChange={onSelectChange}
                locale={{
                  notFoundContent: t('The list is empty'),
                  searchPlaceholder: t('Search'),
                }}
              />
              {/** custom transfer to list effective roles */}
              <div className="ant-transfer">
                <div className="ant-transfer-list">
                  <div className="ant-transfer-list-header">
                    <span className="ant-transfer-list-header-title">{t('Effective Roles')}</span>
                  </div>
                  <div className="ant-transfer-list-body">
                    {!effectiveRoles.length ? (
                      <div className="ant-transfer-list-body-not-found">
                        {t('The list is empty')}
                      </div>
                    ) : (
                      <ul className="ant-transfer-list-content">
                        {effectiveRoles.map((role: KeycloakUserRole) => (
                          <li
                            key={role.id}
                            className="ant-transfer-list-content-item ant-transfer-list-content-item-disabled"
                          >
                            <label className="ant-checkbox-wrapper">
                              <span className="ant-checkbox">
                                <input type="checkbox" className="ant-checkbox-input" />
                                <span className="ant-checkbox-inner" />
                              </span>
                            </label>
                            <span className="ant-transfer-list-content-item-text">
                              <div>{role.name}</div>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </Form.Item>
          ) : (
            ''
          )}
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="create-group">
              {isSubmitting ? t('Saving') : t('Save')}
            </Button>
            <Button onClick={() => history.push(URL_USER_GROUPS)} className="cancel-group">
              {t('Cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
UserGroupForm.defaultProps = defaultProps;
export { UserGroupForm };
