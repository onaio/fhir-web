import React from 'react';
import { Card, Space, Button } from 'antd';
import {
  CANCEL,
  FILE_READY,
  INVENTORY_ITEMS_WILL_BE_ADDED,
  PROCEED_WITH_ADDING_INVENTORY,
} from '../../lang';
import { RightCircleOutlined } from '@ant-design/icons';
import { format } from 'util';
import { CardTitle } from '../../helpers/utils';

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

/** card rendered during csv upload, its shown after validation is successful
 *
 * @param props - component props
 */
const PreConfirmationSuccess = (props: PreConfirmationSuccessProps) => {
  const { onCancel, onCommitInventory, rowsProcessed, filename } = props;

  const cardTitle = (
    <CardTitle
      IconRender={<RightCircleOutlined className="card-title__icon" />}
      text={format(FILE_READY, filename)}
    />
  );

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>{format(INVENTORY_ITEMS_WILL_BE_ADDED, rowsProcessed)}</p>
      <Space>
        <Button
          id="confirm-commit"
          className="custom-btn-success round-button"
          onClick={onCommitInventory}
        >
          {PROCEED_WITH_ADDING_INVENTORY}
        </Button>
        <Button id="cancel-commit" className="round-button" onClick={onCancel}>
          {CANCEL}
        </Button>
      </Space>
    </Card>
  );
};

PreConfirmationSuccess.defaultProps = defaultProps;

export { PreConfirmationSuccess };
