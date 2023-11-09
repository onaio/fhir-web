import React from 'react';
import { Alert, Button } from 'antd';
import { useTranslation } from '../../../../mls';
import { TableLayout } from '@opensrp/react-utils';
import { KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS } from '@opensrp/user-management';
import { KeycloakService } from '@opensrp/keycloak-service';
import { QueryClient, useQueryClient, useQuery } from 'react-query';
import { sendInfoNotification, sendSuccessNotification } from '@opensrp/notifications';
import { TFunction } from '@opensrp/i18n';
import { RbacCheck } from '@opensrp/rbac';

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
        {t('An error occured while fetching user groups that the user is assigned to')}
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
      title: t('Actions'),
      dataIndex: 'id' as const,
      render: (id: string) => (
        <RbacCheck permissions={['iam_user.update']}>
          <Button
            onClick={() => removeGroupFromUser(keycloakBaseUrl, id, resourceId, query, t)}
            type="link"
            danger
          >
            {'Leave'}
          </Button>
        </RbacCheck>
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
  query: QueryClient,
  t: TFunction
) => {
  const endpoint = `${KEYCLOAK_URL_USERS}/${userId}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`;
  const server = new KeycloakService(endpoint, baseUrl);
  return server.delete().then(() => {
    query.refetchQueries([KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS]).catch(() => {
      sendInfoNotification(t('Failed to refresh data, please refresh the page'));
    });
    sendSuccessNotification(t('User has been successfully removed from the keycloak group'));
  });
};
