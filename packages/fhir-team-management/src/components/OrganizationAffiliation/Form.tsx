import { Modal, Button, Form, Select } from 'antd';
import { postPutAffiliations } from '../../utils';
import React from 'react';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { AffiliationsByLocationId, getOptionsFromAffiliations, getOrgSelectOptions } from './utils';

interface OAffiliationFormProps {
  baseUrl: string;
  allOrgs: IOrganization[];
  locationName: string;
  visible: boolean;
  handleCancel: () => void;
  locationId: string;
  affiliationsByLoc: AffiliationsByLocationId;
}

/**
 * AffiliationForm will have to pull the options it can show. On search it will make another request
 *
 * @param props
 */
export const AffiliationForm = (props: OAffiliationFormProps) => {
  const { baseUrl, locationName, handleCancel, visible, allOrgs, affiliationsByLoc, locationId } =
    props;

  const [form] = Form.useForm();
  const orgSelectOptions = getOrgSelectOptions(allOrgs);
  const initialValues = {
    assignedOrgs: getOptionsFromAffiliations(affiliationsByLoc[locationId]),
  };

  return (
    <Form
      form={form}
      onFinish={(values) => {
        // eventually send only organizationAffiliation payloads, one to remove and another to add.
        postPutAffiliations(baseUrl, values, initialValues, locationName, locationId);
      }}
      initialValues={initialValues}
    >
      <Modal
        destroyOnClose={true}
        title={`Assign/Unassign Teams | ${locationName}`}
        visible={visible}
        okText="Save"
        onCancel={handleCancel}
        cancelText="Cancel"
        footer={[
          <Button
            onClick={() => form.submit()}
            type="primary"
            form="teamAssignment"
            key="submit"
            htmlType="submit"
          >
            {'save'}
          </Button>,
          <Button
            id={'cancel'}
            key="cancel"
            onClick={() => {
              handleCancel();
            }}
          >
            {'Cancel'}
          </Button>,
        ]}
        okType="default"
      >
        <div className="form-container">
          <Form.Item label="Teams" name="assignedOrgs">
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Select teams"
              options={orgSelectOptions}
            ></Select>
          </Form.Item>
        </div>
      </Modal>
    </Form>
  );
};
