const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (config) => {
  // Resolve the path aliases.
  config.resolve.plugins.push(new TsconfigPathsPlugin());

  return config;
};
