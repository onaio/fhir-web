/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-prototype-builtins */
import { Form, Button, Card, Space } from 'antd';
import { Dictionary } from '@onaio/utils';
import { xor } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RangePickerSharedProps } from 'rc-picker/lib/RangePicker';
import { useTranslation } from '../mls';
import { PLAN_LIST_URL, PLAN_DESCRIPTION_WORD_LIMIT } from '../constants';
import { getConditionAndTriggers } from './componentsUtils/actions';
import {
  processActivitiesDates,
  processToBasePlanForm,
  validationRulesFactory,
} from '../helpers/utils';
import {
  version,
  actionReasons,
  actionReasonsDisplay,
  FIReasons,
  goalPriorities,
  goalPrioritiesDisplay,
  goalUnitDisplay,
  planActivities,
  PlanStatus,
  InterventionType,
  PlanActionCodesType,
  PlanActivityFormFields,
  PlanFormFields as BasePlanFormFields,
  PlanJurisdictionFormFields,
  generatePlanDefinition,
  getFormActivities,
  getGoalUnitFromActionCode,
  defaultEnvConfig,
  getPlanActivitiesMap,
  MDA_POINT_ADVERSE_EFFECTS_CODE,
  interventionType,
  activities,
  identifier,
  date,
  taskGenerationStatus,
  name,
  actionTitle,
  actionIdentifier,
  actionDescription,
  goalValue,
  timingPeriodStart,
  timingPeriodEnd,
  goalDue,
  goalPriority,
  actionCode,
  actionReason,
  description,
  goalDescription,
  status,
  title,
  jurisdictions,
} from '@opensrp/plan-form-core';
import moment, { Moment } from 'moment';
import { Select, Input, DatePicker } from 'antd';
import { CloseOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse, Modal } from 'antd';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import { CommonProps, defaultCommonProps } from '../helpers/common';
import {
  AfterSubmit,
  BeforeSubmit,
  PlanFormConfig,
  PlanFormFields,
  PlanFormFieldsKeys,
} from '../helpers/types';
import { postPutPlan } from '../helpers/dataloaders';
import { PlanStatusRenderer } from './componentsUtils/status';

const { Panel } = Collapse;
const { List, Item: FormItem } = Form;
const { TextArea } = Input;

const defaultInterventionType = InterventionType.SM;
const initialJurisdictionValues: PlanJurisdictionFormFields[] = [];
const defaultEnvs = defaultEnvConfig;
const defaultPlanActivitiesMap = getPlanActivitiesMap(defaultEnvs);
const defaultFiReasonRoutine = FIReasons[0];

/**
 * caveats due to current way to configure limitation
 * https://github.com/OpenSRP/web/issues/202
 * the initialValues if not explicitly passed through the props,
 * they will not be subject to the envConfigs variables,
 */

/** initial values for plan Form */
export const defaultInitialValues: PlanFormFields = {
  activities: processActivitiesDates(defaultPlanActivitiesMap[defaultInterventionType]),
  caseNum: '',
  // this is an example of a situation where we do not have a proper way to pass configuration to the package.
  dateRange: [moment(), moment().add(defaultEnvs.defaultPlanDurationDays, 'days')],
  date: moment(),
  fiReason: defaultFiReasonRoutine,
  fiStatus: undefined,
  identifier: '',
  interventionType: defaultInterventionType,
  name: '',
  opensrpEventId: undefined,
  status: PlanStatus.DRAFT,
  taskGenerationStatus: 'internal',
  title: '',
  version: defaultEnvs.defaultPlanVersion,
  jurisdictions: initialJurisdictionValues,
};

/**
 * render Prop interface for render function that planForm
 * passes to Whatever component that is rendering the jurisdictionNames.
 */
export type LocationChildRenderProp = (
  locationName: string,
  locationId: string,
  index: number
) => JSX.Element;

/** interface for plan form props */
export interface PlanFormProps extends CommonProps {
  allFormActivities: PlanActivityFormFields[] /** the list of all allowed activities */;
  disabledActivityFields: string[] /** activity fields that are disabled */;
  disabledFields: string[] /** fields that are disabled */;
  initialValues: PlanFormFields /** initial values for fields on the form */;
  beforeSubmit?: BeforeSubmit /** called before submission starts, return true to proceed with submission */;
  afterSubmit?: AfterSubmit /** called after the payload is successfully sent to the server */;
  envConfigs?: PlanFormConfig /** env configuration options */;
  hiddenFields: PlanFormFieldsKeys[] /** what fields to hide */;
  onCancel: () => void /** called when user clicks cancel on form */;
  getRedirectPath: (
    status: PlanStatus
  ) => string /** callback to get the path to redirect after successfully form submission */;
}

/**
 * Plan Form Date range picker
 * Function checks end date to be greater than start date and today date
 *
 * @param {Moment} current - current selected/hovered date (date picker)
 * @param {Moment[]} dates - start and end date
 * @returns {boolean} - returns true if disabled and viseversa
 */
export const disableDate = (current: Moment, dates: Moment[]) => {
  if (!dates || dates.length === 0) {
    return false;
  }
  return (
    current.valueOf() <= Date.now() ||
    current.format('L') <= (dates[0] && dates[0].format('L')) ||
    (dates[1] && dates[1].valueOf() <= Date.now())
  );
};

/**
 * Plan Form component
 *
 * @param {object} props - props
 * @returns {Element} PlanForm component
 */

const PlanForm = (props: PlanFormProps) => {
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [activityModal, setActivityModal] = useState<boolean>(false);
  const [actionConditions, setActionConditions] = useState<Dictionary>({});
  const [actionTriggers, setActionTriggers] = useState<Dictionary>({});
  const [actionDynamicValue, setActionDynamicValue] = useState<Dictionary>({});
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [dates, setDates] = useState<Moment[]>([]);
  const { t } = useTranslation();
  const {
    allFormActivities,
    disabledActivityFields,
    disabledFields,
    initialValues,
    baseURL,
    envConfigs,
    hiddenFields,
    getRedirectPath,
    onCancel,
  } = props;
  const [newPlanStatus, setNewPlanStatus] = useState<PlanStatus>(initialValues.status);
  const validationRules = validationRulesFactory(t);

  const configs = {
    ...defaultEnvConfig,
    ...envConfigs,
  };

  const planActivitiesMap = getPlanActivitiesMap(configs);

  const [form] = Form.useForm();

  useEffect(() => {
    const { conditions, triggers, dynamicValue } = getConditionAndTriggers(
      initialValues.activities,
      t,
      disabledFields.includes('activities')
    );
    setActionConditions(conditions);
    setActionTriggers(triggers);
    setActionDynamicValue(dynamicValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabledFields, initialValues.activities, envConfigs]);

  const isEditMode: boolean = initialValues.identifier !== '';

  /** simple function to toggle activity modal */
  function toggleActivityModal() {
    setActivityModal(!activityModal);
  }

  const isHidden = (fieldKey: PlanFormFieldsKeys) => {
    return hiddenFields.includes(fieldKey);
  };

  const disAllowedStatusChoices: string[] = [];
  if (isEditMode) {
    // Don't allow setting status back to draft
    if (initialValues.status !== PlanStatus.DRAFT) {
      disAllowedStatusChoices.push(PlanStatus.DRAFT);
    }
  }

  /**
   * get the source list of activities
   * This is used to filter out activities selected but not in the "source"
   *
   * @param {BasePlanFormFields} values - current form values
   * @returns {object} -
   */
  function getSourceActivities(values: BasePlanFormFields) {
    // eslint-disable-next-line no-prototype-builtins
    if (planActivitiesMap.hasOwnProperty(values.interventionType)) {
      return planActivitiesMap[values.interventionType];
    }
    return allFormActivities;
  }

  /**
   * Check if all the source activities have been selected
   *
   * @param {BasePlanFormFields} values - current form values
   * @returns {object} -
   */
  function checkIfAllActivitiesSelected(values: BasePlanFormFields) {
    return (
      xor(
        getSourceActivities(values).map((e) => e.actionCode),
        values.activities.map((e) => e.actionCode)
      ).length === 0
    );
  }

  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere) {
    const redirectAfter = getRedirectPath(newPlanStatus);
    return <Redirect to={redirectAfter} />;
  }

  const { Option } = Select;
  const values = form.getFieldValue([]);

  /** responsive layout for the form labels and columns */
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 24,
      },
      md: {
        span: 24,
      },
      lg: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 24,
      },
      md: {
        span: 20,
      },
      lg: {
        span: 16,
      },
    },
  };

  const tailLayout = {
    wrapperCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 12, span: 24 },
      md: { offset: 8, span: 16 },
      lg: { offset: 6, span: 14 },
    },
  };
  return (
    <div className="planform form-container">
      <Form
        {...formItemLayout}
        form={form}
        name="planForm"
        scrollToFirstError
        initialValues={initialValues}
        /* tslint:disable-next-line jsx-no-lambda */
        onFinish={(values) => {
          const baseFormValues = processToBasePlanForm(values);
          const payload = generatePlanDefinition(baseFormValues, null, isEditMode, configs);
          const shouldContinue = props.beforeSubmit && props.beforeSubmit(payload);
          if (!shouldContinue) {
            setSubmitting(false);
            return;
          }
          const successMessage = isEditMode ? t('Successfully Updated') : t('Successfully Created');

          postPutPlan(payload, baseURL, isEditMode)
            .then(() => {
              sendSuccessNotification(successMessage);
              props.afterSubmit && props.afterSubmit(payload);
              setSubmitting(false);
              setNewPlanStatus(payload.status as PlanStatus);
              setAreWeDoneHere(true);
            })
            .catch((err: Error) => {
              setSubmitting(false);
              sendErrorNotification(err.name, err.message);
            });
        }}
      >
        <>
          <FormItem
            name={interventionType}
            label={t('Intervention Type')}
            required
            rules={validationRules.interventionType}
            hidden={isHidden(interventionType)}
            id={interventionType}
          >
            <Select
              disabled={disabledFields.includes(interventionType)}
              onChange={(value: string) => {
                if (planActivitiesMap.hasOwnProperty(value)) {
                  const currentActivities = processActivitiesDates(planActivitiesMap[value]);
                  form.setFieldsValue({ [activities]: currentActivities });
                  const newStuff = getConditionAndTriggers(
                    planActivitiesMap[value],
                    t,
                    disabledFields.includes(activities)
                  );
                  setActionConditions(newStuff.conditions);
                  setActionTriggers(newStuff.triggers);
                  setActionDynamicValue(newStuff.dynamicValue);
                }
                form.setFieldsValue({ jurisdictions: initialJurisdictionValues });
              }}
            >
              <Option value={InterventionType.SM}>{t('Supply Management')}</Option>
            </Select>
          </FormItem>

          <FormItem
            hidden={isHidden(title)}
            label={t('Plan Title')}
            name={title}
            rules={validationRules.title}
            id={title}
          >
            <Input
              onChange={(value) => {
                form.setFieldsValue({
                  [name]: value.target.value,
                });
              }}
              required={true}
              placeholder={t("Enter the plan's name")}
              type="text"
              disabled={disabledFields.includes(title)}
            />
          </FormItem>
          <FormItem name={name} id="name" hidden rules={validationRules.name}>
            <Input type="hidden" disabled={disabledFields.includes(name)} />
          </FormItem>
          <FormItem name={identifier} id="identifier" hidden rules={validationRules.identifier}>
            <Input type="hidden" disabled={disabledFields.includes(identifier)} readOnly={true} />
          </FormItem>
          <FormItem name={version} id="version" hidden rules={validationRules.version}>
            <Input type="hidden" readOnly={true} />
          </FormItem>
          <FormItem
            name={taskGenerationStatus}
            id="taskGenerationStatus"
            hidden
            rules={validationRules.taskGenerationStatus}
          >
            <Input
              type="hidden"
              disabled={disabledFields.includes(taskGenerationStatus)}
              readOnly={true}
            />
          </FormItem>
          <FormItem
            name={status}
            required={true}
            label={t('Status')}
            rules={validationRules.status}
            hidden={isHidden(status)}
            id="status"
            getValueFromEvent={() => {
              return form.getFieldsValue()[status];
            }}
          >
            <PlanStatusRenderer
              setFieldsValue={form.setFieldsValue}
              disabledFields={disabledFields}
              disAllowedStatusChoices={disAllowedStatusChoices}
              assignedJurisdictions={form.getFieldsValue()[jurisdictions]}
            />
          </FormItem>
          <FormItem
            rules={validationRules.dateRange}
            label={t('Active date range')}
            name="dateRange"
            required={true}
            hidden={isHidden('dateRange')}
            id="dateRange"
          >
            <DatePicker.RangePicker
              onCalendarChange={
                ((val: Moment[]) => {
                  setDates(val);
                }) as RangePickerSharedProps<Moment>['onCalendarChange']
              }
              onOpenChange={(open: boolean) => {
                if (open) {
                  if (form.getFieldValue('dateRange')) {
                    setDates(
                      form.getFieldValue('dateRange')[0] && form.getFieldValue('dateRange')[1]
                        ? form.getFieldValue('dateRange')
                        : []
                    );
                  } else {
                    setDates([]);
                  }
                }
              }}
              disabledDate={(current: Moment) => disableDate(current, dates)}
              disabled={disabledFields.includes('dateRange')}
              format={configs.dateFormat}
            />
          </FormItem>

          <FormItem hidden rules={validationRules.date} name={date} id="date">
            <DatePicker format={configs.dateFormat} />
          </FormItem>

          <FormItem
            rules={validationRules.description}
            label={t('Description')}
            name={description}
            required={true}
            hidden={isHidden(description)}
            id="description"
          >
            <TextArea
              rows={4}
              showCount
              maxLength={PLAN_DESCRIPTION_WORD_LIMIT}
              placeholder={t("Enter the plan's description")}
              disabled={disabledFields.includes(description)}
            />
          </FormItem>
          <Form.List name="jurisdictions">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Form.Item
                    className="jurisdiction-fields"
                    hidden
                    required={false}
                    key={field.key}
                  >
                    <Form.Item name={[field.name, 'id']} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item name={[field.name, 'name']} hidden>
                      <Input />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="jurisdiction-fields__delete dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item hidden>
                  <Button
                    className="jurisdiction-fields__add"
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    {t('Add Jurisdiction')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <FormItem
            label={<h4>{t('Activities')}</h4>}
            hidden={isHidden(activities)}
            id="activities"
          >
            <List name={activities}>
              {(_, { remove }) => {
                return (
                  <div>
                    {(() => {
                      const planActivities: BasePlanFormFields[activities] =
                        form.getFieldValue(activities);
                      const allValues = form.getFieldValue([]);

                      const conditionsDisabledDates = (current: Moment) => {
                        // Can not select days before the set plan date range
                        return current && allValues.start < current && current < allValues.end;
                      };
                      return (
                        <>
                          {planActivities.map((arrItem, index) => (
                            <Card
                              type="inner"
                              key={`div${arrItem.actionCode}-${index}`}
                              title={planActivities[index].actionTitle}
                              extra={
                                planActivities &&
                                planActivities.length > 1 &&
                                !isEditMode && (
                                  <Button
                                    className="removeActivity"
                                    aria-label="Close"
                                    icon={<CloseOutlined />}
                                    onClick={() => {
                                      /**
                                       * when we remove an item, we want to also remove its value from
                                       * the values object otherwise the Formik state gets out of sync
                                       */
                                      remove(index);
                                      const newActivityValues = getConditionAndTriggers(
                                        planActivities.filter(
                                          (e) => e.actionCode !== planActivities[index].actionCode
                                        ),
                                        t,
                                        disabledFields.includes(activities)
                                      );
                                      setActionConditions(newActivityValues.conditions);
                                      setActionTriggers(newActivityValues.triggers);
                                      setActionDynamicValue(newActivityValues.dynamicValue);
                                    }}
                                  ></Button>
                                )
                              }
                            >
                              <div className="card-body">
                                <fieldset key={`fieldset${arrItem.actionCode}-${index}`}>
                                  <FormItem
                                    label={t('Action')}
                                    name={[index, actionTitle]}
                                    rules={validationRules.activities.actionTitle}
                                    id={`activities-${index}-actionTitle`}
                                  >
                                    <Input
                                      type="text"
                                      required={true}
                                      disabled={
                                        disabledFields.includes(activities) ||
                                        disabledActivityFields.includes(actionTitle)
                                      }
                                    />
                                  </FormItem>
                                  <FormItem
                                    hidden
                                    name={[index, actionCode]}
                                    rules={validationRules.activities.actionCode}
                                    id={`activities-${index}-actionCode`}
                                  >
                                    <Input
                                      type="hidden"
                                      value={planActivities[index].actionCode}
                                      readOnly={true}
                                    />
                                  </FormItem>

                                  <FormItem
                                    hidden
                                    name={[index, actionIdentifier]}
                                    rules={validationRules.activities.actionIdentifier}
                                    id={`activities-${index}-actionIdentifier`}
                                  >
                                    <Input
                                      type="hidden"
                                      value={planActivities[index].actionIdentifier}
                                      readOnly={true}
                                    />
                                  </FormItem>
                                  <FormItem
                                    rules={validationRules.activities.actionDescription}
                                    label={t('Description')}
                                    id={`activities-${index}-actionDescription`}
                                    name={[index, actionDescription]}
                                  >
                                    <TextArea
                                      required={true}
                                      disabled={
                                        disabledFields.includes('activities') ||
                                        disabledActivityFields.includes(actionDescription)
                                      }
                                    />
                                  </FormItem>
                                  <FormItem
                                    rules={validationRules.activities.goalDescription}
                                    hidden
                                    name={[index, goalDescription]}
                                    id={`activities-${index}-goalDescription`}
                                  >
                                    <Input
                                      type="hidden"
                                      value={planActivities[index].actionDescription}
                                    />
                                  </FormItem>
                                  <FormItem
                                    rules={validationRules.activities.actionReason}
                                    label={t('Reason')}
                                    name={[index, actionReason]}
                                    required={true}
                                    id={`activities-${index}-actionReason`}
                                  >
                                    <Select
                                      disabled={
                                        disabledFields.includes('activities') ||
                                        disabledActivityFields.includes(actionReason)
                                      }
                                    >
                                      {actionReasons.map((e) => (
                                        <Option key={e} value={e}>
                                          {actionReasonsDisplay[e]}
                                        </Option>
                                      ))}
                                    </Select>
                                  </FormItem>
                                  <fieldset>
                                    <legend>{t('Goal')}</legend>
                                    <FormItem
                                      label={t('Quantity')}
                                      name={[index, goalValue]}
                                      rules={validationRules.activities.goalValue}
                                      id={`activities-${index}-goalValue`}
                                    >
                                      <Input
                                        addonAfter={
                                          goalUnitDisplay[
                                            getGoalUnitFromActionCode(
                                              planActivities[index]
                                                .actionCode as PlanActionCodesType
                                            )
                                          ]
                                        }
                                        type="number"
                                        required={true}
                                        disabled={
                                          disabledFields.includes(activities) ||
                                          disabledActivityFields.includes(goalValue) ||
                                          planActivities[index].actionCode ===
                                            MDA_POINT_ADVERSE_EFFECTS_CODE
                                        }
                                      />
                                    </FormItem>
                                    <FormItem
                                      rules={validationRules.activities.timingPeriodStart}
                                      label={t('Start Date')}
                                      name={[index, timingPeriodStart]}
                                      required={true}
                                      id={`activities-${index}-timingPeriodStart`}
                                    >
                                      <DatePicker
                                        disabled={
                                          disabledFields.includes(activities) ||
                                          disabledActivityFields.includes(timingPeriodStart)
                                        }
                                        format={configs.dateFormat}
                                        disabledDate={conditionsDisabledDates}
                                      />
                                    </FormItem>
                                    <FormItem
                                      rules={validationRules.activities.timingPeriodEnd}
                                      label={t('End Date')}
                                      name={[index, timingPeriodEnd]}
                                      required={true}
                                      id={`activities-${index}-timingPeriodEnd`}
                                    >
                                      <DatePicker
                                        disabled={
                                          disabledFields.includes('activities') ||
                                          disabledActivityFields.includes(timingPeriodEnd)
                                        }
                                        format={configs.dateFormat}
                                        disabledDate={conditionsDisabledDates}
                                      />
                                    </FormItem>
                                    <FormItem
                                      hidden
                                      name={[index, goalDue]}
                                      rules={validationRules.activities.goalDue}
                                      id={`activities-${index}-goalDue`}
                                    >
                                      <Input
                                        type="hidden"
                                        value={
                                          planActivities[index].timingPeriodEnd as unknown as string
                                        }
                                      />
                                    </FormItem>
                                    <FormItem
                                      rules={validationRules.activities.goalPriority}
                                      label={t('Priority')}
                                      name={[index, goalPriority]}
                                      required={true}
                                      id={`activities-${index}-goalPriority`}
                                    >
                                      <Select
                                        disabled={
                                          disabledFields.includes(activities) ||
                                          disabledActivityFields.includes(goalPriority)
                                        }
                                      >
                                        {goalPriorities.map((e) => (
                                          <Option key={e} value={e}>
                                            {goalPrioritiesDisplay[e]}
                                          </Option>
                                        ))}
                                      </Select>
                                    </FormItem>
                                  </fieldset>
                                  {(actionTriggers.hasOwnProperty(
                                    planActivities[index].actionCode
                                  ) ||
                                    actionConditions.hasOwnProperty(
                                      planActivities[index].actionCode
                                    ) ||
                                    actionDynamicValue.hasOwnProperty(
                                      planActivities[index].actionCode
                                    )) && (
                                    <Collapse>
                                      <Panel
                                        className="triggers-conditions"
                                        showArrow={false}
                                        header={t('Triggers and Conditions')}
                                        key="1"
                                      >
                                        {actionTriggers.hasOwnProperty(
                                          planActivities[index].actionCode
                                        ) && (
                                          <fieldset className="triggers-fieldset">
                                            <legend>{t('Triggers')}</legend>
                                            {actionTriggers[planActivities[index].actionCode]}
                                          </fieldset>
                                        )}
                                        {actionDynamicValue.hasOwnProperty(
                                          planActivities[index].actionCode
                                        ) && (
                                          <fieldset className="dynamic-value-fieldset">
                                            <legend>{t('Dynamic Value')}</legend>
                                            {actionDynamicValue[planActivities[index].actionCode]}
                                          </fieldset>
                                        )}
                                        {actionConditions.hasOwnProperty(
                                          planActivities[index].actionCode
                                        ) && (
                                          <fieldset className="conditions-fieldset">
                                            <legend>{t('Conditions')}</legend>
                                            {actionConditions[planActivities[index].actionCode]}
                                          </fieldset>
                                        )}
                                      </Panel>
                                    </Collapse>
                                  )}
                                </fieldset>
                              </div>
                            </Card>
                          ))}

                          {planActivities &&
                            planActivities.length >= 1 &&
                            !checkIfAllActivitiesSelected(allValues) &&
                            !isEditMode && (
                              <div>
                                <Button
                                  className="add-more-activities"
                                  type="primary"
                                  danger
                                  onClick={toggleActivityModal}
                                >
                                  {t('Add Activity')}
                                </Button>

                                <Modal
                                  visible={activityModal}
                                  className="activity-modal"
                                  title={t('Add Activity')}
                                  onCancel={toggleActivityModal}
                                >
                                  <>
                                    {/** we want to allow the user to only add activities that are not already selected */}
                                    <ul className="list-unstyled">
                                      {getSourceActivities(values)
                                        .filter(
                                          (e) =>
                                            !values.activities
                                              .map((f: PlanActivityFormFields) => f.actionCode)
                                              .includes(e.actionCode)
                                        )
                                        .map((thisActivity) => (
                                          <li key={thisActivity.actionCode}>
                                            <Button
                                              type="primary"
                                              className="addActivity"
                                              onClick={() => {
                                                const withParsedDates = processActivitiesDates([
                                                  thisActivity,
                                                ]);
                                                values.activities.push(withParsedDates[0]);
                                                const newActivityValues = getConditionAndTriggers(
                                                  values.activities,
                                                  t,
                                                  disabledFields.includes(activities)
                                                );
                                                setActionConditions(newActivityValues.conditions);
                                                setActionTriggers(newActivityValues.triggers);
                                                setActionDynamicValue(
                                                  newActivityValues.dynamicValue
                                                );
                                              }}
                                            >
                                              {t('Add {{actionCode}} Activity', {
                                                actionCode: thisActivity.actionCode,
                                              })}
                                            </Button>
                                          </li>
                                        ))}
                                    </ul>
                                  </>
                                </Modal>
                              </div>
                            )}
                          {/** Turn off modal if all activities selected */}
                          {checkIfAllActivitiesSelected(allValues) && setActivityModal(false)}
                        </>
                      );
                    })()}
                  </div>
                );
              }}
            </List>
          </FormItem>
          <FormItem {...tailLayout} name="submitCancel">
            <Space>
              <Button
                type="primary"
                id="planform-submit-button"
                aria-label={t('Save Plan')}
                disabled={isSubmitting}
                htmlType="submit"
              >
                {t('Save Plan')}
              </Button>

              <Button id="planform-cancel-button" onClick={() => onCancel()}>
                {t('Cancel')}
              </Button>
            </Space>
          </FormItem>
          <FormItem></FormItem>
        </>
      </Form>
    </div>
  );
};

export const defaultProps: PlanFormProps = {
  ...defaultCommonProps,
  allFormActivities: getFormActivities(planActivities, defaultEnvs),
  beforeSubmit: () => true,
  disabledActivityFields: [],
  disabledFields: [],
  initialValues: defaultInitialValues,
  getRedirectPath: () => PLAN_LIST_URL,
  onCancel: () => {
    return;
  },
  hiddenFields: [],
};

/**
 * props for updating plan definition objects
 * We are defining these here to keep things DRY
 *
 * @param {string} planStatus - a plan status
 * @returns {object} -
 */
export const propsForUpdatingPlans = (
  planStatus: string = PlanStatus.DRAFT
): Partial<PlanFormProps> => {
  let disabledFields = [interventionType, identifier, name];
  const fieldsForActivePlan = [activities, date, taskGenerationStatus, title, version];
  const fieldsForCompletePlans = [status];
  disabledFields =
    planStatus === PlanStatus.ACTIVE ? [...disabledFields, ...fieldsForActivePlan] : disabledFields;
  disabledFields =
    planStatus === PlanStatus.COMPLETE || planStatus === PlanStatus.RETIRED
      ? [...disabledFields, ...fieldsForCompletePlans, ...fieldsForActivePlan]
      : disabledFields;
  return {
    disabledFields,
  };
};

PlanForm.defaultProps = defaultProps;

export { PlanForm };
