import React, { useState } from 'react';
import { Form, SubmitButton, FormItem, Radio, Input, InputNumber } from 'formik-antd';
import { Formik } from 'formik';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Space, Button } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { postProduct, putProduct } from '../..//helpers/dataLoaders';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import * as Yup from 'yup';
import { CATALOGUE_LIST_VIEW_URL } from '../../constants';
import { Redirect, useHistory } from 'react-router';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import {
  ACCOUNTABILITY_PERIOD,
  ATTRACTIVE_ITEM_LABEL,
  AVAILABILITY_LABEL,
  AVAILABILITY_PLACEHOLDER,
  CANCEL,
  CONDITION_LABEL,
  CONDITION_PLACEHOLDER,
  DESCRIBE_THE_PRODUCTS_USE,
  ENTER_PRODUCTS_NAME,
  MATERIAL_NUMBER,
  MATERIAL_NUMBER_PLACEHOLDER,
  NO,
  PHOTO_OF_THE_PRODUCT,
  PRODUCT_NAME,
  REQUIRED,
  SUBMIT,
  SUCCESSFULLY_ADDED,
  SUCCESSFULLY_UPDATED,
  USED_APPROPRIATELY,
  YES,
} from '../../lang';

/** type describing the fields in the product catalogue form */
export interface ProductFormFields {
  uniqueId?: number;
  productName: string;
  materialNumber: string;
  isAttractiveItem?: boolean;
  condition: string;
  appropriateUsage: string;
  accountabilityPeriod?: number;
  availability: string;
  photoURL: string | File;
}

export const defaultInitialValues: ProductFormFields = {
  uniqueId: undefined,
  productName: '',
  materialNumber: '',
  isAttractiveItem: undefined,
  condition: '',
  appropriateUsage: '',
  accountabilityPeriod: undefined,
  availability: '',
  photoURL: '',
};

/** props for the product Catalogue form */
interface ProductFormProps extends CommonProps {
  initialValues: ProductFormFields;
  redirectAfterAction: string;
}

const defaultProps = {
  ...defaultCommonProps,
  initialValues: defaultInitialValues,
  redirectAfterAction: CATALOGUE_LIST_VIEW_URL,
};

/** yup validation schema for productForm fields */
const ProductFormValidationSchema = Yup.object().shape({
  uniqueId: Yup.number(),
  productName: Yup.string().required(REQUIRED),
  materialNumber: Yup.string().required(REQUIRED),
  isAttractiveItem: Yup.boolean().required(REQUIRED),
  condition: Yup.string(),
  appropriateUsage: Yup.string(),
  accountabilityPeriod: Yup.number().required(REQUIRED),
  availability: Yup.string().required(REQUIRED),
  photoURL: Yup.mixed(),
});

/** responsive layout for the form labels and columns */
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 24,
    },
    lg: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 20,
    },
    lg: {
      span: 16,
    },
  },
};

const tailLayout = {
  wrapperCol: {
    xs: { offset: 0, span: 16 },
    sm: { offset: 12, span: 24 },
    md: { offset: 8, span: 16 },
    lg: { offset: 6, span: 14 },
  },
};

/** form component to add/edit products in the catalogue */

const ProductForm = (props: ProductFormProps) => {
  const { initialValues, redirectAfterAction, baseURL } = props;
  const isEditMode = !!initialValues.uniqueId;
  const defaultImageUrl = isEditMode ? props.initialValues.photoURL : '';
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer>(defaultImageUrl as string);
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const history = useHistory();

  /** options for the isAttractive form field radio buttons */
  const attractiveOptions = [
    { label: YES, value: true },
    { label: NO, value: false },
  ];

  /** component used by antd Upload, to upload the product photo */
  const uploadButton = (
    <div className="upload-button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  /** returns a string that we can use as the source of the staged image
   * once one is uploaded but before getting submitted.
   *
   * @param {UploadFile} file - the uploaded File
   */
  const readURL = (file: UploadFile): void => {
    if (file.originFileObj) {
      const reader = new FileReader();

      reader.addEventListener('load', function (event) {
        if (event?.target?.result) {
          setImageUrl(event.target.result);
        }
      });

      // convert to base64 string
      reader.readAsDataURL(file.originFileObj);
    }
    return;
  };

  /** change handler for Upload component
   *
   * @param {UploadChangeParam} info - info object containing File, and fileList
   * @param {Function} setFieldValue - the callback that updates formik state
   * for the photoURL field
   */
  const handleChange: (info: UploadChangeParam, setFieldValue: Function) => void = (
    info,
    setFieldValue
  ) => {
    const { file } = info;
    readURL(file);
    setFieldValue('photoURL', file.originFileObj);
  };

  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere) {
    return <Redirect to={redirectAfterAction} />;
  }

  return (
    <div className="product-form form-container">
      <Formik
        initialValues={initialValues}
        validationSchema={ProductFormValidationSchema}
        onSubmit={(values, actions) => {
          const payload = { ...values };
          if (isEditMode) {
            putProduct(baseURL, payload)
              .then(() => {
                sendSuccessNotification(SUCCESSFULLY_UPDATED);
                // the reason this is not in a finally block, it should be called before setAreWeDoneHere
                // to avoid updating an unmounted component.
                actions.setSubmitting(false);
                setAreWeDoneHere(true);
              })
              .catch((err: Error) => {
                sendErrorNotification(err.name, err.message);
                actions.setSubmitting(false);
              });
          } else {
            postProduct(baseURL, payload)
              .then(() => {
                sendSuccessNotification(SUCCESSFULLY_ADDED);
                actions.setSubmitting(false);
                setAreWeDoneHere(true);
              })
              .catch((err: Error) => {
                sendErrorNotification(err.name, err.message);
                actions.setSubmitting(false);
              });
          }
        }}
      >
        {({ setFieldValue }) => {
          return (
            <>
              <Form {...formItemLayout} colon={true} requiredMark={false}>
                <Form.Item id="productName" name="productName" label={PRODUCT_NAME} required={true}>
                  <Input name="productName" placeholder={ENTER_PRODUCTS_NAME} />
                </Form.Item>

                <Form.Item id="uniqueId" name="uniqueId" hidden={true} required={true}>
                  <Input type="hidden" name="uniqueId" id="uniqueId" readOnly={true} />
                </Form.Item>

                <FormItem
                  id="materialNumber"
                  name="materialNumber"
                  label={MATERIAL_NUMBER}
                  required={true}
                >
                  <Input name="materialNumber" placeholder={MATERIAL_NUMBER_PLACEHOLDER} />
                </FormItem>

                <FormItem
                  id="isAttractiveItem"
                  name="isAttractiveItem"
                  label={ATTRACTIVE_ITEM_LABEL}
                  required={true}
                >
                  <Radio.Group name="isAttractiveItem" options={attractiveOptions} />
                </FormItem>

                <FormItem
                  id="availability"
                  name="availability"
                  label={AVAILABILITY_LABEL}
                  required={true}
                >
                  <Input.TextArea
                    rows={4}
                    name="availability"
                    placeholder={AVAILABILITY_PLACEHOLDER}
                  />
                </FormItem>
                <FormItem id="condition" name="condition" label={CONDITION_LABEL}>
                  <Input.TextArea rows={4} name="condition" placeholder={CONDITION_PLACEHOLDER} />
                </FormItem>
                <FormItem id="appropriateUsage" name="appropriateUsage" label={USED_APPROPRIATELY}>
                  <Input.TextArea
                    rows={4}
                    name="appropriateUsage"
                    placeholder={DESCRIBE_THE_PRODUCTS_USE}
                  />
                </FormItem>
                <FormItem
                  id="accountabilityPeriod"
                  name="accountabilityPeriod"
                  label={ACCOUNTABILITY_PERIOD}
                  required={true}
                >
                  <InputNumber name="accountabilityPeriod" min={0} />
                </FormItem>

                <FormItem id="photoURL" name="photoURL" label={PHOTO_OF_THE_PRODUCT}>
                  <Upload
                    customRequest={async () => {
                      return;
                    }}
                    accept="image/*"
                    multiple={false}
                    name="photoURL"
                    listType="picture-card"
                    onChange={(info) => handleChange(info, setFieldValue)}
                    showUploadList={false}
                  >
                    {imageUrl ? (
                      <img src={imageUrl as string} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </FormItem>

                <FormItem {...tailLayout} name="submitCancel">
                  <Space>
                    <SubmitButton id="submit">{SUBMIT}</SubmitButton>

                    <Button
                      id="cancel"
                      onClick={() => {
                        history.push(CATALOGUE_LIST_VIEW_URL);
                      }}
                    >
                      {CANCEL}
                    </Button>
                  </Space>
                </FormItem>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

ProductForm.defaultProps = defaultProps;

export { ProductForm };
