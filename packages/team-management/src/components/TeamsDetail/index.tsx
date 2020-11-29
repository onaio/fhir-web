import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, notification, Spin } from 'antd';
import { Organization } from '../../ducks/organizations';
import { useDispatch, useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, {
  fetchPractionerAction,
  getPractitionerArray,
  reducerName,
  Practioner,
  removePractionerAction,
} from '../../ducks/practitioners';
import { getAccessToken } from '@onaio/session-reducer';
import { API_BASE_URL, TEAM_PRACTITIONERS } from '../../constants';

reducerRegistry.register(reducerName, reducer);

export interface TeamsDetailProps extends Organization {
  onClose?: Function;
  active: boolean;
  id: number;
  identifier: string;
  name: string;
  partOf?: number;
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, identifier } = props;
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const practitioners = useSelector((state) => getPractitionerArray(state));
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoading) {
      const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAM_PRACTITIONERS + identifier);
      dispatch(removePractionerAction());
      serve
        .list()
        .then((response: Practioner[]) => {
          dispatch(fetchPractionerAction(response));
          setIsLoading(false);
        })
        .catch((e) => notification.error({ message: `${e}`, description: '' }));
    }
  }, [accessToken, dispatch, identifier, isLoading]);

  if (isLoading) return <Spin size="small" />;
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
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Created</p>
        <p className="mb-0">2017-10-31</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Last updated</p>
        <p className="mb-0">2017-10-31</p>
      </div>
      {practitioners.length ? (
        <div className="mb-4 small">
          <p className="mb-0 font-weight-bold">Team members</p>
          {practitioners.map((item) => (
            <p key={item.identifier} className="mb-0">{`${item.name}`}</p>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TeamsDetail;
