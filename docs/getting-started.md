# Getting Started With FHIR Web - Complete Local Development Setup

This guide will walk you through setting up fhir-web locally from scratch, including all the necessary tools, SSL certificates, and configuration needed for a working development environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Testing the User Sync Feature](#testing-the-user-sync-feature)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### 1. Node.js (v16 or higher)

- **Check if installed:**
  ```bash
  node -v
  ```
- **Install:** Download from [nodejs.org](https://nodejs.org/) or use a version manager like [nvm](https://github.com/nvm-sh/nvm)
  ```bash
  # Using nvm (recommended)
  nvm install 16
  nvm use 16
  ```

### 2. Yarn

- **Check if installed:**
  ```bash
  yarn --version
  ```
- **Install:**
  ```bash
  npm install -g yarn
  ```

### 3. mkcert (for SSL certificates)

mkcert is needed to generate local SSL certificates for HTTPS development (required for OAuth authentication).

- **macOS:**
  ```bash
  brew install mkcert
  brew install nss  # if you use Firefox
  mkcert -install
  ```
- **Linux:**
  ```bash
  # Debian/Ubuntu
  sudo apt install mkcert

  # Arch
  sudo pacman -S mkcert

  mkcert -install
  ```
- **Windows:**
  ```bash
  choco install mkcert
  mkcert -install
  ```

### 4. Backend Services Access

You need access to:
- **Keycloak Server** (OAuth 2.0 authentication)
- **FHIR Server** (HAPI FHIR Server for data)

**Options:**
- Use staging servers (credentials required - see Environment Configuration section)
- Set up local servers using Docker (see [fhir-web Docker documentation](./fhir-web-docker-deployment.md))

## Project Setup

### 1. Navigate to Project Directory

```bash
# Navigate into the project directory
cd fhir-web
```

### 2. Install Dependencies

This project uses Yarn Workspaces and Lerna for monorepo management.

```bash
yarn install
```

This will install dependencies for:
- The main app (`/app`)
- All packages (`/packages/*`)

**Expected output:** Installation should complete without errors. This may take 2-5 minutes.

### 3. Build All Packages

Before running the app, you need to build all the packages it depends on:

```bash
yarn lerna:prepublish
```

**Expected output:** All packages in `/packages` will be compiled. This may take 1-3 minutes.

## SSL Certificate Setup

**Why HTTPS is Required:** OAuth 2.0 redirect URIs typically require HTTPS for security. Running on `http://localhost:3000` will cause authentication failures.

### Generate SSL Certificates

Run the automated script from the project root:

```bash
yarn generate-certs
```

This will:
- Use `mkcert` if available (recommended)
- Fall back to `openssl` if `mkcert` is not installed
- Generate two files in project root directory:
  - `localhost.pem` (certificate)
  - `localhost-key.pem` (private key)

### Verify Certificate Files

```bash
ls -la | grep localhost
```

You should see:
```
-rw-r--r--  1 user  staff  1234 Jan 01 12:00 localhost-key.pem
-rw-r--r--  1 user  staff  5678 Jan 01 12:00 localhost.pem
```

**Note:** These certificate files are already in `.gitignore` and should NOT be committed to version control.

## Environment Configuration

### 1. Create Environment File

```bash
cp app/.env.sample app/.env
```

### 2. Configure Environment Variables

Open `app/.env` in your editor and update the following critical variables:

#### Required OAuth/Keycloak Configuration

```bash
# IMPORTANT: Must use https:// for OAuth to work
REACT_APP_DOMAIN_NAME=https://localhost:3000

# Keycloak OAuth URLs - Update with your Keycloak server details
REACT_APP_OPENSRP_ACCESS_TOKEN_URL=https://your-keycloak-server/auth/realms/YOUR_REALM/protocol/openid-connect/token
REACT_APP_OPENSRP_AUTHORIZATION_URL=https://your-keycloak-server/auth/realms/YOUR_REALM/protocol/openid-connect/auth
REACT_APP_OPENSRP_USER_URL=https://your-keycloak-server/auth/realms/YOUR_REALM/protocol/openid-connect/userinfo

# Client ID from your Keycloak client configuration
REACT_APP_OPENSRP_CLIENT_ID=your-client-id

# Keycloak Admin API (for user management features)
REACT_APP_KEYCLOAK_API_BASE_URL=https://your-keycloak-server/auth/admin/realms/YOUR_REALM
```

#### FHIR Server Configuration

```bash
# FHIR server base URL
REACT_APP_FHIR_API_BASE_URL=https://your-fhir-server/fhir
```

#### Authentication Settings

```bash
# Use direct Keycloak authentication (no Express backend)
REACT_APP_BACKEND_ACTIVE=false

# Enable OAuth
REACT_APP_ENABLE_OPENSRP_OAUTH=true
REACT_APP_OPENSRP_OAUTH_SCOPES=openid

# Disable for local development (optional - not recommended for production)
REACT_APP_DISABLE_LOGIN_PROTECTION=false
```

#### Feature Flags

Enable the features you want to use:

```bash
# User Management (Parent - must be enabled for child menus to work)
REACT_APP_ENABLE_FHIR_USER_MANAGEMENT=true

# User Management Child Menus (NEW - can be individually controlled)
REACT_APP_ENABLE_USERS=true
REACT_APP_ENABLE_USER_GROUPS=true
REACT_APP_ENABLE_USER_ROLES=true
REACT_APP_ENABLE_USER_SYNC=true

# Other Features
REACT_APP_ENABLE_FHIR_LOCATIONS=true
REACT_APP_ENABLE_FHIR_TEAMS=true
REACT_APP_ENABLE_FHIR_PATIENTS=true
REACT_APP_ENABLE_FHIR_CARE_TEAM=true
REACT_APP_ENABLE_QUEST=true
REACT_APP_ENABLE_FHIR_GROUP=true
REACT_APP_ENABLE_FHIR_COMMODITY=true
```

### 3. Example Configuration (Staging Server)

If you have access to the staging servers, use:

```bash
REACT_APP_DOMAIN_NAME=https://localhost:3000
REACT_APP_OPENSRP_ACCESS_TOKEN_URL=https://keycloak-stage.smartregister.org/auth/realms/FHIR_Android/protocol/openid-connect/token
REACT_APP_OPENSRP_AUTHORIZATION_URL=https://keycloak-stage.smartregister.org/auth/realms/FHIR_Android/protocol/openid-connect/auth
REACT_APP_OPENSRP_USER_URL=https://keycloak-stage.smartregister.org/auth/realms/FHIR_Android/protocol/openid-connect/userinfo
REACT_APP_OPENSRP_CLIENT_ID=fhir-web
REACT_APP_KEYCLOAK_API_BASE_URL=https://keycloak-stage.smartregister.org/auth/admin/realms/FHIR_Android
REACT_APP_FHIR_API_BASE_URL=https://fhir.labs.smartregister.org/fhir/
REACT_APP_BACKEND_ACTIVE=false
REACT_APP_ENABLE_OPENSRP_OAUTH=true
```

## Running the Application

### Option 1: Quick Start with HTTPS (Recommended)

```bash
yarn start
```

This will:
- Start the React app with HTTPS enabled (configured by default)
- Use the generated SSL certificates
- Open at `https://localhost:3000`

**Expected browser behavior:**
1. Browser will show a security warning (because it's a self-signed certificate)
2. Click "Advanced" → "Proceed to localhost (unsafe)" or similar
3. App should load and redirect to Keycloak login

### Option 2: Development Script (Auto-generates certs + starts HTTPS)

```bash
yarn dev
```

This will:
1. Check for certificates and generate if missing
2. Start the app with HTTPS

### Option 3: Handle CORS Issues with Chrome

If you encounter CORS errors (common when connecting to external APIs), use the Chrome launch script:

**Terminal 1:**
```bash
yarn start
```

**Terminal 2:**
```bash
yarn start:chrome
```

This opens Chrome with:
- Web security disabled (allows CORS)
- Separate user profile (won't affect your regular Chrome)
- All cookies/storage isolated to `/tmp/chrome`

**Alternatively, run the command manually:**
```bash
open -n -a "Google Chrome" --args --user-data-dir=/tmp/chrome --disable-web-security
```

Then navigate to `https://localhost:3000`

### Accessing the Application

Once running, the app will be available at:
- **URL:** `https://localhost:3000`
- **Login:** Redirects to your configured Keycloak server
- **Default page after login:** Dashboard

## Testing the User Sync Feature

The User Sync feature automatically creates missing FHIR resources (Practitioner, Group, PractitionerRole) for Keycloak users.

### 1. Enable Feature Flags

Ensure these are set in your `.env`:

```bash
REACT_APP_ENABLE_FHIR_USER_MANAGEMENT=true
REACT_APP_ENABLE_USER_SYNC=true
```

### 2. Restart the App

```bash
# Stop the app (Ctrl+C) and restart
yarn start
```

### 3. Access User Sync

1. Log in to the application
2. Navigate to: **Administration → User Management → User Sync**
3. Click "Scan Users" to check which users need FHIR resources
4. Click "Sync All" to create missing resources

### 4. Verify Sync

Check your FHIR server for created resources:
- Practitioners: `https://your-fhir-server/fhir/Practitioner`
- Groups: `https://your-fhir-server/fhir/Group`
- PractitionerRoles: `https://your-fhir-server/fhir/PractitionerRole`

## Development Workflow

### Making Changes to Packages

When you modify code in `/packages/*`, you must rebuild that package to see changes:

```bash
# Example: After editing fhir-group-management
cd packages/fhir-group-management
yarn build

# Return to app and refresh browser
cd ../../app
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests for specific package
yarn test packages/fhir-user-sync

# Run app tests only
cd app
yarn test

# Watch mode (re-runs on file changes)
cd app
yarn test:watch
```

### Linting

```bash
# Check for linting issues
yarn lint

# Auto-fix linting issues
yarn lint --fix
```

### Rebuilding All Packages

After pulling latest changes or switching branches:

```bash
yarn lerna:prepublish
```

## Troubleshooting

### CORS Errors

**Symptom:** Console shows `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Use the Chrome script: `yarn start:chrome`
2. Configure CORS on your FHIR/Keycloak server
3. Use a proxy or CORS browser extension (not recommended)

### SSL Certificate Errors

**Symptom:** Browser refuses to connect, shows "Your connection is not private"

**Solutions:**
1. Click "Advanced" → "Proceed to localhost"
2. Regenerate certificates:
   ```bash
   rm localhost.pem localhost-key.pem
   yarn generate-certs
   ```
3. If using Firefox, ensure `nss` is installed with mkcert

### Keycloak Redirect Errors

**Symptom:** After login, redirected to `http://localhost:3000` instead of `https://localhost:3000`

**Solution:**
1. Verify `REACT_APP_DOMAIN_NAME=https://localhost:3000` in `.env`
2. Update Keycloak client configuration:
   - Valid Redirect URIs: `https://localhost:3000/*`
   - Web Origins: `https://localhost:3000`
3. Restart the app

### 401 Unauthorized Errors

**Symptom:** API calls fail with 401 Unauthorized

**Solutions:**
1. Check Keycloak client configuration allows the OAuth grant type
2. Verify OAuth scopes in `.env` match Keycloak client scopes
3. Check access token in browser DevTools → Application → Storage
4. Ensure user has required permissions in Keycloak

### Package Changes Not Showing

**Symptom:** Modified package code doesn't appear in the running app

**Solution:**
```bash
# Rebuild the specific package
cd packages/[package-name]
yarn build

# OR rebuild all packages
cd ../..
yarn lerna:prepublish
```

### Port Already in Use

**Symptom:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Kill the process using port 3000:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID [PID] /F
   ```
2. Or use a different port:
   ```bash
   PORT=3001 yarn start
   ```

### Module Not Found Errors

**Symptom:** `Cannot find module '@opensrp/...'`

**Solutions:**
```bash
# Clean install
rm -rf node_modules
rm -rf app/node_modules
rm -rf packages/*/node_modules
yarn install
yarn lerna:prepublish
```

### Build Errors After Git Pull

**Symptom:** Errors after pulling latest changes from git

**Solution:**
```bash
# Clean and reinstall everything
yarn install
yarn lerna:prepublish
```

## Additional Resources

- [Environment Variables Reference](/docs/env.md)
- [Contributing Guide](/docs/CONTRIBUTING.md)
- [Docker Deployment](/docs/fhir-web-docker-deployment.md)
- [Internationalization (i18n)](/docs/I18n.md)
- [Publishing Packages](/docs/publishing.md)

## Need Help?

- Check [GitHub Issues](https://github.com/opensrp/web/issues)
- Consult [Keycloak Documentation](https://www.keycloak.org/documentation)
- Review [FHIR Documentation](https://www.hl7.org/fhir/)
