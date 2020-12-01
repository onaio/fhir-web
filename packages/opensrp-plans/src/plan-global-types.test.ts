import { expectType } from 'tsd';
import {
  ActionReasonType,
  GoalPriorityType,
  GoalUnit,
  PlanAction,
  PlanActionCodesType,
  PlanActionCondition,
  PlanActionsubjectCodableConcept,
  PlanActionTimingPeriod,
  PlanActionTrigger,
  PlanDefinition,
  PlanExpression,
  PlanGoal,
  PlanGoalDetail,
  PlanGoaldetailQuantity,
  PlanGoalTarget,
  UseContext,
  UseContextCodesType,
} from './plan-global-types';

describe('types', () => {
  const planActionTimingPeriod = {
    end: '19-5-2017',
    start: '21-5-2019',
  };
  it('ActionReasonType', () => {
    expectType<ActionReasonType>('Investigation');
  });
  it('GoalPriorityType', () => {
    expectType<GoalPriorityType>('high-priority');
  });
  it('UseContextCodesType', () => {
    expectType<UseContextCodesType>('interventionType');
  });
  it('PlanActionCodesType', () => {
    expectType<PlanActionCodesType>('BCC');
  });
  it('PlanActionTimingPeriod', () => {
    expectType<PlanActionTimingPeriod>(planActionTimingPeriod);
  });
  it('PlanActionsubjectCodableConcept', () => {
    expectType<PlanActionsubjectCodableConcept>({
      text: 'Family',
    });
  });
  it('PlanExpression', () => {
    expectType<PlanExpression>({
      description: '',
      expression: '',
      name: '',
      reference: '',
    });
  });
  it('PlanActionCondition', () => {
    expectType<PlanActionCondition>({
      expression: { expression: '' },
      kind: 'applicability',
    });
  });
  it('PlanActionTrigger', () => {
    expectType<PlanActionTrigger>({
      name: '',
      type: 'named-event',
    });
  });
  it('PlanAction', () => {
    expectType<PlanAction>({
      code: 'BCC',
      condition: [{ expression: { expression: '' }, kind: 'applicability' }],
      description: '',
      goalId: '',
      identifier: '',
      prefix: 123,
      reason: 'Investigation',
      subjectCodableConcept: {
        text: 'Family',
      },
      timingPeriod: { end: '', start: '' },
      title: '',
    });
  });
  it('GoalUnit', () => {
    expectType<GoalUnit>(GoalUnit.ACTIVITY);
  });
  it('PlanGoaldetailQuantity', () => {
    expectType<PlanGoaldetailQuantity>({
      comparator: '>=',
      unit: GoalUnit.ACTIVITY,
      value: 20,
    });
  });
  it('PlanGoalDetail', () => {
    expectType<PlanGoalDetail>({
      detailQuantity: {
        comparator: '>=',
        unit: GoalUnit.ACTIVITY,
        value: 20,
      },
    });
  });
  it('PlanGoalTarget', () => {
    expectType<PlanGoalTarget>({
      due: '',
      detail: {
        detailQuantity: {
          comparator: '>=',
          unit: GoalUnit.ACTIVITY,
          value: 20,
        },
      },
      measure: '',
    });
  });
  it('Plan Goal works', () => {
    expectType<PlanGoal>({
      description: 'zzzz',
      id: '123',
      priority: 'high-priority',
      target: [
        {
          due: '14-10-2019',
          detail: { detailQuantity: { comparator: '>=', unit: GoalUnit.ACTIVITY, value: 134 } },
          measure: 'mm',
        },
      ],
    });
  });
  it('UseContext', () => {
    expectType<UseContext>({
      code: 'interventionType',
      valueCodableConcept: '',
    });
  });
  it('PlanDefinition', () => {
    expectType<PlanDefinition>({
      action: [
        {
          code: 'BCC',
          condition: [{ expression: { expression: '' }, kind: 'applicability' }],
          description: '',
          goalId: '',
          identifier: '',
          prefix: 123,
          reason: 'Investigation',
          subjectCodableConcept: {
            text: 'Family',
          },
          timingPeriod: { end: '', start: '' },
          title: '',
        },
      ],
      date: '',
      effectivePeriod: planActionTimingPeriod,
      goal: [
        {
          description: 'zzzz',
          id: '123',
          priority: 'high-priority',
          target: [
            {
              due: '14-10-2019',
              detail: { detailQuantity: { comparator: '>=', unit: GoalUnit.ACTIVITY, value: 134 } },
              measure: 'mm',
            },
          ],
        },
      ],
      identifier: '',
      jurisdiction: [{ code: '' }],
      name: '',
      serverVersion: 0.1,
      status: 'done',
      title: 'hello',
      useContext: [
        {
          code: 'interventionType',
          valueCodableConcept: '',
        },
      ],
      version: '0.1',
    });
  });
});
