import React from 'react';
import { Card, Spin } from 'antd';
import lang from '../../lang';
import { CardTitle } from '../../helpers/utils';

/**
 * shown during csv bulk upload when waiting for data to be committed to database
 * after user confirms validation
 */
const PostConfirmationUpload = () => {
  const cardTitle = (
    <CardTitle
      IconRender={<Spin size="large"></Spin>}
      text={lang.INVENTORY_IS_BEING_ADDED_TO_SERVICE_POINTS}
    />
  );

  return (
    <Card className="full-page-card" title={cardTitle}>
      <p>{lang.INVENTORY_MAY_TAKE_A_FEW_MINUTES_TO_APPEAR}</p>
    </Card>
  );
};

export { PostConfirmationUpload };
