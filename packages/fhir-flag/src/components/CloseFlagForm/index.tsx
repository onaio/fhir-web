import React, { useMemo } from 'react';
import { Select, Button, Form, Input, Col, Row } from 'antd';
import { BodyLayout } from '@opensrp/react-utils';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';
import { CloseFlagFormFields } from '../Utils/utils';
import { useMutation } from 'react-query';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { useTranslation } from '../../mls';
import { useHistory } from 'react-router';

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
  const { t } = useTranslation();
  const history = useHistory();
  const goTo = (url = '#') => history.push(url);

  const stableInitialValues = useMemo(() => initialValues, [initialValues]);

  const { mutate, isLoading } = useMutation(
    (values: CloseFlagFormFields) => {
      return mutationEffect(stableInitialValues, values, activeFlag);
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
        goTo('/');
      },
    }
  );

  const statusOptions = [
    { label: t('Active'), value: 'active' },
    { label: t('Inactive'), value: 'inactive' },
  ];

  const handleFinish = (values: CloseFlagFormFields) => {
    mutate(values);
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Row className="user-group">
        <Col className="bg-white p-3" span={24}>
          <Form {...formItemLayout} initialValues={stableInitialValues} onFinish={handleFinish}>
            <FormItem
              name="locationName"
              id="locationName"
              label="Service Point"
              rules={[{ required: true }]}
            >
              <Input placeholder={t('(Auto generated)')} disabled />
            </FormItem>

            <FormItem name="productName" id="productName" label="Product">
              <Input placeholder={t('(Auto generated)')} disabled />
            </FormItem>

            <FormItem id="status" label="Status" name="status" rules={[{ required: true }]}>
              <Select options={statusOptions} placeholder={t('Select flag status')} />
            </FormItem>

            <FormItem id="comments" label="Comments" name="comments" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder={t('How was the flag resolved?')} />
            </FormItem>

            <FormItem {...tailLayout}>
              <Button type="primary" id="submit-button" htmlType="submit">
                {isLoading ? t('Saving') : t('Save')}
              </Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </BodyLayout>
  );
};

CloseFlagForm.defaultProps = defaultProps;

export { CloseFlagForm };
