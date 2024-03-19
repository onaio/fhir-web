import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import {
  locationResourceType,
} from '../../constants';
import { useTranslation } from '../../mls';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import {
  BrokenPage,
  PageHeader,
  Resource404} from '@opensrp/react-utils';
import { Spin } from 'antd';
import { ViewDetailsTabs } from './DetailsTabs';
import { getLocationsAncestors } from './utils';
import { LocationPathBreadCrumb } from './LocationPathBreadCrumb';
import { LocationDetails } from './LocationDetails';


interface RouteParams {
  id: string;
}

interface ViewDetailsProps {
  fhirBaseURL: string;
}

export const ViewDetails = (props: ViewDetailsProps) => {
  const { fhirBaseURL } = props;
  const { id: locationId } = useParams<RouteParams>();
  const { t } = useTranslation();

  // recursively fetch path of this location
  const { data, isLoading, error } = useQuery<ILocation[], Error, ILocation[]>(
    [locationResourceType, locationId],
    () => {
      return getLocationsAncestors(fhirBaseURL, locationId);
    }
  );

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error && !data) {
    return <BrokenPage errorMessage={`${error.message}`} />;
  }

  if (!data?.length) {
    return <Resource404 />;
  }

  const normalizedData = data ?? [];
  const theInterestingLoc = normalizedData[normalizedData.length - 1];
  const pageTitle = t(`view details | {{locName}}`, { locName: theInterestingLoc.name });

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle} </title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '16px',
          gap: '14px',
          background: '#FFF',
          borderRadius: '12px',
        }}
      >
        <LocationPathBreadCrumb locationPath={data} />
        <LocationDetails location={theInterestingLoc} />
        <ViewDetailsTabs fhirBaseUrl={fhirBaseURL} location={theInterestingLoc} />
      </div>
    </section>
  );
};

