import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
import { OpenSRPService } from '../../helpers/dataLoaders';
import React from 'react';
import { Card, Button, Typography, Tooltip } from 'antd';
import { useTranslation } from '../../mls';
import { CommonProps, postPutPlan } from '@opensrp/plan-form';
import { defaultCommonProps } from '../../helpers/common';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';

const { Title } = Typography;

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

/**
 * renders a card with a button to effect the activate mission worfklow
 *
 * @param props - the component props
 */
const ActivateMissionCard = (props: ActivateMissionProps) => {
  const { plan, serviceClass, baseURL, submitCallback } = props;
  const { t } = useTranslation();
  const planIsDraft = plan?.status === PlanStatus.DRAFT;

  if (!plan || !planIsDraft) {
    return null;
  }
  const planHasJurisdictions = plan.jurisdiction.length > 0;
  const isActivateButtonDisabled = !planHasJurisdictions;

  /** post the plan with a new status of active */
  const clickHandler = () => {
    const planPayload = {
      ...plan,
      status: PlanStatus.ACTIVE,
    };
    postPutPlan(planPayload, baseURL, true, serviceClass)
      .then(() => {
        sendSuccessNotification(t('Successfully activated mission'));
        submitCallback(planPayload);
      })
      .catch(() => {
        sendErrorNotification(t('Activating mission failed'));
      });
  };

  const ActivateButton = (
    <Button onClick={clickHandler} type="primary" disabled={isActivateButtonDisabled}>
      {t('Activate mission')}
    </Button>
  );

  return (
    <Card
      className="activate-plan"
      bordered={false}
      title={<Title level={5}>{t('Activate mission')}</Title>}
    >
      {planHasJurisdictions ? (
        ActivateButton
      ) : (
        <Tooltip title={t('Assign jurisdictions to the Plan, to enable activating it')}>
          {ActivateButton}
        </Tooltip>
      )}
    </Card>
  );
};

ActivateMissionCard.defaultProps = defaultProps;

export { ActivateMissionCard };
