# Fhir Questionnaire/QuestionnaireResponse Form

Form view that pulls questionnaire or/and questionnaireResponses resources from a server, and renders them as a form

built using [helsenorge skjemautfyller](https://www.npmjs.com/package/@helsenorge/skjemautfyller)

## Installation

```sh
yarn add @opensrp/fhir-quest-form
```

<!--
Include further installation instructions, for instance if the package requires for the user
to manually add css.
-->

## Usage

### Base component props

- **fhirBaseURL** (`string`)

  - The base url to a fhir server

- **resourceId** (`string`)

  - Id for resource to be polled from server and rendered as a form

- **isQuestionnaireOnly** (`boolean`)

  - true denotes this is a Questionnaire resource, false denotes its a questionnaireResponse resource.

- **onSubmit** (`(qr: IQuestionnaire) => void`)

  - Callback when submit event is invoked

- **onSubmit** (`(qr: IQuestionnaire) => void`)

  - Callback when submit event is invoked

- **onCancel** (`() => void`)

  - Callback when user clicks cancel

### QuestRForm props

- Pick<BaseComponentProp, 'fhirBaseURL'>

### Code examples

```typescript
  import { QuestRForm, BaseQuestRForm } from '@opensrp/fhir-quest-form'

  // Base form component
  <BaseQuestRForm fhirBaseURL="http://fhir-test-server.com"
    resourceType='Questionnaire'
    resourceId='uuid' />

  <Switch>
      <Route exact path="/:resourceId/:resourceType">
        <QuestRForm fhirBaseURL="http://fhir-test-server.com" />
      </Route>
  </Switch>
```
