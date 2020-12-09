# PlanForm

Component that renders form to create or edit OpenSRP plans

## Installation

```sh
yarn add @opensrp/plan-form
```

```typescript
import '@opensrp/plan-form/dist/index.css';
```

## Usage

### Props/ Configuration

#### envConfigs

_Optional_(`EnvConfigs`)

an object containing the env configuration options

#### hiddenFields

_Optional_(`PlanFormFieldsKeys[]`)

an array of keys for fields that should be hidden

#### disabledFields

_Optional_(`PlanFormFieldsKeys[]`)

an array of keys for fields that should be disabled

#### disabledActivityFields

_Optional_(`string[]`)

an array of keys for fields that should be disabled in the activities section

#### afterSubmit

_Optional_(`Function`)

hook called after payload is successfully sent to the API

#### beforeSubmit

_Optional_(`(payload) => boolean`)

hook called before the submitting is initiated, return boolean to indicate if submitting should proceed

#### redirectAfterAction

_Optional_(`string`)

Takes user the defined route upon successfully submitting payload to api

#### allFormActivities

_Optional_()

List of allowed activities

#### initialValues

_Optional_()

predefine form field values

### Code examples

```typescript
import {PlanForm} form '@opensrp/plan-form';
import '@opensrp/plan-form/dist/index.css';

const formPage = () => {
  return (<PlanForm />)
}
```
