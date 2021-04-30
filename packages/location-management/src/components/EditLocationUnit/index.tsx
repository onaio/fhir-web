import { BrokenPage, Resource404, useHandleBrokenPage } from '@opensrp/react-utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import {
  fetchLocationUnits,
  getLocationsByFilters,
  LocationUnit,
  locationUnitsReducer,
  locationUnitsReducerName,
} from '../../ducks/location-units';
import { loadJurisdiction } from '../../helpers/dataLoaders';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { FormInstances, getLocationFormFields } from '../LocationForm/utils';
import { Spin, Row, Col } from 'antd';
import { getUser } from '@onaio/session-reducer';
import lang from '../../lang';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { fetchAllHierarchies } from '../../ducks/location-hierarchy';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

const locationsSelector = getLocationsByFilters();

export type LocationRouteProps = { id: string };

export interface EditLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successURLGenerator'
    >,
    RouteComponentProps<LocationRouteProps> {
  opensrpBaseURL: string;
  instance: FormInstances;
  cancelURLGenerator: (data: LocationUnit) => string;
}

const defaultEditLocationUnitProps = {
  redirectAfterAction: '',
  opensrpBaseURL: OPENSRP_API_BASE_URL,
  instance: FormInstances.CORE,
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
    instance,
    hidden,
    disabled,
    opensrpBaseURL,
    cancelURLGenerator,
    successURLGenerator,
    disabledTreeNodesCallback,
  } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [isJurisdiction, setIsJurisdiction] = useState<boolean>(true);
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const user = useSelector((state) => getUser(state));

  // location being edited id
  const { id: locId } = props.match.params;

  const thisLocation = useSelector((state) => {
    const filters = {
      ids: [locId],
    };
    return locationsSelector(state, filters);
  })[0] as LocationUnit | undefined;
  const [loading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
    // get location; we are making 2 calls to know if location is a jurisdiction or a structure
    const commonParams = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      return_geometry: true,
    };
    const structureParams = {
      ...commonParams,
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_jurisdiction: false,
    };
    const jurisdictionParams = {
      ...commonParams,
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_jurisdiction: true,
    };

    const locationsDispatcher = (location: LocationUnit | null, isJurisdiction: boolean) => {
      if (location) {
        const locations = [location];
        dispatch(fetchLocationUnits(locations, isJurisdiction));
      }
    };
    // asynchronously get jurisdiction as structure and jurisdiction, depending on the resolved
    // promise, we can then know if the location to edit is a jurisdiction or structure
    const firstPromise = loadJurisdiction(locId, undefined, opensrpBaseURL, jurisdictionParams)
      .then((res) => {
        if (res) {
          locationsDispatcher(res, true);
        }
      })
      .catch((err) => {
        throw err;
      });
    const secondPromise = loadJurisdiction(locId, undefined, opensrpBaseURL, structureParams)
      .then((res) => {
        if (res) {
          setIsJurisdiction(false);
          locationsDispatcher(res, false);
        }
      })
      .catch((err) => {
        throw err;
      });
    Promise.all([firstPromise, secondPromise])
      .catch((err) => handleBrokenPage(err))
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locId]);

  if (loading) {
    return <Spin size="large"></Spin>;
  }

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  if (!thisLocation) {
    return <Resource404 />;
  }

  const initialValues = getLocationFormFields(thisLocation, instance, isJurisdiction);
  const cancelHandler = () => {
    const cancelURL = cancelURLGenerator(thisLocation);
    history.push(cancelURL);
  };

  const locationFormProps = {
    initialValues,
    successURLGenerator,
    hidden,
    disabled,
    onCancel: cancelHandler,

    opensrpBaseURL,
    user: user.username,
    afterSubmit: () => dispatch(fetchAllHierarchies([])),
    disabledTreeNodesCallback,
  };
  const pageTitle = `${lang.EDIT} > ${thisLocation.properties.name}`;

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
