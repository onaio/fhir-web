/* eslint-disable @typescript-eslint/naming-convention */
import { MoreOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Spin, Dropdown, Menu, PageHeader } from 'antd';
import {
  Tree,
  generateJurisdictionTree,
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
} from '@opensrp/location-management';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { BrokenPage, OpenSRPService } from '@opensrp/react-utils';
import { Setting, LocationHierarchyAncestors } from '../../ducks/settings';
import {
  POP_CHARACTERISTICS_PARAM,
  SECURITY_AUTHENTICATE_ENDPOINT,
  SETTINGS_ENDPOINT,
  LOCATION_HIERARCHY_ANCESTORS,
} from '../../constants';
import { useQuery, useQueryClient } from 'react-query';
import { Table } from './Table';
import { useTranslation } from '../../mls';

export interface Props {
  baseURL: string;
  restBaseURL: string;
  v2BaseURL: string;
}

export const ServerSettingsView: React.FC<Props> = (props: Props) => {
  const { baseURL, v2BaseURL } = props;
  const [currentLocId, setCurrentLocId] = useState<string>('');
  const [treeData, setTreeData] = useState<ParsedHierarchyNode[]>([]);
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const getServerSettings = (locationId: string) =>
    new OpenSRPService(SETTINGS_ENDPOINT, v2BaseURL).list({
      identifier: POP_CHARACTERISTICS_PARAM,
      locationId: locationId,
      resolve: true,
      serverVersion: 0,
    }) as Promise<Setting[]>;

  const settingsServe = (settingMetadataId: string) =>
    new OpenSRPService(`${SETTINGS_ENDPOINT}/${settingMetadataId}`, v2BaseURL);

  const invalidateSettingsQueries = () =>
    queryClient
      .invalidateQueries([SETTINGS_ENDPOINT, currentLocId])
      .catch(() => sendErrorNotification(t('Cant Invalidate')));

  const getLocationHierarchy = (locationId: string) => {
    return new OpenSRPService(LOCATION_HIERARCHY_ANCESTORS, `${baseURL}rest/`).read(
      locationId
    ) as Promise<LocationHierarchyAncestors[]>;
  };

  /**
   * Check if server setting is already similar to the parent's setting
   *
   * @param settingKey setting.key
   * @param locationId current location hierarchy id
   * @param newValue new server.value
   * @returns boolean
   */
  const isSettingSimilarToParent = async (
    settingKey: string,
    locationId: string,
    newValue: 'true' | 'false'
  ) => {
    const locationHierarchy = await getLocationHierarchy(locationId);
    const currentLocation = locationHierarchy.find(
      (location) => location.identifier === locationId
    );
    const parentLocation = locationHierarchy.find(
      (location) => location.identifier === currentLocation?.parentId
    );

    if (!parentLocation) return false;

    const parentSettings = await getServerSettings(parentLocation.identifier);
    const specificSetting = parentSettings.find((setting) => setting.key === settingKey);
    return specificSetting?.value === newValue;
  };

  const updateSettings = async (row: Setting, currentLocId: string, valueIsYes: boolean) => {
    const settingIsSimilarToParent = await isSettingSimilarToParent(
      row.key,
      currentLocId,
      valueIsYes ? 'true' : 'false'
    );

    // if setting being anticipated already exists in the parent location
    // delete existing setting and inherit from the parent location instead
    // server returns inherited parent value instead by default
    if (settingIsSimilarToParent) {
      await settingsServe(row.settingMetadataId)
        .delete()
        .catch(() => sendErrorNotification(t('An error occurred')))
        .then(async () => {
          await invalidateSettingsQueries();
        })
        .then(() => sendSuccessNotification(t('Successfully Updated')));
    } else {
      // remove inheritedFrom field from record
      // no longer inherit settings from parent location
      const { inheritedFrom, ...rest } = row;
      const payload = {
        ...rest,
        value: valueIsYes ? 'true' : 'false',
        locationId: currentLocId,
      };
      await settingsServe(rest.settingMetadataId)
        .update(payload)
        .catch(() => sendErrorNotification(t('An error occurred')))
        .then(async () => {
          await invalidateSettingsQueries();
        })
        .then(() => sendSuccessNotification(t('Successfully Updated')));
    }
  };

  const { isError: isUserLocSettingsError, isLoading: isUserLocSettingsLoading } = useQuery(
    SECURITY_AUTHENTICATE_ENDPOINT,
    () => new OpenSRPService(SECURITY_AUTHENTICATE_ENDPOINT, baseURL).list(),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res: { locations: RawOpenSRPHierarchy }) => res.locations,
      onSuccess: (userLocSettings) => {
        const processedHierarchy = generateJurisdictionTree(userLocSettings).model;
        setTreeData([processedHierarchy]);
        const { map: userLocMap } = userLocSettings.locationsHierarchy;
        setCurrentLocId(Object.keys(userLocMap)[0]);
      },
    }
  );

  const {
    isError: isServerSettingsError,
    isLoading: isServerSettingsLoading,
    data: serverSettingsData,
  } = useQuery(
    [SETTINGS_ENDPOINT, currentLocId],
    async () => await getServerSettings(currentLocId),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res: Setting[]) => res,
      enabled: !!currentLocId.length,
    }
  );

  if (isServerSettingsError || isUserLocSettingsError) {
    return <BrokenPage />;
  }

  if (isServerSettingsLoading || isUserLocSettingsLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  return (
    <section className="content-section">
      <Helmet>
        <title>{t('Settings')}</title>
      </Helmet>
      <PageHeader className="page-header" title={t('Settings')} />
      <Row>
        <Col className="bg-white p-3" span={6}>
          <Tree data={treeData} OnItemClick={(node) => setCurrentLocId(node.id)} />
        </Col>
        <Col className="bg-white p-3 border-left" span={18}>
          <div className="bg-white p-3">
            <Table
              data={serverSettingsData ?? []}
              tree={treeData}
              actioncolumn={{
                title: t('Actions'),
                key: `actions`,
                // eslint-disable-next-line react/display-name
                render: (_, row: Setting) => {
                  return (
                    <Dropdown
                      overlay={
                        <Menu className="menu">
                          <Menu.Item
                            onClick={async () => {
                              await updateSettings(row, currentLocId, true);
                            }}
                          >
                            {t('Yes')}
                          </Menu.Item>
                          <Menu.Item
                            onClick={async () => {
                              await updateSettings(row, currentLocId, false);
                            }}
                          >
                            {t('No')}
                          </Menu.Item>
                          <Menu.Item
                            // for inherit
                            // delete existing setting and inherit from the parent location instead
                            // server returns inherited parent value instead by default
                            onClick={async () => {
                              await settingsServe(row.settingMetadataId)
                                .delete()
                                .catch(() => sendErrorNotification(t('An error occurred')))
                                .then(async () => {
                                  await invalidateSettingsQueries();
                                })
                                .then(() => sendSuccessNotification(t('Successfully Updated')));
                            }}
                          >
                            {t('Inherit')}
                          </Menu.Item>
                        </Menu>
                      }
                      placement="bottomLeft"
                      arrow
                      trigger={['click']}
                    >
                      <MoreOutlined className="more-options" />
                    </Dropdown>
                  );
                },
                width: '10%',
              }}
            />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default ServerSettingsView;
