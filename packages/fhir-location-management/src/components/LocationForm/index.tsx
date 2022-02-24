import React, { useState } from 'react';
import { Form, Input, Space, Button, Radio } from 'antd';
import { Redirect } from 'react-router';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import {
  defaultFormField,
  generateLocationUnit,
  LocationFormFields,
  postPutLocationUnit,
  validationRulesFactory,
} from './utils';
import { locationHierarchyResourceType } from '../../constants';
import lang from '../../lang';
import { CustomTreeSelect, CustomTreeSelectProps } from './CustomTreeSelect';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { TreeNode } from '../../helpers/types';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { LocationUnitStatus } from '../../helpers/types';
import { useQueryClient } from 'react-query';

const { Item: FormItem } = Form;

/** props for the location form */
export interface LocationFormProps
  extends Pick<CustomTreeSelectProps, 'disabledTreeNodesCallback'> {
  initialValues: LocationFormFields;
  tree: TreeNode;
  successUrlGenerator: (payload: ILocation) => string;
  fhirBaseURL: string;
  hidden: string[];
  disabled: string[];
  onCancel: () => void;
  afterSubmit?: (payload: IfhirR4.ILocation) => void;
}

const defaultProps = {
  initialValues: defaultFormField,
  successUrlGenerator: () => '#',
  hidden: [],
  disabled: [],
  onCancel: () => void 0,
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
    successUrlGenerator: successURLGenerator,
    onCancel,
    tree,
  } = props;
  const isEditMode = !!initialValues.id;
  const defaultParentNode =
    tree.first((node) => node.model.nodeId === initialValues.parentId) ?? tree;
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [parentNode, setParentNode] = useState<TreeNode>(defaultParentNode);
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [successUrl, setSuccessUrl] = useState<string>();
  const validationRules = validationRulesFactory(lang);
  const queryClient = useQueryClient();

  const isHidden = (fieldName: string) => hidden.includes(fieldName);

  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({ ...initialValues });
  }, [form, initialValues]);

  const status = [
    { label: lang.LOCATION_ACTIVE_STATUS_LABEL, value: LocationUnitStatus.ACTIVE },
    { label: lang.LOCATION_INACTIVE_STATUS_LABEL, value: LocationUnitStatus.INACTIVE },
    { label: lang.LOCATION_SUSPENDED_STATUS_LABEL, value: LocationUnitStatus.SUSPENDED },
  ];

  // value options for isJurisdiction questions
  const locationCategoryOptions = [
    { label: lang.LOCATION_BUILDING_LABEL, value: false },
    { label: lang.LOCATION_JURISDICTION_LABEL, value: true },
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
            ? lang.SUCCESSFULLY_UPDATED_LOCATION
            : lang.SUCCESSFULLY_CREATED_LOCATION;

          postPutLocationUnit(payload, fhirBaseURL, isEditMode)
            .then(() => {
              const successUrl = successURLGenerator(payload);
              sendSuccessNotification(successMessage);
              afterSubmit?.(payload);
              queryClient.invalidateQueries([locationHierarchyResourceType]).catch((err) => {
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
        <>
          <FormItem name="id" label={lang.ID_LABEL} rules={validationRules.id} hidden id="id">
            <Input disabled></Input>
          </FormItem>

          <FormItem
            id="parentId"
            hidden={isHidden('parentId')}
            label={lang.PARENT_LABEL}
            name="parentId"
            rules={validationRules.parentId}
          >
            <CustomTreeSelect
              disabled={disabled.includes('parentId')}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={lang.PARENT_ID_SELECT_PLACEHOLDER}
              disabledTreeNodesCallback={disabledTreeNodesCallback}
              fullDataCallback={setParentNode}
              tree={tree}
            />
          </FormItem>

          <FormItem
            id="name"
            rules={validationRules.name}
            hidden={isHidden('name')}
            name="name"
            label={lang.NAME_LABEL}
            hasFeedback
          >
            <Input
              disabled={disabled.includes('name')}
              placeholder={lang.ENTER_LOCATION_NAME_PLACEHOLDER}
            ></Input>
          </FormItem>

          <FormItem
            id="alias"
            hidden={isHidden('alias')}
            name="alias"
            label={lang.ALIAS}
            hasFeedback
          >
            <Input disabled={disabled.includes('description')} placeholder={lang.ALIAS}></Input>
          </FormItem>

          <FormItem
            id="status"
            rules={validationRules.status}
            hidden={isHidden('status')}
            label={lang.STATUS_LABEL}
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
            label={lang.PHYSICAL_TYPE}
            name="isJurisdiction"
            id="isJurisdiction"
            rules={validationRules.isJurisdiction}
          >
            <Radio.Group
              disabled={disabled.includes('isJurisdiction')}
              options={locationCategoryOptions}
            ></Radio.Group>
          </FormItem>

          <FormItem
            id="description"
            rules={validationRules.description}
            hidden={isHidden('description')}
            name="description"
            label={lang.DESCRIPTION}
            hasFeedback
          >
            <Input.TextArea
              rows={4}
              disabled={disabled.includes('description')}
              placeholder={lang.DESCRIPTION}
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
                {isSubmitting ? lang.SAVING : lang.SAVE}
              </Button>
              <Button id="location-form-cancel-button" onClick={onCancel}>
                {lang.CANCEL}
              </Button>
            </Space>
          </FormItem>
        </>
      </Form>
    </div>
  );
};

LocationForm.defaultProps = defaultProps;

export { LocationForm };
