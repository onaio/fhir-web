import React from 'react';
import { Alert, Button } from 'antd';
import { useTranslation } from '../../../mls';
import {
  KeyValuesDescriptions,
  ResourceDetails,
  useSearchParams,
  viewDetailsQuery,
} from '@opensrp/react-utils';
import { KEYCLOAK_URL_USERS, KeycloakUser } from '@opensrp/user-management';
import { KeycloakService } from '@opensrp/keycloak-service';
import { useQuery } from 'react-query';
import { USER_DETAILS_URL } from '../../../constants';
import { CloseOutlined, SyncOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// remove onclose from type and export the rest
interface UserDetailsOverViewProps {
  keycloakBaseURL: string;
  resourceId: string;
}

export const UserDetailsOverview = (props: UserDetailsOverViewProps) => {
  const { keycloakBaseURL: keycloakBaseUrl, resourceId } = props;
  const { t } = useTranslation();

  const { removeParam } = useSearchParams();

  const {
    data: user,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery<KeycloakUser>([KEYCLOAK_URL_USERS, resourceId], () =>
    new KeycloakService(`${KEYCLOAK_URL_USERS}`, keycloakBaseUrl).read(resourceId as string)
  );

  if (!resourceId) {
    return null;
  }

  if (!user) {
    const resourceDetailsProp = {
      title: '',
      headerLeftData: {
        [t('ID')]: resourceId,
      },
      headerActions: (
        <Button
          data-testid="cancel"
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => removeParam(viewDetailsQuery)}
        />
      ),
      bodyData: () => {
        if (userIsLoading) {
          return (
            <Alert
              description={t('Fetching user details')}
              type="info"
              showIcon
              icon={<SyncOutlined spin />}
            ></Alert>
          );
        } else if (userError) {
          <Alert message={t("Could not fetch this user's details.")} type="info" />;
        }
      },
    };

    return <ResourceDetails {...resourceDetailsProp} />;
  }

  const { id, firstName, lastName, username, email, enabled, emailVerified } = user;
  const userDetails = {
    [t('First Name')]: firstName,
    [t('Last Name')]: lastName,
    [t('Username')]: username,
    [t('Email')]: email,
  };

  let status = {
    title: t('Disabled'),
    color: 'red',
  };

  if (enabled) {
    status = {
      title: t('Enabled'),
      color: 'green',
    };
  }

  const resourceDetailsProp = {
    title: user.username,
    headerLeftData: {
      [t('ID')]: id,
      [t('Verified')]: emailVerified ? t('True') : t('False'),
    },
    status,
    headerActions: (
      <Button
        data-testid="cancel"
        icon={<CloseOutlined />}
        shape="circle"
        type="text"
        onClick={() => removeParam(viewDetailsQuery)}
      />
    ),
    bodyData: () => (
      <>
        <KeyValuesDescriptions data={userDetails} column={2} theme="default" />
      </>
    ),
    footer: (
      <Link to={`${USER_DETAILS_URL}/${id}`} className="m-0 p-1">
        {t('View full details')}
      </Link>
    ),
  };

  return <ResourceDetails {...resourceDetailsProp} />;
};
