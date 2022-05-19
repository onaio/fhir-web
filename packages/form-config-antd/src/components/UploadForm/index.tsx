import React, { useEffect } from 'react';
import { getFetchOptions } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { Typography, Form, Button, Input, Upload, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  submitUploadForm,
  getManifestFilesById,
  UploadFileFieldTypes,
} from '@opensrp/form-config-core';
import { useSelector } from 'react-redux';
import { RouteComponentProps, Redirect } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { ROUTE_PARAM_FORM_ID } from '../../constants';
import { useTranslation } from '../../mls';

/** inteface for route params */
interface RouteParams {
  [ROUTE_PARAM_FORM_ID]: string;
}

/** component props */
export interface UploadFileProps {
  initialValues: UploadFileFieldTypes;
  opensrpBaseURL: string;
  isJsonValidator: boolean;
  onSaveRedirectURL: string;
  getPayload?: typeof getFetchOptions;
}

/** type intersection for all types that pertain to the props */
export type UploadFilePropTypes = UploadFileProps & RouteComponentProps<RouteParams>;

/** default form values */
export const defaultInitialValues: UploadFileFieldTypes = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  form_name: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  form_relation: '',
  module: '',
  form: [],
};

/** default component props */
const defaultProps: UploadFileProps = {
  initialValues: defaultInitialValues,
  opensrpBaseURL: '',
  isJsonValidator: true,
  onSaveRedirectURL: '',
};

/**
 * Component to upload forms
 *
 * @param {Dictionary} props component props
 * @returns {Element} react form for form upload
 */
const UploadForm = (props: UploadFilePropTypes): JSX.Element => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = React.useState<Array<any>>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [ifDoneHere, setIfDoneHere] = React.useState(false);
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const { initialValues, opensrpBaseURL, isJsonValidator, match, onSaveRedirectURL } = props;
  const formId = match.params[ROUTE_PARAM_FORM_ID];
  const formData = useSelector((state) => getManifestFilesById(state, formId));
  const { t } = useTranslation();

  let formInitialValues = initialValues;
  if (formId && formData) {
    formInitialValues = {
      ...formInitialValues,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      form_name: formData.label,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      form_relation: formData.form_relation,
      module: formData.module,
    };
  }

  useEffect(() => {
    if (formId) {
      setIsEditMode(true);
    }
  }, [formId]);

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

  if (ifDoneHere && onSaveRedirectURL) {
    return <Redirect to={onSaveRedirectURL} />;
  }

  return (
    <div className="layout-content">
      <Title level={3}>{t('Upload Form')}</Title>
      <Card>
        <Form
          {...layout}
          initialValues={formInitialValues}
          onFinish={(values) => {
            submitUploadForm(
              {
                ...values,
                form: fileList[0],
              },
              accessToken,
              opensrpBaseURL,
              isJsonValidator,
              setSubmitting,
              setIfDoneHere,
              sendErrorNotification
            ).catch(() => {
              sendErrorNotification(t('Error occurred'));
            });
          }}
        >
          <Form.Item
            id="form_name"
            name="form_name"
            label={t('Form Name')}
            rules={[{ required: true, message: t('Form Name is required') }]}
          >
            <Input disabled={isEditMode} />
          </Form.Item>
          <Form.Item id="module" name="module" label={t('Module')}>
            <Input disabled={isEditMode} />
          </Form.Item>
          <Form.Item id="form_relation" name="form_relation" label={t('Related to')}>
            <Input disabled={isEditMode} />
          </Form.Item>
          <Form.Item
            id="form"
            name="form"
            label={t('Form')}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: t('Form is required') }]}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>{t('Click to upload')}</Button>
            </Upload>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {isSubmitting ? `${t('Uploading')}....` : t('Upload Form')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

UploadForm.defaultProps = defaultProps;

export { UploadForm };
