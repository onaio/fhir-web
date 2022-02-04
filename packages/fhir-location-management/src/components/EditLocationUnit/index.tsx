import { BrokenPage, Resource404 } from '@opensrp/react-utils';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { getLocationFormFields } from '../LocationForm/utils';
import { Spin, Row, Col } from 'antd';
import lang from '../../lang';
import { Helmet } from 'react-helmet';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { locationResourceType } from '../../constants';

export type LocationRouteProps = { id: string };

export interface EditLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successURLGenerator'
    >,
    RouteComponentProps<LocationRouteProps> {
  fhirBaseURL: string;
  fhirRootLocationIdentifier: string;
  filterByParentId?: boolean;
  cancelURLGenerator: (data: ILocation) => string;
}

const defaultEditLocationUnitProps = {
  fhirRootLocationIdentifier: '',
  hidden: [],
  disabled: [],
  successURLGenerator: () => '',
  cancelURLGenerator: () => '',
};

/** renders page where user can Edit already created location unit
 *
 * @param props - this components props
 */
const EditLocationUnit = (props: EditLocationUnitProps) => {
  const {
    fhirRootLocationIdentifier,
    successURLGenerator,
    disabledTreeNodesCallback,
    fhirBaseURL,
    hidden,
    disabled,
  } = props;
  const history = useHistory();

  // location being edited id
  const locId = props.match.params.id;
  const serve = new FHIRServiceClass<ILocation>(fhirBaseURL, locationResourceType);
  const { data, error, isLoading } = useQuery(
    [locationResourceType, locId],
    () => serve.read(locId),
    {
      select: (res) => res,
    }
  );

  if (isLoading) {
    return <Spin size="large" className="custom-spinner"></Spin>;
  }

  if (error && !data) {
    return <BrokenPage errorMessage={lang.ERROR_OCCURRED} />;
  }

  if (!data) {
    return <Resource404></Resource404>;
  }

  const initialValues = getLocationFormFields(data);

  const locationFormProps: LocationFormProps = {
    initialValues,
    hidden,
    disabled,
    successURLGenerator,
    onCancel: () => history.goBack(),
    fhirBaseURL,
    fhirRootLocationIdentifier,
    disabledTreeNodesCallback,
  };
  const pageTitle = `${lang.EDIT} > ${initialValues.name}`;

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

EditLocationUnit.defaultProps = defaultEditLocationUnitProps;

export { EditLocationUnit };
