import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { SubmitButton, Form as FormikAntForm, Input, Radio, Select } from 'formik-antd';
import { notification, Button, Input as AntInput } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from '@onaio/connected-reducer-registry';
import { getUser } from '@onaio/session-reducer';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { Formik, FieldArray } from 'formik';
import { Ripple } from '@onaio/loaders';
import { useDispatch, useSelector } from 'react-redux';
import { Geometry } from 'geojson';
import { API_BASE_URL, LOCATION_TAG_ALL, LOCATION_UNIT_POST_PUT } from '../../constants';
import { uuid } from 'uuidv4';
import {
  LocationUnitPayloadPOST,
  LocationUnitPayloadPUT,
  LocationUnitStatus,
  LocationUnitSyncStatus,
} from '../../ducks/location-units';
import { fetchLocationTags, getLocationTagsArray, LocationTag } from '../../ducks/location-tags';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

const status = [
  { label: 'Active', value: LocationUnitStatus.ACTIVE },
  { label: 'Inactive', value: LocationUnitStatus.INACTIVE },
];

// TODO : need to resolve this data from server
const parentId = [{ name: 'Bombali', value: '1123' }];

interface FormField {
  parentId: string;
  name: string;
  status: LocationUnitStatus;
  Type: string;
  externalId?: string;
  locationTags?: LocationTag[];
  geometry?: Geometry;
  textEntryKey?: string[];
  textEntryValue?: string[];
}

const initialValue: FormField = {
  parentId: '',
  name: '',
  status: LocationUnitStatus.ACTIVE,
  Type: '',
};

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  parentId: Yup.number().typeError('Parentid must be a Number').required('Parentid is Required'),
  name: Yup.string().typeError('Name must be a String').required('Name is Required'),
  status: Yup.string().required('Status is Required'),
  Type: Yup.string().typeError('Type must be a String').required('Type is Required'),
  externalId: Yup.string().typeError('External id must be a String'),
  locationTags: Yup.array().typeError('location Tags must be an Array'),
  geometry: Yup.string().typeError('location Tags must be a An String'),
  textEntryKey: Yup.array().typeError('Text Entry Key must be an Array'),
  textEntryValue: Yup.array().typeError('Text Entry Value must be an Array'),
});

interface Props {
  id?: string;
}

export const Form: React.FC<Props> = (props: Props) => {
  const user = useSelector((state) => getUser(state));
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const [locationtag, setLocationtag] = useState<LocationTag[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      let serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);
      serve
        .list()
        .then((response: LocationTag[]) => {
          setLocationtag(response);
          setIsLoading(false);
          console.log(response);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  function filter(input: string, option: any) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  /**
   * Handle form submission
   *
   * @param {Object} values the form fields
   * @param {Function} setSubmitting method to set submission status
   */
  function onSubmit(values: FormField, setSubmitting: (isSubmitting: boolean) => void) {
    const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_UNIT_POST_PUT);

    let payload: LocationUnitPayloadPOST | LocationUnitPayloadPUT = {
      properties: {
        username: user.username,
        version: 0,
        externalId: values.externalId,
        parentId: values.parentId,
        name: values.name,
        name_en: values.name,
        status: values.status,
      },
      id: props.id ? props.id : uuid(),
      syncStatus: LocationUnitSyncStatus.SYNCED,
      type: values.Type,
      locationTags: values.locationTags,
      geometry: values.geometry as Geometry,
    };

    function removeEmptykeys(obj: any) {
      Object.keys(obj).forEach(function (key) {
        if (obj[key] && typeof obj[key] === 'object') removeEmptykeys(obj[key]);
        else if (obj[key] == null) delete obj[key];
      });
    }
    removeEmptykeys(payload);

    if (props.id) {
      serve
        .update(payload)
        .then(() => {
          notification.success({ message: 'User Updated successfully', description: '' });
          setSubmitting(false);
          history.goBack();
        })
        .catch((e: Error) => {
          notification.error({ message: `${e}`, description: '' });
          setSubmitting(false);
        });
    } else {
      serve
        .create(payload)
        .then(() => {
          notification.success({ message: 'User Created successfully', description: '' });
          setSubmitting(false);
          history.goBack();
        })
        .catch((e: Error) => {
          notification.error({ message: `${e}`, description: '' });
          setSubmitting(false);
        });
    }
  }

  if (isLoading) return <Ripple />;

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={userSchema}
      onSubmit={(
        values: FormField,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
      ) => onSubmit(values, setSubmitting)}
    >
      {({ values, isSubmitting, handleSubmit }) => {
        console.log('values : ', values);

        return (
          <FormikAntForm requiredMark={'optional'} {...layout} onSubmitCapture={handleSubmit}>
            <FormikAntForm.Item label="Parent" name="parentId" required>
              <Select
                name="parentId"
                showSearch
                placeholder="Select a Parent Id"
                optionFilterProp="children"
                filterOption={filter}
              >
                {parentId.map((e) => (
                  <Select.Option key={e.value} value={e.value}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select>
            </FormikAntForm.Item>

            <FormikAntForm.Item name="name" label="Name" required>
              <Input name="name" placeholder="Enter a location name" />
            </FormikAntForm.Item>

            <FormikAntForm.Item label="Status" name="status" valuePropName="checked" required>
              <Radio.Group name="status" defaultValue={initialValue.status}>
                {status.map((e) => (
                  <Radio name="status" key={e.label} value={e.value}>
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
            </FormikAntForm.Item>

            <FormikAntForm.Item name="Type" label="Type" required>
              <Input name="Type" placeholder="Select type" />
            </FormikAntForm.Item>

            <FormikAntForm.Item name="externalId" label="External ID">
              <Input name="externalId" placeholder="Select status" />
            </FormikAntForm.Item>

            <FormikAntForm.Item name="geometry" label="geometry">
              <Input.TextArea name="geometry" rows={4} placeholder="</> JSON" />
            </FormikAntForm.Item>

            <FormikAntForm.Item label="Unit Group" name="locationTags">
              <Select
                name="locationTags"
                mode="multiple"
                allowClear
                showSearch
                placeholder="Enter a location group name"
                optionFilterProp="children"
                filterOption={filter}
              >
                {locationtag &&
                  locationtag.map((e) => (
                    <Select.Option key={e.id} value={e.id}>
                      {e.name}
                    </Select.Option>
                  ))}
              </Select>
            </FormikAntForm.Item>

            <FieldArray
              name="textEntry"
              render={(arrayHelpers) => (
                <>
                  {values.textEntryKey &&
                    values.textEntryKey.length > 0 &&
                    values.textEntryKey.map((field, index) => {
                      const key = `textEntryKey.${index}`;
                      const value = `textEntryValue.${index}`;
                      return (
                        <FormikAntForm.Item
                          name={key}
                          {...(index === 0
                            ? { labelCol: { span: 8 }, wrapperCol: { span: 16 } }
                            : { wrapperCol: { offset: 8, span: 16 } })}
                          label={index === 0 ? 'Text entry' : ''}
                          key={key}
                        >
                          <AntInput.Group compact style={{ width: '69%' }}>
                            <FormikAntForm.Item name={key} noStyle>
                              <AntInput style={{ width: '50%' }} placeholder="key" />
                            </FormikAntForm.Item>
                            <FormikAntForm.Item name={value} noStyle>
                              <AntInput style={{ width: '50%' }} placeholder="value" />
                            </FormikAntForm.Item>
                          </AntInput.Group>
                          {/* <Input name={key} placeholder="Enter text" /> */}
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => arrayHelpers.remove(index)}
                          />
                        </FormikAntForm.Item>
                      );
                    })}

                  <FormikAntForm.Item name="textEntryButton" {...offsetLayout}>
                    <Button
                      type="dashed"
                      onClick={() => arrayHelpers.push('')}
                      style={{ width: '100%' }}
                      icon={<PlusOutlined />}
                    >
                      Add Text Entry field
                    </Button>
                  </FormikAntForm.Item>
                </>
              )}
            />
            <FormikAntForm.Item name="buttons" {...offsetLayout}>
              <SubmitButton id="submit">{isSubmitting ? 'Saving' : 'Save'}</SubmitButton>
              <Button id="cancel" onClick={() => history.goBack()} type="dashed">
                Cancel
              </Button>
            </FormikAntForm.Item>
          </FormikAntForm>
        );
      }}
    </Formik>
  );
};

export default Form;
