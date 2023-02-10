import React from 'react';
import { Card, Spin } from 'antd';
import { CardTitle } from '../../helpers/utils';
import { useTranslation } from '../../mls';

/**
 * shown during csv bulk upload when waiting for data to be committed to database
 * after user confirms validation
 */
const PostConfirmationUpload = () => {
  const { t } = useTranslation();
  const cardTitle = (
    <CardTitle
      IconRender={<Spin size="large"></Spin>}
      text={t('Inventory is being added to service points…')}
    />
  );

  return (
    <Card className="full-page-card" title={cardTitle}>
      <p>{t('Inventory may take a few minutes to appear.')}</p>
    </Card>
  );
};

export { PostConfirmationUpload };
