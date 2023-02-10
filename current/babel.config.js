module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      '@babel/transform-runtime',
    ],
    env: {
      test: {
        plugins: ['transform-es2015-modules-commonjs'],
      },
    },
    comments: false,
  };
};
