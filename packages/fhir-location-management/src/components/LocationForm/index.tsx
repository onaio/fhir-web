import React, { useState } from 'react';
import { Form, Input, Space, Button, Radio } from 'antd';
import { Redirect } from 'react-router';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import {
  defaultFormFields,
  generateLocationUnit,
  LocationFormFields,
  postPutLocationUnit,
  defaultValidationRulesFactory,
  ValidationFactory,
} from './utils';
import {
  geometry,
  isJurisdiction,
  latitude,
  locationHierarchyResourceType,
  locationResourceType,
  longitude,
  namespace,
  serviceType,
} from '../../constants';
import { CustomTreeSelect, CustomTreeSelectProps } from './CustomTreeSelect';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { LocationI18nNamespace, TreeNode } from '../../helpers/types';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { LocationUnitStatus } from '../../helpers/types';
import { useQueryClient } from 'react-query';
import { useMls } from '../../mls';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { ValueSetAsyncSelect } from '@opensrp/react-utils';
import { eusmServicePointValueSetURI } from '@opensrp/fhir-helpers';

const { Item: FormItem } = Form;

/** props for the location form */
export interface LocationFormProps
  extends Pick<CustomTreeSelectProps, 'disabledTreeNodesCallback'> {
  initialValues: LocationFormFields;
  tree: TreeNode;
  successURLGenerator: (payload: ILocation) => string;
  fhirBaseURL: string;
  hidden: (keyof LocationFormFields)[];
  disabled: (keyof LocationFormFields)[];
  onCancel: () => void;
  afterSubmit?: (payload: IfhirR4.ILocation) => void;
  validationRulesFactory: ValidationFactory;
  i18nNamespace?: LocationI18nNamespace;
}

const defaultProps = {
  initialValues: defaultFormFields,
  successURLGenerator: () => '#',
  hidden: [],
  disabled: [],
  onCancel: () => undefined,
  validationRulesFactory: defaultValidationRulesFactory,
  i18nNamespace: namespace,
};

/** responsive layout for the form labels and columns */
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
    md: {
      span: 4,
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
      span: 18,
    },
    md: {
      span: 16,
    },
    lg: {
      span: 14,
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

/** form component to add/edit location units */

const LocationForm = (props: LocationFormProps) => {
  const {
    initialValues,
    disabled,
    hidden,
    disabledTreeNodesCallback,
    fhirBaseURL,
    afterSubmit,
    successURLGenerator,
    onCancel,
    tree,
    validationRulesFactory,
  } = props;
  const isEditMode = !!initialValues.id;
  const defaultParentNode =
    tree.first((node) => node.model.nodeId === initialValues.parentId) ?? tree;
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [parentNode, setParentNode] = useState<TreeNode>(defaultParentNode);
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [successUrl, setSuccessUrl] = useState<string>();
  const queryClient = useQueryClient();
  const { t } = useMls(props.i18nNamespace);
  const validationRules = validationRulesFactory(t);

  const isHidden = (fieldName: keyof LocationFormFields) => hidden.includes(fieldName);

  const [form] = Form.useForm();

  useDeepCompareEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  const status = [
    { label: t('Active'), value: LocationUnitStatus.ACTIVE },
    { label: t('Inactive'), value: LocationUnitStatus.INACTIVE },
  ];

  // value options for isJurisdiction questions
  const locationCategoryOptions = [
    { label: t('Jurisdiction'), value: true },
    { label: t('Building'), value: false },
  ];

  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere && successUrl) {
    return <Redirect to={successUrl} />;
  }

  return (
    <div className="location-form form-container">
      <Form
        {...formItemLayout}
        form={form}
        name="location-form"
        scrollToFirstError
        initialValues={initialValues}
        /* tslint:disable-next-line jsx-no-lambda */
        onFinish={async (values) => {
          setSubmitting(true);
          const payload = generateLocationUnit(values, initialValues, parentNode);

          const successMessage = isEditMode
            ? t(`Location was successfully updated`)
            : t('Location was successfully created');

          postPutLocationUnit(payload, fhirBaseURL)
            .then(() => {
              const successUrl = successURLGenerator(payload);
              sendSuccessNotification(successMessage);
              afterSubmit?.(payload);
              // hierarchy request usually takes quite a while to resolve, this coupled with react-query's request
              // de-duping mechanism means that more recent requests will get deduped on the pending request.
              // the pending request then resolves with stale data.
              // This cancels any pending request so that after invalidation we can get a fresh promise launched then.
              queryClient.cancelQueries([locationHierarchyResourceType]).catch((err) => {
                throw err;
              });
              queryClient
                .invalidateQueries({
                  predicate: (query) =>
                    [locationResourceType, locationHierarchyResourceType].includes(
                      query.queryKey[0] as string
                    ),
                })
                .catch((err) => {
                  throw err;
                });
              setSuccessUrl(successUrl);
              setAreWeDoneHere(true);
            })
            .catch((err: Error) => {
              sendErrorNotification(err.message);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        <FormItem name="id" label={t('Id')} rules={validationRules.id} hidden id="id">
          <Input disabled></Input>
        </FormItem>

        <FormItem
          id="parentId"
          hidden={isHidden('parentId')}
          label={t('Part Of')}
          name="parentId"
          rules={validationRules.parentId}
        >
          <CustomTreeSelect
            disabled={disabled.includes('parentId')}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder={t('Select the parent location')}
            disabledTreeNodesCallback={disabledTreeNodesCallback}
            fullDataCallback={setParentNode}
            tree={tree}
            allowClear={true}
          />
        </FormItem>

        <FormItem
          id="name"
          rules={validationRules.name}
          hidden={isHidden('name')}
          name="name"
          label={t('Name')}
          hasFeedback
        >
          <Input
            disabled={disabled.includes('name')}
            placeholder={t('Enter a location name')}
          ></Input>
        </FormItem>

        <FormItem id="alias" hidden={isHidden('alias')} name="alias" label={t('Alias')} hasFeedback>
          <Input disabled={disabled.includes('description')} placeholder={t('Alias')}></Input>
        </FormItem>

        <FormItem
          id="status"
          rules={validationRules.status}
          hidden={isHidden('status')}
          label={t('Status')}
          name="status"
        >
          <Radio.Group name="active">
            {status.map((e) => (
              <Radio name="status" key={e.label} value={e.value}>
                {e.label}
              </Radio>
            ))}
          </Radio.Group>
        </FormItem>

        <FormItem
          hidden={isHidden('isJurisdiction')}
          label={t('Physical type')}
          name="isJurisdiction"
          id="isJurisdiction"
          rules={validationRules.isJurisdiction}
        >
          <Radio.Group
            disabled={disabled.includes('isJurisdiction')}
            options={locationCategoryOptions}
          ></Radio.Group>
        </FormItem>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues[isJurisdiction] !== currentValues[isJurisdiction]
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(isJurisdiction) === true ? (
              <FormItem
                id={geometry}
                hidden={isHidden(geometry)}
                name={geometry}
                rules={validationRules.geometry}
                label={t('Geometry')}
              >
                <Input.TextArea
                  disabled={disabled.includes(geometry)}
                  rows={4}
                  placeholder={t('</> JSON')}
                />
              </FormItem>
            ) : (
              <>
                <FormItem
                  hidden={isHidden(serviceType)}
                  name={serviceType}
                  id={serviceType}
                  label={t('Type')}
                  rules={validationRules.serviceType}
                >
                  <ValueSetAsyncSelect
                    showSearch={true}
                    valueSetURL={eusmServicePointValueSetURI}
                    fhirBaseUrl={fhirBaseURL}
                  />
                </FormItem>
                <FormItem
                  id={latitude}
                  hidden={isHidden(latitude)}
                  name={latitude}
                  label={t('Latitude')}
                  rules={validationRules.latitude}
                >
                  <Input disabled={disabled.includes(latitude)} placeholder={t('E.g. -16.08306')} />
                </FormItem>
                <FormItem
                  id={longitude}
                  hidden={isHidden(longitude)}
                  name={longitude}
                  label={t('Longitude')}
                  rules={validationRules.longitude}
                >
                  <Input disabled={disabled.includes(longitude)} placeholder={t('E.g. 49.54933')} />
                </FormItem>
              </>
            )
          }
        </Form.Item>

        <FormItem
          id="description"
          rules={validationRules.description}
          hidden={isHidden('description')}
          name="description"
          label={t('Description')}
          hasFeedback
        >
          <Input.TextArea
            rows={4}
            disabled={disabled.includes('description')}
            placeholder={t('Description')}
          />
        </FormItem>

        <FormItem {...tailLayout}>
          <Space>
            <Button
              type="primary"
              id="location-form-submit-button"
              disabled={isSubmitting}
              htmlType="submit"
            >
              {isSubmitting ? t('Saving') : t('Save')}
            </Button>
            <Button id="location-form-cancel-button" onClick={onCancel}>
              {t('Cancel')}
            </Button>
          </Space>
        </FormItem>
      </Form>
    </div>
  );
};

LocationForm.defaultProps = defaultProps;

export { LocationForm };
