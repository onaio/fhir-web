import { Dictionary } from '@onaio/utils';

export const resourcesSchema: Dictionary = {
  Patient: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.gender.localeCompare(b.name),
      },
      {
        title: 'Birth Date',
        dataIndex: 'dob',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.dob.localeCompare(b.name),
      },
    ],
  },
  Encounter: {
    columns: [
      {
        title: 'Type',
        dataIndex: 'type',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.type.localeCompare(b.name),
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.reason.localeCompare(b.name),
      },
      {
        title: 'Class',
        dataIndex: 'reasonClass',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.reasonClass.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
      {
        title: 'Time',
        dataIndex: 'time',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.time.localeCompare(b.name),
      },
    ],
  },
  Observation: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Value',
        dataIndex: 'value',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.value.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.date.localeCompare(b.name),
      },
    ],
  },
  CarePlan: {
    columns: [
      {
        title: 'Category',
        dataIndex: 'category',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.reason.localeCompare(b.name),
      },
      {
        title: 'Period',
        dataIndex: 'period',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.period.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
    ],
  },
  Condition: {
    columns: [
      {
        title: 'Condition',
        dataIndex: 'condition',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.condition.localeCompare(b.name),
      },
      {
        title: 'Clinical Status',
        dataIndex: 'cstatus',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
      {
        title: 'Verification Status',
        dataIndex: 'vstatus',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.vstatus.localeCompare(b.name),
      },
      {
        title: 'Onset Date',
        dataIndex: 'onsetDate',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.odate.localeCompare(b.name),
      },
    ],
  },
  DiagnosticReport: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
    ],
  },
  Immunization: {
    columns: [
      {
        title: 'Type',
        dataIndex: 'type',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.type.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.date.localeCompare(b.name),
      },
    ],
  },
  Location: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Desciption',
        dataIndex: 'details',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
      {
        title: 'City',
        dataIndex: 'city',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.city.localeCompare(b.name),
      },
      {
        title: 'State',
        dataIndex: 'state',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.state.localeCompare(b.name),
      },
      {
        title: 'Country',
        dataIndex: 'country',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.country.localeCompare(b.name),
      },
    ],
  },
  Medication: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
    ],
  },
  MedicationRequest: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
    ],
  },
  Procedure: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
    ],
  },
  Practitioner: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
      {
        title: 'Active',
        dataIndex: 'active',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.details.localeCompare(b.name),
      },
    ],
  },
  Organization: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.type.localeCompare(b.name),
      },
      {
        title: 'Active',
        dataIndex: 'active',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.active.localeCompare(b.name),
      },
    ],
  },
  ServiceRequest: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.date.localeCompare(b.name),
      },
    ],
  },
  MedicationAdministration: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.date.localeCompare(b.name),
      },
    ],
  },
  MedicationStatement: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.date.localeCompare(b.name),
      },
    ],
  },
  Goal: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Description',
        dataIndex: 'details',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.description.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
    ],
  },
  Coverage: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.name.localeCompare(b.name),
      },
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: Dictionary, b: Dictionary) => a.status.localeCompare(b.name),
      },
    ],
  },
};
