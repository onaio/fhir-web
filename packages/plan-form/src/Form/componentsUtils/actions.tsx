/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Dictionary } from '@onaio/utils';
import React from 'react';
import { DESCRIPTION_LABEL, EXPRESSION_LABEL, NAME } from '../../lang';
import { PlanActivityFormFields } from '@opensrp/planform-core';
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
  for (let index = 0; index < planActivities.length; index++) {
    const element = planActivities[index];

    if (element.condition) {
      conditions[element.actionCode] = element.condition.map((item, mapIndex) => {
        return (
          <FormItem
            className="condition-group"
            // row={true}
            key={`${element.actionCode}-condition-${index}-${mapIndex}`}
            // name={['activities', index]}
          >
            {item.subjectCodableConceptText && (
              <FormItem name={[index, 'condition', mapIndex, 'subjectCodableConceptText']}>
                <Input
                  required={false}
                  id={`activities[${index}].condition[${mapIndex}].subjectCodableConceptText`}
                  disabled={true}
                  hidden={true}
                />
              </FormItem>
            )}
            {item.expression && (
              <FormItem
                label={EXPRESSION_LABEL}
                name={[index, 'condition', mapIndex, 'expression']}
              >
                <TextArea
                  className="form-control"
                  required={true}
                  id={`activities[${index}].condition[${mapIndex}].expression`}
                  disabled={isDisabled}
                />
              </FormItem>
            )}
            {item.description && (
              <FormItem
                label={DESCRIPTION_LABEL}
                name={[index, 'condition', mapIndex, 'description']}
              >
                <TextArea
                  className="form-control"
                  required={true}
                  id={`activities[${index}].condition[${mapIndex}].description`}
                  disabled={isDisabled}
                />
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
            // name={''}
          >
            {item.name && (
              <FormItem label={NAME} name={[index, 'trigger', mapIndex, 'name']}>
                <Input
                  className="form-control col-sm-10"
                  required={true}
                  type="text"
                  id={`activities[${index}].trigger[${mapIndex}].name`}
                  disabled={isDisabled}
                />
              </FormItem>
            )}
            {item.expression && (
              <FormItem label={EXPRESSION_LABEL} name={[index, 'trigger', mapIndex, 'expression']}>
                <TextArea
                  className="form-control col-sm-10"
                  required={true}
                  id={`activities[${index}].trigger[${mapIndex}].expression`}
                  disabled={isDisabled}
                />
              </FormItem>
            )}
            {item.description && (
              <FormItem
                label={DESCRIPTION_LABEL}
                name={[index, 'trigger', mapIndex, 'description']}
              >
                <TextArea
                  className="form-control col-sm-10"
                  required={false}
                  id={`activities[${index}].trigger[${mapIndex}].description`}
                  disabled={isDisabled}
                />
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
  };
};
