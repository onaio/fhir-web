import { BrokenPage, OpenSRPService, useHandleBrokenPage } from '@opensrp/react-utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import {
  fetchLocationUnits,
  getLocationUnitById,
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
import { EDIT_LOCATION_UNIT } from '../../constants';
import { Helmet } from 'react-helmet';
import reducerRegistry from '@onaio/redux-reducer-registry';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

export type LocationRouteProps = { id: string };

export interface EditLocationUnitProps
  extends Pick<LocationFormProps, 'redirectAfterAction' | 'hidden' | 'disabled' | 'service'>,
    RouteComponentProps<LocationRouteProps> {
  openSRPBaseURL: string;
  instance: FormInstances;
}

const defaultEditLocationUnitProps = {
  redirectAfterAction: '',
  openSRPBaseURL: OPENSRP_API_BASE_URL,
  instance: FormInstances.CORE,
  hidden: [],
  disabled: [],
  service: OpenSRPService,
};

/** renders page where user can Edit already created location unit
 *
 * @param props - this components props
 */
const EditLocationUnit = (props: EditLocationUnitProps) => {
  const { instance, hidden, disabled, service, openSRPBaseURL, redirectAfterAction } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [isJurisdiction, setIsJurisdiction] = useState<boolean>(true);
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const user = useSelector((state) => getUser(state));

  // location being edited id
  const { id: locId } = props.match.params;

  const thisLocation = useSelector((state) => getLocationUnitById(state, locId)) ?? undefined;
  const [loading, setLoading] = useState<boolean>(!thisLocation);

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

    const locationsDispatcher = (location: LocationUnit | null) => {
      if (location) {
        const locations = [location];
        dispatch(fetchLocationUnits(locations));
      }
    };
    // asynchronously get jurisdiction as structure and jurisdiction, depending on the resolved
    // promise, we can then know if the location to edit is a jurisdiction or structure
    const firstPromise = loadJurisdiction(
      locId,
      undefined,
      openSRPBaseURL,
      jurisdictionParams,
      service
    )
      .then((res) => {
        if (res) {
          locationsDispatcher(res);
        }
      })
      .catch((err) => {
        throw err;
      });
    const secondPromise = loadJurisdiction(
      locId,
      undefined,
      openSRPBaseURL,
      structureParams,
      service
    )
      .then((res) => {
        if (res) {
          setIsJurisdiction(false);
          locationsDispatcher(res);
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

  const initialValues = getLocationFormFields(thisLocation, instance, isJurisdiction);
  const cancelHandler = () => history.push(redirectAfterAction);

  const locationFormProps = {
    initialValues,
    redirectAfterAction,
    hidden,
    disabled,
    onCancel: cancelHandler,
    service,
    openSRPBaseURL,
    user: user.username,
  };
  const pageTitle = `${EDIT_LOCATION_UNIT} | ${thisLocation?.properties.name}`;

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
