import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { Button, Col, Row, Form, Input, Radio, Select } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import lang from '../../lang';
import { getPatientName, submitForm } from './utils';
import { fhirR4 } from '@smile-cdr/fhirts';
import { URL_CARE_TEAM } from '../../constants';

export interface FormFields {
  id: string;
  name: string;
  status: string;
  groups: any;
  practitioners: any;
}

export interface CareTeamFormProps {
  initialValues: FormFields;
  fhirBaseURL: string;
}

/** default props for editing user component */
export const defaultProps = {
  inititalValues: {
    id: '',
    name: '',
    status: '',
    practitioners: [],
    groups: [],
  },
  fhirBaseURL: '',
};

/** Care Team form for editing/adding FHIR Care Teams
 *
 * @param {object} props - component props
 */
const CareTeamForm: React.FC<CareTeamFormProps> = (props: CareTeamFormProps) => {
  const { initialValues, fhirBaseURL } = props;
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
    { label: 'Yes', value: 'active' },
    { label: 'No', value: 'inactive' },
  ];

  /** Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initiaValues is updated
   * **/
  React.useEffect(() => {
    form.setFieldsValue({
      ...(initialValues as object),
    });
  }, [form, initialValues]);

  console.log('init values', initialValues);

  return (
    <Row className="layout-content user-group">
      {/** If email is provided render edit group otherwise add group */}
      <h5 className="mb-3 header-title">
        {props.initialValues.id
          ? `${lang.EDIT_CARE_TEAM} | ${initialValues.name}`
          : lang.CREATE_CARE_TEAM}
      </h5>
      <Col className="bg-white p-3" span={24}>
        <Form
          {...layout}
          form={form}
          initialValues={initialValues}
          onFinish={(values: Dictionary & { roles?: string[] }) => {
            // remove roles array from payload
            delete values.roles;
            setIsSubmitting(true);
            submitForm({ ...initialValues, ...values }, fhirBaseURL, setIsSubmitting).catch(() =>
              sendErrorNotification(lang.ERROR_OCCURED)
            );
          }}
        >
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
                <Radio name="active" key={e.label} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="practitioners"
            id="practitioners"
            label={lang.TEAM_MEMBERS}
            tooltip={lang.TIP_REQUIRED_FIELD}
          >
            <Select
              allowClear
              mode="multiple"
              placeholder={lang.PARTICIPANTS}
              value={initialValues.practitioners.map((practitioner: any) => practitioner.name)}
            >
              {initialValues.practitioners.map((practitioner: any) => (
                <Select.Option key={practitioner.id} value={practitioner.id}>
                  {practitioner.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="groups"
            id="groups"
            label={lang.CARE_TEAM_MEMBERS}
            tooltip={lang.TIP_REQUIRED_FIELD}
          >
            <Select allowClear mode="tags" placeholder={lang.SUBJECT}>
              {initialValues.groups.map((group: any) => (
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
            <Button onClick={() => history.push(URL_CARE_TEAM)} className="cancel-group">
              {lang.CANCEL}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
CareTeamForm.defaultProps = defaultProps;
export { CareTeamForm };
