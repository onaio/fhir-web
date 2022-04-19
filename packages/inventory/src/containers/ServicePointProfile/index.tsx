import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { Resource404, BrokenPage, useHandleBrokenPage } from '@opensrp/react-utils';
import {
  hierarchyReducer,
  hierarchyReducerName,
  locationUnitsReducer,
  fetchLocationUnits,
  locationUnitsReducerName,
  LocationUnit,
  loadJurisdictions,
  getLocationsBySearch,
  getTreesByIds,
  loadHierarchy,
  fetchTree,
  loadJurisdiction,
} from '@opensrp/location-management';
import { useDispatch, useSelector } from 'react-redux';
import { getCords, GeographicLocationInterface } from './utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { Link, RouteComponentProps, useParams } from 'react-router-dom';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Helmet } from 'react-helmet';
import {
  INVENTORY_SERVICE_POINT_LIST_VIEW,
  GEOGRAPHIC_LEVEL,
  INVENTORY_SERVICE_POINT_PROFILE_PARAM,
  INVENTORY_EDIT_SERVICE_POINT,
  URL_INVENTORY_ADD,
  URL_INVENTORY_EDIT,
  INVENTORY_SERVICE_POINT_PROFILE_VIEW,
} from '../../constants';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import lang from '../../lang';
import '../../index.css';
import { fetchInventories } from '../../ducks/inventory';
import { getNodePath } from './utils';
import { InventoryList } from '../../components/InventoryList';

/** make sure locations and hierarchy reducer is registered */
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

const structuresSelector = getLocationsBySearch();
const treesSelector = getTreesByIds();

/** props for the ServicePointProfile view */
interface ServicePointsProfileProps extends CommonProps {
  fetchInventories: typeof fetchInventories;
  opensrpBaseURL: string;
  addInventoryURL: string;
  editInventoryURL: string;
  servicePointProfileURL: string;
}

const defaultProps = {
  ...defaultCommonProps,
  fetchInventories,
  opensrpBaseURL: '',
  addInventoryURL: URL_INVENTORY_ADD,
  editInventoryURL: URL_INVENTORY_EDIT,
  servicePointProfileURL: INVENTORY_SERVICE_POINT_PROFILE_VIEW,
};

type ServicePointsProfileTypes = ServicePointsProfileProps & RouteComponentProps;

export const findPath = (path: GeographicLocationInterface[], geoLevel: number) => {
  return path.find((x: GeographicLocationInterface) => x.geographicLevel === geoLevel);
};

interface DefaultGeographyItemProp {
  label: string;
  value?: string | number | string[] | number[];
}

/**
 * component that renders Geography Items
 *
 * @param props - the component props
 */
export const GeographyItem = (props: DefaultGeographyItemProp) => {
  const { label, value } = props;
  return (
    <Col md={24} className="geography-item">
      <p className="label">{label}:</p>
      <p className="value"> {value}</p>
    </Col>
  );
};

/**
 * component that renders service point list
 *
 * @param props - the component props
 */
const ServicePointProfile = (props: ServicePointsProfileTypes) => {
  const { opensrpBaseURL, addInventoryURL, editInventoryURL, servicePointProfileURL } = props;
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const params = useParams<{ [INVENTORY_SERVICE_POINT_PROFILE_PARAM]: string }>();
  const spId = params[INVENTORY_SERVICE_POINT_PROFILE_PARAM];

  const filters = {
    isJurisdiction: false,
  };
  const [structure] = useSelector((state) =>
    structuresSelector(state, { ...filters, searchQuery: spId })
  );
  const rootLocations = useSelector((state) =>
    structuresSelector(state, { ...filters, isJurisdiction: true })
  );
  const trees = useSelector((state) => treesSelector(state, {}));

  useEffect(() => {
    // get structures, this is the most important call for this page
    const params = {
      serverVersion: 0,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      is_jurisdiction: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      return_geometry: true,
    };

    const structuresDispatcher = (locations: LocationUnit | null) => {
      if (locations) {
        const locationOfInterest: LocationUnit[] = [locations];
        return dispatch(fetchLocationUnits(locationOfInterest, false));
      }
    };

    loadJurisdiction(spId, structuresDispatcher, opensrpBaseURL, params)
      .catch((err: Error) => {
        handleBrokenPage(err);
      })
      .finally(() => setIsLoading(false));
    // get root Jurisdictions so we can later get the trees.
    const jurisdictionsDispatcher = (locations: LocationUnit[] = []) => {
      return dispatch(fetchLocationUnits(locations, true));
    };

    loadJurisdictions(jurisdictionsDispatcher, opensrpBaseURL, undefined, undefined).catch(
      (err: Error) => sendErrorNotification(err.message)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rootLocations.length > 0) {
      const customTreeDispatcher: typeof fetchTree = (response, treeId) =>
        dispatch(fetchTree(response, treeId));
      const promises = rootLocations
        .map((location) => location.id.toString())
        .map((rootId) => loadHierarchy(rootId, customTreeDispatcher, opensrpBaseURL, undefined));
      Promise.all(promises).catch((err: Error) => sendErrorNotification(err.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rootLocations)]);

  if (isLoading) return <Spin size="large" className="custom-spinner" />;

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  if (!(structure as LocationUnit | undefined)) {
    return <Resource404 />;
  }

  const pageTitle = `${structure.properties.name} ${lang.INVENTORY}`;
  const nodePath = getNodePath(structure, trees);
  const inventoryListProps = {
    servicePointId: spId,
    opensrpBaseURL,
    addInventoryURL,
    editInventoryURL,
    servicePointProfileURL,
  };

  const coordinates = getCords(structure.geometry);
  const latLong = [coordinates.lat, coordinates.lng];
  const latLongString = latLong.some((el) => el) ? latLong.join(', ') : '';

  return (
    <>
      <div className="inventory-profile-header">
        <Row>
          <Col md={18}>
            <Link to={INVENTORY_SERVICE_POINT_LIST_VIEW}>
              <p className="go-back-text">{lang.BACK_TO_SERVICE_POINT_LIST}</p>
            </Link>
            <p className="title">{pageTitle}</p>
            <Row>
              <Col md={12}>
                <GeographyItem
                  label={lang.REGION_LABEL}
                  value={findPath(nodePath, GEOGRAPHIC_LEVEL.REGION)?.label}
                />
                <GeographyItem
                  label={lang.DISTRICT_LABEL}
                  value={findPath(nodePath, GEOGRAPHIC_LEVEL.DISTRICT)?.label}
                />
                <GeographyItem
                  label={lang.COMMUNE_LABEL}
                  value={findPath(nodePath, GEOGRAPHIC_LEVEL.COMMUNE)?.label}
                />
              </Col>
              <Col md={12}>
                <GeographyItem label={lang.TYPE_LABEL} value={structure.properties.type} />
                <GeographyItem label={lang.LAT_LONG_LABEL} value={latLongString} />
                <GeographyItem label={lang.SERVICE_POINT_ID_LABEL} value={spId} />
              </Col>
            </Row>
          </Col>
          <Col md={6} className="flex-center-right">
            <Link to={`${INVENTORY_EDIT_SERVICE_POINT}/${spId}`}>
              <Button type="primary" size="large">
                {lang.EDIT_SERVICE_POINT}
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
      <div className="content-section">
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <InventoryList {...inventoryListProps} />
      </div>
    </>
  );
};

ServicePointProfile.defaultProps = defaultProps;

export { ServicePointProfile };
