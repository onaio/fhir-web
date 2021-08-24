# PlanForm

Component that renders a form to create or edit OpenSRP plans. It implements custom UI and user interactions as required by opensrp-web apps that use antd.

## Installation

```sh
yarn add @opensrp-web/plan-form
```

```typescript
import '@opensrp-web/plan-form/dist/index.css';
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

#### getRedirectPath

**required**(`(planStatus) => string`)

callback to get the path to redirect after successfully form submission

#### onCancel

**required**(`() => void`)

callback called once user clicks on cancel in the plan form

#### allFormActivities

_Optional_()

List of allowed activities

#### initialValues

_Optional_()

predefine form field values

### Code examples

```typescript
import {PlanForm} form '@opensrp-web/plan-form';
import '@opensrp-web/plan-form/dist/index.css';

const formPage = () => {
  return (<PlanForm />)
}
```
