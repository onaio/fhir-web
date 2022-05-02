import React from 'react';
import { RouteComponentProps, useHistory, useLocation, useParams } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { getLocationFormFields } from '../LocationForm/utils';
import { Row, Col, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { BrokenPage, Resource404 } from '@opensrp/react-utils';
import { useGetLocation, useGetLocationHierarchy } from '../../helpers/utils';
import { useTranslation } from '../../mls';

export type LocationRouteProps = { id?: string };

/** full props for the new location component */
export interface NewEditLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successUrlGenerator'
    >,
    RouteComponentProps<LocationRouteProps> {
  fhirBaseURL: string;
  fhirRootLocationIdentifier: string;
  cancelUrlGenerator: () => string;
}

/**
 * renders page where user can create new location unit
 *
 * @param props - this components props
 */
export const NewEditLocationUnit = (props: NewEditLocationUnitProps) => {
  const {
    hidden,
    disabled,
    fhirBaseURL,
    fhirRootLocationIdentifier,
    successUrlGenerator,
    cancelUrlGenerator,
    disabledTreeNodesCallback,
  } = props;
  const history = useHistory();
  const location = useLocation();
  const params = useParams<LocationRouteProps>();
  const sParams = new URLSearchParams(location.search);
  const { t } = useTranslation();

  const cancelHandler = () => {
    const cancelURL = cancelUrlGenerator();
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
      <BrokenPage
        errorMessage={t('Unable to load the location or location hierarchy')}
      ></BrokenPage>
    );
  }

  if (!data || ifNotIdle(!locData)) {
    return <Resource404 errorMessage={t('Unable to load the location or location hierarchy')} />;
  }

  const parentId = sParams.get('parentId') ?? undefined;
  const initialValues = getLocationFormFields(locData, parentId);

  const locationFormProps: LocationFormProps = {
    initialValues,
    tree: data,
    successUrlGenerator: successUrlGenerator,
    hidden: hidden,
    disabled: disabled,
    onCancel: cancelHandler,
    fhirBaseURL,
    disabledTreeNodesCallback: disabledTreeNodesCallback,
  };

  const pageTitle = locData
    ? t('Edit > {{name}}', { name: initialValues.name })
    : t('Add Location Unit');

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
