import { Popconfirm, Button } from 'antd';
import { KEYCLOAK_URL_USERS } from '@opensrp/user-management';
import { sendErrorNotification } from '@opensrp/notifications';
import { deleteUser } from '../UserList/ListView/utils';
import { useTranslation } from '../../mls';
import { useQueryClient } from 'react-query';
import React from 'react';

export interface UserDeleteBtnProp {
  afterActions?: () => void;
  keycloakBaseUrl: string;
  fhirBaseUrl: string;
  resourceId: string;
}

export const UserDeleteBtn = (props: UserDeleteBtnProp) => {
  const { afterActions, keycloakBaseUrl, fhirBaseUrl, resourceId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return (
    <Popconfirm
      key="delete-user"
      title={t('Are you sure you want to delete this user?')}
      okText={t('Yes')}
      cancelText={t('No')}
      onConfirm={async () => {
        await deleteUser(keycloakBaseUrl, fhirBaseUrl, resourceId, t);
        try {
          return await queryClient.invalidateQueries({queryKey: [KEYCLOAK_URL_USERS], exact: true});
        } catch {
          return sendErrorNotification(
            t('Failed to update data, please refresh the page to see the most recent changes')
          );
        } finally {
          afterActions?.();
        }
      }}
    >
      <Button data-testid="delete-user" danger type="link">
        {t('Delete')}
      </Button>
    </Popconfirm>
  );
};
