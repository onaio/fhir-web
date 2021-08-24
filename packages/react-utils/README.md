# React Utils

A couple of utils being used in opensrp-web that work with react

## Installation

```sh
yarn add @opensrp-web/react-utils
```

## Usage

This package currently exposes the following components:

### Broken Page

This is a util component that is shown when a page runs into a non-recoverable error.
it also comes with the `useHandleBrokenPage` hook that helps manage the workflow of a broken page

#### Props/ Configuration

##### title

_Optional_(`string` | defaults `Something went wrong`)

Error title

##### errorMessage

_Optional_(`string` | defaults `Error`)

Error description

##### homeUrl

_Optional_(`string` | defaults `/`)

url path to home page

### Resource404

This is a util component shown when a requested resource is not found;
the more canonical 404 component, is shown when a page is not yet bound
to the routing system, this component is to be used within an existing page
but where one or more resources to be shown on that page are deemed missing.

#### Props/ Configuration

##### title

_Optional_(`string` | defaults `Sorry, the resource you requested for, does not exist`)

Error title

##### errorMessage

_Optional_(`string` | defaults `Error`)

Error description

##### homeUrl

_Optional_(`string` | defaults `/`)

url path to home page

### Code examples

```tsx
import { Resource404, BrokenPage, useHandleBrokenPage } from '@opensrp-web/react-utils';

const Foo = () => {
  const { broken, handleBrokenPage } = useHandleBrokenPage;
  if (broken) {
    return <BrokenPage />;
  }
  if (!object) {
    return <Resource404 />;
  }
};
```
