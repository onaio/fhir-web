import React from 'react';
import { RouteComponentProps, useHistory, useLocation, useParams } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { defaultValidationRulesFactory, getLocationFormFields } from '../LocationForm/utils';
import { Col, Spin } from 'antd';
import { BodyLayout } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { BrokenPage, Resource404 } from '@opensrp/react-utils';
import { useGetLocation, useGetLocationHierarchy } from '../../helpers/utils';
import { useMls } from '../../mls';
import { parentIdQueryParam } from '../../constants';

export type LocationRouteProps = { id?: string };

/** full props for the new location component */
export interface BaseNewEditLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successURLGenerator'
    >,
    RouteComponentProps<LocationRouteProps> {
  fhirBaseURL: string;
  fhirRootLocationId: string;
  cancelURLGenerator: () => string;
  updateLocationFormProps?: (formProps: LocationFormProps) => LocationFormProps;
  i18nNamespace: 'fhir-service-point';
}

/**
 * renders page where user can create new location unit
 *
 * @param props - this components props
 */
export const BaseNewEditLocationUnit = (props: BaseNewEditLocationUnitProps) => {
  const {
    hidden,
    disabled,
    fhirBaseURL,
    fhirRootLocationId,
    successURLGenerator,
    cancelURLGenerator,
    disabledTreeNodesCallback,
    updateLocationFormProps,
  } = props;
  const history = useHistory();
  const location = useLocation();
  const params = useParams<LocationRouteProps>();
  const sParams = new URLSearchParams(location.search);
  const { t } = useMls();

  const cancelHandler = () => {
    const cancelURL = cancelURLGenerator();
    history.push(cancelURL);
  };

  const { data, error, isLoading } = useGetLocationHierarchy(fhirBaseURL, fhirRootLocationId);

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

  const parentId = sParams.get(parentIdQueryParam) ?? undefined;
  const initialValues = getLocationFormFields(locData, parentId);

  const initialFormProps: LocationFormProps = {
    initialValues,
    tree: data,
    successURLGenerator,
    hidden: hidden,
    disabled: disabled,
    onCancel: cancelHandler,
    fhirBaseURL,
    disabledTreeNodesCallback: disabledTreeNodesCallback,
    validationRulesFactory: defaultValidationRulesFactory,
  };
  const locationFormProps = updateLocationFormProps?.(initialFormProps) ?? initialFormProps;

  const pageTitle = locData
    ? t('Edit > {{name}}', { name: initialValues.name })
    : t('Add Location Unit');
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Col className="bg-white p-4" span={24}>
        <LocationForm {...locationFormProps} />
      </Col>
    </BodyLayout>
  );
};
