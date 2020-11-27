import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input, notification } from 'antd';
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
  async function onSubmit(values: FormField) {
    setIsSubmitting(true);
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

    await serve
      .create(payload)
      .then(async () => {
        notification.success({ message: 'Successfully Added Teams', description: '' });
        notification.info({ message: 'Assigning Practitioners', description: '' });

        const serve = new OpenSRPService(props.accessToken, API_BASE_URL, PRACTITIONER_POST);

        const practitioner = props.practitioner.filter((e) =>
          values.practitioners.includes(e.identifier)
        );

        const payload: PractitionerPOST[] = practitioner.map((prac) => {
          return {
            active: prac.active,
            identifier: v4(),
            practitioner: prac.identifier,
            organization: Teamid,
            code: { text: 'Community Health Worker' },
          };
        });

        console.log(payload);

        await serve
          .create(payload)
          .then(() =>
            notification.success({
              message: 'Successfully Assigning Practitioners',
              description: '',
            })
          )
          .catch((e) => notification.error({ message: `${e}`, description: '' }));
      })
      .catch((e) => notification.error({ message: `${e}`, description: '' }));

    setIsSubmitting(false);
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
