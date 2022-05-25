# OpenSRP Web

[![codecov](https://codecov.io/gh/opensrp/web/branch/master/graph/badge.svg?token=EG3TX9MAM4)](https://codecov.io/gh/opensrp/web)

The goal of OpenSRP Web is to be the default frontend for the [OpenSRP Server](https://github.com/OpenSRP/opensrp-server-core) API, providing access to
the data collected on the server, configuration options as well as any
functionality provided by the API server.

This repository is divided into 2 [workTrees](https://yarnpkg.com/features/workspaces), the first contains the actual react application workspace `app`, the second contain the different workspace packages that `app` consumes.

## Run the app

```sh
# create a .env file in the repo/app folder, you can copy the .env.sample and then override its values
# cp app/.env.sample app/.env

# Install dependencies
yarn install

# Build the packages, this involves generating their type definitions and transpiling using babel to cjs
yarn lerna:prepublish

# start the react app
yarn start
```

**Gotcha**

<details>
  <summary>Skip preflight check error on yarn start</summary>
  
  ** Error: ** 
  If you would prefer to ignore this check, add SKIP_PREFLIGHT_CHECK=true to an .env file in your project.
  That will permanently disable this message but you might encounter other issues.

  ** Fix **
  Make sure you have added the .env file in the app folder, and has the SKIP_PREFLIGHT_CHECK=true env

</details>

You can get the list of all configurable envs, their descriptions and sane defaults in the [env docs file](docs/env.md)

## setting up with docker

TBD

## Testing

```sh
yarn lerna:prepublish
yarn test
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Contributing

1. Before creating a PR, create an issue.
2. At least two approvals are required before merging a PR
3. Ensure all status checks are passing, including tests before following up on reviews. A review is likely not going to review if there are failing status checks.
4. Ensure your PR includes tests.
5. Ensure all your commits are signed, [see](https://docs.github.com/en/github/authenticating-to-github/signing-commits).

Familiarity with [React](https://reactjs.org/) and [Ant](https://ant.design/docs/react/introduce) is necessary.
