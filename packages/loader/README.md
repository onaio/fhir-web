# Loaders

This package provides a number of React loading elements that you can use to show
that something on your page is... loading.

## Installation

```node
yarn add @opensrp/loaders
```

## Loader

The Loader displays a nice Loader effect via pure CSS.

### Usage

```javascript
import Loader from '@opensrp/loaders';

<Loader />;
```

### Customization

The Loader takes a number of props that can be used to customize it:

- **borderColor**: the border color
- **borderStyle**: the border style
- **borderWidth**: the border width
- **height**: the height
- **minHeight**: the minimum height
- **width**: the width

#### Code example

```javascript
import Loader from '@opensrp/loaders'

const props = {
  borderColor: '#FF22EF',
  borderStyle: 'dotted',
  borderWidth: '4px',
}

<Loader {...props} />
```
