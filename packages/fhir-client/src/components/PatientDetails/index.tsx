import React from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import {
  BodyLayout,
  FHIRServiceClass,
  GenericTabsView,
  GenericTabsViewProps,
  PopulatedResourceDetails,
  TabTableProps,
  TabsTable,
  TabsTitle,
  sideViewQuery,
  useSearchParams,
} from '@opensrp/react-utils';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import {
  LIST_PATIENTS_URL,
  carePlanResourceType,
  conditionResourceType,
  encounterResourceType,
  immunizationResourceType,
  patientResourceType,
  taskResourceType,
} from '../../constants';
import { useTranslation } from '../../mls';
import {
  defaultSearchParamsFactory,
  sidePreviewDetailsExtractor,
  resourceDetailsPropsGetter,
} from './utils';
import { ICarePlan } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICarePlan';
import {
  parseCareplanList,
  columns as carePlanColumns,
  carePlanSideViewData,
} from './ResourceSchema/CarePlan';
import {
  parseImmunizationList,
  columns as immunizationColumns,
  immunizationSearchParams,
  immunizationSideViewData,
} from './ResourceSchema/Immunization';
import {
  parseEncounterList,
  columns as encounterColumns,
  encounterPreviewExtractor,
} from './ResourceSchema/Encounter';
import {
  parseConditionList,
  columns as conditionColumns,
  conditionSideViewData,
} from './ResourceSchema/Condition';
import {
  parseTaskList,
  columns as taskColumns,
  taskSearchParams,
  taskSideViewData,
} from './ResourceSchema/Task';
import { IImmunization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunization';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { ICondition } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICondition';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Button } from 'antd';

// Interface for route params
interface RouteParams {
  id: string;
}

/** props for editing a user view */
export interface PatientDetailProps {
  fhirBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type PatientDetailPropTypes = PatientDetailProps & RouteComponentProps<RouteParams>;

/**
 * Component which shows FHIR resource details of a single patient
 *
 * @param {Object} props - PatientDetails component props
 * @returns {React.FC} returns patient resources display
 */
const PatientDetails: React.FC<PatientDetailPropTypes> = (props: PatientDetailPropTypes) => {
  const { fhirBaseURL } = props;
  const { id: patientId } = useParams<RouteParams>();
  const { t } = useTranslation();

  const resourceQueryParams = {
    queryKey: [patientResourceType, patientId],
    queryFn: async () =>
      new FHIRServiceClass<IPatient>(fhirBaseURL, patientResourceType).read(patientId),
  };

  const { addParamsToURL, removeURLParam } = useSearchParams();

  const breadCrumbProps = {
    items: [
      {
        title: t('Patients'),
        path: LIST_PATIENTS_URL,
      },
      {
        title: t('Patient profile'),
      },
    ],
  };

  const pageTitle = t('Patient profile');
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
    breadCrumbProps,
  };

  const defaultTableData = {
    resourceId: patientId,
    fhirBaseURL,
    searchParamsFactory: defaultSearchParamsFactory,
  };

  const tableActionColumn = {
    title: t('Actions'),
    render: (value: Coding) => (
      <Button onClick={() => addParamsToURL({ [sideViewQuery]: value.id })} type="link">
        {t('View')}
      </Button>
    ),
  };

  const carePlanTableData: TabTableProps<ICarePlan> = {
    ...defaultTableData,
    resourceType: carePlanResourceType,
    tableColumns: [...carePlanColumns(t), tableActionColumn],
    tableDataGetter: parseCareplanList,
    extractSideViewDetails: sidePreviewDetailsExtractor<ICarePlan>(
      patientId,
      carePlanSideViewData,
      () => removeURLParam(sideViewQuery)
    ),
  };

  const conditionTableData: TabTableProps<ICondition> = {
    ...defaultTableData,
    resourceType: conditionResourceType,
    tableColumns: [...conditionColumns(t), tableActionColumn],
    tableDataGetter: parseConditionList,
    extractSideViewDetails: sidePreviewDetailsExtractor<ICondition>(
      patientId,
      conditionSideViewData,
      () => removeURLParam(sideViewQuery)
    ),
  };

  const taskTableData: TabTableProps<ITask> = {
    ...defaultTableData,
    resourceType: taskResourceType,
    tableColumns: [...taskColumns(t), tableActionColumn],
    tableDataGetter: parseTaskList,
    searchParamsFactory: taskSearchParams,
    extractSideViewDetails: sidePreviewDetailsExtractor<ITask>(patientId, taskSideViewData, () =>
      removeURLParam(sideViewQuery)
    ),
  };

  const immunizationTableData: TabTableProps<IImmunization> = {
    ...defaultTableData,
    resourceType: immunizationResourceType,
    tableColumns: [...immunizationColumns(t), tableActionColumn],
    tableDataGetter: parseImmunizationList,
    searchParamsFactory: immunizationSearchParams,
    extractSideViewDetails: sidePreviewDetailsExtractor<IImmunization>(
      patientId,
      immunizationSideViewData,
      () => removeURLParam(sideViewQuery)
    ),
  };

  const patientEncounterTableData: TabTableProps<IEncounter> = {
    ...defaultTableData,
    resourceType: encounterResourceType,
    tableColumns: [...encounterColumns(t), tableActionColumn],
    tableDataGetter: parseEncounterList,
    extractSideViewDetails: sidePreviewDetailsExtractor<IEncounter>(
      patientId,
      encounterPreviewExtractor,
      () => removeURLParam(sideViewQuery)
    ),
  };

  const tabViewProps: GenericTabsViewProps = {
    tabViewId: 'tabView',
    sideViewQueryName: sideViewQuery,
    size: 'small',
    items: [
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={carePlanResourceType}
            title={t('Care plan')}
            resourceFilters={defaultSearchParamsFactory(patientId)}
          />
        ),
        key: 'carePlan',
        children: <TabsTable<ICarePlan> {...carePlanTableData} />,
      },
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={conditionResourceType}
            title={t('Condition')}
            resourceFilters={defaultSearchParamsFactory(patientId)}
          />
        ),
        key: 'condition',
        children: <TabsTable<ICondition> {...conditionTableData} />,
      },
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={taskResourceType}
            title={t('Task')}
            resourceFilters={taskSearchParams(patientId)}
          />
        ),
        key: 'task',
        children: <TabsTable<ITask> {...taskTableData} />,
      },
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={immunizationResourceType}
            title={t('Immunization')}
            resourceFilters={immunizationSearchParams(patientId)}
          />
        ),
        key: 'immunization',
        children: <TabsTable<IImmunization> {...immunizationTableData} />,
      },
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={encounterResourceType}
            title={t('Patient encounter')}
            resourceFilters={defaultSearchParamsFactory(patientId)}
          />
        ),
        key: 'patientEncounter',
        children: <TabsTable<IEncounter> {...patientEncounterTableData} />,
      },
    ],
  };

  const populatedResourceDetailsProps = {
    resourceQueryParams,
    resourceDetailsPropsGetter,
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <PopulatedResourceDetails<IPatient> {...populatedResourceDetailsProps} />
      <GenericTabsView {...tabViewProps} />
    </BodyLayout>
  );
};

export { PatientDetails };
