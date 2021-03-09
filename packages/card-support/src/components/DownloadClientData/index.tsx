import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Button, Card, Typography, Form, Select, TreeSelect, DatePicker, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import {
  locationHierachyDucks,
  RawOpenSRPHierarchy,
  generateJurisdictionTree,
  ParsedHierarchyNode,
} from '@opensrp/location-management';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { submitForm, handleCardOrderDateChange, UserAssignment } from './utils';
import { OPENSRP_URL_LOCATION_HIERARCHY, OPENSRP_URL_USER_ASSIGNMENT } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import {
  ALL_LOCATIONS,
  CARD_STATUS,
  CLIENT_LOCATION,
  DOWNLOAD_CLIENT_DATA,
  NEEDS_CARD,
  CARD_NOT_NEEDED,
  BOTH_NEEDS_CARD_CARD_NOT_NEEDED,
  CARD_ORDER_DATE,
  CARD_ORDER_DATE_REQUIRED,
  SELECT_CARD_ORDER_DATE,
  DOWNLOADING,
  DOWNLOAD_CSV,
  ERROR_OCCURRED,
} from '../../lang';

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
  const [cardOrderDate, setCardOrderDate] = React.useState<[string, string]>(['', '']);
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [defaultLocationId, setDefaultLocationId] = React.useState<string>('');
  const locationHierarchies = useSelector((state) =>
    locationHierachyDucks.getAllHierarchiesArray(state)
  );
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const dispatch = useDispatch();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disabledDate = (current: moment.Moment) => {
    // Can not select days after
    return current > moment().startOf('day');
  };

  React.useEffect(() => {
    const serve = new opensrpServiceClass(accessToken, opensrpBaseURL, OPENSRP_URL_USER_ASSIGNMENT);
    serve
      .list()
      .then((assignment: UserAssignment) => {
        const { jurisdictions } = assignment;
        const defaultLocationId = jurisdictions[0];
        setDefaultLocationId(defaultLocationId);
        const serve = new opensrpServiceClass(
          accessToken,
          opensrpBaseURL,
          OPENSRP_URL_LOCATION_HIERARCHY
        );
        serve
          // eslint-disable-next-line @typescript-eslint/camelcase
          .read(defaultLocationId, { is_jurisdiction: true })
          .then((res: RawOpenSRPHierarchy) => {
            const hierarchy = generateJurisdictionTree(res);
            dispatch(fetchAllHierarchiesActionCreator([hierarchy.model]));
          })
          .catch((_: Error) => {
            sendErrorNotification(ERROR_OCCURRED);
          });
      })
      .catch((_: Error) => {
        sendErrorNotification(ERROR_OCCURRED);
      });
  }, [
    accessToken,
    opensrpBaseURL,
    fetchAllHierarchiesActionCreator,
    opensrpServiceClass,
    dispatch,
  ]);

  /** Function to parse the hierarchy tree into TreeSelect node format
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
    <div className="layout-content">
      <Title level={3}>{DOWNLOAD_CLIENT_DATA}</Title>
      <Card>
        <Form
          {...layout}
          initialValues={initialFormValues}
          onFinish={(values) => {
            submitForm(
              {
                ...values,
                clientLocation: values.clientLocation ? values.clientLocation : defaultLocationId,
                cardOrderDate,
              },
              accessToken,
              opensrpBaseURL,
              opensrpServiceClass,
              locationHierarchies,
              setSubmitting
            );
          }}
        >
          <Form.Item name="clientLocation" label={CLIENT_LOCATION}>
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
            >
              <TreeSelect.TreeNode value="" title={ALL_LOCATIONS}></TreeSelect.TreeNode>
              {parseHierarchyNode(locationHierarchies)}
            </TreeSelect>
          </Form.Item>
          <Form.Item name="cardStatus" label={CARD_STATUS}>
            <Select>
              <Option value="">{BOTH_NEEDS_CARD_CARD_NOT_NEEDED}</Option>
              <Option value={CardStatus.NEEDS_CARD}>{NEEDS_CARD}</Option>
              <Option value={CardStatus.DOES_NOT_NEED_CARD}>{CARD_NOT_NEEDED}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cardOrderDate"
            label={CARD_ORDER_DATE}
            rules={[{ type: 'array', required: true, message: CARD_ORDER_DATE_REQUIRED }]}
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
              title={!cardOrderDate[0] || !cardOrderDate[1] ? SELECT_CARD_ORDER_DATE : ''}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={!cardOrderDate[0] || !cardOrderDate[1]}
              >
                <DownloadOutlined />
                {isSubmitting ? `${DOWNLOADING}....` : DOWNLOAD_CSV}
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
