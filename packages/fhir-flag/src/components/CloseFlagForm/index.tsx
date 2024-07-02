import React from 'react';
import { Select, Button, Form, Input, Col, Row } from 'antd';
import { BodyLayout } from '@opensrp/react-utils';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';
import { CloseFlagFormFields } from '../Utils/utils';
import { useMutation } from 'react-query';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';

const { Item: FormItem } = Form;
const { TextArea } = Input;

export interface CloseFlagFormProps {
  fhirBaseUrl: string;
  initialValues: CloseFlagFormFields;
  activeFlag?: any;
  mutationEffect: (
    initialValues: CloseFlagFormFields,
    values: CloseFlagFormFields,
    activeFlag: any
  ) => Promise<IGroup>;
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};

const headerProps = {
  pageHeaderProps: {
    title: 'Close Flag',
    onBack: undefined,
  },
};

const CloseFlagForm = (props: CloseFlagFormProps): any => {
  const { initialValues, activeFlag, mutationEffect } = props;

  const { mutate, isLoading } = useMutation(
    (values: CloseFlagFormFields) => {
      return mutationEffect(initialValues, values, activeFlag);
    },
    {
      onError: (err: Error) => {
        sendErrorNotification(err.message);
      },
      onSuccess: async (mutationEffectResponse) => {
        sendSuccessNotification('Flag Closed successfully');

        // queryClient.refetchQueries([groupResourceType]).catch(() => {
        //   sendInfoNotification(t('Failed to refresh data, please refresh the page'));
        // });
        // goTo(successUrl);
      },
    }
  );

  return (
    <BodyLayout headerProps={headerProps}>
      <Row className="user-group">
        <Col className="bg-white p-3" span={24}>
          <Form
            {...formItemLayout}
            initialValues={initialValues}
            onFinish={(values: CloseFlagFormFields) => {
              mutate(values);
            }}
          >
            <FormItem
              name="locationName"
              id="locationName"
              label="Service Point"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </FormItem>

            <FormItem name="productName" id="productName" label="Product">
              <Input disabled />
            </FormItem>

            <FormItem id="status" label="Status" name="status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            </FormItem>

            <FormItem id="comments" label="Comments" name="comments" rules={[{ required: true }]}>
              <TextArea />
            </FormItem>

            <FormItem {...tailLayout}>
              <Button type="primary" id="submit-button" htmlType="submit">
                Save
              </Button>
              <Button id="cancel-button">Cancel</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </BodyLayout>
  );
};

CloseFlagForm.defaultProps = defaultProps;

export { CloseFlagForm };
