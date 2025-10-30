# FHIR User Sync

Synchronization tool for ensuring all Keycloak users have the required FHIR resources.

## Features

- Scans all Keycloak users
- Checks for missing FHIR resources:
  - Practitioner
  - Group
  - PractitionerRole
- Automatically creates missing resources
- Real-time progress tracking
- Detailed reporting

## Usage

The User Sync page is available in the sidebar under **Administration > User Management > User Sync**.

### Prerequisites

Users must have the following permissions:
- `iam_user.read` - To read Keycloak users
- `Practitioner.create` - To create FHIR resources

### How it works

1. Click "Start Synchronization" button
2. The tool scans all Keycloak users
3. For each user, it checks if they have:
   - A Practitioner resource
   - A Group resource
   - A PractitionerRole resource
4. Missing resources are automatically created
5. Progress is displayed in real-time
6. A summary is shown when complete

## Component Props

```typescript
interface UserSyncProps {
  fhirBaseURL: string;      // FHIR server base URL
  keycloakBaseURL: string;  // Keycloak API base URL
}
```

## Development

```bash
# Build the package
yarn build

# Run tests
yarn test

# Lint
yarn lint
```
