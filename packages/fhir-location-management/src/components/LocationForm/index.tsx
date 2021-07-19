import React, { useState } from 'react';
import { Form, Input, Space, Button, Radio } from 'antd';
import FHIR from 'fhirclient';
import { get } from 'lodash';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { Redirect } from 'react-router';
import { ExtraFields } from './ExtraFields';
import {
  defaultFormField,
  generateLocationUnit,
  getServiceTypeOptions,
  handleGeoFieldsChangeFactory,
  LocationFormFields,
  ServiceTypeSetting,
  validationRulesFactory,
} from './utils';
import { baseURL, SERVICE_TYPES_SETTINGS_ID, URL_LOCATION_UNIT } from '../../constants';
import { LocationUnit, LocationUnitStatus, LocationUnitTag } from '../../ducks/location-units';
import { CustomSelect } from './CustomSelect';
import { loadSettings, postPutLocationUnit } from '../../helpers/dataLoaders';
import lang from '../../lang';
import { CustomTreeSelect, CustomTreeSelectProps } from './CustomTreeSelect';
import { TreeNode } from '../../ducks/locationHierarchy/types';
import { IfhirR4 } from '@smile-cdr/fhirts';

const { Item: FormItem } = Form;

/** props for the location form */
export interface LocationFormProps
  extends Pick<CustomTreeSelectProps, 'disabledTreeNodesCallback'> {
  initialValues?: LocationFormFields;
  successURLGenerator: (payload: LocationUnit) => string;
  opensrpBaseURL: string;
  fhirBaseURL: string;
  hidden: string[];
  disabled: string[];
  onCancel: () => void;
  username: string;
  filterByParentId?: boolean;
  afterSubmit: (payload: LocationUnit) => void;
}

const defaultProps = {
  initialValues: defaultFormField,
  filterByParentId: false,
  successURLGenerator: () => URL_LOCATION_UNIT,
  hidden: [],
  disabled: [],
  onCancel: () => void 0,
  username: '',
  opensrpBaseURL: baseURL,
  fhirBaseURL: '',
  afterSubmit: () => {
    return;
  },
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
    successURLGenerator,
    opensrpBaseURL,
    disabled,
    onCancel,
    hidden,
    username,
    afterSubmit,
    disabledTreeNodesCallback,
    filterByParentId,
    fhirBaseURL,
  } = props;
  const isEditMode = !!initialValues?.id;
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [selectedLocationTags, setLocationTags] = useState<LocationUnitTag[]>([]);
  const [selectedParentNode, setSelectedParentNode] = useState<TreeNode>();
  const [generatedPayload, setGeneratedPayload] = useState<LocationUnit>();
  const validationRules = validationRulesFactory(lang);

  const isHidden = (fieldName: string) => hidden.includes(fieldName);
  const isDisabled = (fieldName: string) => disabled.includes(fieldName);

  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({ ...initialValues });
  }, [form, initialValues]);

  const status = [
    { label: lang.LOCATION_ACTIVE_STATUS_LABEL, value: LocationUnitStatus.ACTIVE },
    { label: lang.LOCATION_INACTIVE_STATUS_LABEL, value: LocationUnitStatus.INACTIVE },
  ];

  // value options for isJurisdiction questions
  const locationCategoryOptions = [
    { label: lang.LOCATION_STRUCTURE_LABEL, value: false },
    { label: lang.LOCATION_JURISDICTION_LABEL, value: true },
  ];
  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere) {
    const redirectAfterAction = successURLGenerator(generatedPayload as LocationUnit);
    return <Redirect to={redirectAfterAction} />;
  }

  console.log('loc form??', initialValues);

  const geoFieldsChangeHandler = handleGeoFieldsChangeFactory(form);

  return (
    <div className="location-form form-container">
      <Form
        {...formItemLayout}
        form={form}
        name="location-form"
        scrollToFirstError
        initialValues={initialValues}
        onValuesChange={geoFieldsChangeHandler}
        /* tslint:disable-next-line jsx-no-lambda */
        onFinish={async (values) => {
          const payload = generateLocationUnit(
            values as any,
            get(initialValues, 'identifier.0.value'),
            username,
            selectedLocationTags,
            selectedParentNode
          );

          const successMessage = isEditMode
            ? lang.SUCCESSFULLY_UPDATED_LOCATION
            : lang.SUCCESSFULLY_CREATED_LOCATION;

          const params = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            is_jurisdiction: values.isJurisdiction,
          };

          const serve = FHIR.client(fhirBaseURL);
          if (initialValues?.id) {
            await serve
              .update(payload)
              .then(() => sendSuccessNotification(successMessage))
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
          } else {
            await serve
              .create(payload)
              .then(() => sendSuccessNotification(successMessage))
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
          }
        }}
      >
        <>
          <FormItem name="id" label={lang.ID_LABEL} rules={validationRules.id} hidden id="id">
            <Input disabled></Input>
          </FormItem>

          <FormItem name="username" label={lang.USERNAME_LABEL} hidden id="username">
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
              baseURL={opensrpBaseURL}
              filterByParentId={filterByParentId}
              disabled={disabled.includes('parentId')}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={lang.PARENT_ID_SELECT_PLACEHOLDER}
              fullDataCallback={setSelectedParentNode}
              disabledTreeNodesCallback={disabledTreeNodesCallback}
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
            id="description"
            rules={validationRules.name}
            hidden={isHidden('description')}
            name="description"
            label={lang.DESCRIPTION}
            hasFeedback
          >
            <Input
              disabled={disabled.includes('description')}
              placeholder={lang.DESCRIPTION}
            ></Input>
          </FormItem>

          <FormItem
            id="alias"
            rules={validationRules.alias}
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
            <Radio.Group options={status}></Radio.Group>
          </FormItem>

          <FormItem
            hidden={isHidden('isJurisdiction')}
            label={lang.LOCATION_CATEGORY_LABEL}
            name="isJurisdiction"
            id="isJurisdiction"
            rules={validationRules.isJurisdiction}
          >
            <Radio.Group
              disabled={disabled.includes('isJurisdiction')}
              options={locationCategoryOptions}
            ></Radio.Group>
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
              <Button id="location-form-cancel-button" onClick={() => onCancel()}>
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
