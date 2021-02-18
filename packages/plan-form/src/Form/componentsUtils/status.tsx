import React from 'react';
import { Radio, Popconfirm } from 'antd';
import { PlanStatus, planStatusDisplay, status } from '@opensrp/plan-form-core';
import { FormInstance } from 'antd/lib/form';
import {
  NO,
  SETTING_STATUS_TO_ACTIVE,
  SETTING_STATUS_TO_COMPLETE,
  SETTING_STATUS_TO_DRAFT,
  SETTING_STATUS_TO_RETIRED,
  YES,
} from '../../lang';

interface PlanStatusRendererProps {
  disabledFields: string[];
  disAllowedStatusChoices: string[];
  setFieldsValue: FormInstance['setFieldsValue'];
}

const popUpConfirmationMessageLookup = {
  [PlanStatus.DRAFT]: SETTING_STATUS_TO_DRAFT,
  [PlanStatus.ACTIVE]: SETTING_STATUS_TO_ACTIVE,
  [PlanStatus.COMPLETE]: SETTING_STATUS_TO_COMPLETE,
  [PlanStatus.RETIRED]: SETTING_STATUS_TO_RETIRED,
};

/** renders the status fields on the planForm
 * Wraps the radio buttons in a pop up confirmation box, this means
 * we need some custom logic upstream to change how antd form updates
 * values, so that when user does not confirm in the popup, we retain
 * the previous value.
 *
 * @param props - this components props
 */
export const PlanStatusRenderer = (props: PlanStatusRendererProps) => {
  const { disabledFields, disAllowedStatusChoices, setFieldsValue, ...rest } = props;
  return (
    <Radio.Group className="plan-form-status" {...rest} disabled={disabledFields.includes(status)}>
      {Object.entries(PlanStatus)
        .filter((e) => !disAllowedStatusChoices.includes(e[1]))
        .map((e) => {
          const titleMessage = () => {
            return <p className="popup-width">{popUpConfirmationMessageLookup[e[1]]}</p>;
          };

          return (
            <Popconfirm
              key={e[0]}
              title={titleMessage}
              onConfirm={() => {
                setFieldsValue({ [status]: e[1] });
              }}
              onCancel={() => void 0}
              okText={YES}
              cancelText={NO}
            >
              <Radio className="status-radio" value={e[1]}>
                {planStatusDisplay[e[1]]}
              </Radio>
            </Popconfirm>
          );
        })}
    </Radio.Group>
  );
};
