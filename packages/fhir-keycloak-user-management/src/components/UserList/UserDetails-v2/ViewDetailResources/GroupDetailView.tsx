import React from 'react';
import { Alert, Button } from 'antd';
import { useTranslation } from '../../../../mls';
import { BrokenPage, TableLayout } from '@opensrp/react-utils';
import { KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS } from '@opensrp/user-management';
import { KeycloakService } from '@opensrp/keycloak-service';
import { QueryClient, useQueryClient, useQuery } from 'react-query';
import { keycloakGroupEndpoint, keycloakMembersEndpoint } from '../../../../constants';
import { sendSuccessNotification } from '@opensrp/notifications';

export interface KeycloakGroupDetailsProp {
  keycloakBaseUrl: string;
  resourceId: string;
}

export const KeycloakGroupDetails = (props: KeycloakGroupDetailsProp) => {
  const { t } = useTranslation();
  const { keycloakBaseUrl, resourceId } = props;
  const query = useQueryClient();

  const { data, error, isLoading } = useQuery([KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS], () =>
    new KeycloakService(
      `${KEYCLOAK_URL_USERS}/${resourceId}${KEYCLOAK_URL_USER_GROUPS}`,
      keycloakBaseUrl
    ).list()
  );

  if (error && !data) {
    return (
      <Alert type="error">
        {'Unable to fetch the keycloak groups that the user is assigned to'}
      </Alert>
    );
  }

  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
    },
    {
      title: t('Path'),
      dataIndex: 'path' as const,
    },
    {
      title: t(''),
      dataIndex: 'id' as const,
      render: (id: string) => (
        <Button
          onClick={() => removeGroupFromUser(keycloakBaseUrl, id, resourceId, query)}
          type="link"
          danger
        >
          {'Leave'}
        </Button>
      ),
    },
  ];

  const tableProps = {
    datasource: data ?? [],
    columns,
    loading: isLoading,
    size: 'small' as const,
  };

  return <TableLayout {...tableProps} />;
};

export const removeGroupFromUser = async (
  baseUrl: string,
  groupId: string,
  userId: string,
  query: QueryClient
) => {
  const endpoint = `${KEYCLOAK_URL_USERS}/${userId}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`;
  const server = new KeycloakService(endpoint, baseUrl);
  return server.delete().then(() => {
    query.refetchQueries([KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS]);
    sendSuccessNotification('User was removed from the keycloak group');
  });
};
