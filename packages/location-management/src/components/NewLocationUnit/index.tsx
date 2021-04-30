import { getUser } from '@onaio/session-reducer';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { FormInstances, getLocationFormFields, LocationFormFields } from '../LocationForm/utils';
import { Col, Row } from 'antd';
import { Helmet } from 'react-helmet';
import lang from '../../lang';
import { fetchAllHierarchies } from '../../ducks/location-hierarchy';

/** full props for the new location component */
export interface NewLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successURLGenerator'
    >,
    RouteComponentProps {
  opensrpBaseURL: string;
  instance: FormInstances;
  processInitialValues?: (formFields: LocationFormFields) => LocationFormFields;
  cancelURLGenerator: () => string;
}

const defaultNewLocationUnitProps = {
  redirectAfterAction: '',
  opensrpBaseURL: OPENSRP_API_BASE_URL,
  instance: FormInstances.CORE,
  hidden: [],
  disabled: [],
  successURLGenerator: () => '',
  cancelURLGenerator: () => '',
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
    opensrpBaseURL,
    successURLGenerator,
    cancelURLGenerator,
    processInitialValues,
    disabledTreeNodesCallback,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const cancelHandler = () => {
    const cancelURL = cancelURLGenerator();
    history.push(cancelURL);
  };
  const user = useSelector((state) => getUser(state));

  const urlquery = new URLSearchParams(history.location.search);

  const firstInitialValues: LocationFormFields = {
    parentId: urlquery.get('parentId') ?? undefined,
    ...getLocationFormFields(undefined, instance),
  };
  const initialValues = processInitialValues
    ? processInitialValues(firstInitialValues)
    : firstInitialValues;

  const locationFormProps: LocationFormProps = {
    initialValues: initialValues,
    successURLGenerator: successURLGenerator,
    hidden: hidden,
    disabled: disabled,
    onCancel: cancelHandler,
    opensrpBaseURL,
    username: user.username,
    afterSubmit: () => dispatch(fetchAllHierarchies([])),
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
