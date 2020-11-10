import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { SubmitButton, Form as AntForm, Input, Radio, Select } from 'formik-antd';
import { notification, Button } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { getUser } from '@onaio/session-reducer';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { Formik } from 'formik';
import { Ripple } from '@onaio/loaders';
import {
  LocationUnit,
  LocationUnitPayloadPOST,
  LocationUnitPayloadPUT,
  LocationUnitStatus,
  LocationUnitSyncStatus,
  LocationUnitTag,
} from '../../ducks/location-units';
import { useSelector } from 'react-redux';
import { Geometry } from 'geojson';
import { API_BASE_URL, LOCATION_TAG_ALL, LOCATION_UNIT_POST_PUT } from '../../constants';
import { uuid } from 'uuidv4';
import { LocationTag } from '../../ducks/location-tags';

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
  type: string;
  externalId?: string;
  locationTags?: string[];
  geometry?: string;
}

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  parentId: Yup.number().typeError('Parentid must be a Number').required('Parentid is Required'),
  name: Yup.string().typeError('Name must be a String').required('Name is Required'),
  status: Yup.string().required('Status is Required'),
  type: Yup.string().typeError('Type must be a String').required('Type is Required'),
  externalId: Yup.string().typeError('External id must be a String'),
  locationTags: Yup.array().typeError('location Tags must be an Array'),
  geometry: Yup.string().typeError('location Tags must be a An String'),
});

interface Props {
  id?: string;
}

export const Form: React.FC<Props> = (props: Props) => {
  const user = useSelector((state) => getUser(state));
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const [locationtag, setLocationtag] = useState<LocationTag[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialValue, setInitialValue] = useState<FormField>({
    parentId: '',
    name: '',
    status: LocationUnitStatus.ACTIVE,
    type: '',
  });

  useEffect(() => {
    if (isLoading) {
      let locationstagfetched = false;
      let detailfetched = false;
      if (!locationtag) {
        let serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);
        serve
          .list()
          .then((response: LocationTag[]) => {
            locationstagfetched = true;
            setLocationtag(response);
            console.log('LocationTag : ', response);
            if (!props.id || detailfetched) setIsLoading(false);
          })
          .catch((e) => console.log(e));
      }

      if (props.id) {
        let serve = new OpenSRPService(
          accessToken,
          API_BASE_URL,
          `location/${props.id}?is_jurisdiction=true`
        );
        serve
          .list()
          .then((response: LocationUnit) => {
            detailfetched = true;
            setInitialValue({
              name: response.properties.name,
              // need to set parent id in treeselect
              parentId: response.properties.parentId,
              status: response.properties.status,
              externalId: response.properties.externalId,
              locationTags: response.locationTags?.map((e) =>
                JSON.stringify({ id: e.id, name: e.name })
              ),
              geometry: JSON.stringify(response.geometry),
              type: response.type,
            });
            console.log('LocationUnit : ', response);
            if (locationstagfetched) setIsLoading(false);
          })
          .catch((e) => console.log(e));
      }
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
    const locationtag: LocationUnitTag[] | undefined = values.locationTags?.map((e) =>
      JSON.parse(e)
    );

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
      type: values.type,
      locationTags: locationtag,
      geometry: values.geometry ? (JSON.parse(values.geometry) as Geometry) : undefined,
    };

    function removeEmptykeys(obj: any) {
      Object.keys(obj).forEach(function (key) {
        if (obj[key] && typeof obj[key] === 'object') removeEmptykeys(obj[key]);
        else if (obj[key] == null || obj[key] == [] || obj[key] == {} || obj[key] == undefined)
          delete obj[key];
      });
    }
    removeEmptykeys(payload);
    console.log('payload : ', payload);

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
          <AntForm requiredMark={'optional'} {...layout} onSubmitCapture={handleSubmit}>
            <AntForm.Item label="Parent" name="parentId" required>
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
            </AntForm.Item>

            <AntForm.Item name="name" label="Name" required>
              <Input name="name" placeholder="Enter a location name" />
            </AntForm.Item>

            <AntForm.Item label="Status" name="status" valuePropName="checked" required>
              <Radio.Group name="status" defaultValue={initialValue.status}>
                {status.map((e) => (
                  <Radio name="status" key={e.label} value={e.value}>
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
            </AntForm.Item>

            <AntForm.Item name="type" label="Type" required>
              <Input name="type" placeholder="Select type" />
            </AntForm.Item>

            <AntForm.Item name="externalId" label="External ID">
              <Input name="externalId" placeholder="Select status" />
            </AntForm.Item>

            <AntForm.Item name="geometry" label="geometry">
              <Input.TextArea name="geometry" rows={4} placeholder="</> JSON" />
            </AntForm.Item>

            <AntForm.Item label="Unit Group" name="locationTags">
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
                  locationtag.map((e) => {
                    const value: LocationUnitTag = { id: e.id, name: e.name };
                    return (
                      <Select.Option key={e.id} value={JSON.stringify(value)}>
                        {e.name}
                      </Select.Option>
                    );
                  })}
              </Select>
            </AntForm.Item>

            <AntForm.Item name="buttons" {...offsetLayout}>
              <SubmitButton id="submit">{isSubmitting ? 'Saving' : 'Save'}</SubmitButton>
              <Button id="cancel" onClick={() => history.goBack()} type="dashed">
                Cancel
              </Button>
            </AntForm.Item>
          </AntForm>
        );
      }}
    </Formik>
  );
};

export default Form;
