import React from 'react';
import { Alert, Spin } from 'antd';
import { useQuery } from 'react-query';
import { KeycloakService } from '@opensrp/keycloak-service';
import {
  UserForm,
  defaultUserFormInitialValues,
  KEYCLOAK_URL_USER_GROUPS,
} from '@opensrp/user-management';
import type { FormFields, PractitionerUpdaterFactory, UserGroup } from '@opensrp/user-management';
import type { Dictionary } from '@onaio/utils';

interface UserStepAdapterProps {
  initialValues?: FormFields;
  onSubmit: (values: FormFields) => void;
  keycloakBaseURL: string;
  baseUrl: string;
  fhirBaseURL: string;
  extraData?: Dictionary;
}

export const UserStepAdapter: React.FC<UserStepAdapterProps> = (props) => {
  const groups = useQuery(
    [KEYCLOAK_URL_USER_GROUPS],
    async () =>
      (await new KeycloakService(
        KEYCLOAK_URL_USER_GROUPS,
        props.keycloakBaseURL
      ).list()) as unknown as UserGroup[],
    { enabled: !!props.keycloakBaseURL, refetchOnWindowFocus: false }
  );

  // required by UserForm's props, never called: in draft mode the form
  // hands its values to onDraftSubmit and returns before the updater runs
  const noopUpdaterFactory: PractitionerUpdaterFactory = () => async () => undefined;

  if (groups.isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (groups.isError) {
    return (
      <Alert
        type="error"
        message="Could not load user groups"
        description={(groups.error as Error)?.message}
      />
    );
  }

  return (
    <UserForm
      initialValues={props.initialValues ?? defaultUserFormInitialValues}
      keycloakBaseURL={props.keycloakBaseURL}
      baseUrl={props.baseUrl || props.fhirBaseURL}
      userGroups={groups.data ?? []}
      extraData={props.extraData ?? {}}
      practitionerUpdaterFactory={noopUpdaterFactory}
      onDraftSubmit={props.onSubmit}
    />
  );
};