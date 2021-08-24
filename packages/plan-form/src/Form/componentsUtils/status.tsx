import React from 'react';
import { Radio, Popconfirm } from 'antd';
import { PlanStatus, planStatusDisplay, status } from '@opensrp-web/plan-form-core';
import { FormInstance } from 'antd/lib/form';
import lang from '../../lang';
import { PlanFormFields } from '../../helpers/types';
import { PopconfirmProps } from 'antd/lib/popconfirm';

interface PlanStatusRendererProps {
  disabledFields: string[];
  disAllowedStatusChoices: string[];
  setFieldsValue: FormInstance['setFieldsValue'];
  assignedJurisdictions?: PlanFormFields['jurisdictions'];
}

/** renders the status fields on the planForm
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

  const popUpConfirmationMessageLookup = {
    [PlanStatus.DRAFT]: lang.SETTING_STATUS_TO_DRAFT,
    [PlanStatus.ACTIVE]: lang.SETTING_STATUS_TO_ACTIVE,
    [PlanStatus.COMPLETE]: lang.SETTING_STATUS_TO_COMPLETE,
    [PlanStatus.RETIRED]: lang.SETTING_STATUS_TO_RETIRED,
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
            okText: lang.YES,
            cancelText: lang.NO,
          };
          let additionalRadioClassName = '';

          if (e[1] === PlanStatus.ACTIVE && assignedJurisdictions?.length === 0) {
            // change onConfirm to do nothing, and hide cancelButton, change popup title
            popConfirmProps = {
              title: lang.CANNOT_ACTIVATE_PLAN_WITH_NO_JURISDICTIONS,
              okText: lang.OK,
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
