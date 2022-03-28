import { Modal, Button, Select } from 'antd';
import React, { useState } from 'react';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import {
  AffiliationsByLocationId,
  getOrgOptionsFromAffiliations,
  getOrgSelectOptions,
  OrgSelectOptions,
  postPutAffiliations,
} from './utils';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { locationResourceType } from '@opensrp/fhir-location-management';
import { IOrganizationAffiliation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganizationAffiliation';
import { organizationAffiliationResourceType } from '../../constants';
import { useQueryClient, useMutation } from 'react-query';
import {
  sendErrorNotification,
  sendInfoNotification,
  sendSuccessNotification,
} from '@opensrp/notifications';

interface AffiliationModalProps {
  baseUrl: string;
  allOrgs: IOrganization[];
  location?: ILocation;
  visible: boolean;
  handleCancel: () => void;
  affiliationsByLoc: AffiliationsByLocationId;
  allAffiliations: IOrganizationAffiliation[];
}

/**
 * Modal that shows a select where users can assign organizations to locations
 *
 * @param props - component props
 */
export const AffiliationModal = (props: AffiliationModalProps) => {
  const { handleCancel, visible, allOrgs, affiliationsByLoc, baseUrl, location, allAffiliations } =
    props;

  const locationName = location?.name as string;
  const locationId = location?.id;

  const orgSelectOptions = getOrgSelectOptions(allOrgs);
  const currentAffiliations = affiliationsByLoc[`${locationResourceType}/${locationId}`];
  const defaultOrgsValues = getOrgOptionsFromAffiliations(currentAffiliations);
  const [values, setValues] = useState<OrgSelectOptions[]>(defaultOrgsValues);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    () =>
      postPutAffiliations(
        baseUrl,
        values,
        defaultOrgsValues,
        location as ILocation,
        allAffiliations
      ),
    {
      onError: (err: Error) => sendErrorNotification(err.message),
      onSuccess: () => {
        sendSuccessNotification('Team assignments updated successfully');
        queryClient.invalidateQueries([organizationAffiliationResourceType]).catch(() => {
          sendInfoNotification(
            'Failed to refresh assignments, Please Refresh the page to see the changes'
          );
        });
      },
    }
  );

  if (!locationId) {
    return null;
  }

  const handleChange = (_: string[], fullOption: OrgSelectOptions | OrgSelectOptions[]) => {
    const options = Array.isArray(fullOption) ? fullOption : [fullOption];
    setValues(options);
  };

  const submit = () => {
    return mutate();
  };

  return (
    <Modal
      destroyOnClose={true}
      title={`Assign/Unassign Teams | ${locationName}`}
      visible={visible}
      okText="Save"
      onCancel={handleCancel}
      cancelText="Cancel"
      footer={[
        <Button
          data-testid="submit-affiliations"
          disabled={isLoading}
          onClick={submit}
          type="primary"
          key="submit"
        >
          {isLoading ? 'Saving' : 'save'}
        </Button>,
        <Button
          data-testid="cancel-affiliations"
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
      <Select
        className="full-width"
        data-testid="affiliation-select"
        mode="multiple"
        allowClear
        showSearch
        placeholder="Select teams"
        options={orgSelectOptions}
        defaultValue={defaultOrgsValues as unknown as string[]}
        onChange={handleChange}
      ></Select>
    </Modal>
  );
};
