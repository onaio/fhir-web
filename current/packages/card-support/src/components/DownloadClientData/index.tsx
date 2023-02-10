import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Button, Card, Form, Select, TreeSelect, DatePicker, Tooltip, PageHeader } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  locationHierachyDucks,
  RawOpenSRPHierarchy,
  generateJurisdictionTree,
  ParsedHierarchyNode,
} from '@opensrp/location-management';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { submitForm, handleCardOrderDateChange } from './utils';
import { OPENSRP_URL_LOCATION_HIERARCHY, SECURITY_AUTHENTICATE } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { useQuery } from 'react-query';
import { useTranslation } from '../../mls';

reducerRegistry.register(locationHierachyDucks.reducerName, locationHierachyDucks.reducer);

/** interface for component props */
export interface DownloadClientDataProps {
  accessToken: string;
  opensrpBaseURL: string;
  opensrpServiceClass: typeof OpenSRPService;
  fetchAllHierarchiesActionCreator: typeof locationHierachyDucks.fetchAllHierarchies;
}
/** interface for form fields */
export interface DownloadClientDataFormFields {
  clientLocation: string;
  cardStatus: string;
  cardOrderDate: [string, string];
}
/** enum representing the possible card status types */
export enum CardStatus {
  NEEDS_CARD = 'needs_card',
  DOES_NOT_NEED_CARD = 'does_not_need_card',
}
/** default component props */
export const defaultProps: DownloadClientDataProps = {
  accessToken: '',
  opensrpBaseURL: '',
  opensrpServiceClass: OpenSRPService,
  fetchAllHierarchiesActionCreator: locationHierachyDucks.fetchAllHierarchies,
};
/** default initial form values */
export const initialFormValues: Partial<DownloadClientDataFormFields> = {
  clientLocation: '',
  cardStatus: '',
};

/**
 * DownloadClient Data component
 * Downloads a CSV containing client data base on selection
 *
 * @param {object} props - component props
 * @returns {Function} - DownloadClientData component
 */
const DownloadClientData: React.FC<DownloadClientDataProps> = (props: DownloadClientDataProps) => {
  const { opensrpBaseURL, opensrpServiceClass, fetchAllHierarchiesActionCreator } = props;
  const [cardOrderDate, setCardOrderDate] = useState<[string, string]>(['', '']);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const locationHierarchies = useSelector((state) =>
    locationHierachyDucks.getAllHierarchiesArray(state)
  );
  const dispatch = useDispatch();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const { t } = useTranslation();

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disabledDate = (current: moment.Moment) => {
    // Can not select days after
    return current > moment().startOf('day');
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
    () => new opensrpServiceClass(SECURITY_AUTHENTICATE, BASE_URL).list(),
    {
      onError: () =>
        sendErrorNotification(
          t(
            'Please confirm that the logged-in user is assigned to a team and the team is assigned to a location, otherwise contact system admin.'
          )
        ),
      select: (res: { team: { team: { location: DefaultLocation } } }) => res.team.team.location,
    }
  );

  // fetch location hierarchy for location assigned to the team
  useQuery(
    OPENSRP_URL_LOCATION_HIERARCHY,
    () =>
      new opensrpServiceClass(
        OPENSRP_URL_LOCATION_HIERARCHY,
        opensrpBaseURL

        // eslint-disable-next-line @typescript-eslint/naming-convention
      ).read(userLocSettings.data?.uuid ?? '', { is_jurisdiction: true }),
    {
      // start fetching when userLocSettings hook succeeds
      enabled: userLocSettings.isSuccess && userLocSettings.data.uuid.length > 0,
      onError: () => sendErrorNotification(t('An error occurred')),
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
        {node.children ? parseHierarchyNode(node.children) : ''}
      </TreeSelect.TreeNode>
    ));
  }

  return (
    <div className="content-section">
      <PageHeader title={t('Download Client Data')} className="page-header" />
      <Card>
        <Form
          {...layout}
          initialValues={initialFormValues}
          onFinish={(values) => {
            submitForm(
              {
                ...values,
                clientLocation: values.clientLocation
                  ? values.clientLocation
                  : userLocSettings.data?.uuid ?? '',
                cardOrderDate,
              },
              opensrpBaseURL,
              opensrpServiceClass,
              locationHierarchies,
              setSubmitting,
              t
            ).catch(() => sendErrorNotification(t('An error occurred')));
          }}
        >
          <Form.Item name="clientLocation" label={t('Client Location')}>
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
            >
              <TreeSelect.TreeNode value="" title={t('All Locations')}></TreeSelect.TreeNode>
              {parseHierarchyNode(locationHierarchies)}
            </TreeSelect>
          </Form.Item>
          <Form.Item name="cardStatus" label={t('Card Status')}>
            <Select>
              <Option value="">{t('Both "Needs card" and "Card not needed')}</Option>
              <Option value={CardStatus.NEEDS_CARD}>{t('Needs Card')}</Option>
              <Option value={CardStatus.DOES_NOT_NEED_CARD}>{t('Card not needed')}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cardOrderDate"
            label={t('Card Order Date')}
            rules={[
              { type: 'array', required: true, message: t('Please enter start date and end date') },
            ]}
          >
            <RangePicker
              disabledDate={disabledDate}
              onChange={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (_: any, formatString) => handleCardOrderDateChange(formatString, setCardOrderDate)
              }
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Tooltip
              placement="bottom"
              title={!cardOrderDate[0] || !cardOrderDate[1] ? t('Select Card Order Date') : ''}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={!cardOrderDate[0] || !cardOrderDate[1]}
              >
                <DownloadOutlined />
                {isSubmitting ? t('Downloading...') : t('Download CSV')}
              </Button>
            </Tooltip>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
DownloadClientData.defaultProps = defaultProps;

export { DownloadClientData };
