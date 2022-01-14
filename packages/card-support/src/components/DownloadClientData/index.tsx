import React, { useState, useEffect } from 'react';
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
import { submitForm, handleCardOrderDateChange } from './utils';
import {
  OPENSRP_URL_LOCATION_HIERARCHY,
  PRACTITIONER_FROM_USER,
  ORGANIZATION_BY_PRACTITIONER,
  GET_ASSIGNMENTS_ENDPOINT,
} from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import lang from '../../lang';
import { Practitioner } from '@opensrp/team-management';
import { Dictionary } from '@onaio/utils';
import { Organization } from '@opensrp/team-management';
import { RawAssignment } from '@opensrp/team-assignment';

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
  const [defaultLocationId, setDefaultLocationId] = useState<string>('');
  const locationHierarchies = useSelector((state) =>
    locationHierachyDucks.getAllHierarchiesArray(state)
  );
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const userId = useSelector((state) => (state as Dictionary).session.extraData.user_id);
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

  useEffect(() => {
    // fetch practitioner tied to keycloak user
    const fetchPractitioner = async (userId: string) => {
      const serve = new opensrpServiceClass(accessToken, opensrpBaseURL, PRACTITIONER_FROM_USER);
      try {
        const practitioner: Practitioner = await serve.read(userId);
        return practitioner;
      } catch (_) {
        return undefined;
      }
    };

    // fetch teams (organizations) a practitioner is assigned to
    const fetchAssignedTeams = async (practitionerId: string) => {
      const serve = new opensrpServiceClass(
        accessToken,
        opensrpBaseURL,
        ORGANIZATION_BY_PRACTITIONER
      );
      try {
        const organizations: Organization[] = await serve.read(practitionerId);
        return organizations;
      } catch (_) {
        return [];
      }
    };

    // get all locations a team is assigned to
    const loadAssignments = async (teamId: string) => {
      const serve = new opensrpServiceClass(accessToken, opensrpBaseURL, GET_ASSIGNMENTS_ENDPOINT);
      try {
        const assignments: RawAssignment[] = await serve.read(teamId);
        return assignments;
      } catch (_) {
        return [];
      }
    };

    // fetch location hierarchy for logged  in user
    const fetchLocationHierarchy = async () => {
      const practitioner = await fetchPractitioner(userId);
      if (!practitioner) {
        sendErrorNotification(lang.USER_NOT_ACTIVE_PRACTITIONER);
        return;
      }
      const assignedTeams = await fetchAssignedTeams(practitioner.identifier);
      if (assignedTeams.length === 0) {
        sendErrorNotification(lang.USER_NOT_ASSIGNED);
        return;
      }
      // get first active team member
      const defaultActiveTeam = assignedTeams.find((team) => team.active === true);
      if (!defaultActiveTeam) {
        sendErrorNotification(lang.USER_NOT_ASSIGNED);
        return;
      }
      // load locations assigned to the team
      const locationsAssigned = await loadAssignments(defaultActiveTeam.identifier);
      if (locationsAssigned.length === 0) {
        sendErrorNotification(lang.USERS_TEAM_NOT_ASSIGNED);
        return;
      }
      // get first location whose expiry date is in the future or null
      const defaultLocation = locationsAssigned.find(
        (location) => location.toDate === null || new Date(location.toDate) > new Date()
      );
      if (!defaultLocation) {
        sendErrorNotification(lang.USER_NOT_ASSIGNED_AND_USERS_TEAM_NOT_ASSIGNED);
        return;
      }
      setDefaultLocationId(defaultLocation.jurisdictionId);

      // fetch location hierarchy of default location
      const serve = new opensrpServiceClass(
        accessToken,
        opensrpBaseURL,
        OPENSRP_URL_LOCATION_HIERARCHY
      );
      serve
        // eslint-disable-next-line @typescript-eslint/camelcase
        .read(defaultLocation.jurisdictionId, { is_jurisdiction: true })
        .then((res: RawOpenSRPHierarchy) => {
          const hierarchy = generateJurisdictionTree(res);
          dispatch(fetchAllHierarchiesActionCreator([hierarchy.model]));
        })
        .catch(() => {
          sendErrorNotification(lang.ERROR_OCCURRED);
        });
    };
    if (userId) {
      fetchLocationHierarchy().catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
    }
  }, [
    accessToken,
    dispatch,
    fetchAllHierarchiesActionCreator,
    opensrpBaseURL,
    opensrpServiceClass,
    userId,
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
      <Title level={3}>{lang.DOWNLOAD_CLIENT_DATA}</Title>
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
          <Form.Item name="clientLocation" label={lang.CLIENT_LOCATION}>
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
            >
              <TreeSelect.TreeNode value="" title={lang.ALL_LOCATIONS}></TreeSelect.TreeNode>
              {parseHierarchyNode(locationHierarchies)}
            </TreeSelect>
          </Form.Item>
          <Form.Item name="cardStatus" label={lang.CARD_STATUS}>
            <Select>
              <Option value="">{lang.BOTH_NEEDS_CARD_CARD_NOT_NEEDED}</Option>
              <Option value={CardStatus.NEEDS_CARD}>{lang.NEEDS_CARD}</Option>
              <Option value={CardStatus.DOES_NOT_NEED_CARD}>{lang.CARD_NOT_NEEDED}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cardOrderDate"
            label={lang.CARD_ORDER_DATE}
            rules={[{ type: 'array', required: true, message: lang.CARD_ORDER_DATE_REQUIRED }]}
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
              title={!cardOrderDate[0] || !cardOrderDate[1] ? lang.SELECT_CARD_ORDER_DATE : ''}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={!cardOrderDate[0] || !cardOrderDate[1]}
              >
                <DownloadOutlined />
                {isSubmitting ? `${lang.DOWNLOADING}....` : lang.DOWNLOAD_CSV}
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
