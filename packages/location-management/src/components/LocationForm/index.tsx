import React, { useState } from 'react';
import { Form, Input, Space, Button, Radio } from 'antd';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { Redirect } from 'react-router';
import { ExtraFields } from './ExtraFields';
import {
  defaultFormField,
  generateLocationUnit,
  getLocationTagOptions,
  getSelectedLocTagObj,
  getServiceTypeOptions,
  handleGeoFieldsChangeFactory,
  LocationFormFields,
  ServiceTypeSetting,
  validationRulesFactory,
} from './utils';
import { baseURL, SERVICE_TYPES_SETTINGS_ID, URL_LOCATION_UNIT } from '../../constants';
import { LocationUnit, LocationUnitStatus, LocationUnitTag } from '../../ducks/location-units';
import { CustomSelect } from './CustomSelect';
import { loadLocationTags, loadSettings, postPutLocationUnit } from '../../helpers/dataLoaders';
import { useTranslation } from '../../mls';
import { CustomTreeSelect, CustomTreeSelectProps } from './CustomTreeSelect';
import { TreeNode } from '../../ducks/locationHierarchy/types';

const { Item: FormItem } = Form;

/** props for the location form */
export interface LocationFormProps
  extends Pick<CustomTreeSelectProps, 'disabledTreeNodesCallback'> {
  initialValues?: LocationFormFields;
  successURLGenerator: (payload: LocationUnit) => string;
  opensrpBaseURL: string;
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
  } = props;
  const isEditMode = !!initialValues?.id;
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [selectedLocationTags, setLocationTags] = useState<LocationUnitTag[]>([]);
  const [selectedParentNode, setSelectedParentNode] = useState<TreeNode>();
  const [generatedPayload, setGeneratedPayload] = useState<LocationUnit>();
  const { t } = useTranslation();
  const validationRules = validationRulesFactory(t);

  const isHidden = (fieldName: string) => hidden.includes(fieldName);
  const isDisabled = (fieldName: string) => disabled.includes(fieldName);

  const [form] = Form.useForm();

  React.useEffect(() => {
    // #850 - initial Values would override any values so far fed into  the form,
    form.setFieldsValue({
      ...initialValues,
      ...form.getFieldsValue(),
    });
  }, [form, initialValues]);

  const status = [
    { label: t('Active'), value: LocationUnitStatus.ACTIVE },
    { label: t('Inactive'), value: LocationUnitStatus.INACTIVE },
  ];

  // value options for isJurisdiction questions
  const locationCategoryOptions = [
    { label: t('Service point'), value: false },
    { label: t('Jurisdiction'), value: true },
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
        onFinish={(values) => {
          const payload = generateLocationUnit(
            values,
            username,
            selectedLocationTags,
            selectedParentNode
          );

          const successMessage = isEditMode
            ? t('Location was successfully updated')
            : t('Location was successfully created');

          const params = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            is_jurisdiction: values.isJurisdiction,
          };

          postPutLocationUnit(payload, opensrpBaseURL, isEditMode, params)
            .then(() => {
              afterSubmit(payload);
              sendSuccessNotification(successMessage);
              setGeneratedPayload(payload);
              setAreWeDoneHere(true);
            })
            .catch((err: Error) => {
              sendErrorNotification(err.name, err.message);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        <>
          <FormItem
            name="instance"
            label={t('Instance')}
            rules={validationRules.instance}
            hidden
            id="instance"
            className="instance"
          >
            <Input disabled></Input>
          </FormItem>

          <FormItem name="id" label={t('Id')} rules={validationRules.id} hidden className='id' id="id">
            <Input disabled></Input>
          </FormItem>

          <FormItem className='username' name="username" label={t('username')} hidden id="username">
            <Input disabled></Input>
          </FormItem>

          <FormItem
            id="parentId"
            className="parentId"
            hidden={isHidden('parentId')}
            label={t('Parent')}
            name="parentId"
            rules={validationRules.parentId}
          >
            <CustomTreeSelect
              className='tree'
              baseURL={opensrpBaseURL}
              filterByParentId={filterByParentId}
              disabled={disabled.includes('parentId')}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={t('Select the parent location')}
              fullDataCallback={setSelectedParentNode}
              disabledTreeNodesCallback={disabledTreeNodesCallback}
            />
          </FormItem>

          <FormItem
            id="name"
            className="name"
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

          <FormItem
            id="status"
            className="status"
            rules={validationRules.status}
            hidden={isHidden('status')}
            label={t('Status')}
            name="status"
          >
            <Radio.Group options={status}></Radio.Group>
          </FormItem>

          <FormItem
            hidden={isHidden('isJurisdiction')}
            label={t('Location category')}
            name="isJurisdiction"
            id="isJurisdiction"
            className="isJurisdiction"
            rules={validationRules.isJurisdiction}
          >
            <Radio.Group
              disabled={disabled.includes('isJurisdiction')}
              options={locationCategoryOptions}
            ></Radio.Group>
          </FormItem>

          <FormItem
            hidden={isHidden('serviceType')}
            name="serviceType"
            id="serviceType"
            className="serviceType"
            label={t('Type')}
            rules={validationRules.serviceTypes}
          >
            <CustomSelect<ServiceTypeSetting>
              className='select'
              placeholder={t('Select the service point type')}
              disabled={disabled.includes('serviceType')}
              loadData={(setData) => {
                return loadSettings(SERVICE_TYPES_SETTINGS_ID, opensrpBaseURL, setData);
              }}
              getOptions={getServiceTypeOptions}
            />
          </FormItem>

          <FormItem
            id="externalId"
            className="externalId"
            hidden={isHidden('externalId')}
            name="externalId"
            label={t('External ID')}
            rules={validationRules.externalId}
          >
            <Input disabled={disabled.includes('externalId')} placeholder={t('Select status')} />
          </FormItem>

          <FormItem
            id="geometry"
            className="geometry"
            rules={validationRules.geometry}
            hidden={isHidden('geometry')}
            name="geometry"
            label={t('Geometry')}
          >
            <Input.TextArea
              disabled={disabled.includes('geometry')}
              rows={4}
              placeholder={t('</> JSON')}
            />
          </FormItem>

          <FormItem
            id="latitude"
            className="latitude"
            hidden={isHidden('latitude')}
            name="latitude"
            label={t('Latitude')}
            rules={validationRules.latitude}
          >
            <Input disabled={disabled.includes('latitude')} placeholder={t('E.g. -16.08306')} />
          </FormItem>

          <FormItem
            id="longitude"
            className="longitude"
            hidden={isHidden('longitude')}
            name="longitude"
            label={t('Longitude')}
            rules={validationRules.longitude}
          >
            <Input disabled={disabled.includes('longitude')} placeholder={t('E.g. 49.54933')} />
          </FormItem>

          <FormItem
            id="locationTags"
            className="locationTags"
            hidden={isHidden('locationTags')}
            label={t('Unit group')}
            name="locationTags"
            rules={validationRules.locationTags}
          >
            <CustomSelect<LocationUnitTag>
              disabled={disabled.includes('locationTags')}
              mode="multiple"
              allowClear
              showSearch
              placeholder={t('Enter a location group name')}
              loadData={(setData) => {
                return loadLocationTags(opensrpBaseURL, setData);
              }}
              getOptions={getLocationTagOptions}
              fullDataCallback={setLocationTags}
              getSelectedFullData={getSelectedLocTagObj}
            />
          </FormItem>

          <ExtraFields
            baseURL={opensrpBaseURL}
            hidden={isHidden('extraFields')}
            disabled={isDisabled('extraFields')}
          />

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
              <Button id="location-form-cancel-button" onClick={() => onCancel()}>
                {t('Cancel')}
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
