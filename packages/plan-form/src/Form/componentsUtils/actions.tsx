/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Dictionary } from '@onaio/utils';
import React from 'react';
import lang from '../../lang';
import { PlanActivityFormFields } from '@opensrp/plan-form-core';
import { Form, Input } from 'antd';

const { Item: FormItem } = Form;
const { TextArea } = Input;

/**
 * Returns form components to render triggers and conditions form fields
 *
 * @param {PlanActivityFormFields} planActivities - activities from the plan form field values
 * @param {boolean} isDisabled - whether to disable the fields or not
 * @returns {object} -
 */
export const getConditionAndTriggers = (
  planActivities: PlanActivityFormFields[],
  isDisabled = true
) => {
  const conditions: Dictionary = {};
  const triggers: Dictionary = {};
  const dynamicValue: Dictionary = {};

  for (let index = 0; index < planActivities.length; index++) {
    const element = planActivities[index];

    if (element.condition) {
      conditions[element.actionCode] = element.condition.map((item, mapIndex) => {
        return (
          <FormItem
            className="condition-group"
            key={`${element.actionCode}-condition-${index}-${mapIndex}`}
          >
            {item.subjectCodableConceptText && (
              <FormItem
                name={[index, 'condition', mapIndex, 'subjectCodableConceptText']}
                id={`activities[${index}].condition[${mapIndex}].subjectCodableConceptText`}
              >
                <Input required={false} disabled={true} hidden={true} />
              </FormItem>
            )}
            {item.expression && (
              <FormItem
                label={lang.EXPRESSION_LABEL}
                name={[index, 'condition', mapIndex, 'expression']}
                id={`activities[${index}].condition[${mapIndex}].expression`}
              >
                <TextArea className="form-control" required={true} disabled={isDisabled} />
              </FormItem>
            )}
            {item.description && (
              <FormItem
                label={lang.DESCRIPTION_LABEL}
                name={[index, 'condition', mapIndex, 'description']}
                id={`activities[${index}].condition[${mapIndex}].description`}
              >
                <TextArea className="form-control" required={true} disabled={isDisabled} />
              </FormItem>
            )}
          </FormItem>
        );
      });
    }
    if (element.trigger) {
      triggers[element.actionCode] = element.trigger.map((item, mapIndex) => {
        return (
          <FormItem
            className="trigger-group"
            key={`${element.actionCode}-trigger-${index}-${mapIndex}`}
          >
            {item.name && (
              <FormItem
                label={lang.NAME}
                name={[index, 'trigger', mapIndex, 'name']}
                id={`activities[${index}].trigger[${mapIndex}].name`}
              >
                <Input required={true} type="text" disabled={isDisabled} />
              </FormItem>
            )}
            {item.expression && (
              <FormItem
                label={lang.EXPRESSION_LABEL}
                name={[index, 'trigger', mapIndex, 'expression']}
                id={`activities[${index}].trigger[${mapIndex}].expression`}
              >
                <TextArea required={true} disabled={isDisabled} />
              </FormItem>
            )}
            {item.description && (
              <FormItem
                label={lang.DESCRIPTION_LABEL}
                name={[index, 'trigger', mapIndex, 'description']}
                id={`activities[${index}].trigger[${mapIndex}].description`}
              >
                <TextArea required={false} disabled={isDisabled} />
              </FormItem>
            )}
          </FormItem>
        );
      });
    }
    if (element.dynamicValue) {
      dynamicValue[element.actionCode] = element.dynamicValue.map((item, mapIndex) => {
        return (
          <FormItem
            className="dynamic-value-group"
            key={`${element.actionCode}-dynamicValue-${index}-${mapIndex}`}
          >
            {item.path && (
              <FormItem
                label={lang.PATH_LABEL}
                name={[index, 'dynamicValue', mapIndex, 'path']}
                id={`activities[${index}].dynamicValue[${mapIndex}].path`}
              >
                <Input required={true} type="text" disabled={isDisabled} />
              </FormItem>
            )}
            {item.expression && (
              <FormItem
                label={lang.EXPRESSION_LABEL}
                name={[index, 'dynamicValue', mapIndex, 'expression']}
                id={`activities[${index}].dynamicValue[${mapIndex}].expression`}
              >
                <Input required={true} type="text" disabled={isDisabled} />
              </FormItem>
            )}
          </FormItem>
        );
      });
    }
  }
  return {
    conditions,
    triggers,
    dynamicValue,
  };
};
