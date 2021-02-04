import React from 'react';
import { Card, Button, Spin } from 'antd';
import { CANCEL, DO_NOT_CANCEL, UPLOADING_CSV, VALIDATING_CSV } from '../../lang';
import { CardTitle, UploadStatus } from '../../helpers/utils';
import { format } from 'util';

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

  const cardTitle = (
    <CardTitle
      IconRender={<Spin size="large" />}
      text={
        ((uploadStatus === UploadStatus.PRE_CONFIRMATION_VALIDATION) as boolean)
          ? format(VALIDATING_CSV, filename)
          : uploadStatus === UploadStatus.PRE_CONFIRMATION_UPLOAD
          ? format(UPLOADING_CSV, filename)
          : ''
      }
    />
  );

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>{DO_NOT_CANCEL}</p>
      <Button className="round-button" onClick={() => onCancel?.()}>
        {CANCEL}
      </Button>
    </Card>
  );
};

UploadValidateCard.defaultProps = defaultProps;

export { UploadValidateCard };
