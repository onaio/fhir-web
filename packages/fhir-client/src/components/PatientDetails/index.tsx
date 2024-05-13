import React from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import {
  FHIRServiceClass,
  GenericDetailsView,
  GenericDetailsViewProps,
  GenericTabsView,
  GenericTabsViewProps,
  TabTableProps,
  TabsTable,
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
import { resourceDetailsPropsGetter } from './utils';
import { ICarePlan } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICarePlan';
import { parseCareplanList, columns as carePlanColumns } from './ResourceSchema/CarePlan';
import {
  parseImmunizationList,
  columns as immunizationColumns,
  immunizationSearchParams,
} from './ResourceSchema/Immunization';
import { parseEncounterList, columns as encounterColumns } from './ResourceSchema/Encounter';
import { parseConditionList, columns as conditionColumns } from './ResourceSchema/Condition';
import { parseTaskList, columns as taskColumns, taskSearchParams } from './ResourceSchema/Task';
import { IImmunization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunization';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { ICondition } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICondition';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';

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

  const carePlanTableData: TabTableProps<ICarePlan> = {
    resourceId: patientId,
    fhirBaseURL,
    resourceType: carePlanResourceType,
    tableColumns: carePlanColumns(t),
    tableDataGetter: parseCareplanList,
  };

  const conditionTableData: TabTableProps<ICondition> = {
    resourceId: patientId,
    fhirBaseURL,
    resourceType: conditionResourceType,
    tableColumns: conditionColumns(t),
    tableDataGetter: parseConditionList,
  };

  const taskTableData: TabTableProps<ITask> = {
    resourceId: patientId,
    fhirBaseURL,
    resourceType: taskResourceType,
    tableColumns: taskColumns(t),
    tableDataGetter: parseTaskList,
    searchParamsFactory: taskSearchParams,
  };

  const immunizationTableData: TabTableProps<IImmunization> = {
    resourceId: patientId,
    fhirBaseURL,
    resourceType: immunizationResourceType,
    tableColumns: immunizationColumns(t),
    tableDataGetter: parseImmunizationList,
    searchParamsFactory: immunizationSearchParams,
  };

  const patientEncounterTableData: TabTableProps<IEncounter> = {
    resourceId: patientId,
    fhirBaseURL,
    resourceType: encounterResourceType,
    tableColumns: encounterColumns(t),
    tableDataGetter: parseEncounterList,
  };

  const tabViewProps: GenericTabsViewProps = {
    tabViewId: 'tabView',
    size: 'small',
    items: [
      {
        label: t('Care plan'),
        key: 'carePlan',
        children: <TabsTable<ICarePlan> {...carePlanTableData} />,
      },
      {
        label: t('Condition'),
        key: 'condition',
        children: <TabsTable<ICondition> {...conditionTableData} />,
      },
      {
        label: t('Task'),
        key: 'task',
        children: <TabsTable<ITask> {...taskTableData} />,
      },
      {
        label: t('Immunization'),
        key: 'immunization',
        children: <TabsTable<IImmunization> {...immunizationTableData} />,
      },
      {
        label: t('Patient encounter'),
        key: 'patientEncounter',
        children: <TabsTable<IEncounter> {...patientEncounterTableData} />,
      },
    ],
  };

  const genericDetailsViewProps: GenericDetailsViewProps<IPatient> = {
    bodyLayoutProps: { headerProps },
    resourceQueryParams,
    resourceDetailsPropsGetter,
    resourceId: patientId,
  };

  return (
    <GenericDetailsView<IPatient> {...genericDetailsViewProps}>
      <GenericTabsView {...tabViewProps} />
    </GenericDetailsView>
  );
};

export { PatientDetails };
