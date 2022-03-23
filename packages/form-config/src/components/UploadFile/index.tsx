import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Button, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import { uploadValidationSchema, defaultInitialValues, InitialValuesTypes } from './helpers';
import { Redirect } from 'react-router';
import { FormConfigProps } from '../../helpers/types';
import { Store } from 'redux';
import { connect } from 'react-redux';
import {
  filesReducer,
  ManifestFilesTypes,
  getManifestFilesById,
  filesReducerName,
  submitUploadForm,
} from '@opensrp/form-config-core';
import { Dictionary } from '@onaio/utils';
import { GetAccessTokenType } from '@opensrp/server-service';
import reducerRegistry from '@onaio/redux-reducer-registry';
import lang from '../../lang';

/** register the reducers */
reducerRegistry.register(filesReducerName, filesReducer);

/** default props interface */
export interface UploadDefaultProps {
  fileNameLabel: string;
  fileUploadLabel: string;
  formData: ManifestFilesTypes | null;
  formInitialValues: InitialValuesTypes;
  formNameRequiredLable: string;
  formRequiredLabel: string;
  moduleLabel: string;
  relatedToLabel: string;
  accessToken: string | GetAccessTokenType;
}

/** UploadConfigFile interface */
export interface UploadConfigFileProps extends FormConfigProps {
  draftFilesUrl: string;
  formId: string | null;
  isJsonValidator: boolean;
  validatorsUrl: string;
}

const UploadConfigFile = (props: UploadConfigFileProps & UploadDefaultProps) => {
  const {
    isJsonValidator,
    formId,
    draftFilesUrl,
    formInitialValues,
    endpoint,
    baseURL,
    customAlert,
    validatorsUrl,
    fileNameLabel,
    moduleLabel,
    fileUploadLabel,
    relatedToLabel,
    formNameRequiredLable,
    formRequiredLabel,
    accessToken,
  } = props;

  const [ifDoneHere, setIfDoneHere] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const redirectUrl = isJsonValidator ? validatorsUrl : draftFilesUrl;

  useEffect(() => {
    if (formId) {
      setIsEditMode(true);
    }
  }, [formId]);

  const displayAlertError = (err: string): void => {
    if (customAlert) {
      customAlert(err, { type: 'error' });
    }
  };

  if (ifDoneHere) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={uploadValidationSchema}
      // tslint:disable-next-line: jsx-no-lambda
      onSubmit={(values, { setSubmitting }) => {
        submitUploadForm(
          values,
          accessToken,
          baseURL,
          isJsonValidator,
          setSubmitting,
          setIfDoneHere,
          displayAlertError,
          endpoint
        ).catch(() => {
          displayAlertError(lang.ERROR_OCCURRED);
        });
      }}
    >
      {({ values, setFieldValue, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
        <Form onSubmit={handleSubmit} data-enctype="multipart/form-data">
          <Row>
            <Col md={6}>
              <FormGroup>
                <div>
                  <Label for="form_name">{fileNameLabel} *</Label>
                </div>
                <Input
                  type="text"
                  name="form_name"
                  disabled={isEditMode}
                  value={values.form_name}
                  onChange={handleChange}
                />
                {errors.form_name && touched.form_name && (
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  <small className="form-text text-danger jurisdictions-error">
                    {formNameRequiredLable}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <div>
                  <Label for="module">{moduleLabel}</Label>
                </div>
                <Input
                  type="text"
                  name="module"
                  disabled={isEditMode}
                  value={values.module}
                  onChange={handleChange}
                />
                {errors.module && touched.module && (
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  <small className="form-text text-danger jurisdictions-error">
                    {errors.module}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <div>
                  <Label for="form_relation">{relatedToLabel}</Label>
                </div>
                <Input
                  type="text"
                  name="form_relation"
                  disabled={isEditMode}
                  value={values.form_relation}
                  onChange={handleChange}
                />
                {errors.form_relation && touched.form_relation && (
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  <small className="form-text text-danger jurisdictions-error">
                    {errors.form_relation}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={6}></Col>
          </Row>
          <FormGroup>
            <Label for="upload-file">{fileUploadLabel} *</Label>
            <Input
              type="file"
              name="form"
              // tslint:disable-next-line: jsx-no-lambda
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.files) {
                  setFieldValue('form', event.target.files[0]);
                }
              }}
            />
            {errors.form && touched.form && (
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              <small className="form-text text-danger jurisdictions-error">
                {formRequiredLabel}
              </small>
            )}
          </FormGroup>
          <div>
            <Button
              type="submit"
              id="exportform-submit-button"
              className="btn btn-md btn btn-primary float-right"
              color="primary"
              disabled={isSubmitting}
            >
              {fileUploadLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

/**default props */
const defaultProps: UploadDefaultProps = {
  fileNameLabel: lang.FILE_NAME,
  fileUploadLabel: lang.UPLOAD_FILE,
  formData: null,
  formInitialValues: defaultInitialValues,
  formNameRequiredLable: lang.ERROR_FORM_NAME_REQUIRED,
  formRequiredLabel: lang.ERROR_FORM_REQUIRED,
  moduleLabel: lang.MODULE,
  relatedToLabel: lang.RELATED_TO,
  accessToken: '',
};

UploadConfigFile.defaultProps = defaultProps;

/** ownprops interface */
interface OwnProps extends UploadConfigFileProps, UploadDefaultProps {}

/**
 * Map props to state
 *
 * @param {Store} state - the  redux store
 * @param {Dictionary} ownProps - props passed to component
 * @returns {Dictionary} - dispatched props
 */
const mapStateToProps = (state: Partial<Store>, ownProps: OwnProps): UploadDefaultProps => {
  const formId = ownProps.formId;
  let formInitialValues: InitialValuesTypes = defaultInitialValues;
  let formData: ManifestFilesTypes | null = null;
  if (formId) {
    formData = getManifestFilesById(state, formId);
  }
  if (formId && formData) {
    /* eslint-disable @typescript-eslint/naming-convention */
    formInitialValues = {
      form: null,
      form_name: formData.label,
      form_relation: formData.form_relation,
      module: formData.module,
    };
  }
  return {
    ...defaultProps,
    ...ownProps,
    formData,
    formInitialValues,
  };
};

/** map dispatch to props */
const mapDispatchToProps = {};

/** Connected UploadConfigFile component */
const ConnectedUploadConfigFile = connect(mapStateToProps, mapDispatchToProps)(UploadConfigFile);

export { UploadConfigFile, ConnectedUploadConfigFile };
