import React from 'react';
import { RouteComponentProps, useHistory, useLocation, useParams } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { getLocationFormFields } from '../LocationForm/utils';
import { Row, Col, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import lang from '../../lang';
import { BrokenPage, Resource404 } from '@opensrp/react-utils';
import { useGetLocation, useGetLocationHierarchy } from '../../helpers/utils';

export type LocationRouteProps = { id?: string };

/** full props for the new location component */
export interface NewEditLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successURLGenerator'
    >,
    RouteComponentProps<LocationRouteProps> {
  fhirBaseURL: string;
  fhirRootLocationIdentifier: string;
  cancelURLGenerator: () => string;
}

const defaultNewEditLocationUnitProps = {
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
const NewEditLocationUnit = (props: NewEditLocationUnitProps) => {
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
  const location = useLocation();
  const params = useParams<LocationRouteProps>();
  const sParams = new URLSearchParams(location.search);

  const cancelHandler = () => {
    const cancelURL = cancelURLGenerator();
    history.push(cancelURL);
  };

  const { data, error, isLoading } = useGetLocationHierarchy(
    fhirBaseURL,
    fhirRootLocationIdentifier
  );

  // location being edited id
  const locId = params.id;
  const {
    data: locData,
    error: locError,
    isLoading: locIsLoading,
    isIdle: locIsIdle,
  } = useGetLocation(fhirBaseURL, locId);

  const ifNotIdle = (isDoing: boolean) => !locIsIdle && isDoing;

  if (isLoading || ifNotIdle(locIsLoading)) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (error && !data && locError && !locData) {
    return (
      <BrokenPage errorMessage="Unable to load the location or location hierarchy"></BrokenPage>
    );
  }

  if (!data || ifNotIdle(!locData)) {
    return <Resource404 errorMessage="Unable to load the location or location hierarchy" />;
  }

  const parentId = sParams.get('parentId') ?? undefined;
  const initialValues = getLocationFormFields(locData, parentId);

  const locationFormProps: LocationFormProps = {
    initialValues,
    tree: data,
    successURLGenerator: successURLGenerator,
    hidden: hidden,
    disabled: disabled,
    onCancel: cancelHandler,
    fhirBaseURL,
    disabledTreeNodesCallback: disabledTreeNodesCallback,
  };

  const pageTitle = locData ? `${lang.EDIT} > ${initialValues.name}` : lang.ADD_LOCATION_UNIT;
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

NewEditLocationUnit.defaultProps = defaultNewEditLocationUnitProps;

export { NewEditLocationUnit };
