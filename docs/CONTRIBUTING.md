# Contribution Guide

First of all, thanks for taking time to contribute.

## 1 Making changes to codebase

### 1.0 Prerequisites

- Ensure all your commits are signed, [see](https://docs.github.com/en/github/authenticating-to-github/signing-commits).
- Ensure your PR includes tests.
- Ensure all status checks are passing, including tests before following up on reviews. A reviewer is likely not going to review if there are failing status checks.

### 1.1 Fixing a typo

Fix and [create a pr](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

### 1.2 Fixing a bug

First, [create an issue](https://github.com/opensrp/web/issues/new/choose), You can now dig into the source code to try to fix the bug. Have a look at the Project Structure below to better understand how the project is designed.

#### Project structure

This repository follows a monorepo structure. We use lerna and yarn workspaces. dev dependencies that affect more than one package are added to the global package.json. The repository is further subdivided into 2 workTrees.

1. `RootPath/app` folder - this workspace contains the react application. it imports package views (usually in the second work tree) and hooks them up together via the router. It also makes use a few components from our [Js utilities repo](https://github.com/onaio/js-tools) to support the authorization workflow
2. `RootPath/packages` folder - Holds several packages that are consumed by the react application. One such package will usually export views for performing CRUD operations for a certain opensrp server entity. As an example The team Management package will export views through which users can create, read, update, and delete teams resource on the server.

Here is a more visual representation of how the different components work with each other.

![opensrp web package dependency diagram](https://user-images.githubusercontent.com/28119869/172324415-b2a25cbf-53cf-4168-b2a4-6f379cef11b3.png)

The terms `peerDependencies` and `dependencies` are to be interpreted as defined [here](https://classic.yarnpkg.com/lang/en/docs/dependency-types/)

#### Running tests

```bash
# make sure there are no stale package builds
yarn lerna:prepublish
yarn test
```

#### Cleaning up

We use Eslint and prettier to enforce lint rules on the repo. This should run automatically with every commit. However you can still manually run the lint command `yarn lint --fix`

You can now create a pr, make sure to link to the issue getting resolved, add a relevant description of the issue.

### 1.3 Developing a new feature

Its very important that you start with an issue, we may need to have discussions on the design, the maintenance burden it would add, etc. Once the way forward is decided the steps to resolving the issue should be similar to those in [Fixing a bug](#12-fixing-a-bug)

### 1.4 Huh!

If you need any further information or help, do not hesitate to get in touch by opening an issue.
