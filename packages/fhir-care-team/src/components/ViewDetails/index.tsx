import React, { Fragment } from 'react';
import { Col, Button, Alert } from 'antd';
import { CloseOutlined, SyncOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import {
  BrokenPage,
  FHIRServiceClass,
  getObjLike,
  IdentifierUseCodes,
  getResourcesFromBundle,
  parseFhirHumanName,
} from '@opensrp/react-utils';
import { careTeamResourceType, URL_CARE_TEAM } from '../../constants';
import { useTranslation } from '../../mls';
import { renderObjectAsKeyvalue } from '@opensrp/react-utils';
import { get, groupBy, keyBy } from 'lodash';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R3';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';

/** typings for the view details component */
export interface ViewDetailsProps {
  careTeamId: string;
  fhirBaseURL: string;
}

/**
 * We pull a single care team with all referenced resources, this function tries ot group
 * the referenced resources in groups by their resource type for easier parsing down the line.
 *
 * @param resources - referenced fhir resources
 * @param careTeamId - care team id referencin aforementioned resources.
 */
function categorizeIncludedResources(resources: Resource[], careTeamId: string) {
  const resByIds = keyBy(resources, (resource) => `${resource.resourceType}/${resource.id}`);
  // TODO - how can we make us of type narrowing to get rid of explicit casts.
  const thisCareTeam = resByIds[`${careTeamResourceType}/${careTeamId}`] as unknown as ICareTeam;

  const subjectRef = thisCareTeam.subject?.reference;
  const subjectResource = subjectRef ? resByIds[subjectRef] : undefined;
  const participants: Resource[] = [];
  const managingOrganizations: IOrganization[] = [];
  thisCareTeam.participant?.forEach((participant) => {
    const ref = participant.member?.reference;
    const referencedResource = resByIds[ref ?? ''] as unknown as Resource | undefined;
    if (referencedResource) {
      participants.push(referencedResource);
    }
  });
  thisCareTeam.managingOrganization?.forEach((organization) => {
    const ref = organization.reference;
    const referencedResource = resByIds[ref ?? ''] as unknown as IOrganization | undefined;
    if (referencedResource) {
      managingOrganizations.push(referencedResource);
    }
  });
  const participantByResourceType = groupBy(participants, 'resourceType');
  return { subjectResource, participantByResourceType, thisCareTeam, managingOrganizations };
}

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { careTeamId, fhirBaseURL } = props;
  const { t } = useTranslation();
  const history = useHistory();

  // fetch this careTeam and include all its referenced resources.
  const { data, isLoading, error } = useQuery({
    queryKey: [careTeamResourceType, careTeamId],
    queryFn: () =>
      new FHIRServiceClass<IBundle>(fhirBaseURL, careTeamResourceType).list({
        _id: careTeamId,
        _include: `${careTeamResourceType}:*`,
      }),
    enabled: !!careTeamId,
    select: (res) => {
      const resEntries = getResourcesFromBundle<Resource>(res);
      return categorizeIncludedResources(resEntries, careTeamId);
    },
  });

  const careTeam = data?.thisCareTeam;
  const participantByResourceType = data?.participantByResourceType;
  const managingOrganizations = data?.managingOrganizations;

  const officialIdentifier = getObjLike(careTeam?.identifier, 'use', IdentifierUseCodes.OFFICIAL);

  const careTeamKeyValues = {
    [t('CareTeam ID')]: careTeam?.id,
    [t('Identifier')]: get(officialIdentifier, '0.value'),
    [t('Name')]: careTeam?.name,
    [t('status')]: careTeam?.status,
    [t('Participants')]: (
      <ul>
        {Object.entries(participantByResourceType ?? {}).map(([resourceType, resources], index) => {
          return (
            <li key={index}>
              {(() => {
                const subKeyValues = {
                  [resourceType]: (
                    <ul id="care-team-participants">
                      {resources.map((resource) => {
                        const res = resource as unknown as IOrganization | IPractitioner;
                        const practitionerName = getObjLike(
                          (res as IPractitioner).name,
                          'use',
                          IdentifierUseCodes.OFFICIAL
                        )[0];
                        return (
                          <li key={resource.id}>
                            {typeof res.name === 'string'
                              ? res.name
                              : parseFhirHumanName(practitionerName)}
                          </li>
                        );
                      })}
                    </ul>
                  ),
                };
                return (
                  <Fragment key={index}>
                    {resources.length && renderObjectAsKeyvalue(subKeyValues)}
                  </Fragment>
                );
              })()}
            </li>
          );
        })}
      </ul>
    ),
    [t('Managing organizations')]: managingOrganizations?.length ? (
      <ul id="managing-organizations">
        {managingOrganizations.map((organization) => (
          <li key={organization.id}>{organization.name}</li>
        ))}
      </ul>
    ) : (
      <Alert description={t('No managing organizaions found')} type="warning"></Alert>
    ),
  };

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          data-test-id="cancel"
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => history.push(URL_CARE_TEAM)}
        />
      </div>
      {error && !data ? (
        <BrokenPage errorMessage={`${error}`} />
      ) : (
        <>
          {isLoading ? (
            <Alert
              description={t('Fetching Care team')}
              type="info"
              showIcon
              icon={<SyncOutlined spin />}
            ></Alert>
          ) : careTeam ? (
            renderObjectAsKeyvalue(careTeamKeyValues)
          ) : (
            <Alert description={t('Care Team not found')} type="warning"></Alert>
          )}
        </>
      )}
    </Col>
  );
};

export { ViewDetails };
