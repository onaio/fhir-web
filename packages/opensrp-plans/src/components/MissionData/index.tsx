/** renders card that shows mission indicators info and mission data csv export */
import {
  FIX_PRODUCT_PROBLEMS_CODE,
  PlanDefinition,
  PlanStatus,
  PRODUCT_CHECK_CODE,
  SERVICE_POINT_CHECK_CODE,
} from '@opensrp/plan-form-core';
import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import {
  DOWNLOAD_MISSION_DATA,
  FETCHING_MISSION_INDICATORS_DATA,
  MISSION_DATA,
  NUMBER_OF_FLAGGED_PRODUCTS,
  PRODUCTS_CHECKED,
  SERVICE_POINTS_VISITED,
} from '../../lang';
import { loadTasksIndicators, TaskCount, TaskParams } from '../../helpers/dataLoaders';
import { CommonProps, defaultCommonProps } from '@opensrp/plan-form';
import { useHandleBrokenPage } from '@opensrp/react-utils';
import { BuildDownloadUrl } from '../../helpers/utils';
import { OPENSRP_BUSINESS_STATUS_VISITED } from '../../constants';

const { Title, Text } = Typography;

interface MissionDataProps extends CommonProps {
  plan: PlanDefinition;
}

const defaultProps = {
  ...defaultCommonProps,
};

const MissionData = (props: MissionDataProps) => {
  const { plan, baseURL } = props;
  const [servicePoints, setServicePoints] = useState<number>(0);
  const [productsChecked, setProductsChecked] = useState<number>(0);
  const [flaggedProducts, setFlaggedProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { handleBrokenPage, broken, errorMessage } = useHandleBrokenPage();

  useEffect(() => {
    const { identifier: planId } = plan;
    const promises: Promise<void | Response>[] = [];
    const codes = [SERVICE_POINT_CHECK_CODE, PRODUCT_CHECK_CODE, FIX_PRODUCT_PROBLEMS_CODE];
    const setStateSequence = [setServicePoints, setProductsChecked, setFlaggedProducts];
    const otherParams: TaskParams = {
      businessStatus: OPENSRP_BUSINESS_STATUS_VISITED,
    };
    codes.forEach((code, index) => {
      const thisPromise = loadTasksIndicators(baseURL, planId, code, true, otherParams)
        .then((response: TaskCount) => {
          setStateSequence[index](response.total_records);
        })
        .catch((err: Error) => {
          throw err;
        });
      promises.push(thisPromise);
    });
    Promise.all(promises)
      .catch((e) => handleBrokenPage(e))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);
  return plan.status !== PlanStatus.DRAFT && plan.status !== PlanStatus.RETIRED ? (
    <Card className="mission-data" bordered={false} title={<Title level={5}>{MISSION_DATA}</Title>}>
      {loading ? (
        <p>
          <Text style={{ fontStyle: 'italic' }}>{FETCHING_MISSION_INDICATORS_DATA}</Text>
        </p>
      ) : null}
      {broken ? <Alert message={errorMessage} type="error" /> : null}
      <Space direction="vertical">
        <p>
          <Text>{SERVICE_POINTS_VISITED}</Text>:&nbsp;
          <Text type="secondary">{servicePoints}</Text>
        </p>
        <p>
          <Text>{PRODUCTS_CHECKED}</Text>:&nbsp;
          <Text type="secondary">{productsChecked}</Text>
        </p>
        <p>
          <Text>{NUMBER_OF_FLAGGED_PRODUCTS}</Text>:&nbsp;
          <Text type="secondary">{flaggedProducts}</Text>
        </p>
        <a href={BuildDownloadUrl(baseURL, plan.identifier)} download>
          <Button type="primary">{DOWNLOAD_MISSION_DATA}</Button>
        </a>
      </Space>
    </Card>
  ) : null;
};

MissionData.defaultProps = defaultProps;

export { MissionData };
