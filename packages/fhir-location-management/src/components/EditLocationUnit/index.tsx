import { BrokenPage } from '@opensrp/react-utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { LocationUnit } from '../../ducks/location-units';
import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { LocationFormProps, LocationForm } from '../LocationForm';
import { FormInstances, getLocationFormFields } from '../LocationForm/utils';
import { Spin, Row, Col } from 'antd';
import { getUser } from '@onaio/session-reducer';
import lang from '../../lang';
import { Helmet } from 'react-helmet';
import { FHIRServiceClass } from '@opensrp/react-utils';
import {
  FHIRLocationHierarchy,
  generateFHIRLocationTree,
  getHierarchyNode,
} from '../../ducks/locationHierarchy/utils';
import { useQuery, useQueryClient } from 'react-query';
import { sendErrorNotification } from '@opensrp/notifications';
import { IfhirR4 } from '@smile-cdr/fhirts';

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
  fhirBaseURL: '',
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
    hidden,
    disabled,
    opensrpBaseURL,
    filterByParentId,
    fhirRootLocationIdentifier,
    successURLGenerator,
    disabledTreeNodesCallback,
    fhirBaseURL,
  } = props;
  const queryClient = useQueryClient();
  const user = useSelector((state) => getUser(state));
  const serve = new FHIRServiceClass(fhirBaseURL, 'Location');

  // location being edited id
  const { id: locId } = props.match.params;

  const hierarchyParams = {
    identifier: fhirRootLocationIdentifier,
  };

  const singleLocation = useQuery(`Locations/${locId}`, () => serve.read(locId), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res) => res,
  });

  const treeDataQuery = useQuery(
    'LocationHierarchy',
    async () => new FHIRServiceClass(fhirBaseURL, 'LocationHierarchy').list(hierarchyParams),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res) => {
        return res.entry.map(
          (singleEntry) =>
            generateFHIRLocationTree((singleEntry as unknown) as FHIRLocationHierarchy).model
        );
      },
    }
  );

  if (treeDataQuery?.data?.length === 0 || !singleLocation.data) return <Spin size="large"></Spin>;

  if (singleLocation.error || treeDataQuery.error) {
    return <BrokenPage errorMessage={lang.ERROR_OCCURRED} />;
  }
  const initialValues = getLocationFormFields(singleLocation.data as IfhirR4.ILocation);

  const locationFormProps: LocationFormProps = {
    initialValues,
    successURLGenerator,
    hidden,
    disabled,
    onCancel: () => '',
    opensrpBaseURL,
    fhirBaseURL,
    filterByParentId,
    fhirRootLocationIdentifier,
    username: user.username,
    afterSubmit: (payload: IfhirR4.ILocation & { parentId: string }) => {
      const parentid = payload.parentId;
      // if the location unit is changed inside some parent id
      if (parentid) {
        const grandparenthierarchy = treeDataQuery.data?.find((tree) =>
          getHierarchyNode(tree, parentid)
        );
        if (grandparenthierarchy && grandparenthierarchy.id)
          queryClient
            .invalidateQueries('LocationHierarchy')
            .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
        else sendErrorNotification(lang.ERROR_OCCURRED);
      }
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
