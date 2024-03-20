import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { useTranslation } from '../../../mls';
import React from 'react';
import { SingleKeyNestedValue } from '@opensrp/react-utils';
import { Descriptions, Divider, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { parseLocationDetails } from '../utils';
import { URL_LOCATION_UNIT_EDIT } from '../../../constants';

const { Text } = Typography;

const GeometryRender = ({ geometry }: { geometry?: string }) => {
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

export const LocationDetails = ({ location }: { location: ILocation }) => {
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
  } = parseLocationDetails(location);

  const otherDetailsMap = {
    [t('Location Name')]: name,
    [t('Status')]: status,
    [t('alias')]: alias,
    [t('Latitude & Longitude')]: latitude && longitude ? `${latitude}, ${longitude}` : undefined,
    [t('Physical Type')]: physicalType.display,
    [t('Geometry')]: geometry ? <GeometryRender geometry={geometry} /> : undefined,
    [t('Description')]: description,
  };
  const dateCreatedKeyPairing = {
    [t('Date Last Updated')]: lastUpdated,
  };
  return (
    <div
      data-testid="details-section"
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
          <Link to={`${URL_LOCATION_UNIT_EDIT}/${id}`}>{t('Edit details')}</Link>
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
