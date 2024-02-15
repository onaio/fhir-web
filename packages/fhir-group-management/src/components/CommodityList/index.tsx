import { getConfig } from '@opensrp/pkg-config';
import { EusmCommodityList } from './Eusm/List';
import { DefaultCommodityList, GroupListProps } from './Default/List';
import React from 'react';
import { useTranslation } from '../../mls';
import { Alert } from 'antd';

export const CommodityList = (props: GroupListProps) => {
  const { listId } = props;
  const { t } = useTranslation()
  if (!listId) {
    return <Alert
      type="error"
      message={t('Missing configuration')}
      description={t(
        'List id is either incorrectly configured or missing, kindly contact support to fix this.'
      )}
      banner
      showIcon
    />
  }

  const projectCode = getConfig('projectCode');

  if (projectCode === 'eusm') {
    return <EusmCommodityList {...props} />;
  } else {
    return <DefaultCommodityList {...props} />;
  }
};
