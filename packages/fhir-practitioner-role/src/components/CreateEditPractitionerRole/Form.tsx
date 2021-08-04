import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Input, Radio, Select } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import lang from '../../lang';
import { submitForm } from './utils';
import { URL_PRACTITIONER_ROLE } from '../../constants';

export interface Fields {
  id: string;
  name: string;
}

export interface FormFields {
  uuid: string | undefined;
  id: string | undefined;
  name: string | undefined;
  status: string | undefined;
  active: boolean;
  practitionersId?: string[];
  groupsId?: string;
}

export interface PractitionerRoleFormProps {
  initialValues: FormFields;
  fhirBaseURL: string;
  practitioners: Fields[];
  groups: Fields[];
}

/** Practitioner Role form for editing/adding Practitioner Roles
 *
 * @param {object} props - component props
 */
const PractitionerRoleForm: React.FC<PractitionerRoleFormProps> = (
  props: PractitionerRoleFormProps
) => {
  const { fhirBaseURL, initialValues } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const status = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  /** Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initiaValues is updated
   * **/
  React.useEffect(() => {
    form.setFieldsValue({
      ...(initialValues as FormFields),
    });
  }, [form, initialValues]);

  return (
    <Row className="layout-content practitioner-role">
      <h5 className="mb-3 header-title">
        {props.initialValues?.id
          ? `${lang.EDIT_CARE_TEAM} | ${initialValues.name}`
          : lang.CREATE_CARE_TEAM}
      </h5>
      <Col className="bg-white p-3" span={24}>
        <Form
          {...layout}
          form={form}
          initialValues={initialValues}
          onFinish={(values: FormFields) => {
            setIsSubmitting(true);
            submitForm(
              { ...initialValues, ...values },
              fhirBaseURL,
              props.initialValues?.id,
              props.initialValues?.uuid
            ).catch(() => sendErrorNotification(lang.ERROR_OCCURED));
          }}
        >
          <Form.Item id={'uuid'} hidden={true} name={'uuid'} label={'UUID'}>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            id="name"
            label={lang.NAME}
            rules={[{ required: true, message: lang.NAME_REQUIRED }]}
          >
            <Input />
          </Form.Item>
          <Form.Item id="status" name="status" label={lang.STATUS}>
            <Radio.Group name="status">
              {status.map((e) => (
                <Radio name="status" key={e.label} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="practitionersId"
            id="practitionersId"
            label={lang.PARTICIPANTS}
            tooltip={lang.TIP_REQUIRED_FIELD}
          >
            <Select placeholder={lang.PARTICIPANTS}>
              {props.practitioners.map((practitioner: Fields) => (
                <Select.Option key={practitioner.id} value={practitioner.id}>
                  {practitioner.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="organizationsId"
            id="organizationsId"
            label={lang.SUBJECT}
            tooltip={lang.TIP_REQUIRED_FIELD}
          >
            <Select placeholder={lang.SUBJECT}>
              {props.groups.map((group: Fields) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="create-group">
              {isSubmitting ? lang.SAVING : lang.SAVE}
            </Button>
            <Button
              onClick={() => history.push(URL_PRACTITIONER_ROLE)}
              className="cancel-care-team"
            >
              {lang.CANCEL}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export { PractitionerRoleForm };
