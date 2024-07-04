import React from 'react'
import { Typography, Steps, Button, Space } from 'antd';
import UploadIcon from '@2fd/ant-design-icons/lib/Upload'
import ArrowDownThick from '@2fd/ant-design-icons/lib/ArrowDownThick'
import { OpenSRPService, downloadFile, getFileNameFromCDHHeader } from '@opensrp/react-utils';
import {IMPORT_DOMAIN_URI} from '../../constants';

const { Title, Text } = Typography;


export const ImporterFormInstructions = () => {
    return <>
        <Space direction='vertical'>
        <Title level={4}><UploadIcon />Step by step guide for bulk upload</Title>
        <Text type="secondary">
            Follow these simple instructions to help you prepare, upload, and verify your data smoothly and efficiently
        </Text>
        <ol>
            <li>
                <dl>
                    <dt>{InstructionStepOneTitle}</dt>
                    <dd>{InstructionStepOne}</dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>{InstructionStepTwoTitle}</dt>
                    <dd>{InstructionStepTwo}</dd>
                </dl>
            </li>
        </ol>
        {/* <Steps
            direction="vertical"
            size="small"
            items={[{ title: InstructionStepOneTitle, description: InstructionStepOne }, { title: InstructionStepTwoTitle, description: InstructionStepTwo }]}>
        </Steps> */}
        </Space>
    </>
}

export const InstructionStepOneTitle = <Text strong>Prepare your data file</Text>
export const InstructionStepOne =
    <ol>
        <li>Click the button below to download the bulk upload template file(s) <br></br>
            <Button type="primary" onClick={async () => {
                const service = new OpenSRPService("/$import/templates", IMPORT_DOMAIN_URI)
                const response = await service.download();

                // get filename from content-disposition header
                const contentDispositionHeader = response.headers.get('content-disposition');
                const fileName = contentDispositionHeader
                  ? getFileNameFromCDHHeader(contentDispositionHeader)
                  : `import-template`;
              
                // get blob data from response
                const blob = await response.blob();
              
                downloadFile(blob, fileName);
                service.list().then(res => {

                })
            }}>Download Template <ArrowDownThick /></Button></li>
        <li>Enter your data into the template file. Ensure all required fields are filled and follow the specified format(e.g. date format,)</li>
        <li>Check for any data inconsistencies or errors (e.g. missing values, incorrect data types) before uploading</li>
    </ol>


export const InstructionStepTwoTitle = <Text strong>Upload your data file</Text>
export const InstructionStepTwo =
    <ol>
        <li>Click the "Attach" button to select your prepared data file.</li>
        <li>Once the file or files are selected, click "Start Import" to begin the upload</li>
    </ol>

