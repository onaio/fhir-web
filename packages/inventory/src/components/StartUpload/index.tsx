import React from 'react';
import { Card, Button, Upload } from 'antd';
import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import { CSV_FILE_TYPE } from '../../constants';
import { UploadChangeParam, RcCustomRequestOptions } from 'antd/lib/upload/interface';
import { CardTitle } from '../../helpers/utils';
import { useTranslation } from '../../mls';

/** props for file start upload */
interface StartUploadProps {
  onFileUpload: (file: File) => void;
}

const defaultProps = {
  onFileUpload: () => void 0,
};

/** card rendered during csv upload, its shown on the first page, initiates the file upload
 * upload constraints; only csv files can be uploaded, only one file can be uploaded at a time
 *
 * @param props - components props
 */
const StartUpload = (props: StartUploadProps) => {
  const { onFileUpload } = props;
  const { t } = useTranslation();

  const cardTitle = (
    <CardTitle
      IconRender={<CloudUploadOutlined className="card-title__icon" />}
      text={t('Use a CSV file to add service point inventory')}
    />
  );

  /** call onFileUpload callback after file is fully read from source
   *
   * @param info - the selected file, formatted by antd
   */
  const uploadOnChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      if (info.file.originFileObj) {
        onFileUpload(info.file.originFileObj as File);
      }
    }
  };

  const uploadProps = {
    accept: `${CSV_FILE_TYPE}`,
    onChange: uploadOnChange,
    customRequest: ({ file, onSuccess }: RcCustomRequestOptions) => {
      onSuccess({}, file);
    },
  };

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>{t('You’ll get a chance to review before committing inventory updates.')}</p>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} type="primary" className="round-button">
          {t('Select CSV file')}
        </Button>
      </Upload>
    </Card>
  );
};

StartUpload.defaultProps = defaultProps;

export { StartUpload };
