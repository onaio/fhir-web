import React, { useState } from 'react';
import { Form, Input, Space, Button, Radio } from 'antd';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { Redirect } from 'react-router';
import { ExtraFields } from './ExtraFields';
import {
  defaultFormField,
  generateLocationUnit,
  getLocationTagOptions,
  getServiceTypeOptions,
  LocationFormFields,
  Setting,
  validationRules,
} from './utils';
import { baseURL, SERVICE_TYPES_SETTINGS_ID, URL_LOCATION_UNIT } from '../../constants';
import { LocationUnitStatus, LocationUnitTag } from '../../ducks/location-units';
import { CustomSelect } from './CustomSelect';
import { loadLocationTags, loadSettings, postPutLocationUnit } from '../../helpers/dataLoaders';
import { OpenSRPService } from '@opensrp/react-utils';
import { CANCEL, SUCCESSFULLY_CREATED_LOCATION, SUCCESSFULLY_UPDATED_LOCATION } from '../../lang';
import { CustomTreeSelect } from './CustomTreeSelect';
import { TreeNode } from '../../ducks/locationHierarchy/types';

const { Item: FormItem } = Form;

/** props for the product Catalogue form */
export interface LocationFormProps {
  initialValues: LocationFormFields;
  redirectAfterAction: string;
  openSRPBaseURL: string;
  hidden: string[];
  disabled: string[];
  onCancel: () => void;
  service: typeof OpenSRPService;
  username: string;
}

const defaultProps = {
  initialValues: defaultFormField,
  redirectAfterAction: URL_LOCATION_UNIT,
  hidden: [],
  disabled: [],
  onCancel: () => {
    return;
  },
  service: OpenSRPService,
  username: '',
  openSRPBaseURL: baseURL,
};

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
      span: 12,
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
      span: 12,
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

/** form component to add/edit products in the catalogue */

const LocationForm = (props: LocationFormProps) => {
  const {
    initialValues,
    redirectAfterAction,
    openSRPBaseURL,
    disabled,
    onCancel,
    hidden,
    service,
    username,
  } = props;
  const isEditMode = !!initialValues.id;
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [selectedLocationTags, setLocationTags] = useState<LocationUnitTag[]>([]);
  const [selectedParentNode, setSelectedParentNode] = useState<TreeNode>();

  const isHidden = (fieldName: string) => hidden.includes(fieldName);
  const isDisabled = (fieldName: string) => disabled.includes(fieldName);

  const [form] = Form.useForm();

  const status = [
    { label: 'Active', value: LocationUnitStatus.ACTIVE },
    { label: 'Inactive', value: LocationUnitStatus.INACTIVE },
  ];

  // value options for isJurisdiction questions
  const locationCategoryOptions = [
    { label: 'Service point', value: false },
    { label: 'Jurisdiction', value: true },
  ];
  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere) {
    return <Redirect to={redirectAfterAction} />;
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
        onFinish={(values) => {
          const payload = generateLocationUnit(
            values,
            username,
            selectedLocationTags,
            selectedParentNode
          );

          const successMessage = isEditMode
            ? SUCCESSFULLY_UPDATED_LOCATION
            : SUCCESSFULLY_CREATED_LOCATION;

          const params = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            is_jurisdiction: values.isJurisdiction,
          };

          postPutLocationUnit(payload, openSRPBaseURL, service, isEditMode, params)
            .then(() => {
              sendSuccessNotification(successMessage);
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
            label="Instance"
            rules={validationRules.instance}
            hidden
            id="instance"
          >
            <Input disabled></Input>
          </FormItem>

          <FormItem name="id" label="id" rules={validationRules.id} hidden id="id">
            <Input disabled></Input>
          </FormItem>

          <FormItem name="username" label="username" hidden id="username">
            <Input disabled></Input>
          </FormItem>

          <FormItem
            id="parentId"
            hidden={isHidden('parentId')}
            label="Parent"
            name="parentId"
            rules={validationRules.parentId}
          >
            <CustomTreeSelect
              service={service}
              baseURL={openSRPBaseURL}
              disabled={disabled.includes('parentId')}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              fullDataCallback={setSelectedParentNode}
            />
          </FormItem>

          <FormItem
            id="name"
            rules={validationRules.name}
            hidden={isHidden('name')}
            name="name"
            label="Name"
            hasFeedback
          >
            <Input disabled={disabled.includes('name')} placeholder="Enter a location name"></Input>
          </FormItem>

          <FormItem
            id="status"
            rules={validationRules.status}
            hidden={isHidden('status')}
            label="Status"
            name="status"
          >
            <Radio.Group options={status}></Radio.Group>
          </FormItem>

          <FormItem
            hidden={isHidden('isJurisdiction')}
            label="Location Category"
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
            id="type"
            rules={validationRules.type}
            hidden={isHidden('type')}
            name="type"
            label="Type"
          >
            <Input disabled={disabled.includes('type')} placeholder="Select type" />
          </FormItem>

          <FormItem
            hidden={isHidden('serviceTypes')}
            name="serviceTypes"
            id="serviceTypes"
            label="Type"
            rules={validationRules.serviceTypes}
          >
            <CustomSelect<Setting>
              disabled={disabled.includes('serviceTypes')}
              loadData={(setData) => {
                return loadSettings(SERVICE_TYPES_SETTINGS_ID, openSRPBaseURL, service, setData);
              }}
              getOptions={getServiceTypeOptions}
            />
          </FormItem>

          <FormItem
            id="externalId"
            hidden={isHidden('externalId')}
            name="externalId"
            label="External ID"
            rules={validationRules.externalId}
          >
            <Input disabled={disabled.includes('externalId')} placeholder="Select status" />
          </FormItem>

          <FormItem
            id="geometry"
            rules={validationRules.geometry}
            hidden={isHidden('geometry')}
            name="geometry"
            label="geometry"
          >
            <Input.TextArea
              disabled={disabled.includes('geometry')}
              rows={4}
              placeholder="</> JSON"
            />
          </FormItem>

          <FormItem
            id="locationTags"
            hidden={isHidden('locationTags')}
            label="Unit Group"
            name="locationTags"
            rules={validationRules.locationTags}
          >
            <CustomSelect<LocationUnitTag>
              disabled={disabled.includes('locationTags')}
              mode="multiple"
              allowClear
              showSearch
              placeholder="Enter a location group name"
              loadData={(setData) => {
                return loadLocationTags(openSRPBaseURL, service, setData);
              }}
              getOptions={getLocationTagOptions}
              fullDataCallback={setLocationTags}
            />
          </FormItem>

          <ExtraFields
            baseURL={openSRPBaseURL}
            service={service}
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
                {isSubmitting ? 'Saving' : 'Save'}
              </Button>
              <Button id="location-form-cancel-button" onClick={() => onCancel()}>
                {CANCEL}
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
