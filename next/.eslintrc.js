module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-opensrp`
  extends: ["opensrp"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
