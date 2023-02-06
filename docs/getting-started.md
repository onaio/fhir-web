# Getting Started With FHIR Web

1. Clone the repository

   ```bash
   # with https
   git clone https://github.com/opensrp/web.git

   # with ssh
   git clone git@github.com:opensrp/web.git
   ```

2. Cd into the cloned web directory

   ```bash
   cd web
   ```

3. Create a `.env` file in the main package directory (`/app`)

   - You can do this by copying the `/app/.env.sample` file

     ```bash
     cp app/.env.sample app/.env
     ```

4. Override the created `.env` values to match your `Keycloak` and `FHIR server` deployment configurations

5. Install dependencies

   ```bash
   yarn install
   ```

6. Build packages

   ```bash
   yarn lerna:prepublish
   ```

7. Start the react app

   ```bash
   yarn start
   ```

8. The app starts and automatically launches itself on your default browser on [http://localhost:3000](http://localhost:3000)

## Testing

1. Run the `test` command in the root directory to run all test suites for all packages, or inside a specific package directory to only run the package's test suits.

   ```bash
   yarn test
   ```

## Notes

1.  You can use OAuth 2.0's `Implicit Grant flow` to run the app with direct authentication to Keyckloak. I.e bypassing the express authentication backend.

    - This is done by setting the `REACT_APP_BACKEND_ACTIVE` env to false

      ```bash
      REACT_APP_BACKEND_ACTIVE=false
      ```

2.  To see changes in the UI after making a code change to a package, cd into the packages directory and rebuild it using the build command in it's package.json

    - e.g to rebuild the Fhir Group Management package after making code changes to it:

      ```bash
      cd packages/fhir-group-management

      # ...make a code change

      yarn build
      ```
