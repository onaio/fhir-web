import { getConfig } from '@opensrp/pkg-config';
import { EusmCommodityList } from './Eusm/List';
import { DefaultCommodityList, GroupListProps } from './Default/List';
import React from 'react';

export const CommodityList = (props: GroupListProps) => {
  const projectCode = getConfig('projectCode');

  if (projectCode === 'eusm') {
    return <EusmCommodityList {...props} />;
  } else {
    return <DefaultCommodityList {...props} />;
  }
};
