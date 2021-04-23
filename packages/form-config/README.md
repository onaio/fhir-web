# Form Config

These are bunch of components that support creation and manuplation of [OpenSRP](https://smartregister.atlassian.net/wiki/spaces/Documentation/pages/1507000340/OpenSRP+Document+Configurability) configuration files.

The configuration files include:

1. JSON widget validator - JSON file that holds a list of fields that cannot be removed in a certain JSON form.
2. Manifest - A combination of properties that help bundle up all the files uploaded.

## Instalation

```node
yarn add @opensrp/form-config
```

## Code Sample

You can opt to use default table styles by this file to a higher component

```typescript
import '@onaio/drill-down-table/dist/table.css';
```

### Form upload and Edit

```typescript
import ConnectedUploadConfigFile from '@opensrp/form-config'

const UploadConfigFilePage = () => {

    const props = {
        baseURL: <OpenSRP API base url>,
        draftFilesUrl: <draft files url>, // redirects here when form is upoaded
        endpoint: <OpenSRP API file upload endpoint>,
        formId: <form identifier>, // provided when editing else pass null
        isJsonValidator: <boolean>, // true when editing or creating a json validator
        getPayload: <function for generating OpenSrp API headers>,
        LoadingComponent: <loading component>, // optional
        validatorsUrl: <web link to json validators>,
    };
    return <ConnectedUploadConfigFile {...props} />
};
```

### List manifest releases

```typescript
import ConnectedManifestReleases from '@opensrp/form-config'

const ManifestReleasesPage = () => {

    const props = {
        baseURL: <OpenSRP API base url>,
        currentUrl: <current web url>,
        endpoint: <OpenSRP API manifest endpoint>,
        formUploadUrl: <form upload web url>
        getPayload: <function for generating OpenSrp API headers>,
        LoadingComponent: <loading component>, // optional
        uploadTypeUrl: <string>, // differentiate valdator and form upload  eg. form-upload or validator-upload
    };
    return <ConnectedManifestReleases {...props} />
};
```

#### If you would like to use the equivalent Antd components

Create the list view component

```ts
import { AntdReleaseList } from '@opensrp/form-config';

const { ReleaseList } = AntdReleaseList;

const ManifestReleasesPage = () => {
  const props = {
    uploadFileURL: '/drafts/upload', // route to navigate to upload a draft form
    viewReleaseURL: '/releases', // route to navigate to view a release record details
  };
  return <ReleaseList {...props} />;
};
```

Create the view component that displays a details record

```ts
import { AntdFilesList } from '@opensrp/form-config';

const { FileList } = AndFilesList;

const ManifestReleaseViewPage = () => {
  const props = {
    isJsonValidator: false,
  };
  return <FileList {...props} />;
};
```

Create the upload form component to upload a draft form

```ts
import { AntdUploadForm } from '@opensrp/form-config';

const { UploadForm } = AntdUploadForm;

const UploadDraftPage = () => {
  const props = {
    isJsonValidator: false, // true when editing or creating a json validator
    onSaveRedirectURL: '/drafts', // redirects here when form is upoaded
  };
  return <UploadForm {...props} />;
};
```

Declare routes

```tsx
import { ROUTE_PARAM_FORM_VERSION } from '@opensrp/form-config';
// releases list view
<Route path="/releases">
  <ManifestReleasesPage />
</Route>;

// release record view
<Route path={`/releases/:${ROUTE_PARAM_FORM_VERSION}`}>
  <ManifestReleaseViewPage />
</Route>;

// upload draft view
<Route path="/drafts/upload">
  <UploadDraftPage />
</Route>;
```

### List JSON validators and config forms

```typescript
import ConnectedManifestFilesList from '@opensrp/form-config'

const JsonValidatorsPage = () => {

    const props = {
        baseURL: <OpenSRP API base url>,
        downloadEndPoint: <OpenSrp form download endpoint>
        endpoint: <OpenSRP API forms endpoint>,
        fileUploadUrl: <form upload web url>
        formVersion: <form version for configs to be displayed> // null for JSON validator
        getPayload: <function for generating OpenSrp API headers>,
        isJsonValidator: <true for JSON validator page>
        LoadingComponent: <loading component>, // optional
        uploadTypeUrl: <string>, // differentiate valdator and form upload  eg. form-upload or validator-upload
    };
    return <ConnectedManifestFilesList {...props} />
};
```

#### If you would like to use the equivalent Antd component

Create the list view component

```ts
import { AntdFilesList } from '@opensrp/form-config';

const { FileList } = AntdFilesList;

const JsonValidatorsPage = () => {
  const props = {
    uploadFileURL: '/json-validators/upload', // route to navigate to upload form
    isJsonValidator: true, // true for json validators page
  };
  return <FileList {...props} />;
};
```

Create the upload form component

```ts
import { AntdUploadForm } from '@opensrp/form-config';

const { UploadForm } = AntdUploadForm;

const UploadJsonValidatorPage = () => {
  const props = {
    isJsonValidator: true, // true when editing or creating a json validator
    onSaveRedirectURL: '/json-validators', // redirects here when form is upoaded
  };
  return <UploadForm {...props} />;
};
```

Declare routes

```tsx
import { ROUTE_PARAM_FORM_ID } from '@opensrp/form-config';

// json validators list view
<Route path="/json-validators">
  <JsonValidatorsPage />
</Route>;

// edit route
<Route path={`/json-validators/upload/:${ROUTE_PARAM_FORM_ID}`}>
  <UploadJsonValidatorPage />
</Route>;

// upload route
<Route path="/json-validators/upload">
  <UploadJsonValidatorPage />
</Route>;
```

### List Draft files

```typescript
import ManifestDraftFiles from '@opensrp/form-config'

const DraftListPage = () => {

    const props = {
        baseURL: <OpenSRP API base url>,
        downloadEndPoint: <OpenSrp form download endpoint>
        endpoint: <OpenSRP API forms endpoint>,
        fileUploadUrl: <form upload web url>
        getPayload: <function for generating OpenSrp API headers>,
        LoadingComponent: <loading component>, // optional
        manifestEndPoint: <OpenSrp manifest endpoint>
        releasesUrl: <manifest release web url>
    };
    return <ManifestDraftFiles {...props} />
};
```

#### If you would like to use the equivalent Antd component

Create the list view component

```ts
import { AntdDraftFileList } from '@opensrp/form-config';

const { DraftList } = AntdDraftFileList;

const DraftListPage = () => {
  const props = {
    uploadFileURL: '/drafts/upload', // route to navigate to upload form
    onMakeReleaseRedirectURL: '/releases', // redirect url after release is made
  };
  return <ManifestDraftFiles {...props} />;
};
```

Create the upload form component

```ts
import { AntdUploadForm } from '@opensrp/form-config';

const { UploadForm } = AntdUploadForm;

const UploadDraftPage = () => {
  const props = {
    isJsonValidator: false, // true when editing or creating a json validator
    onSaveRedirectURL: '/drafts', // redirects here when form is upoaded
  };
  return <UploadForm {...props} />;
};
```

Declare routes

```tsx
import { ROUTE_PARAM_FORM_ID } from '@opensrp/form-config';

// drafts list view
<Route path="/drafts">
  <JsonValidatorsPage />
</Route>;

// edit route
<Route path={`/drafts/upload/:${ROUTE_PARAM_FORM_ID}`}>
  <UploadJsonValidatorPage />
</Route>;

// upload route
<Route path="/drafts/upload">
  <UploadJsonValidatorPage />
</Route>;
```
