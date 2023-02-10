import { Dictionary } from '@onaio/utils';
import { parsePatient, columns as patientTableColumns } from './Patient';
import { parseEncounter, columns as encouterTableColumns } from './Encounter';
import { parseObservation, columns as observationTablecolumns } from './Observation';
import { parseCareplan, columns as carePlanTableColumns } from './CarePlan';
import { parseCondition, columns as conditionTablecolumns } from './Condition';
import { parseDiagnosticReport, columns as diagnosticReportTableColumns } from './DiagnosticReport';
import { parseImmunization, columns as immunizationTablecolumns } from './Immunization';
import { parseLocation, columns as locationTableColumns } from './Location';
import { parseMedication, columns as medicationTableColumns } from './Medication';
import {
  parseMedicationRequest,
  columns as medicationRequestTableColumns,
} from './MedicationRequest';
import { parseProcedure, columns as procedureTableColumns } from './Procedure';
import { parsePractitioner, columns as practitionerTableColumns } from './Practitioner';
import { parseOrganization, columns as organizationTableColumns } from './Organization';
import { parseServiceRequest, columns as serviceRequestTablecolumns } from './ServiceRequest';
import {
  parseMedicationAdministration,
  columns as medicationAdminTableColumns,
} from './MedicationAdministration';
import {
  parseMedicationStatement,
  columns as medicationStatementTablecolumns,
} from './MedicationStatement';
import { parseGoal, columns as goalTableColumns } from './Goal';
import {
  parseImmunizationRecommendation,
  columns as immunizationRecTableColumns,
} from './ImmunizationRecommendation';

export const resourcesSchema: Dictionary = {
  Patient: {
    resourceParser: parsePatient,
    columns: patientTableColumns,
  },
  Encounter: {
    resourceParser: parseEncounter,
    columns: encouterTableColumns,
  },
  Observation: {
    resourceParser: parseObservation,
    columns: observationTablecolumns,
  },
  CarePlan: {
    resourceParser: parseCareplan,
    columns: carePlanTableColumns,
  },
  Condition: {
    resourceParser: parseCondition,
    columns: conditionTablecolumns,
  },
  DiagnosticReport: {
    resourceParser: parseDiagnosticReport,
    columns: diagnosticReportTableColumns,
  },
  Immunization: {
    resourceParser: parseImmunization,
    columns: immunizationTablecolumns,
  },
  Location: {
    resourceParser: parseLocation,
    columns: locationTableColumns,
  },
  Medication: {
    resourceParser: parseMedication,
    columns: medicationTableColumns,
  },
  MedicationRequest: {
    resourceParser: parseMedicationRequest,
    columns: medicationRequestTableColumns,
  },
  Procedure: {
    resourceParser: parseProcedure,
    columns: procedureTableColumns,
  },
  Practitioner: {
    resourceParser: parsePractitioner,
    columns: practitionerTableColumns,
  },
  Organization: {
    resourceParser: parseOrganization,
    columns: organizationTableColumns,
  },
  ServiceRequest: {
    resourceParser: parseServiceRequest,
    columns: serviceRequestTablecolumns,
  },
  MedicationAdministration: {
    resourceParser: parseMedicationAdministration,
    columns: medicationAdminTableColumns,
  },
  MedicationStatement: {
    resourceParser: parseMedicationStatement,
    columns: medicationStatementTablecolumns,
  },
  Goal: {
    resourceParser: parseGoal,
    columns: goalTableColumns,
  },
  ImmunizationRecommendation: {
    resourceParser: parseImmunizationRecommendation,
    columns: immunizationRecTableColumns,
  },
};
