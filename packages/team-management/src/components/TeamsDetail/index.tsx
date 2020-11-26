import * as React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Organization } from '../../ducks/organizations';

export interface TeamsDetailProps extends Organization {
  onClose?: Function;
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, identifier } = props;
  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => (props.onClose ? props.onClose() : '')}
        className="float-right"
        type="text"
        icon={<CloseOutlined />}
      />
      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">Team name</p>
        <p className="mb-0">{name}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Status</p>
        <p className="mb-0">{`${active}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Identifier</p>
        <p className="mb-0">{`${identifier}`}</p>
      </div>
      {/* <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Created</p>
        <p className="mb-0">{`${date}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Last updated</p>
        <p className="mb-0">{`${active}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Team members</p>
        <p className="mb-0">{`${active}`}</p>
      </div> */}
    </div>
  );
};

export default TeamsDetail;
