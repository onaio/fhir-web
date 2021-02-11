import React from 'react';
import { Row, Col, Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { columns } from '../../containers/ProfileView/utils';
import { Link } from 'react-router-dom';
import { INVENTORY_ADD_SERVICE_POINT } from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { ADD_NEW_INVENTORY_ITEM, INVENTORY_ITEMS } from '../../lang';
import { Inventory } from '../../ducks/inventory';

import '../../index.css';

/** props for the InventoryList view */
interface InventoryListProps extends CommonProps {
  columns: ColumnsType<Inventory>;
  inventoriesArray: Inventory[];
}

const defaultProps = {
  ...defaultCommonProps,
  columns: columns,
  inventoriesArray: [],
};

/** component that renders Inventory list
 *
 * @param props - the component props
 */
const InventoryList = (props: InventoryListProps) => {
  const { inventoriesArray } = props;
  return (
    <>
      <Row className={'list-view'}>
        <Col className={'main-content'}>
          <div className="inventory-profile">
            <h6>{INVENTORY_ITEMS}</h6>
            <Link to={INVENTORY_ADD_SERVICE_POINT}>
              <Button type="primary" size="large">
                {ADD_NEW_INVENTORY_ITEM}
              </Button>
            </Link>
          </div>
          <Table dataSource={inventoriesArray} columns={columns}></Table>
        </Col>
      </Row>
    </>
  );
};

InventoryList.defaultProps = defaultProps;

export { InventoryList };
