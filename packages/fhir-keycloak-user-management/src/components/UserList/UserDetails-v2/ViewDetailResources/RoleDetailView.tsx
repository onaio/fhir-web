import React from 'react';
import { Alert, Divider, Space, Typography } from 'antd';
import { useTranslation } from '../../../../mls';
import { BrokenPage, TableLayout } from '@opensrp/react-utils';
import { KEYCLOAK_URL_USERS } from '@opensrp/user-management';
import { KeycloakService } from '@opensrp/keycloak-service';
import { useQuery } from 'react-query';
import { keycloakRoleMappingsEndpoint } from '../../../../constants';
import { KeycloakUserRoleMappings } from '../types';

const { Text } = Typography;

export interface KeycloakRoleDetailsProps {
  keycloakBaseUrl: string;
  resourceId: string;
}

export const KeycloakRoleDetails = (props: KeycloakRoleDetailsProps) => {
  const { t } = useTranslation();
  const { keycloakBaseUrl, resourceId } = props;

  const { data, error, isLoading } = useQuery<KeycloakUserRoleMappings>([], () =>
    new KeycloakService(
      `${KEYCLOAK_URL_USERS}/${resourceId}/${keycloakRoleMappingsEndpoint}`,
      keycloakBaseUrl
    ).list()
  );

  if (error && !data) {
    return <Alert type="error">{'Unable to fetch Roles assigned to the user'}</Alert>;
  }

  const { realmMappings, clientMappings } = data ?? {};
  const realmRoles = realmMappings ?? [];
  const clientRoles = flattenClientRoles(clientMappings);

  const realmRoleTableColumn = [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
    },

    {
      title: t('Description'),
      dataIndex: 'description' as const,
    },
  ];

  const clientRoleTableColumn = [
    {
      title: t('Client'),
      dataIndex: 'client' as const,
    },
    {
      title: t('Name'),
      dataIndex: 'name' as const,
    },

    {
      title: t('Description'),
      dataIndex: 'description' as const,
    },
  ];

  console.log({ realmRoles, clientRoles });
  const realmRolesTableProps = {
    datasource: realmRoles,
    columns: realmRoleTableColumn,
    loading: isLoading,
    size: 'small' as const,
    key: 'realms',
  };

  const clientRolesTableProps = {
    datasource: clientRoles,
    columns: clientRoleTableColumn,
    loading: isLoading,
    size: 'small' as const,
    key: 'client',
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <section>
          <Text strong>Realm Roles</Text>
          <TableLayout {...realmRolesTableProps} key="realm" />
        </section>
        <section>
          <Text strong>Client Roles</Text>
          <TableLayout {...clientRolesTableProps} key="client" />
        </section>
      </div>
    </>
  );
};

const flattenClientRoles = (clientRoleMapping: KeycloakUserRoleMappings['clientMappings']) => {
  const mapping = clientRoleMapping ?? {};
  const rtv = [];
  for (const roleObj of Object.values(mapping)) {
    const client = roleObj.client;
    for (const role of roleObj.mappings) {
      rtv.push({
        ...role,
        client,
      });
    }
  }
  return rtv;
};
