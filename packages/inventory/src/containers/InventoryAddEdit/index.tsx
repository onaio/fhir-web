import React from 'react';
import { Typography, Card } from 'antd';
import { Helmet } from 'react-helmet';
import { OpenSRPService } from '@opensrp/react-utils';
import { InventoryItemForm } from '../../components/InventoryItemForm';
import { ADD_INVENTORY_ITEM } from '../../lang';

/** interface component props */
export interface InventoryAddEditProps {
  openSRPBaseURL: string;
  cancelURL: string;
  openSRPService: typeof OpenSRPService;
}

/** default component props */
export const defaultInventoryAddEditProps = {
  openSRPBaseURL: '',
  cancelURL: '',
  openSRPService: OpenSRPService,
};

const InventoryAddEdit: React.FC<InventoryAddEditProps> = (props: InventoryAddEditProps) => {
  const { openSRPBaseURL, cancelURL, openSRPService } = props;
  const inventoryItemFormProps = {
    openSRPBaseURL,
    cancelURL,
    openSRPService,
  };
  const { Title } = Typography;

  return (
    <div className="layout-content">
      <Helmet>
        <title>{ADD_INVENTORY_ITEM}</title>
      </Helmet>
      <Title level={3}>Add inventory item to </Title>
      <Card>
        <InventoryItemForm {...inventoryItemFormProps} />
      </Card>
    </div>
  );
};

InventoryAddEdit.defaultProps = defaultInventoryAddEditProps;

export { InventoryAddEdit };
