import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
import { OpenSRPService } from '../../helpers/dataLoaders';
import React from 'react';
import { Card, Button, Alert } from 'antd';
import {
  ACTIVATE_MISSION,
  FAILED_TO_ACTIVATE_MISSION,
  ONLY_DRAFT_MISSIONS_CAN_BE_ACTIVATED,
  SUCCESSFULLY_ACTIVATED_MISSION,
} from '../../lang';
import { CommonProps, postPutPlan } from '@opensrp/plan-form';
import { defaultCommonProps } from '../../helpers/common';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';

/** props for the activate mission component */
interface ActivateMissionProps extends CommonProps {
  plan: PlanDefinition | null;
  serviceClass: typeof OpenSRPService;
  submitCallback: (plan: PlanDefinition) => void;
}

const defaultProps = {
  ...defaultCommonProps,
  plan: null,
  serviceClass: OpenSRPService,
  submitCallback: () => {
    return;
  },
};

/** renders a card with a button to effect the activate mission worfklow
 *
 * @param props - the component props
 */
const ActivateMissionCard = (props: ActivateMissionProps) => {
  const { plan, serviceClass, baseURL, submitCallback } = props;

  if (!plan) {
    return null;
  }
  const planIsDraft = plan.status === PlanStatus.DRAFT;

  /** post the plan with a new status of active */
  const clickHandler = () => {
    const planPayload = {
      ...plan,
      status: PlanStatus.ACTIVE,
    };
    postPutPlan(planPayload, baseURL, true, serviceClass)
      .then(() => {
        sendSuccessNotification(SUCCESSFULLY_ACTIVATED_MISSION);
        submitCallback(planPayload);
      })
      .catch(() => {
        sendErrorNotification(FAILED_TO_ACTIVATE_MISSION);
      });
  };

  return (
    <Card className="activate-plan" bordered={false} title={ACTIVATE_MISSION}>
      {!planIsDraft ? (
        <Alert message={ONLY_DRAFT_MISSIONS_CAN_BE_ACTIVATED} type="info"></Alert>
      ) : (
        <Button onClick={clickHandler} type="primary"></Button>
      )}
    </Card>
  );
};

ActivateMissionCard.defaultProps = defaultProps;

export { ActivateMissionCard };
