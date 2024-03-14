import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import {
  URL_LOCATION_VIEW_DETAILS,
  geoJsonExtensionUrl,
  locationResourceType,
} from '../../../constants';
import { useTranslation } from '../../../mls';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import {
  BrokenPage,
  FHIRServiceClass,
  PageHeader,
  Resource404,
  SingleKeyNestedValue,
  getObjLike,
  getResourcesFromBundle,
} from '@opensrp/react-utils';
import { Breadcrumb, Descriptions, Divider, Grid, Spin, Tabs, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { get, reverse } from 'lodash';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { ViewDetailsTabs } from './ViewDetailResources';

const { Text } = Typography;
interface RouteParams {
  id: string;
}

interface ViewDetailsV2Props {
  fhirBaseURL: string;
}

/**
 * @param fhirBaseUrl
 * @param locationId
 */
export async function getParentLocations(fhirBaseUrl: string, locationId: string) {
  let foundParent = false;
  const locationPath: ILocation[] = [];
  let currentLocationId = locationId;
  while (!foundParent) {
    const { parent, child } = await fetchLocAndParent(fhirBaseUrl, currentLocationId);
    if (child) {
      locationPath.push(child);
    }
    if (!parent) {
      foundParent = true;
    } else {
      locationPath.push(parent);
      const grandParentReferenceParts = (parent.partOf?.reference ?? '').split('/');
      const grandParentReference = grandParentReferenceParts[grandParentReferenceParts.length - 1];
      currentLocationId = grandParentReference;
      if (!grandParentReference) {
        foundParent = true;
      }
    }
  }
  const rootFirstLocations = reverse(locationPath);
  return rootFirstLocations;
}

/**
 * @param fhirBaseUrl
 * @param locationId
 */
async function fetchLocAndParent(fhirBaseUrl: string, locationId?: string) {
  const service = new FHIRServiceClass<IBundle>(fhirBaseUrl, locationResourceType);
  // fetch location.
  const response = await service
    .list({ _id: locationId, _include: 'Location:partof' })
    .then((res) => getResourcesFromBundle<ILocation>(res));
  // invariant we should only have at-most 2 locations here.
  let parentId;
  let parent: ILocation | undefined = undefined;
  let child: ILocation | undefined = undefined;
  for (const loc of response) {
    const thisLocParentId = loc.partOf?.reference;
    const thisLocId = `${locationResourceType}/${loc.id}`;
    if (parentId === undefined) {
      parentId = thisLocParentId;
    }
    if (parentId === thisLocId) {
      parent = loc;
    } else {
      child = loc;
    }
  }
  return { child, parent };
}

interface BreadCrumpContainerProps {}

export const ViewDetailsV2 = (props: ViewDetailsV2Props) => {
  const { fhirBaseURL } = props;
  const { id: locationId } = useParams<RouteParams>();
  const { t } = useTranslation();

  // recursively fetch path of this location
  const { data, isLoading, error } = useQuery<ILocation[], Error, ILocation[]>(
    [locationResourceType],
    () => {
      return getParentLocations(fhirBaseURL, locationId);
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

        <ViewDetailsTabs fhirBaseUrl={fhirBaseURL} locationId={theInterestingLoc.id as string} />
      </div>
    </section>
  );
};

interface LocationPathBreadCrumbProps {
  locationPath: ILocation[];
}

const LocationPathBreadCrumb = (props: LocationPathBreadCrumbProps) => {
  const { locationPath } = props;
  const { t } = useTranslation();
  const breadCrumbItems = locationPath.map((location) => {
    const { name, id } = location;
    return {
      title: name,
      path: `${URL_LOCATION_VIEW_DETAILS}/${id}`,
    };
  });

  return (
    <Breadcrumb
      style={{ marginLeft: '16px' }}
      separator=">"
      items={breadCrumbItems}
      // eslint-disable-next-line @typescript-eslint/naming-convention
      itemRender={(route, _, items, __) => {
        const last = items.indexOf(route) === items.length - 1 || items.indexOf(route) === 0;
        return last ? (
          <span>{route.title}</span>
        ) : (
          <Link to={route.path ? route.path : '#'}>{route.title}</Link>
        );
      }}
    ></Breadcrumb>
  );
};

// TODO - move to react utils
/**
 * @param date
 */
function isValidDate(date?: Date) {
  // Check if the provided date is a valid Date object
  if (date) {
    return !isNaN(new Date(date).getTime());
  }
  return false;
}

/**
 * @param node
 */
export function parseLocation(node: ILocation) {
  const { id, name, status, description, identifier, meta, extension, position, alias, type } =
    node;
  const updatedLastRaw = meta?.lastUpdated;

  let updatedLast = updatedLastRaw ? new Date(updatedLastRaw) : undefined;
  if (!isValidDate(updatedLast)) {
    updatedLast = undefined;
  }

  const geoJSonExtens = getObjLike(extension, 'url', geoJsonExtensionUrl)[0];
  const geoJsonExtensionData = geoJSonExtens.valueAttachment?.data;
  let geometry;
  if (geoJsonExtensionData) {
    geometry = btoa(geoJsonExtensionData);
  }

  // TODO - get codeSystem system from fhir-location-management or move system extensions to fhir-utils.
  const servicePointTypeCodings = (type?.flatMap((concept) => concept.coding) ?? []).filter(
    (x) => x !== undefined
  ) as Coding[];
  const servicePointCodeSystem = 'http://smartregister.org/CodeSystem/eusm-service-point-type';
  const servicePointCode = getObjLike(servicePointTypeCodings, 'system', servicePointCodeSystem)[0];

  return {
    identifier,
    id: id,
    name: name,
    partOf: node.partOf?.display ?? '-',
    description: description,
    status: status,
    physicalType: get(node, 'physicalType.coding.0.display'),
    lastUpdated: updatedLast?.toLocaleString(),
    geometry,
    longitude: position?.longitude,
    latitude: position?.latitude,
    version: meta?.versionId,
    alias,
    servicePointType: servicePointCode.display,
  };
}

const GeometryRender = ({ geometry }: { geometry: string }) => {
  let formattedGeo = geometry ?? '';
  try {
    formattedGeo = JSON.stringify(JSON.parse(formattedGeo), undefined, 2);
  } catch {
    // do nothing
  }
  return (
    <pre
      style={{
        maxHeight: '60px',
        overflow: 'auto',
        border: '1px solid #ddd',
        padding: '4px',
      }}
    >
      {formattedGeo}
    </pre>
  );
};

const LocationDetails = ({ location }: { location: ILocation }) => {
  // TODO - possibility of making this section re-usable
  const { t } = useTranslation();
  const {
    id,
    name,
    status,
    physicalType,
    lastUpdated,
    geometry,
    longitude,
    latitude,
    version,
    alias,
    description,
  } = parseLocation(location);

  const otherDetailsMap = {
    [t('Location Name')]: name,
    [t('Status')]: status,
    [t('alias')]: alias,
    [t('Latitude & Longitude')]: latitude && longitude ? `${latitude}, ${longitude}` : undefined,
    [t('Physical Type')]: physicalType,
    [t('Geometry')]: geometry ? <GeometryRender geometry={geometry} /> : undefined,
    [t('Description')]: description,
  };
  const dateCreatedKeyPairing = {
    [t('Date Last Updated')]: lastUpdated,
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '16px',
        gap: '16px',
        background: '#FAFAFA',
        borderRadius: '6px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text strong>{name}</Text>
          <Link to="">Edit details</Link>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '32px',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{}}>
            <Text>ID: {id}</Text>
            <br></br>
            <Text>Version: {version}</Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <SingleKeyNestedValue {...dateCreatedKeyPairing} />
          </div>
        </div>
      </div>
      <Divider
        style={{
          margin: '0',
        }}
      />
      <div>
        <Descriptions size="small" column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}>
          {Object.entries(otherDetailsMap).map(([key, value]) => {
            const keyValuePairing = { [key]: value };
            return (
              <Descriptions.Item key={key}>
                <SingleKeyNestedValue {...keyValuePairing} />
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </div>
    </div>
  );
};
