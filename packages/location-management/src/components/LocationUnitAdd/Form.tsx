import * as Yup from 'yup';
import React from 'react';
import { SubmitButton, Form as AntForm, Input, Radio, Select, ResetButton } from 'formik-antd';
import { notification, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from '@onaio/connected-reducer-registry';
import { getUser } from '@onaio/session-reducer';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { Formik, FieldArray } from 'formik';

import {
  LocationUnitPayloadPOST,
  LocationUnitStatus,
  LocationUnitSyncStatus,
} from '../../ducks/location-units';
import { useSelector } from 'react-redux';
import { Geometry } from 'geojson';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

const locationtag = [
  { name: 'Option 1', value: 1 },
  { name: 'Option 2', value: 2 },
  { name: 'Option 3', value: 3 },
];

const status = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
];

const initialValue = {
  parentId: '',
  name: '',
  status: LocationUnitStatus.ACTIVE,
  Type: '',
  externalId: '',
  locationTags: [],
  geometry: {
    coordinates: [],
    type: 'MultiPolygon',
  },
  textEntry: [],
};

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  parentId: Yup.number().typeError('Parentid must be a Number').required('Parentid is Required'),
  name: Yup.string().typeError('Name must be a String').required('Name is Required'),
  status: Yup.boolean().typeError('Status must be a Boolean').required('Status is Required'),
  Type: Yup.string().typeError('Status must be a String').required('Status is Required'),
  externalId: Yup.string().typeError('External id must be a String'),
  locationTags: Yup.array().typeError('location Tags must be an Array'),
  geometry: Yup.object().typeError('location Tags must be a An Object'),
  textEntry: Yup.array().typeError('Text Entry must be an Array'),
});

interface Props {
  id?: any;
}

export const Form: React.FC<Props> = (props: Props) => {
  const user = useSelector((state) => getUser(state));
  const accessToken = useSelector((state) => getAccessToken(state) as string);

  function filter(input: string, option: any) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={userSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log('values :', JSON.stringify(values));

        const serve = new OpenSRPService(
          accessToken,
          'https://opensrp-stage.smartregister.org/opensrp/rest/',
          'location-tag'
        );

        const payload: LocationUnitPayloadPOST = {
          properties: {
            username: user.username,
            version: 0,
            externalId: values.externalId,
            OpenMRS_Id: props.id,
            parentId: values.parentId,
            name: values.name,
            status: values.status ? LocationUnitStatus.ACTIVE : LocationUnitStatus.INACTIVE,
          },
          syncStatus: LocationUnitSyncStatus.SYNCED,
          type: values.Type,
          locationTags: values.locationTags,
          geometry: values.geometry as Geometry,
        };

        props.id
          ? serve
              .create(payload)
              .then(() => {
                notification.success({ message: 'User created successfully', description: '' });
                setSubmitting(false);
                history.goBack();
              })
              .catch((e: Error) => {
                notification.error({ message: `${e}`, description: '' });
                setSubmitting(false);
              })
          : serve
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
      }}
    >
      {({ values, errors, isSubmitting, handleSubmit }) => {
        console.log('values :', values, ' errors :', errors);

        return (
          <AntForm requiredMark={'optional'} {...layout} onSubmitCapture={handleSubmit}>
            <AntForm.Item label="Parent" name="parentId" required>
              <Select
                name="parentId"
                showSearch
                placeholder="Enter a location group name"
                optionFilterProp="children"
                filterOption={filter}
              >
                {locationtag.map((e) => (
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

            <AntForm.Item name="Type" label="Type" required>
              <Input name="Type" placeholder="Select type" />
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
                {locationtag.map((e) => (
                  <Select.Option key={e.value} value={e.value}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select>
            </AntForm.Item>

            <FieldArray
              name="textEntry"
              render={(arrayHelpers) => (
                <>
                  {values.textEntry &&
                    values.textEntry.length > 0 &&
                    values.textEntry.map((field, index) => {
                      const key = `textEntry.${index}`;
                      return (
                        <AntForm.Item
                          name={key}
                          {...(index === 0
                            ? { labelCol: { span: 8 }, wrapperCol: { span: 16 } }
                            : { wrapperCol: { offset: 8, span: 16 } })}
                          label={index === 0 ? 'Text entry' : ''}
                          key={key}
                        >
                          <AntForm.Item {...field} noStyle>
                            <Input name={key} placeholder="Enter text" style={{ width: '69%' }} />
                          </AntForm.Item>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => arrayHelpers.remove(index)}
                          />
                        </AntForm.Item>
                      );
                    })}

                  <AntForm.Item name="textEntryButton" {...offsetLayout}>
                    <Button
                      type="dashed"
                      onClick={() => arrayHelpers.push('')}
                      style={{ width: '100%' }}
                      icon={<PlusOutlined />}
                    >
                      Add Text Entry field
                    </Button>
                  </AntForm.Item>
                </>
              )}
            />
            <AntForm.Item name="buttons" {...offsetLayout}>
              <SubmitButton>{isSubmitting ? 'Saving' : 'Save'}</SubmitButton>
              <ResetButton onClick={() => history.goBack()}>Cancel</ResetButton>
            </AntForm.Item>
          </AntForm>
        );
      }}
    </Formik>
  );
};

export default Form;
