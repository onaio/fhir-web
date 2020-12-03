# PlanForm Core

Core functions and utilities that support the plan creation and editing activities.
The main pieces exposed from here are:

- types: types defining the supported plan structure, supported form fields structure
- utility functions: Utilities that help parse form data and plan definition structure to and fro, Pieces not covered include any Form-implementation specific stuff e.g validating form fields, or utilities such as reading errors from a form
- constants: The plan structure defines a few constants that we re-expose for use in your projects, just to avoid a-lot of duplication

The intention for this package, is to serve as a common building block for several different user-facing form components that can create or edit opensrp plans.

## Installation

```sh
yarn add @opensrp/planform-core
```

## Usage

### Props/ Configuration

Some of the util functions exposed can optionally take a config object shaped as follows:

```typescript
/** describes all possible configuration options */
export interface EnvConfig {
  dateFormat: string;
  defaultPlanDurationDays: number;
  defaultPlanVersion: string;
  enabledFiReasons: FIReasonType[];
  planTypesAllowedToCreate: InterventionType[];
  planTypesWithMultiJurisdictions: InterventionType[];
  actionUuidNamespace: string;
  planUuidNamespace: string;
  defaultTime: string;
  defaultActivityDurationDays: number;
  displayedPlanTypes: InterventionType[];
  taskGenerationStatus: taskGenerationStatusType;
}
```
