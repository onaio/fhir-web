import React from 'react';
import { Card, Space, Button } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import { CardTitle } from '../../helpers/utils';
import { useTranslation } from '../../mls';

/** describes this component's props */
interface PreConfirmationSuccessProps {
  onCancel?: () => void;
  onCommitInventory?: () => Promise<unknown> | undefined;
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
 * @param props - component props
 */
const PreConfirmationSuccess = (props: PreConfirmationSuccessProps) => {
  const { onCancel, onCommitInventory, rowsProcessed, filename } = props;
  const { t } = useTranslation();

  const cardTitle = (
    <CardTitle
      IconRender={<RightCircleOutlined className="card-title__icon" />}
      text={t('“{{filename}}” ready', { filename })}
    />
  );

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>
        {t(
          '{{rowsProcessed}} inventory items will be added to service points. Do you wish to proceed?',
          { rowsProcessed }
        )}
      </p>
      <Space>
        <Button
          id="confirm-commit"
          className="custom-btn-success round-button"
          onClick={onCommitInventory}
        >
          {t('Proceed with adding inventory')}
        </Button>
        <Button id="cancel-commit" className="round-button" onClick={onCancel}>
          {t('Cancel')}
        </Button>
      </Space>
    </Card>
  );
};

PreConfirmationSuccess.defaultProps = defaultProps;

export { PreConfirmationSuccess };
