import React from 'react';
import { Select, Button, Form, Radio, Input, Space, InputNumber, Upload } from 'antd';
import {
  active,
  name,
  id,
  identifier,
  type,
  unitOfMeasure,
  groupResourceType,
  materialNumber,
  isAttractiveItem,
  availability,
  condition,
  appropriateUsage,
  accountabilityPeriod,
  productImage,
} from '../../constants';
import {
  sendSuccessNotification,
  sendErrorNotification,
  sendInfoNotification,
} from '@opensrp/notifications';
import { useQueryClient, useMutation } from 'react-query';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';
import { useHistory } from 'react-router';
import { SelectProps } from 'antd/lib/select';
import { useTranslation } from '../../mls';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { PlusOutlined } from '@ant-design/icons';
import { CommonGroupFormFields, GroupFormFields, ValidationRulesFactory } from './types';
import {
  getGroupTypeOptions,
  getUnitOfMeasureOptions,
  groupSelectfilterFunction,
  normalizeFileInputEvent,
  SelectOption,
} from './utils';
import { useUserRole } from '@opensrp/rbac';

const { Item: FormItem } = Form;

export interface GroupFormProps<
  TCreatedResources = IGroup,
  FormFields extends CommonGroupFormFields = GroupFormFields
> {
  fhirBaseUrl: string;
  initialValues: FormFields;
  disabled: (keyof FormFields)[];
  hidden: (keyof FormFields)[];
  cancelUrl?: string;
  successUrl?: string;
  postSuccess?: (createdResources: TCreatedResources, edited: boolean) => Promise<unknown>;
  validationRulesFactory: ValidationRulesFactory;
  mutationEffect: (initialValues: FormFields, values: FormFields) => Promise<TCreatedResources>;
}

const defaultProps = {
  initialValues: {},
  disabled: [],
  hidden: [],
};

/**
 * @param props - form props
 */
function CommodityForm<
  TCreatedResources,
  FormFields extends CommonGroupFormFields = GroupFormFields
>(props: GroupFormProps<TCreatedResources, FormFields>) {
  const {
    mutationEffect,
    initialValues,
    disabled,
    hidden,
    cancelUrl,
    successUrl,
    postSuccess,
    validationRulesFactory,
  } = props;

  const queryClient = useQueryClient();
  const history = useHistory();
  const { t } = useTranslation();
  const goTo = (url = '#') => history.push(url);

  const userRole = useUserRole();
  if (!userRole.hasPermissions(['Binary.create'])) {
    disabled.push(productImage);
  }

  const { mutate, isLoading } = useMutation(
    (values: FormFields) => {
      return mutationEffect(initialValues, values);
    },
    {
      onError: (err: Error) => {
        sendErrorNotification(err.message);
      },
      onSuccess: async (mutationEffectResponse) => {
        sendSuccessNotification(t('Commodity updated successfully'));
        const isEdit = !!initialValues.id;
        await postSuccess?.(mutationEffectResponse, isEdit).catch((err) => {
          sendErrorNotification(err.message);
        });
        queryClient.invalidateQueries([groupResourceType]).catch(() => {
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

  /** options for the isAttractive form field radio buttons */
  const attractiveOptions = [
    { label: t('Yes'), value: true },
    { label: t('No'), value: false },
  ];

  const unitsOfMeasureOptions = getUnitOfMeasureOptions();
  const typeOptions = getGroupTypeOptions();

  const validationRules = validationRulesFactory(t);

  return (
    <Form
      {...formItemLayout}
      onFinish={(values: FormFields) => {
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
        hidden={hidden.includes(name)}
        name={name}
        rules={validationRules[name]}
        label={t('Enter commodity name')}
      >
        <Input disabled={disabled.includes(name)} placeholder={t('Name')} />
      </FormItem>

      <FormItem
        id={materialNumber}
        name={materialNumber}
        label={t('Material number')}
        hidden={hidden.includes(materialNumber)}
        rules={validationRules[materialNumber]}
      >
        <Input
          disabled={disabled.includes(materialNumber)}
          placeholder={t("Enter the product's material number")}
        />
      </FormItem>

      <FormItem
        id={active}
        rules={validationRules[active]}
        name={active}
        hidden={hidden.includes(active)}
        label={t('Select commodity status')}
      >
        <Radio.Group disabled={disabled.includes(active)} options={statusOptions}></Radio.Group>
      </FormItem>

      <FormItem
        id={type}
        name={type}
        hidden={hidden.includes(type)}
        rules={validationRules[type]}
        label={t('Select commodity Type')}
      >
        <Select
          disabled={disabled.includes(type)}
          placeholder={t('Select commodity type')}
          options={typeOptions}
          showSearch={true}
          filterOption={groupSelectfilterFunction as SelectProps<SelectOption[]>['filterOption']}
        ></Select>
      </FormItem>

      <FormItem
        id={unitOfMeasure}
        name={unitOfMeasure}
        hidden={hidden.includes(unitOfMeasure)}
        rules={validationRules[unitOfMeasure]}
        label={t('Select the unit of measure')}
      >
        <Select
          disabled={disabled.includes(unitOfMeasure)}
          placeholder={t('Select the unit of measure')}
          options={unitsOfMeasureOptions}
          showSearch={true}
          filterOption={groupSelectfilterFunction as SelectProps<SelectOption[]>['filterOption']}
        ></Select>
      </FormItem>

      <FormItem
        id={isAttractiveItem}
        name={isAttractiveItem}
        label={t('Is it an Asset')}
        hidden={hidden.includes(isAttractiveItem)}
        rules={validationRules[isAttractiveItem]}
      >
        <Radio.Group disabled={disabled.includes(isAttractiveItem)} options={attractiveOptions} />
      </FormItem>

      <FormItem
        id={availability}
        name={availability}
        hidden={hidden.includes(availability)}
        label={t('Is it there')}
        rules={validationRules[availability]}
      >
        <Input.TextArea
          rows={4}
          disabled={disabled.includes(availability)}
          placeholder={t(
            'Describe where a supply monitor can locate this product at the service point.'
          )}
        />
      </FormItem>

      <FormItem
        id={condition}
        name={condition}
        hidden={hidden.includes(condition)}
        label={t('Is it in good condition')}
        rules={validationRules[condition]}
      >
        <Input.TextArea
          rows={4}
          disabled={disabled.includes(condition)}
          placeholder={t(
            'Describe how a supply monitor would assess whether the product is in good condition'
          )}
        />
      </FormItem>

      <FormItem
        id={appropriateUsage}
        name={appropriateUsage}
        hidden={hidden.includes(appropriateUsage)}
        label={t('Is it being used appropriately')}
        rules={validationRules[appropriateUsage]}
      >
        <Input.TextArea
          rows={4}
          disabled={disabled.includes(appropriateUsage)}
          placeholder={t("Describe the product's intended use at the service point")}
        />
      </FormItem>

      <FormItem
        id={accountabilityPeriod}
        name={accountabilityPeriod}
        hidden={hidden.includes(accountabilityPeriod)}
        label={t('Accountability period (in months)')}
        rules={validationRules[accountabilityPeriod]}
      >
        <InputNumber disabled={disabled.includes(accountabilityPeriod)} min={0} />
      </FormItem>

      <Form.Item noStyle dependencies={[productImage]}>
        {({ getFieldValue }) => {
          return (
            <Form.Item
              rules={validationRules[productImage]}
              id={productImage}
              hidden={hidden.includes(productImage)}
              name={productImage}
              label={t('Photo of the product')}
              valuePropName="fileList"
              getValueFromEvent={normalizeFileInputEvent}
            >
              <Upload
                id={productImage}
                beforeUpload={() => false}
                accept="image/*"
                multiple={false}
                listType="picture-card"
                maxCount={1}
                disabled={disabled.includes(productImage)}
              >
                {!getFieldValue(productImage)?.length ? (
                  <button
                    data-testid="upload-button"
                    style={{ border: 0, background: 'none' }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                ) : null}
              </Upload>
            </Form.Item>
          );
        }}
      </Form.Item>

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
}

CommodityForm.defaultProps = defaultProps;

export { CommodityForm };
