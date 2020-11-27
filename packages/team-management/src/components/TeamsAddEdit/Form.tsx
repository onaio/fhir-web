import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 } from 'uuid';
import { API_BASE_URL, ORGANIZATION_POST, PRACTITIONER_POST } from '../../constants';
import { OpenSRPService } from '@opensrp/server-service';
import { OrganizationPOST } from '../../ducks/organizations';
import { Practitioner, PractitionerPOST } from '../../ducks/practitioner';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };
const layoutFull = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const offsetLayoutFull = { wrapperCol: { offset: 8, span: 16 } };

interface FormField {
  name: string;
  active: boolean;
  practitioners: string[];
}

interface Props {
  id?: string;
  practitioner: Practitioner[];
  initialValue?: FormField;
  accessToken: string;
}

export const Form: React.FC<Props> = (props: Props) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue: FormField = props.initialValue
    ? props.initialValue
    : { active: true, name: '', practitioners: [''] };

  /**
   * Handle form submission
   *
   * @param {Object} values the form fields
   * @param {Function} setSubmitting method to set submission status
   */
  function onSubmit(values: FormField) {
    setIsSubmitting(true);
    console.log(values);
    const Teamid = v4();

    const serve = new OpenSRPService(props.accessToken, API_BASE_URL, ORGANIZATION_POST);
    const payload: OrganizationPOST = {
      active: values.active,
      identifier: Teamid,
      name: values.name,
      type: {
        coding: [
          {
            code: 'team',
            display: 'Team',
            system: 'http://terminology.hl7.org/CodeSystem/organization-type',
          },
        ],
      },
    };

    console.log(payload);

    serve
      .create(payload)
      .then((e) => {
        console.log(e);
        const serve = new OpenSRPService(props.accessToken, API_BASE_URL, PRACTITIONER_POST);

        const practitioner = props.practitioner.filter((e) =>
          values.practitioners.includes(e.identifier)
        );

        console.log(practitioner);

        const payload: PractitionerPOST[] = practitioner;
        // values.practitioners.map((practitioner) => {
        //   return {
        //     active: values.active,
        //     code: { text: 'Community Health Worker' },
        //     identifier: v4(),
        //     organization: Teamid,
        //     practitioner: practitioner,
        //   };
        // });

        // console.log(payload);

        serve
          .create(payload)
          .then((e) => {
            console.log(e);
            setIsSubmitting(false);
          })
          .catch((e) => {
            console.log(e);
            setIsSubmitting(false);
          });
      })
      .catch((e) => {
        console.log(e);
        setIsSubmitting(false);
      });

    // team payload
    // {
    //   "id": 3,
    //   "identifier": "1cb25782-89ec-4a35-8609-95729cc1035f",
    //   "active": true,
    //   "name": "Sample test Team 2",
    //   "type": { "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/organization-type", "code": "team", "display": "Team" }] }
    // }

    // Practitioner payload
    // {
    //   "identifier": "24fe334a-4bbf-4698-99b8-1fa1a5a46d35",
    //   "active": true,
    //   "name": "prac two",
    //   "userId": "e09deae4-50fe-40d4-8b5a-6f59683dbdba",
    //   "username": "prac2"
    // }

    // const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);
    // const payload: LocationTagPayloadPOST | LocationTagPayloadPUT = values;
  }

  return (
    <AntdForm requiredMark={false} {...layout} onFinish={onSubmit} initialValues={initialValue}>
      <AntdForm.Item name="name" label="Team Name">
        <Input placeholder="Enter a team name" />
      </AntdForm.Item>

      <AntdForm.Item name="active" label="Status">
        <Radio.Group>
          <Radio value={true}>Active</Radio>
          <Radio value={false}>Inactive</Radio>
        </Radio.Group>
      </AntdForm.Item>

      <AntdForm.List name="practitioners">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <AntdForm.Item
                {...(index === 0 ? layoutFull : offsetLayoutFull)}
                label={index === 0 ? 'Team Members' : ''}
                key={field.key}
                tooltip="This is a required field"
              >
                <AntdForm.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message:
                        index == 0
                          ? "Please input user's name"
                          : "Please input user's name or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Select style={{ width: '69%' }} placeholder="Select user (practitioners only)">
                    {props.practitioner.map((practitioner) => (
                      <Select.Option key={practitioner.identifier} value={practitioner.identifier}>
                        {practitioner.name}
                      </Select.Option>
                    ))}
                  </Select>
                </AntdForm.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </AntdForm.Item>
            ))}
            <AntdForm.Item {...offsetLayout}>
              <Button type="dashed" onClick={() => add()} className="w-100" icon={<PlusOutlined />}>
                Add field
              </Button>
              <AntdForm.ErrorList errors={errors} />
            </AntdForm.Item>
          </>
        )}
      </AntdForm.List>

      <AntdForm.Item {...offsetLayout}>
        <Button id="submit" loading={isSubmitting} type="primary" htmlType="submit">
          {isSubmitting ? 'Saving' : 'Save'}
        </Button>
        <Button id="cancel" onClick={() => history.goBack()} type="dashed">
          Cancel
        </Button>
      </AntdForm.Item>
    </AntdForm>
  );
};

export default Form;
