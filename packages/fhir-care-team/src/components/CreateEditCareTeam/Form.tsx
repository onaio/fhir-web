import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Input, Radio, Select } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import { submitForm } from './utils';
import { URL_CARE_TEAM } from '../../constants';
import { useTranslation } from '../../mls';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';

export interface Fields {
  id: string;
  name: string;
}

export interface FormFields {
  uuid: string | undefined;
  id: string | undefined;
  name: string | undefined;
  status: string | undefined;
  practitionersId?: string[];
  groupsId?: string;
  initialCareTeam?: ICareTeam;
}

export interface CareTeamFormProps {
  initialValues: FormFields;
  fhirBaseURL: string;
  practitioners: Fields[];
  groups: Fields[];
}

/**
 * Care Team form for editing/adding FHIR Care Teams
 *
 * @param {object} props - component props
 */
const CareTeamForm: React.FC<CareTeamFormProps> = (props: CareTeamFormProps) => {
  const { fhirBaseURL, initialValues } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const history = useHistory();
  const { t } = useTranslation();
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
    { label: t('Active'), value: 'active' },
    { label: t('Inactive'), value: 'inactive' },
  ];

  interface Option {
    children: string;
  }

  // search for occurrence of substring (search term) in select options
  const filterFunction = (input: string, option: unknown): boolean =>
    (option as Option).children.toLocaleLowerCase().includes(input.toLocaleLowerCase());

  return (
    <Row className="layout-content user-group">
      {/** If email is provided render edit group otherwise add group */}
      <h5 className="mb-3 header-title">
        {props.initialValues.id
          ? t('Edit Care Team | {{name}}', { name: initialValues.name })
          : t('Create Care Team')}
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
              props.groups,
              props.practitioners,
              t,
              props.initialValues.id,
              props.initialValues.uuid
            )
              .catch(() => sendErrorNotification(t('An error occurred')))
              .finally(() => setIsSubmitting(false));
          }}
        >
          <Form.Item id={'uuid'} hidden={true} name={'uuid'} label={t('UUID')}>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            id="name"
            label={t('Name')}
            rules={[{ required: true, message: t('Name is Required') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item id="status" name="status" label={t('Status')}>
            <Radio.Group name="status">
              {status.map((e) => (
                <Radio name="status" key={e.label} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            data-testid="practitionersId"
            name="practitionersId"
            id="practitionersId"
            label={t('Participant')}
            tooltip={t('This is a required field')}
          >
            <Select
              placeholder={t('Participant')}
              allowClear
              mode="multiple"
              showSearch
              optionFilterProp="children"
              filterOption={filterFunction}
            >
              {props.practitioners.map((practitioner: Fields) => (
                <Select.Option key={practitioner.id} value={practitioner.id}>
                  {practitioner.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="groupsId"
            id="groupsId"
            label={t('Subject')}
            tooltip={t('This is a required field')}
          >
            <Select placeholder={t('Subject')}>
              {props.groups.map((group: Fields) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="create-group">
              {isSubmitting ? t('Saving') : t('Save')}
            </Button>
            <Button onClick={() => history.push(URL_CARE_TEAM)} className="cancel-care-team">
              {t('Cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export { CareTeamForm };
