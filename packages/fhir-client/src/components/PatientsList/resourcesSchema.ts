/* eslint-disable @typescript-eslint/no-explicit-any */
export const resourcesSchema = {
  Patient: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        editable: true,
        sorter: (a: any, b: any) => a.gender.localeCompare(b.name),
      },
      {
        title: 'Birth Date',
        dataIndex: 'dob',
        editable: true,
        sorter: (a: any, b: any) => a.dob.localeCompare(b.name),
      },
    ],
  },
  Encounter: {
    columns: [
      {
        title: 'Type',
        dataIndex: 'type',
        editable: true,
        sorter: (a: any, b: any) => a.type.localeCompare(b.name),
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        editable: true,
        sorter: (a: any, b: any) => a.reason.localeCompare(b.name),
      },
      {
        title: 'Class',
        dataIndex: 'class',
        editable: true,
        sorter: (a: any, b: any) => a.class.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: any, b: any) => a.status.localeCompare(b.name),
      },
      {
        title: 'Time',
        dataIndex: 'time',
        editable: true,
        sorter: (a: any, b: any) => a.time.localeCompare(b.name),
      },
    ],
  },
  Observation: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Value',
        dataIndex: 'value',
        editable: true,
        sorter: (a: any, b: any) => a.value.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.date.localeCompare(b.name),
      },
    ],
  },
  CarePlan: {
    columns: [
      {
        title: 'Category',
        dataIndex: 'category',
        editable: true,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        editable: true,
        sorter: (a: any, b: any) => a.reason.localeCompare(b.name),
      },
      {
        title: 'Period',
        dataIndex: 'period',
        editable: true,
        sorter: (a: any, b: any) => a.period.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: any, b: any) => a.status.localeCompare(b.name),
      },
    ],
  },
  Condition: {
    columns: [
      {
        title: 'Condition',
        dataIndex: 'condition',
        editable: true,
        sorter: (a: any, b: any) => a.condition.localeCompare(b.name),
      },
      {
        title: 'Clinical Status',
        dataIndex: 'cstatus',
        editable: true,
        sorter: (a: any, b: any) => a.status.localeCompare(b.name),
      },
      {
        title: 'Verification Status',
        dataIndex: 'vstatus',
        editable: true,
        sorter: (a: any, b: any) => a.vstatus.localeCompare(b.name),
      },
      {
        title: 'Onset Date',
        dataIndex: 'onsetDate',
        editable: true,
        sorter: (a: any, b: any) => a.odate.localeCompare(b.name),
      },
    ],
  },
  DiagnosticReport: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
    ],
  },
  Immunization: {
    columns: [
      {
        title: 'Type',
        dataIndex: 'type',
        editable: true,
        sorter: (a: any, b: any) => a.type.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: any, b: any) => a.status.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.date.localeCompare(b.name),
      },
    ],
  },
  Medication: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
    ],
  },
  MedicationRequest: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
    ],
  },
  Procedure: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Details',
        dataIndex: 'details',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
    ],
  },
  Practitioner: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
      {
        title: 'Active',
        dataIndex: 'active',
        editable: true,
        sorter: (a: any, b: any) => a.details.localeCompare(b.name),
      },
    ],
  },
  Organization: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        editable: true,
        sorter: (a: any, b: any) => a.type.localeCompare(b.name),
      },
      {
        title: 'Active',
        dataIndex: 'active',
        editable: true,
        sorter: (a: any, b: any) => a.active.localeCompare(b.name),
      },
    ],
  },
  ServiceRequest: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.date.localeCompare(b.name),
      },
    ],
  },
  MedicationAdministration: {
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: any, b: any) => a.status.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.date.localeCompare(b.name),
      },
    ],
  },
  MedicationStatement: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: any, b: any) => a.status.localeCompare(b.name),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        editable: true,
        sorter: (a: any, b: any) => a.date.localeCompare(b.name),
      },
    ],
  },
  Goal: {
    columns: [
      {
        title: 'Identifier',
        dataIndex: 'identifier',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Description',
        dataIndex: 'details',
        editable: true,
        sorter: (a: any, b: any) => a.identifier.localeCompare(b.name),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: true,
        sorter: (a: any, b: any) => a.status.localeCompare(b.name),
      },
    ],
  },
};
