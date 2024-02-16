import { getConfig } from '@opensrp/pkg-config';
import { EusmCommodityList } from './Eusm/List';
import { DefaultCommodityList, GroupListProps } from './Default/List';
import React from 'react';
import { useTranslation } from '../../mls';
import { Alert } from 'antd';

export const CommodityList = (props: GroupListProps) => {
  const { t } = useTranslation();
  const { listId } = props;
  const projectCode = getConfig('projectCode');

  if (!listId) {
    return (
      <Alert
        type="error"
        message={t('Incorrect/Missing Configuration')}
        description={t(
          'List id is either incorrectly configured or missing. Kindly contact support to fix this.'
        )}
        banner
        showIcon
      />
    );
  }

  if (projectCode === 'eusm') {
    return <EusmCommodityList {...props} />;
  } else {
    return <DefaultCommodityList {...props} />;
  }
};
