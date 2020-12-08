import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 } from 'uuid';
import { API_BASE_URL, TEAMS_POST, PRACTITIONER_POST } from '../../constants';
import { OpenSRPService } from '@opensrp/server-service';
import {
  sendSuccessNotification,
  sendInfoNotification,
  sendErrorNotification,
} from '@opensrp/notifications';
import { OrganizationPOST } from '../../ducks/organizations';
import { Practitioner, PractitionerPOST } from '../../ducks/practitioners';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };
const layoutFull = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const offsetLayoutFull = { wrapperCol: { offset: 8, span: 16 } };

export interface FormField {
  name: string;
  active: boolean;
  practitioners: string[];
}

interface Props {
  id?: string;
  practitioner: Practitioner[];
  initialValue?: FormField | null;
  accessToken: string;
}

/**
 * Handle form submission
 *
 * @param {string} accessToken Token for api calles
 * @param {Object} values the form fields
 * @param {Practitioner} practitioner list of practitioner to filter the selected one from
 * @param {Function} setIsSubmitting function to set IsSubmitting loading process
 */
export async function onSubmit(
  accessToken: string,
  values: FormField,
  practitioner: Practitioner[],
  setIsSubmitting?: (value: boolean) => void
) {
  if (setIsSubmitting) setIsSubmitting(true);
  const Teamid = v4();

  const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAMS_POST);
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

  await serve
    .create(payload)
    .then(async () => {
      sendSuccessNotification('Successfully Added Teams');
      sendInfoNotification('Assigning Practitioners');

      const serve = new OpenSRPService(accessToken, API_BASE_URL, PRACTITIONER_POST);

      const selectedPractitioner = practitioner.filter((e) =>
        values.practitioners.includes(e.identifier)
      );

      const payload: PractitionerPOST[] = selectedPractitioner.map((prac) => {
        return {
          active: prac.active,
          identifier: v4(),
          practitioner: prac.identifier,
          organization: Teamid,
          code: { text: 'Community Health Worker' },
        };
      });

      return await serve.create(payload).then(() => {
        sendSuccessNotification('Successfully Assigning Practitioners');
        history.goBack();
      });
    })
    .catch(() => sendErrorNotification('An error occurred'));

  if (setIsSubmitting) setIsSubmitting(false);
}

export const Form: React.FC<Props> = (props: Props) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initialValue = props.initialValue
    ? props.initialValue
    : { active: true, name: '', practitioners: [''] };

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values) =>
        onSubmit(props.accessToken, values, props.practitioner, setIsSubmitting)
      }
      initialValues={initialValue}
    >
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
                className="practitioners_Field"
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
                        fields.length > 0
                          ? "Please input user's name or delete this field."
                          : "Please input user's name",
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
                  <Button
                    className="removePractitioner"
                    type="default"
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined className="dynamic-delete-button" />}
                  />
                ) : null}
              </AntdForm.Item>
            ))}
            <AntdForm.Item {...offsetLayout}>
              <Button
                id="addPractitioner"
                type="dashed"
                onClick={() => add()}
                className="w-100"
                icon={<PlusOutlined />}
              >
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
