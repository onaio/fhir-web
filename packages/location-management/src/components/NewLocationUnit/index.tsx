import { getUser } from '@onaio/session-reducer';
import { OpenSRPService } from '@opensrp/react-utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { FormInstances, getLocationFormFields, LocationFormFields } from '../LocationForm/utils';
import { Col, Row } from 'antd';
import { Helmet } from 'react-helmet';
import { ADD_LOCATION_UNIT } from '../../lang';

/** full props for the new location component */
export interface NewLocationUnitProps
  extends Pick<LocationFormProps, 'hidden' | 'disabled' | 'service' | 'disabledTreeNodesCallback'>,
    RouteComponentProps {
  openSRPBaseURL: string;
  instance: FormInstances;
  processInitialValues?: (formFields: LocationFormFields) => LocationFormFields;
  successURL: string;
  cancelURL: string;
}

const defaultNewLocationUnitProps = {
  redirectAfterAction: '',
  openSRPBaseURL: OPENSRP_API_BASE_URL,
  instance: FormInstances.CORE,
  hidden: [],
  disabled: [],
  service: OpenSRPService,
  successURL: '',
  cancelURL: '',
};

/** renders page where user can create new location unit
 *
 * @param props - this components props
 */
const NewLocationUnit = (props: NewLocationUnitProps) => {
  const {
    instance,
    hidden,
    disabled,
    service,
    openSRPBaseURL,
    successURL,
    cancelURL,
    processInitialValues,
    disabledTreeNodesCallback,
  } = props;
  const history = useHistory();
  const cancelHandler = () => history.push(cancelURL);
  const user = useSelector((state) => getUser(state));

  const firstInitialValues = getLocationFormFields(undefined, instance);
  const initialValues = processInitialValues?.(firstInitialValues);

  const locationFormProps = {
    initialValues,
    redirectAfterAction: successURL,
    hidden,
    disabled,
    onCancel: cancelHandler,
    service,
    openSRPBaseURL,
    username: user.username,
    disabledTreeNodesCallback,
  };

  const pageTitle = ADD_LOCATION_UNIT;
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
