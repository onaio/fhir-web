import React from 'react';
import { getFetchOptions } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { Typography, Form, Button, Input, Upload, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { submitForm } from './utils';
import { useSelector } from 'react-redux';

/** form field props */
export interface UploadFileFieldTypes {
  form_name: string;
  form_relation: string;
  module: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: Array<any>;
}

/** component props */
export interface UploadFileProps {
  initialValues: UploadFileFieldTypes;
  opensrpBaseURL: string;
  endpoint: string;
  isJsonValidator: false;
  getPayload?: typeof getFetchOptions;
}

/** default form values */
export const defaultInitialValues: UploadFileFieldTypes = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  form_name: '',
  // eslint-disable-next-line @typescript-eslint/camelcase
  form_relation: '',
  module: '',
  form: [],
};

/** default component props */
export const defaultProps: UploadFileProps = {
  initialValues: defaultInitialValues,
  opensrpBaseURL: '',
  endpoint: '',
  isJsonValidator: false,
};

const UploadFileForm = (props: UploadFileProps): JSX.Element => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = React.useState<Array<any>>([]);
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const { initialValues, opensrpBaseURL, isJsonValidator } = props;
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
  const { Title } = Typography;
  const uploadProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeUpload: (file: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFileList([...fileList, file]);
      return false;
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Title level={3}>Upload Form</Title>
      <Card>
        <Form
          {...layout}
          initialValues={initialValues}
          onFinish={(values) => {
            submitForm(
              {
                ...values,
                form: fileList,
              },
              accessToken,
              opensrpBaseURL,
              isJsonValidator,
              setSubmitting
            );
          }}
        >
          <Form.Item
            name="form_name"
            label="Form Name"
            rules={[{ required: true, message: 'Form Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="module" label="Module">
            <Input />
          </Form.Item>
          <Form.Item name="form_relation" label="Related to">
            <Input />
          </Form.Item>
          <Form.Item
            name="form"
            label="Form"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Form is required' }]}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {isSubmitting ? 'Uploading....' : 'Upload form'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

UploadFileForm.defaultProps = defaultProps;

export { UploadFileForm };
