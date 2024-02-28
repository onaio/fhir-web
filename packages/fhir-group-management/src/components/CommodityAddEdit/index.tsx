import { getConfig } from '@opensrp/pkg-config';
import { CommodityAddEdit as EusmCommodityAddEdit } from './Eusm';
import { CommodityAddEdit as DefaultCommodityAddEdit, GroupAddEditProps } from './Default';
import React from 'react';

export const CommodityAddEdit = (props: GroupAddEditProps) => {
  const projectCode = getConfig('projectCode');

  if (projectCode === 'eusm') {
    return <EusmCommodityAddEdit {...props} />;
  } else {
    return <DefaultCommodityAddEdit {...props} />;
  }
};
