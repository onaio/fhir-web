import React from 'react';
import { Card, Space, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { INVENTORY_BULK_UPLOAD_URL, INVENTORY_SERVICE_POINT_LIST_VIEW } from '../../constants';
import { CardTitle } from '../../helpers/utils';
import { useTranslation } from '../../mls';
import { Trans } from '@opensrp/i18n';

export interface PostConfirmationSuccessProps {
  rowsProcessed: number | string;
  filename: string;
}

const defaultProps = {
  rowsProcessed: 0,
  filename: '',
};

/**
 * card rendered during csv upload, its shown after validation is successful
 *
 * @param props this component's props
 */
const PostConfirmationSuccess = (props: PostConfirmationSuccessProps) => {
  const { rowsProcessed, filename } = props;
  const { t } = useTranslation();

  const history = useHistory();

  const cardTitle = (
    <CardTitle
      IconRender={<CheckCircleOutlined className="card-title__icon" />}
      text={t('“{{filename}}” inventory items successfully added', { filename })}
    />
  );

  return (
    <Card title={cardTitle} className="full-page-card">
      <Trans t={t} i18nKey="postConfirmationSuccess.inventoryAddedTo">
        <p>
          {{ rowsProcessed }} inventory items added to&nbsp;
          <Link to={INVENTORY_SERVICE_POINT_LIST_VIEW}>Service point inventory</Link>.&nbsp;
          Inventory may take a few minutes to appear.
        </p>
      </Trans>
      <Space>
        <Button className="round-button" onClick={() => {history.push(INVENTORY_BULK_UPLOAD_URL)}}>
          {t('Upload another file')}
        </Button>
      </Space>
    </Card>
  );
};

PostConfirmationSuccess.defaultProps = defaultProps;

export { PostConfirmationSuccess };
