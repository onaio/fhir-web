import React from 'react';
import { Card, Button, Spin } from 'antd';
import { CardTitle, UploadStatus } from '../../helpers/utils';
import { useTranslation } from 'react-i18next';

/** this component's props' interface */
interface UploadValidatingCardProps {
  onCancel?: () => void;
  uploadStatus: UploadStatus;
  filename: string;
}

const defaultProps = {
  uploadStatus: UploadStatus.PRE_CONFIRMATION_UPLOAD,
  filename: '',
};

/** rendered in csv upload, shown during pre confirmation upload and validation steps
 *
 * @param props - component props
 */
const UploadValidateCard = (props: UploadValidatingCardProps) => {
  const { onCancel, uploadStatus, filename } = props;
  const { t } = useTranslation();

  const cardTitle = (
    <CardTitle
      IconRender={<Spin size="large" />}
      text={
        ((uploadStatus === UploadStatus.PRE_CONFIRMATION_VALIDATION) as boolean)
          ? t('Validating {{filename}} ...', { filename })
          : uploadStatus === UploadStatus.PRE_CONFIRMATION_UPLOAD
          ? t('Uploading {{filename}} ...', { filename })
          : ''
      }
    />
  );

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>{t('Do not close tab or navigate away.')}</p>
      <Button className="round-button" onClick={() => onCancel?.()}>
        {t('Cancel')}
      </Button>
    </Card>
  );
};

UploadValidateCard.defaultProps = defaultProps;

export { UploadValidateCard };
