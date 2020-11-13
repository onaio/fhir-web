import React from 'react';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { Button, Card, Typography, Form, Select, TreeSelect, DatePicker, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { OpenSRPService } from '@opensrp/server-service';
import { makeAPIStateSelector } from '@opensrp/store';
import { Dictionary } from '@onaio/utils';
import { submitForm, handleCardOrderDateChange } from './utils';

/** interface for component props */
export interface DownloadClientDataProps {
  accessToken: string;
  opensrpBaseURL: string;
  opensrpServiceClass: typeof OpenSRPService;
}
/** interface for form fields */
export interface DownloadClientDataFormFields {
  clientLocation: string | undefined;
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
 * @param {Dictionary} props - component props
 * @returns {Function} - DownloadClientData component
 */
const DownloadClientData: React.FC<DownloadClientDataProps> = (props: DownloadClientDataProps) => {
  const { accessToken, opensrpBaseURL, opensrpServiceClass } = props;
  const [cardOrderDate, setCardOrderDate] = React.useState<[string, string]>(['', '']);
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const { TreeNode } = TreeSelect;
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
  return (
    <>
      <Title level={3}>Download Client Data</Title>
      <Card>
        <Form
          {...layout}
          initialValues={initialFormValues}
          onFinish={(values) => {
            submitForm(
              {
                ...values,
                cardOrderDate,
              },
              accessToken,
              opensrpBaseURL,
              opensrpServiceClass,
              setSubmitting
            );
          }}
        >
          <Form.Item name="clientLocation" label="Client Location">
            <TreeSelect
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
            >
              <TreeNode value="" title="All locations"></TreeNode>
              <TreeNode value="parent 1" title="parent 1">
                <TreeNode value="parent 1-0" title="parent 1-0">
                  <TreeNode value="leaf1" title="my leaf" />
                  <TreeNode value="leaf2" title="your leaf" />
                </TreeNode>
                <TreeNode value="parent 1-1" title="parent 1-1">
                  <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} />
                </TreeNode>
              </TreeNode>
            </TreeSelect>
          </Form.Item>
          <Form.Item name="cardStatus" label="Card Status">
            <Select>
              <Option value="">{`Both "Needs card" and "Card not needed"`}</Option>
              <Option value={CardStatus.NEEDS_CARD}>Needs card</Option>
              <Option value={CardStatus.DOES_NOT_NEED_CARD}>Card not needed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cardOrderDate"
            label="Card Order Date"
            rules={[
              { type: 'array', required: true, message: 'Please enter start date and end date' },
            ]}
          >
            <RangePicker
              onChange={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (_: any, formatString) => handleCardOrderDateChange(formatString, setCardOrderDate)
              }
            />
          </Form.Item>
          <Form.Item {...tailLayout} name="tail">
            <Tooltip
              placement="bottom"
              title={!!cardOrderDate[0] || !!cardOrderDate[1] ? '' : 'Select Card Order Date'}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={!cardOrderDate[0] || !cardOrderDate[1]}
              >
                <DownloadOutlined />
                {isSubmitting ? 'Downloading....' : 'Download CSV'}
              </Button>
            </Tooltip>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
DownloadClientData.defaultProps = defaultProps;
export { DownloadClientData };
/** Interface for connected state to props */
interface DispatchedProps {
  accessToken: string;
}
/**
 * Map state to props
 *
 * @param {Store} state - the app state
 * @returns {Dictionary} - dispatched props
 */
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const accessToken = makeAPIStateSelector()(state, { accessToken: true });
  return { accessToken };
};
export const ConnectedDownloadClientData = connect(mapStateToProps)(DownloadClientData);
