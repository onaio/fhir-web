import { ErrorMessage, Field, Formik } from 'formik';
import React from 'react';
import { Button, Form, notification } from 'antd';
import * as Yup from 'yup';
import { history } from '@onaio/connected-reducer-registry';
import { KeycloakUser } from '../../../store/ducks/keycloak';
import { KeycloakService } from '../../../services';

/** props for editing a user view */
export interface UserFormProps {
  initialValues: KeycloakUser;
  serviceClass: typeof KeycloakService;
}

/** default form initial values */

export const defaultInitialValues: KeycloakUser = {
  access: {
    manageGroupMembership: false,
    view: false,
    mapRoles: false,
    impersonate: false,
    manage: false,
  },
  createdTimestamp: undefined,
  disableableCredentialTypes: [],
  email: '',
  emailVerified: false,
  enabled: true,
  firstName: '',
  id: '',
  lastName: '',
  notBefore: 0,
  requiredActions: [],
  totp: false,
  username: '',
};

/** default props for editing user component */
export const defaultProps: Partial<UserFormProps> = {
  initialValues: defaultInitialValues,
  serviceClass: KeycloakService,
};

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  lastName: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
});

const UserForm: React.FC<UserFormProps> = (props: UserFormProps) => {
  const { initialValues, serviceClass } = props;
  const isEditMode = initialValues.id !== '';

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

  return (
    <div className="form-container">
      <Formik
        initialValues={initialValues as KeycloakUser}
        validationSchema={userSchema}
        // tslint:disable-next-line: jsx-no-lambda
        onSubmit={(values, { setSubmitting }) => {
          if (isEditMode) {
            const serve = new serviceClass(`/users/${initialValues.id}`);
            serve
              .update(values)
              .then(() => {
                setSubmitting(false);
                history.push('/admin');
                notification.success({
                  message: 'User edited successfully',
                  description: '',
                });
              })
              .catch((e: Error) => {
                notification.error({
                  message: `${e}`,
                  description: '',
                });
                setSubmitting(false);
              });
          } else {
            const serve = new serviceClass(`/users`);
            serve
              .create(values)
              .then(() => {
                setSubmitting(false);
                history.push('/admin');
                notification.success({
                  message: 'User created successfully',
                  description: '',
                });
              })
              .catch((e: Error) => {
                notification.error({
                  message: `${e}`,
                  description: '',
                });
                setSubmitting(false);
              });
          }
        }}
      >
        {({ errors, isSubmitting, handleSubmit }) => (
          <Form {...layout} onSubmitCapture={handleSubmit}>
            <Form.Item label={'User Id'}>
              <Field
                readOnly={true}
                type="text"
                name="id"
                id="id"
                // disabled={disabledFields.includes('name')}
                className={errors.id ? `form-control is-invalid` : `form-control`}
              />
            </Form.Item>
            <Form.Item
              label={'First Name'}
              rules={[
                { required: true, message: 'Please input your First Name!', whitespace: true },
              ]}
            >
              <Field
                type="text"
                name="firstName"
                id="firstName"
                // disabled={disabledFields.includes('name')}
                className={errors.firstName ? `form-control is-invalid` : `form-control`}
              />
            </Form.Item>
            <Form.Item
              label={'Last Name'}
              rules={[
                { required: true, message: 'Please input your Last Name!', whitespace: true },
              ]}
            >
              <Field
                type="text"
                name="lastName"
                id="lastName"
                // disabled={disabledFields.includes('name')}
                className={errors.lastName ? `form-control is-invalid` : `form-control`}
              />
              <ErrorMessage
                name="lastName"
                component="small"
                className="form-text text-danger name-error"
              />
            </Form.Item>

            <Form.Item label={'Username'}>
              <Field
                readOnly={isEditMode}
                type="text"
                name="username"
                id="username"
                //   disabled={disabledFields.includes('username')}
                className={errors.username ? `form-control is-invalid` : `form-control`}
              />
              <ErrorMessage
                component="small"
                name="username"
                className="form-text text-danger username-error"
              />
            </Form.Item>
            <Form.Item label={'Email'}>
              <Field
                type="text"
                name="email"
                id="email"
                className={errors.email ? `form-control is-invalid` : `form-control`}
              />
              <ErrorMessage
                component="small"
                name="email"
                className="form-text text-danger username-error"
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                className="create-user"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                {isSubmitting ? 'Saving' : 'Save User'}
              </Button>
              <Button
                htmlType="submit"
                onClick={() => history.push('/admin')}
                className="cancel-user"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

UserForm.defaultProps = defaultProps;

export { UserForm };
