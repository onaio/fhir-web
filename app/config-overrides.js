const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (config) => {
  // Remove the ModuleScopePlugin which throws when we try
  // to import something outside of src/.
  config.resolve.plugins.pop();

  // Resolve the path aliases.
  config.resolve.plugins.push(new TsconfigPathsPlugin());

  return config;
};
