# Team Assignment

This package contains components that list locations and their assigned teams, update and create new assigmnents.

## Installation

```sh
yarn add @opensrp/team-assignment
```

## Usage

### Tean Assignment ListView

This component allows assigning teams to locations from the admin panel.
To add the team assignment list view component:

```tsx
import { TeamAssignmentView } from '@opensrp/team-assignment';

export const teamAssignmentProps = {
  opensrpBaseURL: 'https://opensrp-stage.smartregister.org/opensrp/rest'
  defaultPlanId: `<insert default plan id set in env>`,
};

<Route path={`/team-assignment`}>
  <TeamAssignmentView {...teamAssignmentProps} />
</Route>
```

- **opensrpBaseURL:**(string)

  - **required**
  - Opensrp API base URL

- **defaultPlanId:**(string)

  - **required**
  - Opensrp default plan id which is an env var
