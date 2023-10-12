# Integration testing.

**Setup**

```sh
# install playwright packages
yarn install

#  Install Playwright Browsers
yarn playwright install
```

**Running tests**

```sh
# Run all tests
yarn test

# Run a specific scenario
yarn test tests/scenarios/group_management.test.ts

# Run a single test
yarn test -g "<test suite name>"
```

[Reference](https://playwright.dev/docs/running-tests).
