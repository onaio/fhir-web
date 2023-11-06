# fhir-web

[![codecov](https://codecov.io/gh/onaio/fhir-web/branch/master/graph/badge.svg?token=EG3TX9MAM4)](https://codecov.io/gh/onaio/fhir-web)

<!-- We need an introduction banner here -->

fhir-web is the default frontend for the [HAPI FHIR Server](https://github.com/opensrp/hapi-fhir-jpaserver-starter), as well as a configuration dashboard for the FHIR-based version of [OpenSRP](https://github.com/opensrp/fhircore) mobile application. It provides access to healthcare data, configuration options, and other functionality provided by OpenSRP.

## Table of Contents

---

- [fhir-web](#fhir-web)
  - [Table of Contents](#table-of-contents)
  - [What is the FHIR Standard](#what-is-the-fhir-standard)
  - [What is OpenSRP](#what-is-opensrp)
  - [Project Architecture](#project-architecture)
  - [Repository Setup](#repository-setup)
    - [Bootstrapping](#bootstrapping)
    - [Current Build Tools](#current-build-tools)
    - [Deprecated Build Tools](#deprecated-build-tools)
  - [Getting Started](#getting-started)
  - [Contributing](#contributing)
  - [Deployments](#deployments)
    - [Prerequisites](#prerequisites)
    - [1. Docker](#1-docker)
    - [2. Kubernetes](#2-kubernetes)
    - [3. Ansible](#3-ansible)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
    - [Multi-language Support (MLS)](#multi-language-support-mls)
  - [Publishing](#publishing)
  - [Deprecation Notice](#deprecation-notice)

## What is the FHIR Standard

HL7 Fast Healthcare Interoperability Resources (`FHIR`), is a standard to enable quick and efficient representation and exchange of health care data, including clinical and administrative data, by digital health systems.

## What is OpenSRP

OpenSRP is a Kotlin application for delivering offline-capable, mobile-first healthcare project implementations from local community to national and international scale using FHIR and the WHO Smart Guidelines on Android.

## Project Architecture

<!-- We need an architecture diagram here -->

fhir-web consumes FHIR resources from the[ OpenSRP HAPI FHIR server](https://github.com/opensrp/hapi-fhir-jpaserver-starter). Both fhir-web and the HAPI FHIR server use a [Keycloak Server](https://hub.docker.com/r/onaio/keycloak) for authentication (Oauth 2.0). On top of the React JS web application, there is a tiny [Express JS Server](https://github.com/onaio/express-server) that is bundled together with fhir-web that handles both authentication and serving the compiled fhir-web files. For All Intents and Purposes, both the Express and the React JS apps are bundled together and collectively referred to as the fhir-web.

## Repository Setup

### Bootstrapping

This repository is a monorepo bootstrapped with [Lerna](https://github.com/lerna/lerna) and [Yarn Workspaces](https://yarnpkg.com/features/workspaces). It is divided into two workTrees, the first, [/app](/app/), containing the actual React application, and the second, [/packages](/packages/) containing the different packages that `/app` consume.

### Current Build Tools

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/)
- [Lerna](https://github.com/lerna/lerna)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [TanStack Query](https://tanstack.com/query)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [React Router](https://reactrouter.com/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)

### Deprecated Build Tools

- [Enzyme](https://enzymejs.github.io/enzyme/)
- [React Redux](https://react-redux.js.org/)

## Getting Started

- [Getting Started Documentation](/docs/getting-started.md).

## Contributing

- [Contributing Documentation](/docs/CONTRIBUTING.md).

## Deployments

We use different technologies to deploy fhir-web.

### Prerequisites

- A well configured [keycloak server](https://hub.docker.com/r/onaio/keycloak) deployment.
  - We currently support version `18.0.0-legacy`
  - This should include the Keycloak [Realm](https://www.keycloak.org/docs/latest/server_admin/#configuring-realms) and [Client](https://www.keycloak.org/docs/latest/server_admin/#assembly-managing-clients_server_administration_guide) configurations.
- A well configured [Hapi FHIR server](https://github.com/opensrp/hapi-fhir-jpaserver-starter) deployment.

### 1. Docker

- [fhir-web Docker Deployment Documentation](/docs/fhir-web-docker-deployment.md).

### 2. Kubernetes

- [fhir-web Kubernetes Helm Chart](https://github.com/opensrp/helm-charts/tree/main/charts/opensrp-web).

### 3. Ansible

- [fhir-web Ansible Playbook](https://github.com/opensrp/playbooks/blob/master/web.yml)
  - Run an fhir-web deployment with certbot, react, express, and nginx.
  - You'll need accompanying ansible inventories

## Configuration

### Environment Variables

- [List Of Configurable Environment Variables](/docs/env.md).

### Multi-language Support (MLS)

- [Internalization and Multi Language Support Documentation](/docs/I18n.md).

## Publishing

- [Publishing Documentation](/docs/publishing.md).

## Deprecation Notice

**Important:** We are deprecating packages used for administration of both opensrp web server and mobile clients that do not use fhir. These packages will no longer be actively maintained or receive updates.

The code can be found in this [branch](https://github.com/opensrp/web/tree/opensrp-1). Any future releases and development should be done from this branch.

For any questions or assistance regarding issues in the affected modules, please feel free to create an [issue](https://github.com/opensrp/web/issues/new/choose)
