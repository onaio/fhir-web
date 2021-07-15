import { namespace } from './mls';

/** hack: to get the correct TFunction type from i18next  we'll need to move to tsc >= v4.0.1*/
export interface TFunction {
  (t: string, options: Record<string, unknown>): typeof t;
}

/** recompute values */
export function lang(t: TFunction) {
  return {
    ERROR_OCCURRED: t(`An error occurred`, { ns: namespace }),
    DOWNLOAD_CLIENT_DATA: t(`Download Client Data`, { ns: namespace }),
    CARD_SUPPORT: t(`Card Support`, { ns: namespace }),
    LOGIN: t(`Login`, { ns: namespace }),
    LOGOUT: t(`Logout`, { ns: namespace }),
    MANAGE_ACCOUNT: t(`Manage account`, { ns: namespace }),
    LOGIN_PROMPT: t(`Please log in with one of the following providers`, {
      ns: namespace,
    }),
    USER_MANAGEMENT: t(`User Management`, { ns: namespace }),
    TEAM_ASSIGNMENT: t(`Team Assignment`, { ns: namespace }),
    USER_GROUPS: t(`User Groups`, { ns: namespace }),
    USER_ROLES: t(`User Roles`, { ns: namespace }),
    TEAMS: t(`Teams`, { ns: namespace }),
    LOCATION_UNIT: t(`Location unit`, { ns: namespace }),
    LOCATION_UNIT_GROUP: t(`Location unit group`, { ns: namespace }),
    PRODUCT_CATALOGUE: t(`Product Catalogue`, { ns: namespace }),
    MANIFEST_RELEASES: t(`Manifest Releases`, { ns: namespace }),
    DRAFT_FILES: t(`Draft Files`, { ns: namespace }),
    JSON_VALIDATORS: t(`JSON Validators`, { ns: namespace }),
    FORM_CONFIGURATION: t(`Form Configuration`, { ns: namespace }),
    PLANS: t(`Plans`, { ns: namespace }),
    ACTIVE: t(`Active`, { ns: namespace }),
    DRAFT: t(`Draft`, { ns: namespace }),
    COMPLETE: t(`Complete`, { ns: namespace }),
    RETIRED: t(`Retired`, { ns: namespace }),
    LOCATIONS: t(`Locations`, { ns: namespace }),
    USERS: t(`Users`, { ns: namespace }),
    ADMIN: t(`Admin`, { ns: namespace }),
    MISSIONS: t(`Missions`, { ns: namespace }),
    WELCOME_TO_OPENSRP: t(`Welcome to OpenSRP`, { ns: namespace }),
    INVENTORY: t(`Inventory`, { ns: namespace }),
    SERVICE_POINT_INVENTORY: t(`Service point inventory`, { ns: namespace }),
    ADD_INVENTORY_VIA_CSV: t(`Add inventory via CSV`, { ns: namespace }),
  };
}

export default lang;
