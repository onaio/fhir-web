/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-prototype-builtins */
import { Form, Button, Card } from 'antd';
import { Dictionary } from '@onaio/utils';
import { xor } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { format } from 'util';
import { DATE_FORMAT, DEFAULT_PLAN_DURATION_DAYS, DEFAULT_PLAN_VERSION } from '../../envs';
import {
  ACTION,
  ACTIVITIES_LABEL,
  ADD_ACTIVITY,
  ADD_CODED_ACTIVITY,
  AND,
  CONDITIONS_LABEL,
  DEFINITION_URI,
  DESCRIPTION_LABEL,
  END_DATE,
  FOCUS_AREA_HEADER,
  GOAL_LABEL,
  INTERVENTION_TYPE_LABEL,
  PLAN_END_DATE_LABEL,
  PLAN_START_DATE_LABEL,
  PLAN_TITLE_LABEL,
  PRIORITY_LABEL,
  QUANTITY_LABEL,
  REASON_HEADER,
  SAVE_PLAN,
  START_DATE,
  STATUS_HEADER,
  TRIGGERS_LABEL,
} from '../lang';
import { PLAN_LIST_URL } from '../constants';
// import JurisdictionSelect from '../JurisdictionSelect';
import { getConditionAndTriggers } from './componentsUtils/actions';
import { validationRules } from './helpers';
import {
  actionReasons,
  actionReasonsDisplay,
  FIReasons,
  goalPriorities,
  goalPrioritiesDisplay,
  goalUnitDisplay,
  planActivities,
  planStatusDisplay,
  PlanStatus,
  InterventionType,
  PlanActionCodesType,
  PlanActivityFormFields,
  PlanFormFields,
  PlanJurisdictionFormFields,
  planActivitiesMap,
  showDefinitionUriFor,
  generatePlanDefinition,
  getFormActivities,
  getGoalUnitFromActionCode,
} from '@opensrp/planform-core';
import moment from 'moment';
import { Select, Input, DatePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Collapse, Modal, Divider } from 'antd';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import { CommonProps, defaultCommonProps } from '../helpers/common';
import { SUPPLY_MANAGEMENT_TITLE } from '../lang';
import { AfterSubmit, BeforeSubmit } from './types';
import { postPlan, postPutPlan, putPlan } from '../helpers/dataloaders';

const { Panel } = Collapse;
const { List, Item: FormItem } = Form;
const { TextArea } = Input;

const defaultInterventionType = InterventionType.SM;
const initialJurisdictionValues: PlanJurisdictionFormFields[] = [];

/** initial values for plan Form */
export const defaultInitialValues: PlanFormFields = {
  activities: planActivitiesMap[defaultInterventionType],
  caseNum: '',
  date: moment(),
  end: moment().add(DEFAULT_PLAN_DURATION_DAYS, 'days'),
  fiReason: FIReasons[0],
  fiStatus: undefined,
  identifier: '',
  interventionType: defaultInterventionType,
  name: '',
  opensrpEventId: undefined,
  start: moment(),
  status: PlanStatus.DRAFT,
  taskGenerationStatus: 'internal',
  title: '',
  version: DEFAULT_PLAN_VERSION,
  jurisdictions: initialJurisdictionValues,
};

/** render Prop interface for render function that planForm
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
  allowMoreJurisdictions: boolean /** should we allow one to add more jurisdictions */;
  cascadingSelect: boolean /** should we use cascading selects for jurisdiction selection */;
  disabledActivityFields: string[] /** activity fields that are disabled */;
  disabledFields: string[] /** fields that are disabled */;
  initialValues: PlanFormFields /** initial values for fields on the form */;
  jurisdictionLabel: string /** the label used for the jurisdiction selection */;
  redirectAfterAction: string /** the url to redirect to after form submission */;
  renderLocationNames?: (
    child?: LocationChildRenderProp /** nested render content for each location name */
  ) => JSX.Element;
  beforeSubmit: BeforeSubmit /** called before submission starts, return true to proceed with submission */;
  afterSubmit?: AfterSubmit /** called after the payload is successfully sent to the server */;
}

/**
 * Plan Form component
 *
 * @param {PlanFormProps} props - props
 * @returns {Element} PlanForm component
 */

const PlanForm = (props: PlanFormProps) => {
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [activityModal, setActivityModal] = useState<boolean>(false);
  const [actionConditions, setActionConditions] = useState<Dictionary>({});
  const [actionTriggers, setActionTriggers] = useState<Dictionary>({});
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  const {
    allFormActivities,
    disabledActivityFields,
    disabledFields,
    // formHandler,
    initialValues,
    redirectAfterAction,
    baseURL,
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    const { conditions, triggers } = getConditionAndTriggers(
      initialValues.activities,
      disabledFields.includes('activities')
    );
    setActionConditions(conditions);
    setActionTriggers(triggers);
  }, [disabledFields, initialValues.activities]);

  const isEditMode: boolean = initialValues.identifier !== '';

  /** simple function to toggle activity modal */
  function toggleActivityModal() {
    setActivityModal(!activityModal);
  }

  const disAllowedStatusChoices: string[] = [];
  if (isEditMode) {
    // Don't allow setting status back to draft
    if (initialValues.status !== PlanStatus.DRAFT) {
      disAllowedStatusChoices.push(PlanStatus.DRAFT);
    }
  }

  /** get the source list of activities
   * This is used to filter out activities selected but not in the "source"
   *
   * @param {PlanFormFields} values - current form values
   */
  function getSourceActivities(values: PlanFormFields) {
    // if(Object.prototype.hasOwnProperty.call(planActivitiesMap, values.interventionType))
    // eslint-disable-next-line no-prototype-builtins
    if (planActivitiesMap.hasOwnProperty(values.interventionType)) {
      return planActivitiesMap[values.interventionType];
    }
    return allFormActivities;
  }

  /**
   * Check if all the source activities have been selected
   *
   * @param {PlanFormFields} values - current form values
   */
  function checkIfAllActivitiesSelected(values: PlanFormFields) {
    return (
      xor(
        getSourceActivities(values).map((e) => e.actionCode),
        values.activities.map((e) => e.actionCode)
      ).length === 0
    );
  }

  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere) {
    return <Redirect to={redirectAfterAction} />;
  }

  const { Option } = Select;
  const values = form.getFieldValue([]);

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
      md: {
        span: 6,
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
        span: 16,
      },
      md: {
        span: 16,
      },
      lg: { span: 16 },
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
          const payload = generatePlanDefinition(values, null, isEditMode);
          const continueWithSubmit = props.beforeSubmit(payload);
          if (!continueWithSubmit) {
            setSubmitting(false);
            return;
          }
          const successMessage = isEditMode ? 'Successfully Updated' : 'Successfully Updated';


          postPutPlan(payload, baseURL, isEditMode)
              .then(() => {
                sendSuccessNotification(successMessage);
                props.afterSubmit?(payload);
                setSubmitting(false);
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
            name="interventionType"
            label={INTERVENTION_TYPE_LABEL}
            required
            rules={validationRules.interventionType}
            hidden
          >
            <Select
              id="interventionType"
              disabled={disabledFields.includes('interventionType')}
              onChange={(value: string) => {
                if (planActivitiesMap.hasOwnProperty(value)) {
                  form.setFieldsValue({ activities: planActivitiesMap[value] });
                  const newStuff = getConditionAndTriggers(
                    planActivitiesMap[value],
                    disabledFields.includes('activities')
                  );
                  setActionConditions(newStuff.conditions);
                  setActionTriggers(newStuff.triggers);
                }

                form.setFieldsValue({ jurisdictions: [initialJurisdictionValues] });
              }}
            >
              <Option value={InterventionType.SM}>{SUPPLY_MANAGEMENT_TITLE}</Option>
            </Select>
          </FormItem>

          <FormItem label={PLAN_TITLE_LABEL} name="title" rules={validationRules.title}>
            <Input
              required={true}
              type="text"
              id="title"
              disabled={disabledFields.includes('title')}
            />
          </FormItem>
          <FormItem name="name" hidden rules={validationRules.name}>
            <Input type="hidden" id="name" />
          </FormItem>
          <FormItem name="identifier" hidden rules={validationRules.identifier}>
            <Input type="hidden" id="identifier" readOnly={true} />
          </FormItem>
          <FormItem name="version" hidden rules={validationRules.version}>
            <Input type="hidden" id="version" readOnly={true} />
          </FormItem>
          <FormItem name="taskGenerationStatus" hidden rules={validationRules.taskGenerationStatus}>
            <Input type="hidden" id="taskGenerationStatus" readOnly={true} />
          </FormItem>
          <FormItem name="teamAssignmentStatus" hidden rules={validationRules.teamAssignmentStatus}>
            <Input type="hidden" id="teamAssignmentStatus" readOnly={true} />
          </FormItem>
          <FormItem
            name="status"
            required={true}
            label={STATUS_HEADER}
            rules={validationRules.status}
          >
            <Select id="status" disabled={disabledFields.includes('status')}>
              {Object.entries(PlanStatus)
                .filter((e) => !disAllowedStatusChoices.includes(e[1]))
                .map((e) => (
                  <Option key={e[0]} value={e[1]}>
                    {planStatusDisplay[e[1]]}
                  </Option>
                ))}
            </Select>
          </FormItem>
          <FormItem
            rules={validationRules.start}
            label={PLAN_START_DATE_LABEL}
            name="start"
            required={true}
          >
            <DatePicker
              id="start"
              disabled={disabledFields.includes('start')}
              format={DATE_FORMAT}
            />
          </FormItem>

          <FormItem rules={validationRules.date} name="date" hidden>
            <Input type="hidden" name="date" id="date" />
          </FormItem>

          <FormItem
            rules={validationRules.end}
            label={PLAN_END_DATE_LABEL}
            name="end"
            required={true}
          >
            <DatePicker id="end" disabled={disabledFields.includes('end')} format={DATE_FORMAT} />
          </FormItem>

          <Divider orientation="left">
            <h4>{ACTIVITIES_LABEL}</h4>
          </Divider>
          <List name="activities">
            {(_, { remove }) => {
              return (
                <div>
                  {(() => {
                    const activities: PlanFormFields['activities'] = form.getFieldValue(
                      'activities'
                    );
                    const allValues = form.getFieldValue([]);
                    return (
                      <>
                        {activities.map((arrItem, index) => (
                          <Card
                            type="inner"
                            key={`div${arrItem.actionCode}-${index}`}
                            title={activities[index].actionTitle}
                            extra={
                              activities &&
                              activities.length > 1 &&
                              !isEditMode && (
                                <Button
                                  // type="button"
                                  // className="close position-absolute removeArrItem removeActivity"
                                  aria-label="Close"
                                  icon={<CloseOutlined />}
                                  onClick={() => {
                                    /** when we remove an item, we want to also remove its value from
                                     * the values object otherwise the Formik state gets out of sync
                                     */
                                    remove(index);
                                    const newActivityValues = getConditionAndTriggers(
                                      activities.filter(
                                        (e) => e.actionCode !== activities[index].actionCode
                                      ),
                                      disabledFields.includes('activities')
                                    );
                                    setActionConditions(newActivityValues.conditions);
                                    setActionTriggers(newActivityValues.triggers);
                                  }}
                                ></Button>
                              )
                            }
                          >
                            <div className="card-body">
                              <fieldset key={`fieldset${arrItem.actionCode}-${index}`}>
                                {/* {errors.activities && errors.activities[index] && (
                            <div
                              className={`alert alert-danger activities-${index}-errors`}
                              role="alert"
                            >
                              <h6 className="alert-heading">{PLEASE_FIX_THESE_ERRORS}</h6>
                              <ul className="list-unstyled">
                                {Object.entries(errors.activities[index] || {}).map(
                                  ([key, val]) => (
                                    <li key={key} id={`${key}-${index}-error`}>
                                      <strong>{key}</strong>: {val}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )} */}
                                <FormItem
                                  label={ACTION}
                                  name={[index, 'actionTitle']}
                                  rules={validationRules.activities.actionTitle}
                                >
                                  <Input
                                    type="text"
                                    id={`activities-${index}-actionTitle`}
                                    required={true}
                                    disabled={
                                      disabledFields.includes('activities') ||
                                      disabledActivityFields.includes('actionTitle')
                                    }
                                    // className={
                                    //   errors.activities &&
                                    //   doesFieldHaveErrors('actionTitle', index, errors.activities)
                                    //     ? 'form-control is-invalid'
                                    //     : 'form-control'
                                    // }
                                  />
                                  {/* <ErrorMessage
                              name={`activities[${index}].actionTitle`}
                              component="small"
                              className="form-text text-danger"
                            /> */}
                                </FormItem>
                                <FormItem
                                  hidden
                                  name={[index, 'actionCode']}
                                  rules={validationRules.activities.actionCode}
                                >
                                  <Input
                                    type="hidden"
                                    id={`activities-${index}-actionCode`}
                                    value={activities[index].actionCode}
                                    readOnly={true}
                                  />
                                </FormItem>

                                <FormItem
                                  hidden
                                  name={[index, 'actionIdentifier']}
                                  rules={validationRules.activities.actionIdentifier}
                                >
                                  <Input
                                    type="hidden"
                                    id={`activities-${index}-actionIdentifier`}
                                    value={activities[index].actionIdentifier}
                                    readOnly={true}
                                  />
                                </FormItem>
                                <FormItem
                                  rules={validationRules.activities.actionDescription}
                                  label={DESCRIPTION_LABEL}
                                  name={[index, 'actionDescription']}
                                >
                                  <TextArea
                                    id={`activities-${index}-actionDescription`}
                                    required={true}
                                    disabled={
                                      disabledFields.includes('activities') ||
                                      disabledActivityFields.includes('actionDescription')
                                    }
                                    // className={
                                    //   errors.activities &&
                                    //   doesFieldHaveErrors('actionDescription', index, errors.activities)
                                    //     ? 'form-control is-invalid'
                                    //     : 'form-control'
                                    // }
                                  />
                                  {/* <ErrorMessage
                              name={`activities[${index}].actionDescription`}
                              component="small"
                              className="form-text text-danger"
                            /> */}
                                </FormItem>
                                <FormItem
                                  rules={validationRules.activities.goalDescription}
                                  hidden
                                  name={[index, 'goalDescription']}
                                >
                                  <Input
                                    type="hidden"
                                    id={`activities-${index}-goalDescription`}
                                    value={activities[index].actionDescription}
                                  />
                                </FormItem>
                                <FormItem
                                  rules={validationRules.activities.actionReason}
                                  label={REASON_HEADER}
                                  name={[index, 'actionReason']}
                                  required={true}
                                >
                                  <Select
                                    id={`activities-${index}-actionReason`}
                                    disabled={
                                      disabledFields.includes('activities') ||
                                      disabledActivityFields.includes('actionReason')
                                    }
                                    // className={
                                    //   errors.activities &&
                                    //   doesFieldHaveErrors('actionReason', index, errors.activities)
                                    //     ? 'form-control is-invalid'
                                    //     : 'form-control'
                                    // }
                                  >
                                    {actionReasons.map((e) => (
                                      <Option key={e} value={e}>
                                        {actionReasonsDisplay[e]}
                                      </Option>
                                    ))}
                                  </Select>
                                  {/* <ErrorMessage
                              name={`activities[${index}].actionReason`}
                              component="small"
                              className="form-text text-danger"
                            /> */}
                                </FormItem>
                                {showDefinitionUriFor.includes(
                                  form.getFieldValue('interventionType')
                                ) && (
                                  <>
                                    <FormItem
                                      rules={validationRules.activities.actionDefinitionUri}
                                      label={DEFINITION_URI}
                                      name={[index, 'actionDefinitionUri']}
                                    >
                                      <Input
                                        type="text"
                                        id={`activities-${index}-actionDefinitionUri`}
                                        required={true}
                                        disabled={
                                          disabledFields.includes('activities') ||
                                          disabledActivityFields.includes('actionDefinitionUri')
                                        }
                                        // className={
                                        //   errors.activities &&
                                        //   doesFieldHaveErrors(
                                        //     'actionDefinitionUri',
                                        //     index,
                                        //     errors.activities
                                        //   )
                                        //     ? 'form-control is-invalid'
                                        //     : 'form-control'
                                        // }
                                      />
                                      {/* <ErrorMessage
                                name={`activities[${index}].actionDefinitionUri`}
                                component="small"
                                className="form-text text-danger"
                              /> */}
                                    </FormItem>
                                    <FormItem hidden name={[index, 'goalDefinitionUri']}>
                                      <Input
                                        type="hidden"
                                        id={`activities-${index}-goalDefinitionUri`}
                                        value={activities[index].actionDefinitionUri}
                                      />
                                    </FormItem>
                                  </>
                                )}
                                <fieldset>
                                  <legend>{GOAL_LABEL}</legend>
                                  <FormItem
                                    label={QUANTITY_LABEL}
                                    name={[index, 'goalValue']}
                                    rules={validationRules.activities.goalValue}
                                  >
                                    <Input
                                      addonAfter={
                                        goalUnitDisplay[
                                          getGoalUnitFromActionCode(
                                            activities[index].actionCode as PlanActionCodesType
                                          )
                                        ]
                                      }
                                      type="number"
                                      id={`activities-${index}-goalValue`}
                                      required={true}
                                      disabled={
                                        disabledFields.includes('activities') ||
                                        disabledActivityFields.includes('goalValue') ||
                                        activities[index].actionCode ===
                                          MDA_POINT_ADVERSE_EFFECTS_CODE
                                      }
                                      // className={
                                      //   errors.activities &&
                                      //   doesFieldHaveErrors('goalValue', index, errors.activities)
                                      //     ? 'form-control is-invalid'
                                      //     : 'form-control'
                                      // }
                                    />

                                    {/* <ErrorMessage
                                name={`activities[${index}].goalValue`}
                                component="small"
                                className="form-text text-danger"
                              /> */}
                                  </FormItem>
                                  <FormItem
                                    rules={validationRules.activities.timingPeriodStart}
                                    label={START_DATE}
                                    name={[index, 'timingPeriodStart']}
                                    required={true}
                                  >
                                    <DatePicker
                                      id={`activities-${index}-timingPeriodStart`}
                                      disabled={
                                        disabledFields.includes('activities') ||
                                        disabledActivityFields.includes('timingPeriodStart')
                                      }
                                      format={DATE_FORMAT}
                                      // className={
                                      //   errors.activities &&
                                      //   doesFieldHaveErrors('timingPeriodStart', index, errors.activities)
                                      //     ? 'form-control is-invalid'
                                      //     : 'form-control'
                                      // }

                                      // minDate={values.start}
                                      // maxDate={values.end}
                                    />
                                    {/* <ErrorMessage
                                name={`activities[${index}].timingPeriodStart`}
                                component="small"
                                className="form-text text-danger"
                              /> */}
                                  </FormItem>
                                  <FormItem
                                    rules={validationRules.activities.timingPeriodEnd}
                                    label={END_DATE}
                                    name={[index, 'timingPeriodEnd']}
                                    required={true}
                                  >
                                    <DatePicker
                                      id={`activities-${index}-timingPeriodEnd`}
                                      disabled={
                                        disabledFields.includes('activities') ||
                                        disabledActivityFields.includes('timingPeriodEnd')
                                      }
                                      format={DATE_FORMAT}
                                      // className={
                                      //   errors.activities &&
                                      //   doesFieldHaveErrors('timingPeriodEnd', index, errors.activities)
                                      //     ? 'form-control is-invalid'
                                      //     : 'form-control'
                                      // }

                                      // minDate={values.activities[index].timingPeriodStart}
                                      // maxDate={values.end}
                                    />
                                    {/* <ErrorMessage
                                name={`activities[${index}].timingPeriodEnd`}
                                component="small"
                                className="form-text text-danger"
                              /> */}
                                  </FormItem>
                                  <FormItem
                                    hidden
                                    name={[index, 'goalDue']}
                                    rules={validationRules.activities.goalDue}
                                  >
                                    <Input
                                      type="hidden"
                                      id={`activities-${index}-goalDue`}
                                      value={
                                        (activities[index].timingPeriodEnd as unknown) as string
                                      }
                                    />
                                  </FormItem>
                                  <FormItem
                                    rules={validationRules.activities.goalPriority}
                                    label={PRIORITY_LABEL}
                                    name={[index, 'goalPriority']}
                                    required={true}
                                  >
                                    <Select
                                      id={`activities-${index}-goalPriority`}
                                      disabled={
                                        disabledFields.includes('activities') ||
                                        disabledActivityFields.includes('goalPriority')
                                      }
                                      // className={
                                      //   errors.activities &&
                                      //   doesFieldHaveErrors('goalPriority', index, errors.activities)
                                      //     ? 'form-control is-invalid'
                                      //     : 'form-control'
                                      // }
                                    >
                                      {goalPriorities.map((e) => (
                                        <Option key={e} value={e}>
                                          {goalPrioritiesDisplay[e]}
                                        </Option>
                                      ))}
                                    </Select>
                                    {/* <ErrorMessage
                                name={`activities[${index}].goalPriority`}
                                component="small"
                                className="form-text text-danger"
                              /> */}
                                  </FormItem>
                                </fieldset>
                                {(actionTriggers.hasOwnProperty(activities[index].actionCode) ||
                                  actionConditions.hasOwnProperty(
                                    activities[index].actionCode
                                  )) && (
                                  <Collapse>
                                    <Panel
                                      showArrow={false}
                                      header={`${TRIGGERS_LABEL} ${AND} ${CONDITIONS_LABEL}`}
                                      key="1"
                                    >
                                      {actionTriggers.hasOwnProperty(
                                        activities[index].actionCode
                                      ) && (
                                        <fieldset className="triggers-fieldset">
                                          <legend>{TRIGGERS_LABEL}</legend>
                                          {actionTriggers[activities[index].actionCode]}
                                        </fieldset>
                                      )}
                                      {actionConditions.hasOwnProperty(
                                        activities[index].actionCode
                                      ) && (
                                        <fieldset className="conditions-fieldset">
                                          <legend>{CONDITIONS_LABEL}</legend>
                                          {actionConditions[activities[index].actionCode]}
                                        </fieldset>
                                      )}
                                    </Panel>
                                  </Collapse>
                                )}
                              </fieldset>
                            </div>
                          </Card>
                        ))}

                        {activities &&
                          activities.length >= 1 &&
                          !checkIfAllActivitiesSelected(allValues) &&
                          !isEditMode && (
                            <div>
                              <Button type="primary" danger onClick={toggleActivityModal}>
                                {ADD_ACTIVITY}
                              </Button>

                              <Modal
                                // size="lg"
                                visible={activityModal}
                                className="activity-modal"
                                title={ADD_ACTIVITY}
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
                                            className="btn btn-primary btn-sm mb-1 addActivity"
                                            onClick={() => {
                                              values.activities.push(thisActivity);
                                              const newActivityValues = getConditionAndTriggers(
                                                values.activities,
                                                disabledFields.includes('activities')
                                              );
                                              setActionConditions(newActivityValues.conditions);
                                              setActionTriggers(newActivityValues.triggers);
                                            }}
                                          >
                                            {format(ADD_CODED_ACTIVITY, thisActivity.actionCode)}
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

          <FormItem>
            <Button
              type="primary"
              id="planform-submit-button"
              aria-label={SAVE_PLAN}
              // disabled={isSubmitting || Object.keys(errors).length > 0 || !isValid}
            >
              {isSubmitting ? 'Saving Plan' : SAVE_PLAN}
            </Button>
          </FormItem>
        </>
      </Form>
    </div>
  );
};

export const defaultProps: PlanFormProps = {
  ...defaultCommonProps,
  allFormActivities: getFormActivities(planActivities),
  allowMoreJurisdictions: true,
  beforeSubmit: () => true,
  cascadingSelect: true,
  disabledActivityFields: [],
  disabledFields: [],
  initialValues: defaultInitialValues,
  jurisdictionLabel: FOCUS_AREA_HEADER,
  redirectAfterAction: PLAN_LIST_URL,
};

/**
 * props for updating plan definition objects
 * We are defining these here to keep things DRY
 *
 * @param planStatus
 */
export const propsForUpdatingPlans = (
  planStatus: string = PlanStatus.DRAFT
): Partial<PlanFormProps> => {
  let disabledFields = [
    'interventionType',
    'fiReason',
    'fiStatus',
    'identifier',
    'name',
    'caseNum',
    'opensrpEventId',
    'jurisdictions',
  ];
  const fieldsForActivePlan = [
    'activities',
    'date',
    'end',
    'fiReason',
    'fiStatus',
    'start',
    'taskGenerationStatus',
    'teamAssignmentStatus',
    'title',
    'version',
  ];
  const fieldsForCompletePlans = ['status'];
  disabledFields =
    planStatus === PlanStatus.ACTIVE ? [...disabledFields, ...fieldsForActivePlan] : disabledFields;
  disabledFields =
    planStatus === PlanStatus.COMPLETE || planStatus === PlanStatus.RETIRED
      ? [...disabledFields, ...fieldsForCompletePlans, ...fieldsForActivePlan]
      : disabledFields;
  return {
    disabledActivityFields: ['actionReason', 'goalPriority'],
    disabledFields,
  };
};

PlanForm.defaultProps = defaultProps;

export { PlanForm };
