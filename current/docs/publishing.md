# Publishing packages to NPM

## Pre-requisites

- npm credentials
- GH_TOKEN: this should be set as an environement variable that can be obtained by following this [guide](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token). This is required in the versioning step, so that lerna can be able to push tags to github and create-releases with the generated tags.

## Steps

1. run `lerna:version` script

   - this will find the changed packages, update the package.json files, create tags, create releases for those tags.
   - you will need to set the `GH_TOKEN` env variable for this step.

2. run `lerna:publish`

- One needs to be already logged into npm for this step.
- This will call the prepublish lifecycle script and then push the versioned packages to npm

### Other added scripts

- run `lerna:prepublish` script.
  - This runs build script in each of the package, generating the dist folder.
  - One can target a specific package by passing in `--scope` flag e.g. `--scope @opensrp/opensrp-store`
