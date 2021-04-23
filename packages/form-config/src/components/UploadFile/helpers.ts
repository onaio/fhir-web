import * as Yup from 'yup';

/** form fields interface */
export interface InitialValuesTypes {
  form: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  form_name: string;
  form_relation: string;
  module: string;
}

/** Yup client upload validation schema */
/* eslint-disable @typescript-eslint/camelcase */
export const uploadValidationSchema = Yup.object().shape({
  form: Yup.mixed().required(),
  form_name: Yup.string().required(),
  form_relation: Yup.string(),
  module: Yup.string(),
});

/** */
export const defaultInitialValues: InitialValuesTypes = {
  form: null,
  form_name: '',
  form_relation: '',
  module: '',
};
