import React from 'react';
import { Col, Row } from 'antd';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import { RouteComponentProps } from 'react-router-dom';
import { Dictionary } from '@onaio/utils';
import { FHIRServiceClass } from '@opensrp/react-utils';
import lang from '../../lang';
import {
  FHIR_CARE_TEAM,
  FHIR_GROUPS,
  FHIR_PRACTITIONERS,
  ROUTE_PARAM_CARE_TEAM_ID,
} from '../../constants';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { CareTeamForm, FormFields } from './Form';
import { getPatientName } from './utils';
import { BundleEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry';
import { Practitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/practitioner';

// Interface for route params
interface RouteParams {
  careTeamId: string;
}

/** props for editing a user view */
export interface EditCareTeamProps {
  fhirBaseURL: string;
  resourcePageSize: number;
}

/** type intersection for all types that pertain to the props */
export type CreateEditCareTeamProps = EditCareTeamProps & RouteComponentProps<RouteParams>;

/** default props for editing user component */
export const defaultEditCareTeamsProps: EditCareTeamProps = {
  fhirBaseURL: '',
  resourcePageSize: 20,
};

export const fetchPractitionersCount = async (fhirBaseURL: string): Promise<number> => {
  const serve = new FHIRServiceClass(fhirBaseURL, FHIR_PRACTITIONERS);
  return serve.list().then((res: IfhirR4.IBundle) => {
    return res.total as number;
  });
};

export const fetchPractitionersRecursively = async (
  fhirBaseURL: string,
  pageSize: number,
  pageOffset: number
) => {
  let data: IfhirR4.IBundle;
  let offsetStart: number = pageOffset;
  const careTeamsCount = await fetchPractitionersCount(fhirBaseURL);
  const allData: BundleEntry[] = [];
  const serve = new FHIRServiceClass(fhirBaseURL, FHIR_PRACTITIONERS);
  const params = {
    _count: pageSize,
    _getpagesoffset: pageOffset,
  };
  if (typeof pageSize !== 'undefined') {
    do {
      data = await serve.list(params);
      allData.push(...(data.entry as BundleEntry[]));
      if (data.entry) {
        offsetStart = offsetStart + (data.entry.length as number);
      }
    } while (offsetStart < careTeamsCount);
  }
  return allData;
};

export const defaultInitialValues: FormFields = {
  uuid: '',
  id: '',
  name: '',
  status: '',
  practitionersId: [],
  groupsId: '',
};
/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditCareTeam: React.FC<CreateEditCareTeamProps> = (props: CreateEditCareTeamProps) => {
  const { fhirBaseURL, resourcePageSize } = props;
  const careTeamId = props.match.params[ROUTE_PARAM_CARE_TEAM_ID];
  const singleCareTeam = useQuery(
    `${FHIR_CARE_TEAM}/${careTeamId}`,
    async () =>
      careTeamId
        ? await new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM).read(careTeamId)
        : undefined,
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.ICareTeam) => res,
    }
  );

  const fhirGroups = useQuery(
    FHIR_GROUPS,
    async () => await new FHIRServiceClass(fhirBaseURL, FHIR_GROUPS).list(),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IBundle) => res,
    }
  );

  const fhirPractitioners = useQuery(
    FHIR_PRACTITIONERS,
    async () => await fetchPractitionersRecursively(fhirBaseURL, resourcePageSize, 0),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: BundleEntry[]) => res,
    }
  );

  const buildInitialValues = singleCareTeam.data
    ? {
        uuid: (singleCareTeam.data?.identifier as Dictionary[])[0].value as string,
        id: singleCareTeam.data.id,
        name: singleCareTeam.data.name,
        status: singleCareTeam.data.status ?? 'active',
        practitionersId: singleCareTeam.data.participant?.map(
          (p: Dictionary) => p.member.reference.split('/')[1]
        ),
        groupsId: singleCareTeam.data.subject?.reference?.split('/')[1] ?? '',
      }
    : defaultInitialValues;

  const careTeamFormProps = {
    fhirBaseURL,
    initialValues: buildInitialValues,
    // filter for only active practitioners and map output to object with id and name
    practitioners:
      fhirPractitioners.data?.flatMap((e: Dictionary) =>
        (e.resource as Practitioner).active
          ? [
              {
                id: e.resource.id,
                name: getPatientName(e.resource),
              },
            ]
          : []
      ) ?? [],
    groups:
      fhirGroups.data?.entry?.map((e: Dictionary) => ({
        id: e.resource?.id,
        name: e.resource?.name,
      })) ?? [],
  };

  if (
    fhirPractitioners.isLoading ||
    fhirGroups.isLoading ||
    (careTeamId && !buildInitialValues.id)
  ) {
    return <Spin size="large" />;
  }

  return (
    <Row>
      <Col span={24}>
        <CareTeamForm {...careTeamFormProps} />
      </Col>
    </Row>
  );
};

CreateEditCareTeam.defaultProps = defaultEditCareTeamsProps;

export { CreateEditCareTeam };
