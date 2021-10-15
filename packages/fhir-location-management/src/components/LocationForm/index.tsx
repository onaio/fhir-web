import React, { useState } from 'react';
import { Form, Input, Space, Button, Radio } from 'antd';
import { useHistory } from 'react-router';
import FHIR from 'fhirclient';
import { get } from 'lodash';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { Redirect } from 'react-router';
import {
  defaultFormField,
  generateLocationUnit,
  handleGeoFieldsChangeFactory,
  LocationFormFields,
  validationRulesFactory,
} from './utils';
import { baseURL, URL_LOCATION_UNIT } from '../../constants';
import { LocationUnit, LocationUnitStatus, LocationUnitTag } from '../../ducks/location-units';
import lang from '../../lang';
import { CustomTreeSelect, CustomTreeSelectProps } from './CustomTreeSelect';
import { TreeNode } from '../../ducks/locationHierarchy/types';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { useQueryClient } from 'react-query';

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
  fhirRootLocationIdentifier: string;
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
    hidden,
    disabledTreeNodesCallback,
    fhirRootLocationIdentifier,
    filterByParentId,
    fhirBaseURL,
    afterSubmit,
  } = props;
  const isEditMode = !!initialValues?.id;
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [selectedLocationTags, setLocationTags] = useState<LocationUnitTag[]>([]);
  const [selectedParentNode, setSelectedParentNode] = useState<TreeNode>();
  const [generatedPayload, setGeneratedPayload] = useState<LocationUnit>();
  const history = useHistory();
  const queryClient = useQueryClient();
  const validationRules = validationRulesFactory(lang);

  const isHidden = (fieldName: string) => hidden.includes(fieldName);

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
    { label: lang.LOCATION_BUILDING_LABEL, value: false },
    { label: lang.LOCATION_JURISDICTION_LABEL, value: true },
  ];
  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere) {
    const redirectAfterAction = successURLGenerator(generatedPayload as LocationUnit);
    return <Redirect to={redirectAfterAction} />;
  }

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
          const payload = await generateLocationUnit(
            values as any,
            get(initialValues, 'identifier.0.value'),
            fhirBaseURL
          );

          const successMessage = isEditMode
            ? lang.SUCCESSFULLY_UPDATED_LOCATION
            : lang.SUCCESSFULLY_CREATED_LOCATION;
          const serve = new FHIRServiceClass(fhirBaseURL, 'Location');
          if (initialValues?.id) {
            await serve
              .update(payload)
              .then(() => {
                afterSubmit(payload as any);
                sendSuccessNotification(successMessage);
              })
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED))
              .finally(() => queryClient.invalidateQueries());
          } else {
            await serve
              .create(payload)
              .then(() => {
                afterSubmit(payload as any);
                sendSuccessNotification(successMessage);
              })
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED))
              .finally(() => queryClient.invalidateQueries());
          }
          history.push(URL_LOCATION_UNIT);
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
              fhirBaseURL={fhirBaseURL}
              baseURL={opensrpBaseURL}
              filterByParentId={filterByParentId}
              disabled={disabled.includes('parentId')}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={lang.PARENT_ID_SELECT_PLACEHOLDER}
              fullDataCallback={setSelectedParentNode}
              disabledTreeNodesCallback={disabledTreeNodesCallback}
              fhirRootLocationIdentifier={fhirRootLocationIdentifier}
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
              <Button
                id="location-form-cancel-button"
                onClick={() => history.push(URL_LOCATION_UNIT)}
              >
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
