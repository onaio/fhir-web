import React from 'react';
import { Button, Form, Typography, UploadFile, Upload, Space } from 'antd';
import UploadIcon from '@2fd/ant-design-icons/lib/Upload';
import UploadOutlined from '@2fd/ant-design-icons/lib/UploadOutline';
import { UploadChangeParam } from 'antd/es/upload';
import { useHistory } from 'react-router';
import { useMutation, useQueryClient } from 'react-query';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  locations,
  users,
  organizations,
  careteams,
  inventories,
  orgToLocationAssignment,
  userToOrganizationAssignment,
  products,
  productImages,
  DATA_IMPORT_LIST_URL,
  IMPORT_DOMAIN_URI,
  dataImportRQueryKey,
  IMPORT_ENDPOINT,
} from '../../constants';
import { useTranslation } from '../../mls';
import {
  sendErrorNotification,
  sendInfoNotification,
  sendSuccessNotification,
} from '@opensrp/notifications';
import { HTTPMethod, getDefaultHeaders } from '@opensrp/server-service';
import './form.css';
import { getAllConfigs } from '@opensrp/pkg-config';

const { Text, Title } = Typography;

interface DataImportFormProps {
  hidden?: string[];
}

interface FormFields {
  [locations]: UploadFile[];
  [users]: UploadFile[];
  [organizations]: UploadFile[];
  [careteams]: UploadFile[];
  [inventories]: UploadFile[];
  [orgToLocationAssignment]: UploadFile[];
  [userToOrganizationAssignment]: UploadFile[];
  [products]: UploadFile[];
  [productImages]: UploadFile[];
}

/**
 * get payload for fetch
 *
 * @param  _ - signal object that allows you to communicate with a DOM request
 * @param  accessToken - the access token
 * @param  method - the HTTP method
 * @param  data - data to be used for payload
 */
export function customFetchOptions<T>(
  _: AbortSignal,
  accessToken: string,
  method: HTTPMethod,
  data?: T
): RequestInit {
  const headers = getDefaultHeaders(accessToken);
  return {
    headers: { authorization: headers.authorization as string },
    method,
    ...(data ? { body: data as BodyInit } : {}),
  };
}

export const DataImportForm = (props: DataImportFormProps) => {
  const { hidden } = props;
  const queryClient = useQueryClient();
  const history = useHistory();
  const { t } = useTranslation();
  const goTo = (url = '#') => history.push(url);
  const { productListId, inventoryListId } = getAllConfigs();
  const listIdsSParams = new URLSearchParams();

  if (productListId) {
    listIdsSParams.append('productListId', productListId);
  }
  if (inventoryListId) {
    listIdsSParams.append('inventoryListId', inventoryListId);
  }

  const { mutate, isLoading } = useMutation(
    async (values: FormFields) => {
      const postUrl = `${IMPORT_ENDPOINT}?${listIdsSParams.toString()}`;
      const service = new OpenSRPService(postUrl, IMPORT_DOMAIN_URI, customFetchOptions);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value?.[0]?.originFileObj);
        }
      });

      return service.create(formData);
    },
    {
      onError: (err: Error) => {
        sendErrorNotification(err.message);
      },
      onSuccess: async () => {
        sendSuccessNotification(t('Data import started successfully'));
        queryClient.invalidateQueries(dataImportRQueryKey).catch(() => {
          sendInfoNotification(t('Failed to refresh data, please refresh the page'));
        });
        goTo(DATA_IMPORT_LIST_URL);
      },
    }
  );

  const formItems = [
    {
      formFieldName: users,
      label: 'Users',
      UploadBtnText: 'Attach users file',
    },
    {
      formFieldName: locations,
      label: 'Locations',
      UploadBtnText: 'Attach locations file',
    },
    {
      formFieldName: organizations,
      label: 'Organizations',
      UploadBtnText: 'Attach organizations file',
    },
    {
      formFieldName: careteams,
      label: 'CareTeams',
      UploadBtnText: 'Attach careTeams file',
    },
    {
      formFieldName: orgToLocationAssignment,
      label: 'Organization location assignment',
      UploadBtnText: 'Attach assignment file',
    },
    {
      formFieldName: userToOrganizationAssignment,
      label: 'User organization assignment',
      UploadBtnText: 'Attach assignment file',
    },
    {
      formFieldName: inventories,
      label: 'Inventory',
      UploadBtnText: 'Attach inventory file',
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Title level={4}>
        <UploadIcon />
        Select files to upload
      </Title>
      <Text type="secondary">Supported file formats CSV</Text>
      <Form
        className="import-form"
        colon={false}
        onFinish={(values: FormFields) => {
          mutate(values);
        }}
      >
        {formItems.map((item) => {
          const { formFieldName, label, UploadBtnText } = item;
          return (
            <Form.Item
              key={formFieldName}
              id={formFieldName}
              hidden={hidden?.includes(formFieldName)}
              name={formFieldName}
              label={label}
              valuePropName="fileList"
              getValueFromEvent={normalizeFileInputEvent}
            >
              <Upload
                id={formFieldName}
                beforeUpload={() => false}
                accept="text/csv"
                multiple={false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>{UploadBtnText}</Button>
              </Upload>
            </Form.Item>
          );
        })}
        <Form.Item
          id={products}
          hidden={hidden?.includes(products)}
          name={products}
          label={'Products'}
          valuePropName="fileList"
          getValueFromEvent={normalizeFileInputEvent}
        >
          <Upload
            id={products}
            beforeUpload={() => false}
            accept="text/csv"
            multiple={false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>{'Attach product file'}</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" id="submit-button" disabled={isLoading} htmlType="submit">
              {isLoading ? t('Uploading') : t('Start Import')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};

/**
 * extract file from an input event
 *
 * @param e - event after a file upload
 */
export const normalizeFileInputEvent = (e: UploadChangeParam<UploadFile>) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e.fileList;
};
