import React from 'react';
import { Divider, Typography } from 'antd';
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
    return <BrokenPage errorMessage={'Unable to fetch Roles assigned to the user'} />;
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
      dataIndex: 'id' as const,
    },
  ];

  console.log({ realmRoles, clientRoles });
  const realmRolesTableProps = {
    datasource: [],
    columns: realmRoleTableColumn,
    loading: isLoading,
    size: 'small' as const,
    key: 'realms',
  };

  const clientRolesTableProps = {
    datasource: [],
    columns: clientRoleTableColumn,
    loading: isLoading,
    size: 'small' as const,
    key: 'client',
  };

  return (
    <>
      <Text strong>Realm Roles</Text>
      <TableLayout {...realmRolesTableProps} key="realm" />
      <Divider />
      <Text strong>Client Roles</Text>
      <TableLayout {...clientRolesTableProps} key="client" />
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
