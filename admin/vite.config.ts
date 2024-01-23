import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
<<<<<<< HEAD

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3000,
  },
=======
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  preview: {
    port: 3000,
  },
  // optimizeDeps: {
  //   include: ['@opensrp/**/*',
  //   ]
  // },
  resolve: {
    alias: {
      util: "util",
      // http: ("stream-http"),
      // https: ("https-browserify"),
      crypto: ("crypto-browserify"),
      // stream: ("stream-browserify"),
      // "buffer": "buffer",
      // url: ("url"),
      // assert: ("assert"),
    }
  },
  define: {
    'process': process
  }, // https://github.com/vitejs/vite/issues/1973
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [
        // /pro-layout/,
        /error-boundary-fallback/,
        // /fhir-care-team/,
        // /fhir-client/,
        // /fhir-group-management/,
        // /fhir-healthcare-service/,
        // // /fhir-user-management/,
        // /fhir-location-management/,
        // /fhir-quest-form/,
        // /fhir-resources/,
        // /fhir-team-management/,
        // /fhir-views/,
        /i18n/,
        /keycloak-service/,
        // /user-management/,
        // /location-management/,
        /notifications/,
        // /reducer-factory/,
        // /server-service/,
        /store/,
        /pkg-config/,
        /rbac/,
        /react-utils/,
        /server-logout/,
        // /template/,
        /node_modules/
      ],
    },
  },
>>>>>>> a87a46ec (Add placebo application)
  envPrefix: "REACT_" // TODO - change to this to default VITE_
});
