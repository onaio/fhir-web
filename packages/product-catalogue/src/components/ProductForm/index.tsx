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
import { useTranslation } from '../../mls';
import type { TFunction } from '@opensrp/i18n';
import { HTTPError } from '@opensrp/server-service';
import { fetchProtectedImage } from '@opensrp/react-utils';

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

/**
 * yup validation schema for productForm fields
 *
 * @param t - the language translator function
 */
const ProductFormValidationSchemaFactory = (t: TFunction) =>
  Yup.object().shape({
    uniqueId: Yup.number(),
    productName: Yup.string().required(t('Required')),
    materialNumber: Yup.string().required(t('Required')),
    isAttractiveItem: Yup.boolean().required(t('Required')),
    condition: Yup.string(),
    appropriateUsage: Yup.string(),
    accountabilityPeriod: Yup.number().required(t('Required')),
    availability: Yup.string().required(t('Required')),
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
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer>('');
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const history = useHistory();
  const { t } = useTranslation();

  const ProductFormValidationSchema = ProductFormValidationSchemaFactory(t);

  /** options for the isAttractive form field radio buttons */
  const attractiveOptions = [
    { label: t('yes'), value: true },
    { label: t('no'), value: false },
  ];

  /** component used by antd Upload, to upload the product photo */
  const uploadButton = (
    <div className="upload-button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t('Upload')}</div>
    </div>
  );

  /**
   * returns a string that we can use as the source of the staged image
   * once one is uploaded but before getting submitted.
   *
   * @param {UploadFile} file - the uploaded File
   */
  const readURL = (file: UploadFile): void => {
    if (file.originFileObj) {
      const reader = new FileReader();

      reader.addEventListener('load', function (event) {
        if (event.target?.result) {
          setImageUrl(event.target.result);
        }
      });

      // convert to base64 string
      reader.readAsDataURL(file.originFileObj);
    }
    return;
  };

  /**
   * change handler for Upload component
   *
   * @param {UploadChangeParam} info - info object containing File, and fileList
   * @param {Function} setFieldValue - the callback that updates formik state
   * for the photoURL field
   */
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  const handleChange: (info: UploadChangeParam<any>, setFieldValue: Function) => void = (
    info,
    setFieldValue
  ) => {
    const { file } = info;
    readURL(file);
    setFieldValue('photoURL', file.originFileObj);
  };

  React.useEffect(() => {
    let objectURL: string | null = null;

    if (isEditMode && initialValues.photoURL) {
      fetchProtectedImage((initialValues.photoURL as string).replace('http', 'https'))
        .then((url: string | null) => {
          if (url) {
            objectURL = url;
            setImageUrl(url);
          }
        })
        .catch((_: HTTPError) => sendErrorNotification(t('Image could not be loaded')));
    }
    return () => {
      if (objectURL) {
        // For optimal performance and memeory usage, release object URL on unmount
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [isEditMode, baseURL, initialValues.photoURL, t]);

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
                sendSuccessNotification(t('Successfully Updated'));
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
                sendSuccessNotification(t('Successfully Added'));
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
                <Form.Item
                  id="productName"
                  className="productName"
                  name="productName"
                  label={t('Product name')}
                  required={true}
                >
                  <Input
                    name="productName"
                    placeholder={t("Enter the product's name e.g Midwifery Kit")}
                  />
                </Form.Item>

                <Form.Item id="uniqueId" name="uniqueId" hidden={true} required={true}>
                  <Input type="hidden" name="uniqueId" id="uniqueId" readOnly={true} />
                </Form.Item>

                <FormItem
                  id="materialNumber"
                  className="materialNumber"
                  name="materialNumber"
                  label={t('Material number')}
                  required={true}
                >
                  <Input
                    name="materialNumber"
                    placeholder={t("Enter the product's material number")}
                  />
                </FormItem>

                <FormItem
                  id="isAttractiveItem"
                  className="isAttractiveItem"
                  name="isAttractiveItem"
                  label={t('Attractive item?')}
                  required={true}
                >
                  <Radio.Group name="isAttractiveItem" options={attractiveOptions} />
                </FormItem>

                <FormItem
                  id="availability"
                  className="availability"
                  name="availability"
                  label={t('Is it there?')}
                  required={true}
                >
                  <Input.TextArea
                    rows={4}
                    name="availability"
                    placeholder={t(
                      'Describe where a supply monitor can locate this product at the service point.'
                    )}
                  />
                </FormItem>
                <FormItem
                  className="condition"
                  id="condition"
                  name="condition"
                  label={t('Is it in good condition? (optional)')}
                >
                  <Input.TextArea
                    rows={4}
                    name="condition"
                    placeholder={t(
                      'Describe how a supply monitor would assess whether the product is in good condition'
                    )}
                  />
                </FormItem>
                <FormItem
                  className="appropriateUsage"
                  id="appropriateUsage"
                  name="appropriateUsage"
                  label={t('Is it being used appropriately? (optional)')}
                >
                  <Input.TextArea
                    rows={4}
                    name="appropriateUsage"
                    placeholder={t("Describe the product's intended use at the service point")}
                  />
                </FormItem>
                <FormItem
                  className="accountabilityPeriod"
                  id="accountabilityPeriod"
                  name="accountabilityPeriod"
                  label={t('Accountability period (in months)')}
                  required={true}
                >
                  <InputNumber name="accountabilityPeriod" min={0} />
                </FormItem>

                <FormItem
                  className="photoURL"
                  id="photoURL"
                  name="photoURL"
                  label={t('Photo of the product (optional)')}
                >
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
                    <SubmitButton id="submit">{t('Submit')}</SubmitButton>

                    <Button
                      id="cancel"
                      onClick={() => {
                        history.push(CATALOGUE_LIST_VIEW_URL);
                      }}
                    >
                      {t('Cancel')}
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
