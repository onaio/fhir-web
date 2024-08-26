import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Input, Radio } from 'antd';
import { BodyLayout, PaginatedAsyncSelect, SelectOption } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import {
  FormFields,
  preloadExistingOptionsFactory,
  processOrganizationOption,
  processPractitionerOption,
  submitForm,
} from './utils';
import {
  id,
  managingOrganizations,
  name,
  organizationResourceType,
  practitionerParticipants,
  practitionerResourceType,
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
  disabled?: string[];
}

/**
 * Care Team form for editing/adding FHIR Care Teams
 *
 * @param {object} props - component props
 */
const CareTeamForm: React.FC<CareTeamFormProps> = (props: CareTeamFormProps) => {
  const { fhirBaseURL, initialValues, disabled } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const history = useHistory();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [selectedOrgs, setSelectedOrgs] = useState<SelectOption<IOrganization>[]>([]);
  const [selectedPractitioners, setSelectedPractitioners] = useState<SelectOption<IPractitioner>[]>(
    []
  );

  const statusOptions = [
    { label: t('Active'), value: 'active' },
    { label: t('Inactive'), value: 'inactive' },
  ];

  const pageTitle = initialValues.id
    ? t('Edit Care Team | {{name}}', { name: initialValues.name })
    : t('Create Care Team');
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  const organizationPreloadExistingOptions = preloadExistingOptionsFactory(
    fhirBaseURL,
    processOrganizationOption
  );
  const practitionerPreloadExistingOptions = preloadExistingOptionsFactory(
    fhirBaseURL,
    processPractitionerOption
  );

  const organizationChangeHandler = (
    orgs: SelectOption<IOrganization> | SelectOption<IOrganization>[]
  ) => {
    const sanitized = Array.isArray(orgs) ? orgs : [orgs];
    setSelectedOrgs(sanitized);
  };

  const practitionerChangeHandler = (
    practitioners: SelectOption<IPractitioner> | SelectOption<IPractitioner>[]
  ) => {
    const sanitized = Array.isArray(practitioners) ? practitioners : [practitioners];
    setSelectedPractitioners(sanitized);
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Row className="user-group">
        {/** If email is provided render edit group otherwise add group */}
        <Col className="bg-white p-3" span={24}>
          <Form
            {...formItemLayout}
            form={form}
            initialValues={initialValues}
            onFinish={(values: FormFields) => {
              setIsSubmitting(true);
              submitForm(values, initialValues, fhirBaseURL, selectedOrgs, selectedPractitioners, t)
                .then(() => {
                  history.push(URL_CARE_TEAM);
                })
                .catch((err) => {
                  console.log({ err });
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
              <PaginatedAsyncSelect<IPractitioner>
                baseUrl={fhirBaseURL}
                resourceType={practitionerResourceType}
                transformOption={processPractitionerOption}
                showSearch
                placeholder={t('Select practitioners to assign to this Care Team')}
                disabled={disabled?.includes(practitionerParticipants)}
                mode="multiple"
                allowClear
                getFullOptionOnChange={practitionerChangeHandler}
                discoverUnknownOptions={practitionerPreloadExistingOptions as any}
              />
            </Form.Item>

            <Form.Item
              name={managingOrganizations}
              id="managingOrganizations"
              label={t('Managing organizations')}
              tooltip={t('Select one or more managing organizations')}
            >
              <PaginatedAsyncSelect<IOrganization>
                baseUrl={fhirBaseURL}
                resourceType={organizationResourceType}
                transformOption={processOrganizationOption}
                mode="multiple"
                allowClear
                showSearch
                placeholder={t('Select a managing Organization')}
                disabled={disabled?.includes(managingOrganizations)}
                getFullOptionOnChange={organizationChangeHandler}
                discoverUnknownOptions={organizationPreloadExistingOptions as any}
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
    </BodyLayout>
  );
};

export { CareTeamForm };
