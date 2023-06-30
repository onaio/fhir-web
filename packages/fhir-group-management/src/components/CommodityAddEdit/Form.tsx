import React from 'react';
import { Select, Button, Form, Radio, Input, Space } from 'antd';
import {
  active,
  name,
  id,
  identifier,
  type,
  unitOfMeasure,
  groupResourceType,
} from '../../constants';
import {
  sendSuccessNotification,
  sendErrorNotification,
  sendInfoNotification,
} from '@opensrp/notifications';
import { useQueryClient, useMutation } from 'react-query';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';
import { useHistory } from 'react-router';
import {
  generateGroupPayload,
  getGroupTypeOptions,
  getUnitOfMeasureOptions,
  GroupFormFields,
  groupSelectfilterFunction,
  postPutGroup,
  SelectOption,
  validationRulesFactory,
} from './utils';
import { SelectProps } from 'antd/lib/select';
import { useTranslation } from '../../mls';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';

const { Item: FormItem } = Form;

export interface GroupFormProps {
  fhirBaseUrl: string;
  initialValues: GroupFormFields;
  disabled: string[];
  cancelUrl?: string;
  successUrl?: string;
  postSuccess?: (commodity: IGroup, edited: boolean) => Promise<unknown>;
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};

const CommodityForm = (props: GroupFormProps) => {
  const { fhirBaseUrl, initialValues, disabled, cancelUrl, successUrl, postSuccess } = props;

  const queryClient = useQueryClient();
  const history = useHistory();
  const { t } = useTranslation();
  const goTo = (url = '#') => history.push(url);

  const { mutate, isLoading } = useMutation(
    (values: GroupFormFields) => {
      const payload = generateGroupPayload(values, initialValues);
      return postPutGroup(fhirBaseUrl, payload);
    },
    {
      onError: (err: Error) => {
        sendErrorNotification(err.message);
      },
      onSuccess: async (createdGroup) => {
        sendSuccessNotification(t('Commodity updated successfully'));
        const isEdit = !!initialValues.id;
        await postSuccess?.(createdGroup, isEdit).catch((err) => {
          sendErrorNotification(err.message);
        });
        queryClient.refetchQueries([groupResourceType]).catch(() => {
          sendInfoNotification(t('Failed to refresh data, please refresh the page'));
        });
        goTo(successUrl);
      },
    }
  );

  const statusOptions = [
    { label: t('Active'), value: true },
    { label: t('Disabled'), value: false },
  ];

  const unitsOfMEasureOptions = getUnitOfMeasureOptions();
  const typeOptions = getGroupTypeOptions();

  const validationRules = validationRulesFactory(t);

  return (
    <Form
      requiredMark={false}
      {...formItemLayout}
      onFinish={(values: GroupFormFields) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      <FormItem hidden={true} id="id" name={id} label={t('Commodity Id')}>
        <Input placeholder={t('(Auto generated)')} disabled={true} />
      </FormItem>

      <FormItem hidden={true} id="identifier" name={identifier} label={t('Identifier')}>
        <Input placeholder={t('(Auto generated)')} disabled={true} />
      </FormItem>

      <FormItem
        id={name}
        name={name}
        rules={validationRules[name]}
        label={t('Enter Commodity name')}
      >
        <Input disabled={disabled.includes(name)} placeholder={t('Name')} />
      </FormItem>

      <FormItem
        id={active}
        rules={validationRules[active]}
        name={active}
        label={t('Select Commodity status')}
      >
        <Radio.Group disabled={disabled.includes(active)} options={statusOptions}></Radio.Group>
      </FormItem>

      <FormItem
        id={type}
        name={type}
        rules={validationRules[type]}
        label={t('Select Commodity Type')}
      >
        <Select
          disabled={disabled.includes(type)}
          placeholder={t('Select Commodity type')}
          options={typeOptions}
          showSearch={true}
          filterOption={groupSelectfilterFunction as SelectProps<SelectOption[]>['filterOption']}
        ></Select>
      </FormItem>

      <FormItem
        id={unitOfMeasure}
        name={unitOfMeasure}
        rules={validationRules[unitOfMeasure]}
        label={t('Select the unit of measure')}
      >
        <Select
          disabled={disabled.includes(unitOfMeasure)}
          placeholder={t('Select the unit of measure')}
          options={unitsOfMEasureOptions}
          showSearch={true}
          filterOption={groupSelectfilterFunction as SelectProps<SelectOption[]>['filterOption']}
        ></Select>
      </FormItem>

      <FormItem {...tailLayout}>
        <Space>
          <Button type="primary" id="submit-button" disabled={isLoading} htmlType="submit">
            {isLoading ? t('Saving') : t('save')}
          </Button>
          <Button
            id="cancel-button"
            onClick={() => {
              goTo(cancelUrl);
            }}
          >
            {t('Cancel')}
          </Button>
        </Space>
      </FormItem>
    </Form>
  );
};

CommodityForm.defaultProps = defaultProps;

export { CommodityForm };
