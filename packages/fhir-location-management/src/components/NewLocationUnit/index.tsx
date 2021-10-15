import { getUser } from '@onaio/session-reducer';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import React from 'react';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { FormInstances, getLocationFormFields, LocationFormFields } from '../LocationForm/utils';
import { Spin, Row, Col } from 'antd';
import { Helmet } from 'react-helmet';
import lang from '../../lang';
import { fetchAllHierarchies } from '../../ducks/location-hierarchy';
import { LocationUnit } from '../../ducks/location-units';
import {
  generateFHIRLocationTree,
  getBaseTreeNode,
  getHierarchyNode,
} from '../../ducks/locationHierarchy/utils';
import { useQuery, useQueryClient } from 'react-query';
import { LOCATION_HIERARCHY, LOCATION_UNIT_FIND_BY_PROPERTIES } from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';

/** full props for the new location component */
export interface NewLocationUnitProps
  extends Pick<
      LocationFormProps,
      'hidden' | 'disabled' | 'disabledTreeNodesCallback' | 'successURLGenerator'
    >,
    RouteComponentProps {
  opensrpBaseURL: string;
  fhirBaseURL: string;
  instance: FormInstances;
  fhirRootLocationIdentifier: string;
  filterByParentId?: boolean;
  processInitialValues?: (formFields: LocationFormFields) => LocationFormFields;
  cancelURLGenerator: () => string;
}

const defaultNewLocationUnitProps = {
  redirectAfterAction: '',
  findByParentId: false,
  opensrpBaseURL: OPENSRP_API_BASE_URL,
  fhirBaseURL: '',
  instance: FormInstances.CORE,
  hidden: [],
  disabled: [],
  fhirRootLocationIdentifier: '',
  successURLGenerator: () => '',
  cancelURLGenerator: () => '',
};

/** renders page where user can create new location unit
 *
 * @param props - this components props
 */
const NewLocationUnit = (props: NewLocationUnitProps) => {
  const {
    instance,
    hidden,
    disabled,
    opensrpBaseURL,
    fhirBaseURL,
    filterByParentId,
    fhirRootLocationIdentifier,
    successURLGenerator,
    cancelURLGenerator,
    processInitialValues,
    disabledTreeNodesCallback,
  } = props;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const history = useHistory();
  const cancelHandler = () => {
    const cancelURL = cancelURLGenerator();
    history.push(cancelURL);
  };
  const user = useSelector((state) => getUser(state));
  const urlquery = new URLSearchParams(history.location.search);
  const firstInitialValues: LocationFormFields = {
    parentId: urlquery.get('parentId') ?? undefined,
    ...getLocationFormFields(undefined, instance),
  };
  const initialValues = processInitialValues
    ? processInitialValues(firstInitialValues)
    : firstInitialValues;

  const hierarchyParams = {
    identifier: fhirRootLocationIdentifier,
  };

  const treeDataQuery = useQuery(
    'LocationHierarchy',
    async () => new FHIRServiceClass(fhirBaseURL, 'LocationHierarchy').list(hierarchyParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) =>
        res.entry.map((singleEntry) => generateFHIRLocationTree(singleEntry as any).model),
    }
  );

  const treeData = treeDataQuery.data as ParsedHierarchyNode[];

  if (!treeData || treeData.length === 0) return <Spin size="large"></Spin>;

  const locationFormProps: LocationFormProps = {
    initialValues: initialValues,
    successURLGenerator: successURLGenerator,
    hidden: hidden,
    disabled: disabled,
    onCancel: cancelHandler,
    opensrpBaseURL,
    fhirBaseURL,
    filterByParentId,
    fhirRootLocationIdentifier,
    username: user.username,
    afterSubmit: (payload) => {
      const parentid = payload.parentId;
      // if the location unit is changed inside some parent id
      if (parentid) {
        const grandparenthierarchy = treeData.find((tree) => getHierarchyNode(tree, parentid));
        if (grandparenthierarchy)
          queryClient
            .invalidateQueries([LOCATION_HIERARCHY, grandparenthierarchy])
            .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
        else sendErrorNotification(lang.ERROR_OCCURRED);
      }
      dispatch(fetchAllHierarchies([]));
    },
    disabledTreeNodesCallback: disabledTreeNodesCallback,
  };

  const pageTitle = lang.ADD_LOCATION_UNIT;
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

NewLocationUnit.defaultProps = defaultNewLocationUnitProps;

export { NewLocationUnit };
