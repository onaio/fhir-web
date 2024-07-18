import React from 'react';
import { Typography, Steps, Button, Space } from 'antd';
import UploadIcon from '@2fd/ant-design-icons/lib/Upload';
import ArrowDownThick from '@2fd/ant-design-icons/lib/ArrowDownThick';
import { OpenSRPService, downloadFile, getFileNameFromCDHHeader } from '@opensrp/react-utils';
import { defaultImportTemplateName, IMPORT_DOMAIN_URI } from '../../constants';
import { useTranslation } from '../../mls';
import { sendErrorNotification } from '@opensrp/notifications';

const { Title, Text } = Typography;

export const ImporterFormInstructions = () => {
  const { t } = useTranslation();
  return (
    <div data-testid="form-instructions">
      <Space direction="vertical">
        <Title level={4}>
          <UploadIcon />
          {t('Step by step guide for bulk upload')}
        </Title>
        <Text type="secondary">
          {t(
            'Follow these simple instructions to help you prepare, upload, and verify your data smoothly and efficiently'
          )}
        </Text>
        <Steps
          className="form-instructions-steps"
          direction="vertical"
          size="small"
          items={[
            { title: <InstructionStepOneTitle />, description: <InstructionStepOne /> },
            { title: <InstructionStepTwoTitle />, description: <InstructionStepTwo /> },
          ]}
        ></Steps>
      </Space>
    </div>
  );
};

export const InstructionStepOneTitle = () => {
  const { t } = useTranslation();
  return <Text strong>{t('Prepare your data file')}</Text>;
};

export const InstructionStepOne = () => {
  const { t } = useTranslation();
  return (
    <ol>
      <li>
        {t('Click the button below to download the bulk upload template file(s).')}
        <br></br>
        <Button
          type="primary"
          onClick={async () => {
            const service = new OpenSRPService('/$import/templates', IMPORT_DOMAIN_URI);
            await service
              .download()
              .then(async (response) => {
                // get filename from content-disposition header
                const contentDispositionHeader = response.headers.get('content-disposition');
                const fileName = contentDispositionHeader
                  ? getFileNameFromCDHHeader(contentDispositionHeader)
                  : defaultImportTemplateName;

                // get blob data from response
                const blob = await response.blob();
                downloadFile(blob, fileName);
              })
              .catch(() =>
                sendErrorNotification(t('An error occurred while fetching the csv templates'))
              );
          }}
        >
          {t('Download Template')}
          <ArrowDownThick />
        </Button>
      </li>
      <li>
        {t(
          'Enter your data into the template file. Ensure all required fields are filled and follow the specified format(e.g. date format)'
        )}
      </li>
      <li>
        {t(
          'Check for any data inconsistencies or errors (e.g. missing values, incorrect data types) before uploading'
        )}
      </li>
    </ol>
  );
};

export const InstructionStepTwoTitle = () => {
  const { t } = useTranslation();
  return <Text strong>{t('Upload your data file')}</Text>;
};
export const InstructionStepTwo = () => {
  const { t } = useTranslation();
  return (
    <ol>
      <li>{t('Click the "Attach" button to select your prepared data file.')}</li>
      <li>{t('Once the file or files are selected, click "Start Import" to begin the upload')}</li>
    </ol>
  );
};
