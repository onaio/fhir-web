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
  photoURL,
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
  groupSelectfilterFunction,
  postPutGroup,
  SelectOption,
  validationRulesFactory,
} from '../CommodityAddEdit/utils';
import { SelectProps } from 'antd/lib/select';
import { useTranslation } from '../../mls';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { PlusOutlined } from '@ant-design/icons';
import { GroupFormFields } from './types';
import { normalizeFileInputEvent } from './utils';

const { Item: FormItem } = Form;

export interface GroupFormProps {
  fhirBaseUrl: string;
  initialValues: GroupFormFields;
  disabled: string[];
  cancelUrl?: string;
  successUrl?: string;
  postSuccess?: (commodity: IGroup, edited: boolean) => Promise<unknown>;
  validationsFactory: any
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};




/**
 * 
 * Use project code to define how the commodity view works.
 * AddEditBehavior:
 *  - have form with everything, ingest a list of hide-able form fields
 *  - create different views for different projects, include one single export view that conditionally exposes the right component.
 * List view
 *  - same:
 *    create default view let it be as it is, 
 *    create another eusm view
 *    Add a wrapper that shows the correct container conditionally with respect to project code.
 */

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


  /** options for the isAttractive form field radio buttons */
  const attractiveOptions = [
    { label: t('yes'), value: true },
    { label: t('no'), value: false },
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
        id={materialNumber}
        name={materialNumber}
        label={t('Material number')}
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

      <FormItem
        id={isAttractiveItem}
        name={isAttractiveItem}
        label={t('Attractive item?')}
        rules={validationRules[isAttractiveItem]}
      >
        <Radio.Group disabled={disabled.includes(isAttractiveItem)} options={attractiveOptions} />
      </FormItem>

      <FormItem
        id={availability}
        name={availability}
        label={t('Is it there?')}
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
        label={t('Is it in good condition?')}
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
        label={t('Is it being used appropriately?')}
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
        label={t('Accountability period (in months)')}
        rules={validationRules[accountabilityPeriod]}
      >
        <InputNumber disabled={disabled.includes(accountabilityPeriod)} min={0} />
      </FormItem>

      <Form.Item id={photoURL}
        name={photoURL}
        label={t('Photo of the product (optional)')} valuePropName="fileList" getValueFromEvent={normalizeFileInputEvent}>
          <Upload beforeUpload={() => false}
          accept="image/*"
          multiple={false}
          name="photoURL"
          listType="picture-card"
          showUploadList={false}
          >
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
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
};

CommodityForm.defaultProps = defaultProps;

export { CommodityForm };
