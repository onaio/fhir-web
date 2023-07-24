import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Input, Radio, Select } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import {
  FormFields,
  getOrgSelectOptions,
  getPractitionerSelectOptions,
  selectFilterFunction,
  submitForm,
} from './utils';
import {
  id,
  managingOrganizations,
  name,
  practitionerParticipants,
  status,
  URL_CARE_TEAM,
  uuid,
} from '../../constants';
import { useTranslation } from '../../mls';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';

export interface CareTeamFormProps {
  initialValues: FormFields;
  fhirBaseURL: string;
  practitioners: IPractitioner[];
  organizations: IOrganization[];
}

/**
 * Care Team form for editing/adding FHIR Care Teams
 *
 * @param {object} props - component props
 */
const CareTeamForm: React.FC<CareTeamFormProps> = (props: CareTeamFormProps) => {
  const { fhirBaseURL, initialValues, practitioners, organizations } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const history = useHistory();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const orgOptions = getOrgSelectOptions(organizations);
  const practOptions = getPractitionerSelectOptions(practitioners);

  const statusOptions = [
    { label: t('Active'), value: 'active' },
    { label: t('Inactive'), value: 'inactive' },
  ];

  return (
    <Row className="content-section user-group">
      {/** If email is provided render edit group otherwise add group */}
      <PageHeader
        title={
          initialValues.id
            ? t('Edit Care Team | {{name}}', { name: initialValues.name })
            : t('Create Care Team')
        }
      />

      <Col className="bg-white p-3" span={24}>
        <Form
          {...formItemLayout}
          form={form}
          initialValues={initialValues}
          onFinish={(values: FormFields) => {
            setIsSubmitting(true);
            submitForm(values, initialValues, fhirBaseURL, organizations, practitioners, t)
              .catch(() => {
                if (initialValues.id) {
                  sendErrorNotification(t('There was a problem updating the Care Team'));
                } else {
                  sendErrorNotification(t('There was a problem creating the Care Team'));
                }
              })
              .finally(() => setIsSubmitting(false));
          }}
        >
          <Form.Item id={'id'} hidden={true} name={id} label={t('ID')}>
            <Input />
          </Form.Item>

          <Form.Item id={'uuid'} hidden={true} name={uuid} label={t('UUID')}>
            <Input />
          </Form.Item>

          <Form.Item
            name={name}
            id="name"
            label={t('Name')}
            rules={[{ required: true, message: t('Name is Required') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item id="status" name={status} label={t('Status')}>
            <Radio.Group name="status">
              {statusOptions.map((e) => (
                <Radio name="status" key={e.label} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            data-testid="practitioners"
            name={practitionerParticipants}
            id="practitionerParticipants"
            label={t('Practitioner Participant')}
          >
            <Select
              placeholder={t('Select practitioners to assign to this Care Team')}
              allowClear
              mode="multiple"
              showSearch
              options={practOptions}
              filterOption={selectFilterFunction}
            />
          </Form.Item>

          <Form.Item
            name={managingOrganizations}
            id="managingOrganizations"
            label={t('Managing organizations')}
            tooltip={t('Select one or more managing organizations')}
          >
            <Select
              options={orgOptions}
              mode="multiple"
              allowClear
              showSearch
              placeholder={t('Select a managing Organization')}
              filterOption={selectFilterFunction}
            />
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
