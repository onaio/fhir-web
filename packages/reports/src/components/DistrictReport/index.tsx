import React, { useState } from 'react';
import { Button, Card, Typography, Form, TreeSelect, DatePicker, Tooltip, Spin, Alert } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  locationHierachyDucks,
  RawOpenSRPHierarchy,
  generateJurisdictionTree,
  ParsedHierarchyNode,
} from '@opensrp/location-management';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useQuery } from 'react-query';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { sendErrorNotification } from '@opensrp/notifications';
import { SECURITY_AUTHENTICATE, OPENSRP_URL_LOCATION_HIERARCHY } from '../../constants';
import { submitForm } from './utils';
import { useTranslation } from '../../mls';
import './index.css';

export interface DistrictReportProps {
  opensrpBaseURL: string;
}

export const DistrictReport = ({ opensrpBaseURL }: DistrictReportProps) => {
  const [reportDate, setReportDate] = useState<string>('');
  const [locationId, setLocationId] = useState<string>('');
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const locationHierarchies = useSelector((state) =>
    locationHierachyDucks.getAllHierarchiesArray(state)
  );
  const fetchAllHierarchiesActionCreator = locationHierachyDucks.fetchAllHierarchies;
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { Title } = Typography;
  const layout = {
    labelCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 2, span: 10 },
      md: { offset: 0, span: 8 },
      lg: { offset: 0, span: 6 },
    },
    wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 12 }, lg: { span: 10 } },
  };
  const tailLayout = {
    wrapperCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 12, span: 24 },
      md: { offset: 8, span: 16 },
      lg: { offset: 6, span: 14 },
    },
  };

  interface DefaultLocation {
    display: string;
    name: string;
    uuid: string;
  }

  // remove '/rest' from base opensrp url (https://some.open.opensrp.url/opensrp/rest/)
  const BASE_URL = opensrpBaseURL.replace('/rest', '');

  // fetch logged in user data including team assigned to and location assigned to the team
  const userLocSettings = useQuery(
    SECURITY_AUTHENTICATE,
    () => new OpenSRPService(accessToken, BASE_URL, SECURITY_AUTHENTICATE).list(),
    {
      onError: () =>
        sendErrorNotification(
          t(
            `Please confirm that the logged-in user is assigned to a team and the team is assigned to a location, otherwise contact system admin.`
          )
        ),
      select: (res: { team: { team: { location: DefaultLocation } } }) => res.team.team.location,
    }
  );

  // fetch location hierarchy for location assigned to the user (through the team)
  const { isIdle, isLoading } = useQuery(
    OPENSRP_URL_LOCATION_HIERARCHY,
    () =>
      new OpenSRPService(accessToken, opensrpBaseURL, OPENSRP_URL_LOCATION_HIERARCHY).read(
        userLocSettings.data?.uuid ?? '',
        { is_jurisdiction: true }
      ),
    {
      // start fetching when userLocSettings hook succeeds
      enabled: userLocSettings.isSuccess && userLocSettings.data.uuid.length > 0,
      onError: () => sendErrorNotification(t('an error occurred')),
      onSuccess: (res: RawOpenSRPHierarchy) => {
        const hierarchy = generateJurisdictionTree(res);
        dispatch(fetchAllHierarchiesActionCreator([hierarchy.model]));
      },
    }
  );

  /**
   * Function to parse the hierarchy tree into TreeSelect node format
   *
   * @param {Array<ParsedHierarchyNode>} hierarchyNode the tree node to parse
   * @returns {Array<React.ReactNode>} the parsed format of for Ant TreeSelect
   */
  function parseHierarchyNode(hierarchyNode: ParsedHierarchyNode[]): React.ReactNode[] {
    return hierarchyNode.map((node) => (
      <TreeSelect.TreeNode key={node.id} value={node.id} title={node.title}>
        {node.children ? parseHierarchyNode(node.children) : null}
      </TreeSelect.TreeNode>
    ));
  }

  return (
    <div className="layout-content">
      <Title level={3}>{t('Download District Report')}</Title>
      <Card>
        <Form
          {...layout}
          onFinish={() => {
            setSubmitting(true);
            submitForm(locationId, reportDate, accessToken, opensrpBaseURL)
              .catch(() => sendErrorNotification(t('An error occurred')))
              .finally(() => setSubmitting(false));
          }}
        >
          <Form.Item name="location" label={t('Location')}>
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Select Location"
              onChange={(value) => setLocationId(value)}
              loading={!userLocSettings.isError && (isIdle || isLoading)}
              notFoundContent={
                !userLocSettings.isError && (isIdle || isLoading) ? (
                  <Spin size="small" className="inline-spinner" />
                ) : userLocSettings.isError ? (
                  <Alert message="Error loading locations" type="error" showIcon />
                ) : null
              }
            >
              {parseHierarchyNode(locationHierarchies)}
            </TreeSelect>
          </Form.Item>
          <Form.Item
            name="reportDate"
            label={t('Report Date')}
            rules={[{ required: true, message: t('Date Required') }]}
          >
            <DatePicker
              disabledDate={(current) => current > moment().endOf('month')}
              picker="month"
              onChange={(_, dateString) => setReportDate(dateString)}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Tooltip placement="bottom" title={!reportDate ? t('Date Required') : null}>
              <Button type="primary" htmlType="submit" disabled={!reportDate || !locationId}>
                <DownloadOutlined />
                {isSubmitting ? t(`Downloading....`) : t('Download Report')}
              </Button>
            </Tooltip>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
