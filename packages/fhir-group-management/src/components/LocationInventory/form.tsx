import React, { useState } from 'react';
import { Form, Button, Input, DatePicker, Space, Switch } from 'antd';
import {
  PaginatedAsyncSelect,
  formItemLayout,
  tailLayout,
  SelectOption as ProductSelectOption,
  ValueSetAsyncSelect,
} from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { useQueryClient, useMutation } from 'react-query';
import { supplyMgSnomedCode, snomedCodeSystem } from '../../helpers/utils';
import { Rule } from 'rc-field-form/lib/interface';
import {
  sendSuccessNotification,
  sendErrorNotification,
  sendInfoNotification,
} from '@opensrp/notifications';
import {
  product,
  quantity,
  deliveryDate,
  accountabilityEndDate,
  expiryDate,
  unicefSection,
  serialNumber,
  donor,
  PONumber,
  groupResourceType,
  unicefSectionValueSetId,
  id,
  active,
  name,
  type,
  actual,
  unicefDonorValueSetId,
} from '../../constants';
import {
  getLocationInventoryPayload,
  handleDisabledFutureDates,
  handleDisabledPastDates,
  isAttractiveProduct,
  postLocationInventory,
  processProductOptions,
  productAccountabilityMonths,
  validationRulesFactory,
} from './utils';
import { GroupFormFields } from './types';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { useHistory } from 'react-router';
import { Dayjs } from 'dayjs';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { Dictionary } from '@onaio/utils';

const { Item: FormItem } = Form;

export interface LocationInventoryFormProps {
  fhirBaseURL: string;
  initialValues: GroupFormFields;
  listResourceId: string;
  servicePointObj: ILocation;
  cancelUrl?: string;
  successUrl?: string;
  inventoryId?: string;
  inventoryResourceObj?: IGroup;
  commodityListId?: string;
}

const defaultProps = {
  initialValues: {},
};

const getProductQueryFilters = (listId?: string) => {
  const listFilter: Dictionary = {};
  if (listId) {
    listFilter['_has:List:item:_id'] = listId;
  }
  return {
    code: `${snomedCodeSystem}|${supplyMgSnomedCode}`,
    ...listFilter,
  };
};

/**
 * Add location inventory form
 *
 * @param  props - LocationInventoryFormProps component props
 * @returns returns form to add location inventories
 */
const AddLocationInventoryForm = (props: LocationInventoryFormProps) => {
  const {
    fhirBaseURL,
    initialValues,
    inventoryId,
    listResourceId,
    inventoryResourceObj,
    servicePointObj,
    commodityListId,
  } = props;
  const [attractiveProduct, setAttractiveProduct] = useState<boolean>(
    isAttractiveProduct(inventoryResourceObj)
  );
  const [accounterbilityMonths, setAccounterbilityMonths] = useState<number>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const history = useHistory();
  const [form] = Form.useForm();
  const editMode = !!inventoryId;

  const { mutate, isLoading } = useMutation(
    async (values: GroupFormFields) => {
      const payload = getLocationInventoryPayload(values, editMode, inventoryResourceObj);
      return postLocationInventory(fhirBaseURL, payload, editMode, listResourceId, servicePointObj);
    },
    {
      onError: (error: Error) => {
        sendErrorNotification(error.message);
      },
      onSuccess: () => {
        const successMessage = editMode
          ? t('Location inventory updated successfully')
          : t('Location inventory created successfully');
        sendSuccessNotification(successMessage);
        if (editMode) {
          queryClient.invalidateQueries([fhirBaseURL, inventoryId]).catch(() => {
            sendInfoNotification(t('Failed to refresh data, please refresh the page'));
          });
        } else {
          form.resetFields();
        }
      },
    }
  );

  const productChangeHandler = (
    fullOption: ProductSelectOption<IGroup> | ProductSelectOption<IGroup>[]
  ) => {
    const product = Array.isArray(fullOption) ? fullOption[0] : fullOption;
    const endDate = productAccountabilityMonths(product.ref);
    setAttractiveProduct(isAttractiveProduct(product.ref));
    if (endDate) {
      setAccounterbilityMonths(endDate);
    }
  };

  const delveryDateChangeHandler = (selectedDate: Dayjs | null) => {
    if (accounterbilityMonths && selectedDate) {
      const newDate = selectedDate.add(accounterbilityMonths, 'month');
      form.setFieldValue(accountabilityEndDate, newDate);
    }
  };

  const validationRules = validationRulesFactory(t, attractiveProduct);
  const productQueryFilters = getProductQueryFilters(commodityListId);

  return (
    <Form
      form={form}
      requiredMark={false}
      {...formItemLayout}
      onFinish={(values: GroupFormFields) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      <FormItem id={product} name={product} label={t('Product name')}>
        <PaginatedAsyncSelect<IGroup>
          baseUrl={fhirBaseURL}
          resourceType={groupResourceType}
          transformOption={processProductOptions}
          extraQueryParams={productQueryFilters}
          showSearch={true}
          placeholder={t('Select product')}
          getFullOptionOnChange={productChangeHandler}
          disabled={editMode}
        />
      </FormItem>

      <FormItem id={quantity} name={quantity} label={t('Quantity')}>
        <Input min={0} placeholder={t('Quantity')} type="number" />
      </FormItem>

      <FormItem
        id={deliveryDate}
        rules={validationRules[deliveryDate]}
        name={deliveryDate}
        label={t('Delivery date')}
      >
        <DatePicker
          placeholder={t('Delivery date')}
          onChange={delveryDateChangeHandler}
          disabledDate={handleDisabledFutureDates}
        />
      </FormItem>

      <FormItem
        id={accountabilityEndDate}
        name={accountabilityEndDate}
        label={t('Accountability end date')}
        rules={validationRules[accountabilityEndDate]}
      >
        <DatePicker placeholder={t('End date')} disabledDate={handleDisabledPastDates} />
      </FormItem>

      <FormItem hidden id="expiryDate" name={expiryDate} label={t('Expiry date')}>
        <DatePicker placeholder={t('Expiry date')} disabledDate={handleDisabledPastDates} />
      </FormItem>

      <FormItem
        id={unicefSection}
        name={unicefSection}
        label={t('UNICEF section')}
        rules={validationRules[unicefSection]}
      >
        <ValueSetAsyncSelect
          placeholder={t('Select UNICEF section')}
          showSearch={true}
          valueSetId={unicefSectionValueSetId}
          fhirBaseUrl={fhirBaseURL}
        />
      </FormItem>

      <FormItem
        id={serialNumber}
        rules={serialNumebrRule}
        name={serialNumber}
        label={t('Serial number')}
      >
        <Input disabled={!attractiveProduct} type="number" placeholder={t('Serial number')} />
      </FormItem>

      <FormItem id={donor} name={donor} label={t('Donor')}>
        <ValueSetAsyncSelect
          placeholder={t('Select donor')}
          showSearch={true}
          valueSetId={unicefDonorValueSetId}
          fhirBaseUrl={fhirBaseURL}
        />
      </FormItem>

      <FormItem
        id={PONumber}
        rules={validationRules[PONumber]}
        name={PONumber}
        label={t('PO number')}
      >
        <Input type="number" placeholder={t('PO number')} />
      </FormItem>

      {/* start hidden fields */}
      <FormItem hidden={true} id="id" name={id} label={t('product Id')}>
        <Input disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="active" name={active} label={t('Active')}>
        <Switch checked={initialValues.active} disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="actual" name={actual} label={t('Actual')}>
        <Switch checked={initialValues.actual} disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="name" name={name} label={t('Name')}>
        <Input disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="type" name={type} label={t('Type')}>
        <Input disabled={true} />
      </FormItem>
      {/* End hidden fields */}

      <FormItem {...tailLayout}>
        <Space>
          <Button type="primary" id="submit-button" disabled={isLoading} htmlType="submit">
            {isLoading ? t('Saving') : t('save')}
          </Button>
          <Button id="cancel-button" onClick={() => history.goBack()}>
            {t('Cancel')}
          </Button>
        </Space>
      </FormItem>
    </Form>
  );
};

AddLocationInventoryForm.defaultProps = defaultProps;

export { AddLocationInventoryForm };
