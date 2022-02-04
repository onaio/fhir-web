import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { defaultFormField } from '../LocationForm/utils';
import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet';
import lang from '../../lang';

/** full props for the new location component */
export interface NewLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successURLGenerator'
    >,
    RouteComponentProps {
  fhirBaseURL: string;
  fhirRootLocationIdentifier: string;
  cancelURLGenerator: () => string;
}

const defaultNewLocationUnitProps = {
  hidden: [],
  disabled: [],
  fhirRootLocationIdentifier: '',
  successURLGenerator: () => '',
  cancelURLGenerator: () => '',
};

/** renders page where user can create new location unit
 *
 * @param props - this components props
 */
const NewLocationUnit = (props: NewLocationUnitProps) => {
  const {
    hidden,
    disabled,
    fhirBaseURL,
    fhirRootLocationIdentifier,
    successURLGenerator,
    cancelURLGenerator,
    disabledTreeNodesCallback,
  } = props;
  const history = useHistory();
  const cancelHandler = () => {
    const cancelURL = cancelURLGenerator();
    history.push(cancelURL);
  };

  const locationFormProps: LocationFormProps = {
    initialValues: defaultFormField,
    successURLGenerator: successURLGenerator,
    hidden: hidden,
    disabled: disabled,
    onCancel: cancelHandler,
    fhirBaseURL,
    fhirRootLocationIdentifier,
    disabledTreeNodesCallback: disabledTreeNodesCallback,
  };

  const pageTitle = lang.ADD_LOCATION_UNIT;
  return (
    <Row className="layout-content">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <h5 className="mb-4 header-title">{pageTitle}</h5>
      <Col className="bg-white p-4" span={24}>
        <LocationForm {...locationFormProps} />
      </Col>
    </Row>
  );
};

NewLocationUnit.defaultProps = defaultNewLocationUnitProps;

export { NewLocationUnit };
