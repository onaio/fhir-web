import React from 'react';
import { Card, Space, Button } from 'antd';
import lang from '../../lang';
import { CheckCircleOutlined } from '@ant-design/icons';
import { format } from 'util';
import { Link } from 'react-router-dom';
import { INVENTORY_BULK_UPLOAD_URL, INVENTORY_SERVICE_POINT_LIST_VIEW } from '../../constants';
import { CardTitle } from '../../helpers/utils';

export interface PostConfirmationSuccessProps {
  rowsProcessed: number | string;
  filename: string;
}

const defaultProps = {
  rowsProcessed: 0,
  filename: '',
};

/** card rendered during csv upload, its shown after validation is successful
 *
 * @param props this component's props
 */
const PostConfirmationSuccess = (props: PostConfirmationSuccessProps) => {
  const { rowsProcessed, filename } = props;

  const cardTitle = (
    <CardTitle
      IconRender={<CheckCircleOutlined className="card-title__icon" />}
      text={format(lang.INVENTORY_ITEMS_SUCCESSFULLY_ADDED, filename)}
    />
  );

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>
        {rowsProcessed} {lang.INVENTORY_ITEMS_ADDED_TO}{' '}
        <Link to={INVENTORY_SERVICE_POINT_LIST_VIEW}>{lang.SERVICE_POINT_INVENTORY}</Link>.{' '}
        {lang.INVENTORY_MAY_TAKE_A_FEW_MINUTES_TO_APPEAR}
      </p>
      <Space>
        <Link to={INVENTORY_BULK_UPLOAD_URL}>
          <Button className="round-button">{lang.UPLOAD_ANOTHER_FILE}</Button>
        </Link>
      </Space>
    </Card>
  );
};

PostConfirmationSuccess.defaultProps = defaultProps;

export { PostConfirmationSuccess };
