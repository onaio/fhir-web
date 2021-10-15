import { BrokenPage, Resource404, useHandleBrokenPage } from '@opensrp/react-utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { IfhirR4 } from '@smile-cdr/fhirts';
import FHIR from 'fhirclient';
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
import { OpenSRPService, FHIRServiceClass } from '@opensrp/react-utils';
import {
  generateFHIRLocationTree,
  generateJurisdictionTree,
  getBaseTreeNode,
  getHierarchyNode,
} from '../../ducks/locationHierarchy/utils';
import { useQuery, useQueryClient, useQueries, UseQueryResult } from 'react-query';
import { LOCATION_HIERARCHY, LOCATION_UNIT_FIND_BY_PROPERTIES } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { ParsedHierarchyNode, RawOpenSRPHierarchy } from '../../ducks/locationHierarchy/types';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

const locationsSelector = getLocationsByFilters();

export type LocationRouteProps = { id: string };

export interface EditLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successURLGenerator'
    >,
    RouteComponentProps<LocationRouteProps> {
  fhirBaseURL: string;
  opensrpBaseURL: string;
  fhirRootLocationIdentifier: string;
  instance: FormInstances;
  filterByParentId?: boolean;
  cancelURLGenerator: (data: LocationUnit) => string;
}

const defaultEditLocationUnitProps = {
  redirectAfterAction: '',
  filterByParentId: false,
  fhirRootLocationIdentifier: '',
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
    filterByParentId,
    fhirRootLocationIdentifier,
    cancelURLGenerator,
    successURLGenerator,
    disabledTreeNodesCallback,
    fhirBaseURL,
  } = props;
  const history = useHistory();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [isJurisdiction, setIsJurisdiction] = useState<boolean>(true);
  const { broken, errorMessage, handleBrokenPage } = useHandleBrokenPage();
  const user = useSelector((state) => getUser(state));
  const serve = new FHIRServiceClass(fhirBaseURL, 'Location');

  // location being edited id
  const { id: locId } = props.match.params;

  const thisLocation = useSelector((state) => {
    const filters = {
      ids: [locId],
    };
    return locationsSelector(state, filters);
  })[0] as LocationUnit | undefined;
  const [loading, setLoading] = useState<boolean>(true);

  const hierarchyParams = {
    identifier: fhirRootLocationIdentifier,
  };

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

  const singleLocation = useQuery(`Locations/${locId}`, () => serve.read(locId), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res) => res,
  });

  // const parentLocation = useQuery(['Location', singleLocation.data], () => serve.read());

  const treeDataQuery = useQuery(
    'LocationHierarchy',
    async () => new FHIRServiceClass(fhirBaseURL, 'LocationHierarchy').list(hierarchyParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) =>
        res.entry.map((singleEntry) => generateFHIRLocationTree(singleEntry as any).model),
    }
  );

  if (treeDataQuery?.data?.length === 0 || !singleLocation.data) return <Spin size="large"></Spin>;

  if (broken) {
    return <BrokenPage errorMessage={errorMessage} />;
  }

  // if (!thisLocation) {
  //   return <Resource404 />;
  // }

  const initialValues = getLocationFormFields(singleLocation.data as any, instance, isJurisdiction);
  // const cancelHandler = () => {
  //   const cancelURL = cancelURLGenerator(thisLocation);
  //   history.push(cancelURL);
  // };

  const locationFormProps: LocationFormProps = {
    initialValues,
    successURLGenerator,
    hidden,
    disabled,
    onCancel: () => {},
    opensrpBaseURL,
    fhirBaseURL,
    filterByParentId,
    fhirRootLocationIdentifier,
    username: user.username,
    afterSubmit: (payload) => {
      const parentid = payload.parentId;
      // if the location unit is changed inside some parent id
      if (parentid) {
        const grandparenthierarchy = treeDataQuery.data?.find((tree) =>
          getHierarchyNode(tree, parentid)
        );
        if (grandparenthierarchy && grandparenthierarchy.id)
          queryClient
            .invalidateQueries([LOCATION_HIERARCHY, grandparenthierarchy.id])
            .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
        else sendErrorNotification(lang.ERROR_OCCURRED);
      }
      dispatch(fetchAllHierarchies([]));
    },
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
