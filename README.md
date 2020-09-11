# OpenSRP Web

[![Coverage Status](https://coveralls.io/repos/github/OpenSRP/web/badge.svg?branch=master)](https://coveralls.io/github/OpenSRP/web?branch=master)

The goal of OpenSRP Web is to be the default frontend for the [OpenSRP Server](https://github.com/OpenSRP/opensrp-server-core) API, providing access to
the data collected on the server, configuration options as well as any
functionality provided by the API server.

The initial priorities are to support:

1. Authentication through Keycloak
2. User management - pull some functionality, not all, that currently can be achieved by Keycloak.
3. Team management
4. Jurisdiction/Location management: user or team assignment,

The hope is to build on the work done on other attempts so far.

This repository intends to be a monorepo of all components that you will use
to provide all the functionality for an OpenSRP frontend UI.

## Code

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Contributing

1. Before creating a PR, create an issue.
2. At least two approvals are required before merging a PR
3. Ensure all status checks are passing, including tests before following up on reviews. A review is likely not going to review if there are failing status checks.
4. Ensure your PR includes tests.
5. Ensure all your commits are signed, [see](https://docs.github.com/en/github/authenticating-to-github/signing-commits).

Familiarity with [React](https://reactjs.org/) and [Ant](https://ant.design/docs/react/introduce)
is necessary.
