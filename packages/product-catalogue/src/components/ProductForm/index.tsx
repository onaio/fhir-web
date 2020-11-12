import React, { useState } from 'react';
import { Form, SubmitButton, FormItem, Radio, Input, InputNumber } from 'formik-antd';
import { Formik } from 'formik';
import { ProductCatalogue } from '../../ducks/productCatalogue';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Space, Button } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { postProduct, putProduct } from '../..//helpers/dataLoaders';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import * as Yup from 'yup';
import { CATALOGUE_LIST_VIEW_URL, HOME_URL } from '../../constants';
import { Redirect, useHistory } from 'react-router';

/** type describing the fields in the product catalogue form */
type ProductFormFields = Omit<ProductCatalogue, 'serverVersion' | 'productPhoto'> & {
  productPhoto: string | File;
};

const defaultInitialValues: Partial<ProductFormFields> = {
  uniqueId: undefined,
  productName: '',
  materialNumber: '',
  isAttractiveItem: undefined,
  condition: '',
  appropriateUsage: '',
  accountabilityPeriod: undefined,
  availability: '',
  productPhoto: '',
};

/** props for the product Catalogue form */
interface ProductFormProps {
  initialValues: ProductFormFields;
  redirectAfterAction: string;
}

const defaultProps = {
  initialValues: defaultInitialValues,
  redirectAfterAction: CATALOGUE_LIST_VIEW_URL,
};

/** yup validation schema for productForm fields */
const ProductFormValidationSchema = Yup.object().shape({
  uniqueId: Yup.number(),
  productName: Yup.string().required('Required'),
  materialNumber: Yup.string().required('Required'),
  isAttractiveItem: Yup.boolean().required('Required'),
  condition: Yup.string(),
  appropriateUsage: Yup.string(),
  accountabilityPeriod: Yup.number().required('Required'),
  availability: Yup.string().required('Required'),
  productPhoto: Yup.mixed(),
});

/** responsive layout for the form labels and columns */
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 5,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
  },
};

/** form component to add/edit products in the catalogue */

const ProductForm = (props: ProductFormProps) => {
  const { initialValues, redirectAfterAction } = props;
  const isEditMode = !!initialValues.uniqueId;
  const defaultImageUrl = (isEditMode ? props.initialValues.productPhoto : '') ?? '';
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer>(defaultImageUrl as string);
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const history = useHistory();

  /** options for the isAttractive form field radio buttons */
  const attractiveOptions = [
    { label: 'yes', value: true },
    { label: 'no', value: false },
  ];

  /** component used by antd Upload, to upload the product photo */
  const uploadButton = (
    <div className="upload-button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  /** returns a string that we can use at the source of the staged image
   * once one is uploaded.
   *
   * @param {UploadFile} file - the uploaded File
   */
  const readURL = (file: UploadFile): void => {
    if (file && file.originFileObj) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event?.target?.result) {
          setImageUrl(event.target.result);
        }
      };

      // convert to base64 string
      reader.readAsDataURL(file.originFileObj);
    }
    return;
  };

  /** change handler for Upload component
   *
   * @param {UploadChangeParam} info - info object containing File, and filelist
   * @param {Function} setFieldValue - the callback that updates formik state
   * for the productPhoto field
   */
  const handleChange: (info: UploadChangeParam, setFieldValue: Function) => void = (
    info,
    setFieldValue
  ) => {
    const { file } = info;
    readURL(file);
    setFieldValue('productPhoto', file.originFileObj);
  };

  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere) {
    return <Redirect to={redirectAfterAction} />;
  }

  return (
    <div className="form-container">
      <Formik
        initialValues={initialValues}
        validationSchema={ProductFormValidationSchema}
        onSubmit={(values) => {
          const payload = { ...values };
          if (isEditMode) {
            putProduct(payload)
              .then(() => {
                sendSuccessNotification('Successfully Updated');
                setAreWeDoneHere(true);
              })
              .catch((err: Error) => {
                sendErrorNotification(err.name, err.message);
              });
          } else {
            postProduct(payload)
              .then(() => {
                sendSuccessNotification('Successfully Added');
              })
              .catch((err: Error) => {
                sendErrorNotification(err.name, err.message);
                setAreWeDoneHere(true);
              });
          }
        }}
      >
        {({ setFieldValue }) => {
          return (
            <>
              <Form {...formItemLayout}>
                <Form.Item
                  id="productName"
                  name="productName"
                  label="Product name:"
                  required={true}
                >
                  <Input name="productName" placeholder="Enter the product name" />
                </Form.Item>

                <Form.Item id="uniqueId" name="uniqueId" hidden={true} required={true}>
                  <Input type="hidden" name="uniqueId" id="uniqueId" readOnly={true} />
                </Form.Item>

                <FormItem
                  id="materialNumber"
                  name="materialNumber"
                  label="Material number:"
                  required={true}
                >
                  <Input name="materialNumber" />
                </FormItem>

                <FormItem
                  id="isAttractiveItem"
                  name="isAttractiveItem"
                  label="Attractive item?"
                  required={true}
                >
                  <Radio.Group name="isAttractiveItem" options={attractiveOptions} />
                </FormItem>

                <FormItem
                  id="availability"
                  name="availability"
                  label="Is it there?"
                  required={true}
                >
                  <Input.TextArea name="availability" placeholder="Input.TextArea" />
                </FormItem>
                <FormItem id="condition" name="condition" label="Is it in good condition?">
                  <Input.TextArea name="condition" placeholder="Input.TextArea" />
                </FormItem>
                <FormItem
                  id="appropriateUsage"
                  name="appropriateUsage"
                  label="Is it being used appropriately?"
                >
                  <Input.TextArea name="appropriateUsage" placeholder="Input.TextArea" />
                </FormItem>
                <FormItem
                  id="accountabilityPeriod"
                  name="accountabilityPeriod"
                  label="Accountability period (in months)"
                  required={true}
                >
                  <InputNumber name="accountabilityPeriod" min={0} />
                </FormItem>

                <FormItem id="productPhoto" name="productPhoto" label="Photo of the product">
                  <Upload
                    customRequest={async () => {
                      return;
                    }}
                    accept="image/*"
                    multiple={false}
                    name="productPhoto"
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
                <Space>
                  <SubmitButton id="submit">Submit</SubmitButton>

                  <Button
                    id="cancel"
                    onClick={() => {
                      history.push(HOME_URL);
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
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
