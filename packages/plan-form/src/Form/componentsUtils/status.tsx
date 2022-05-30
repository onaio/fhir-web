import React from 'react';
import { Radio, Popconfirm } from 'antd';
import { PlanStatus, planStatusDisplay, status } from '@opensrp/plan-form-core';
import { FormInstance } from 'antd/lib/form';
import { useTranslation } from '../../mls';
import { PlanFormFields } from '../../helpers/types';
import { PopconfirmProps } from 'antd/lib/popconfirm';

interface PlanStatusRendererProps {
  disabledFields: string[];
  disAllowedStatusChoices: string[];
  setFieldsValue: FormInstance['setFieldsValue'];
  assignedJurisdictions?: PlanFormFields['jurisdictions'];
}

/**
 * renders the status fields on the planForm
 * Wraps the radio buttons in a pop up confirmation box, this means
 * we need some custom logic upstream to change how antd form updates
 * values, so that when user does not confirm in the popup, we retain
 * the previous value.
 *
 * @param props - this components props
 */
export const PlanStatusRenderer = (props: PlanStatusRendererProps) => {
  const {
    disabledFields,
    disAllowedStatusChoices,
    setFieldsValue,
    assignedJurisdictions,
    ...rest
  } = props;
  const { t } = useTranslation();

  const popUpConfirmationMessageLookup = {
    [PlanStatus.DRAFT]: t('Are you sure? status will be set to draft'),
    [PlanStatus.ACTIVE]: t("Are you sure? you won't be able to change the status back to draft"),
    [PlanStatus.COMPLETE]: t(
      "Are you sure? you won't be able to change the status for complete plans"
    ),
    [PlanStatus.RETIRED]: t(
      "Are you sure? you won't be able to change the status for retired plans"
    ),
  };

  return (
    <Radio.Group className="plan-form-status" {...rest} disabled={disabledFields.includes(status)}>
      {Object.entries(PlanStatus)
        .filter((e) => !disAllowedStatusChoices.includes(e[1]))
        .map((e) => {
          const titleMessage = () => {
            return <p className="popup-width">{popUpConfirmationMessageLookup[e[1]]}</p>;
          };

          // nominal popConfirmProps
          let popConfirmProps: PopconfirmProps = {
            title: titleMessage,
            onConfirm: () => {
              setFieldsValue({ [status]: e[1] });
            },
            onCancel: () => void 0,
            okText: t('yes'),
            cancelText: t('no'),
          };
          let additionalRadioClassName = '';

          if (e[1] === PlanStatus.ACTIVE && assignedJurisdictions?.length === 0) {
            // change onConfirm to do nothing, and hide cancelButton, change popup title
            popConfirmProps = {
              title: t('Assign jurisdictions to the Plan, to enable activating it'),
              okText: t('OK'),
              cancelButtonProps: {
                style: { display: 'none' },
              },
            };
            // change Radio to be disabled
            additionalRadioClassName = 'disabled';
          }

          return (
            <Popconfirm key={e[0]} {...popConfirmProps}>
              <Radio className={`status-radio ${additionalRadioClassName}`} value={e[1]}>
                {planStatusDisplay[e[1]]}
              </Radio>
            </Popconfirm>
          );
        })}
    </Radio.Group>
  );
};
