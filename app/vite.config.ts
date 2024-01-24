import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import cjs from '@rollup/plugin-commonjs';


// yarn add @rollup/plugin-commonjs rollup-plugin-polyfill-node @esbuild-plugins/node-modules-polyfill @esbuild-plugins/node-globals-polyfill

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>  {
  console.log("==============>", process.env.NODE_ENV)
  setEnv(mode)
  console.log("==============>", process.env.NODE_ENV)
  const externalProcess = process
  return {
    plugins: [react()],
    resolve: {
       preserveSymlinks: true ,
      alias: [
        {
          // this is required for the SCSS modules - https://github.com/vitejs/vite/issues/5764#issuecomment-982407332
          find: /^~(.*)$/,
          replacement: '$1',
        },
        {
          // this is required for the SCSS modules
          find: "util",
          replacement: "util",
        },
        {
          // this is required for the SCSS modules
          find: "crypto",
          replacement: "crypto-browserify",
        },
      ],
    },
    // resolve: {
    //   alias: {
    //     util: "util",
    //     http: ("stream-http"),
    //     https: ("https-browserify"),
    //     crypto: ("crypto-browserify"),
    //     stream: ("stream-browserify"),
    //     "buffer": "buffer",
    //     url: ("url"),
    //     assert: ("assert"),
    //   }
    // },
    define: {
      'process': {},
      // global: {}
    }, // https://github.com/vitejs/vite/issues/1973
    optimizeDeps: {
      include: ['react'],
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    // optimizeDeps: {
    //   disabled: false
    //   // include: ['@opensrp/**/*',
    //   // ]
    // },
    server: {
      port: 3000
    },
    preview: {
      port: 3000
    },
    // build: {
    //   commonjsOptions: {
    //     include: [
    //       //       /pro-layout/,
    //       //       /notifications/,
    //       //       /error-boundary-fallback/,
    //       //       /fhir-care-team/,
    //       //       /fhir-client/,
    //       //       /fhir-group-management/,
    //       //       /fhir-healthcare-service/,
    //       //       // /fhir-user-management/,
    //       //       /fhir-location-management/,
    //       //       /fhir-quest-form/,
    //       //       /fhir-resources/,
    //       //       /fhir-team-management/,
    //       //       /fhir-views/,
    //       //       /i18n/,
    //       //       /keycloak-service/,
    //       //       /user-management/,
    //       //       /location-management/,
    //       //       /notifications/,
    //       //       /reducer-factory/,
    //       //       /server-service/,
    //       //       /store/,
    //       //       /pkg-config/,
    //       //       /rbac/,
    //       //       /react-utils/,
    //       //       /server-logout/,
    //       //       /template/,
    //       //       /node_modules/
    //     ],
    //   },
    // },
    build: {
      // minify: false,
      // target: "es2015",
      outDir: 'build',
      sourcemap: true,
      commonjsOptions: { include: [/react/, /node_modules/ ,'@helsenorge/**/*.js'] },
      // rollupOptions: {
      //   plugins: [
      //     // Enable rollup polyfills plugin
      //     // used during production bundling
      //     // nodePolyfills({
      //     //   include: ['node_modules/**/*.js', '../node_modules/**/*.js'],
      //     // }),
      //     cjs({ include: [/lodash\.isequalwith/]  }),
      //   ],
      // },
    },
    // resolve: {
    //   alias: {
    //     // '@': resolve(__dirname, 'src'),
    //     process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
    //     buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
    //     events: 'rollup-plugin-node-polyfills/polyfills/events',
    //     util: 'rollup-plugin-node-polyfills/polyfills/util',
    //     sys: 'util',
    //     stream: 'rollup-plugin-node-polyfills/polyfills/stream',
    //     _stream_duplex:
    //       'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
    //     _stream_passthrough:
    //       'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
    //     _stream_readable:
    //       'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
    //     _stream_writable:
    //       'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
    //     _stream_transform:
    //       'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
    //   },
    // },
    envPrefix: "REACT_" // TODO - change to this to default VITE_

  }
})


function setEnv(mode: string) {
  Object.assign(
    process.env,
    loadEnv(mode, ".", ["REACT_", "NODE_ENV", "PUBLIC_URL"]),
  );
  process.env.NODE_ENV ||= mode;
}



// // Expose `process.env` environment variables to your client code
// // Migration guide: Follow the guide below to replace process.env with import.meta.env in your app, you may also need to rename your environment variable to a name that begins with VITE_ instead of REACT_APP_
// // https://vitejs.dev/guide/env-and-mode.html#env-variables
// function envPlugin(): Plugin {
//   return {
//     name: "env-plugin",
//     config(_, { mode }) {
//       const env = loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]);
//       return {
//         define: Object.fromEntries(
//           Object.entries(env).map(([key, value]) => [
//             `process.env.${key}`,
//             JSON.stringify(value),
//           ]),
//         ),
//       };
//     },
//   };
// }