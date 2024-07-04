import React from 'react';
import { Button, Form, Typography, UploadFile, Upload, Space } from 'antd';
import UploadIcon from "@2fd/ant-design-icons/lib/Upload";
import UploadOutlined from "@2fd/ant-design-icons/lib/UploadOutline";
import { UploadChangeParam } from 'antd/es/upload';
import { useHistory } from 'react-router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { OpenSRPService, formItemLayout, tailLayout } from "@opensrp/react-utils";
import { locations, users, organizations, careteams, inventories, orgToLocationAssignment, userToOrganizationAssignment, products, productImages, DATA_IMPORT_LIST_URL, IMPORT_DOMAIN_URI, dataImportRQueryKey } from '../../constants';
import { useTranslation } from '../../mls';
import { sendErrorNotification, sendSuccessNotification, sendInfoNotification } from '@opensrp/notifications';
import FormItem from 'antd/es/form/FormItem';
import { HTTPMethod, getDefaultHeaders } from '@opensrp/server-service';
import "./form.css";

const { Text, Title } = Typography;

interface DataImportFormProps {
    hidden: string[]
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
 * @param {object} _ - signal object that allows you to communicate with a DOM request
 * @param {string} accessToken - the access token
 * @param {string} method - the HTTP method
 * @param {object} data - data to be used for payload
 * @returns {Object} the payload
 */
export function customFetchOptions<T = any>(
    _: AbortSignal,
    accessToken: string,
    method: HTTPMethod,
    data?: T
): RequestInit {
    const headers = getDefaultHeaders(accessToken)
    return {
        headers: { authorization: headers.authorization as string },
        method,
        ...(data ? { body: data as any } : {}),
    };
}

export const DataImportForm = (props: DataImportFormProps) => {
    const { hidden } = props
    const queryClient = useQueryClient();
    const history = useHistory();
    const { t } = useTranslation();
    const goTo = (url = '#') => history.push(url);

    const { mutate, isLoading } = useMutation(
        async (values: FormFields) => {
            const service = new OpenSRPService<any>("/$import", IMPORT_DOMAIN_URI, customFetchOptions)
            const formData = new FormData()

            Object.entries(values).forEach(([key, value]) => {

                if (value) {
                    formData.append(key, value?.[0]?.originFileObj)
                }
            })

            service.create(formData)
        },
        {
            onError: (err: Error) => {
                sendErrorNotification(err.message);
            },
            onSuccess: async () => {
                sendSuccessNotification(t('Data import started successfully'));
                queryClient.invalidateQueries(dataImportRQueryKey)
                goTo(DATA_IMPORT_LIST_URL);
            },
        }

    );


    const formItems = [{
        formFieldName: users,
        label: "Users",
        UploadBtnText: "Attach users file"
    }, {
        formFieldName: locations,
        label: "Locations",
        UploadBtnText: "Attach locations file"
    }, {
        formFieldName: organizations,
        label: "Organizations",
        UploadBtnText: "Attach organizations file"
    }, {
        formFieldName: careteams,
        label: "Careteams",
        UploadBtnText: "Attach careteams file"
    }, {
        formFieldName: orgToLocationAssignment,
        label: "Organization location assignment",
        UploadBtnText: "Attach assignment file"
    }, {
        formFieldName: userToOrganizationAssignment,
        label: "User organization assignment",
        UploadBtnText: "Attach assignment file"
    }, {
        formFieldName: inventories,
        label: "Inventory",
        UploadBtnText: "Attach inventory file"
    }]

    return <Space direction='vertical' style={{ width: "100%" }}>
        <Title level={4}><UploadIcon />Select files to upload</Title>
        <Text type='secondary'>Supported file formats CSV</Text>
        <Form
            className='import-form'
            colon={false}
            onFinish={(values: any) => {
                mutate(values);
            }}
        >
            {
                formItems.map(item => {
                    const { formFieldName, label, UploadBtnText } = item
                    return <Form.Item
                        id={formFieldName}
                        hidden={hidden.includes(formFieldName)}
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
                })
            }
            <Form.Item
                id={products}
                hidden={hidden.includes(products)}
                name={products}
                label={"Products"}
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
                    <Button icon={<UploadOutlined />}>{"Attach product file"}</Button>
                </Upload>
                {/* <br/>
                <Form.Item
                    id={productImages}
                    hidden={hidden.includes(productImages)}
                    name={productImages}
                    valuePropName="fileList"
                    getValueFromEvent={normalizeFileInputEvent}
                >
                    <Upload
                        id={product}
                        beforeUpload={() => false}
                        accept="text/csv"
                        multiple={false}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>{"Attach products file"}</Button>
                    </Upload>
                </Form.Item> */}
            </Form.Item>
            <FormItem >
                <Space>
                    <Button type="primary" id="submit-button" disabled={isLoading} htmlType="submit">
                        {isLoading ? t('Uploading') : t('Start Import')}
                    </Button>
                </Space>
            </FormItem>

        </Form>
    </Space>
}




// TODO - dry out
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