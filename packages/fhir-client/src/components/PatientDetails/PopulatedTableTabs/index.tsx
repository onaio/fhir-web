import React from 'react';
import {
  GenericTabsView,
  GenericTabsViewProps,
  TabTableProps,
  TabsTable,
  TabsTitle,
  sideViewQuery,
  useSearchParams,
} from '@opensrp/react-utils';
import {
  carePlanResourceType,
  conditionResourceType,
  encounterResourceType,
  immunizationResourceType,
  taskResourceType,
} from '../../../constants';
import { useTranslation } from '../../../mls';
import { defaultSearchParamsFactory, sidePreviewDetailsExtractor } from '../utils';
import {
  parseCareplanList,
  columns as carePlanColumns,
  carePlanSideViewData,
} from '../ResourceSchema/CarePlan';
import {
  parseImmunizationList,
  columns as immunizationColumns,
  immunizationSearchParams,
  immunizationSideViewData,
} from '../ResourceSchema/Immunization';
import {
  parseEncounterList,
  columns as encounterColumns,
  encounterPreviewExtractor,
} from '../ResourceSchema/Encounter';
import {
  parseConditionList,
  columns as conditionColumns,
  conditionSideViewData,
} from '../ResourceSchema/Condition';
import {
  parseTaskList,
  columns as taskColumns,
  taskSearchParams,
  taskSideViewData,
} from '../ResourceSchema/Task';
import { IImmunization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunization';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { ICondition } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICondition';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { ICarePlan } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICarePlan';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Button } from 'antd';
import { useUserRole } from '@opensrp/rbac';

/** Populated table tabs wrapper props */
export interface PopulatedTableTabsProps {
  fhirBaseURL: string;
  patientId: string;
}

/**
 * Patient details view table tabs
 *
 * @param props - PopulatedTableTabs component props
 */
export const PopulatedTableTabs: React.FC<PopulatedTableTabsProps> = (
  props: PopulatedTableTabsProps
) => {
  const { fhirBaseURL, patientId } = props;
  const { t } = useTranslation();
  const userRole = useUserRole();

  const { addParams, removeParam } = useSearchParams();
  const hasCareTeamRead = userRole.hasPermissions(['CareTeam.read']);
  const hasConditionRead = userRole.hasPermissions(['Condition.read']);
  const hasTaskRead = userRole.hasPermissions(['Task.read']);
  const hasImmunizationRead = userRole.hasPermissions(['Immunization.read']);
  const hasEncounterRead = userRole.hasPermissions(['Encounter.read']);

  const defaultTableData = {
    resourceId: patientId,
    fhirBaseURL,
    searchParamsFactory: defaultSearchParamsFactory,
  };

  const tableActionColumn = {
    title: t('Actions'),
    render: (value: Coding) => (
      <Button onClick={() => addParams({ [sideViewQuery]: value.id })} type="link">
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
      () => removeParam(sideViewQuery)
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
      () => removeParam(sideViewQuery)
    ),
  };

  const taskTableData: TabTableProps<ITask> = {
    ...defaultTableData,
    resourceType: taskResourceType,
    tableColumns: [...taskColumns(t), tableActionColumn],
    tableDataGetter: parseTaskList,
    searchParamsFactory: taskSearchParams,
    extractSideViewDetails: sidePreviewDetailsExtractor<ITask>(patientId, taskSideViewData, () =>
      removeParam(sideViewQuery)
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
      () => removeParam(sideViewQuery)
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
      () => removeParam(sideViewQuery)
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
            hasResourcePermissions={hasCareTeamRead}
          />
        ),
        key: 'carePlan',
        children: <TabsTable<ICarePlan> {...carePlanTableData} />,
        disabled: !hasCareTeamRead,
      },
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={conditionResourceType}
            title={t('Condition')}
            resourceFilters={defaultSearchParamsFactory(patientId)}
            hasResourcePermissions={hasConditionRead}
          />
        ),
        key: 'condition',
        children: <TabsTable<ICondition> {...conditionTableData} />,
        disabled: !hasConditionRead,
      },
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={taskResourceType}
            title={t('Task')}
            resourceFilters={taskSearchParams(patientId)}
            hasResourcePermissions={hasTaskRead}
          />
        ),
        key: 'task',
        children: <TabsTable<ITask> {...taskTableData} />,
        disabled: !hasTaskRead,
      },
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={immunizationResourceType}
            title={t('Immunization')}
            resourceFilters={immunizationSearchParams(patientId)}
            hasResourcePermissions={hasImmunizationRead}
          />
        ),
        key: 'immunization',
        children: <TabsTable<IImmunization> {...immunizationTableData} />,
        disabled: !hasImmunizationRead,
      },
      {
        label: (
          <TabsTitle
            fhirBaseURL={fhirBaseURL}
            resourceType={encounterResourceType}
            title={t('Patient encounter')}
            resourceFilters={defaultSearchParamsFactory(patientId)}
            hasResourcePermissions={hasEncounterRead}
          />
        ),
        key: 'patientEncounter',
        children: <TabsTable<IEncounter> {...patientEncounterTableData} />,
        disabled: !hasEncounterRead,
      },
    ],
  };

  return <GenericTabsView {...tabViewProps} />;
};

export const MemoizePopulatedTableTabs = React.memo(PopulatedTableTabs);
