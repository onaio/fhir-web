import i18n, { namespace } from './mls';
import { TFunction } from 'react-i18next';

/** recompute values */
export function lang(t: TFunction) {
  return {
    ERROR_OCCURRED: i18n.t(`An error occurred`, { ns: namespace }),
    DOWNLOAD_CLIENT_DATA: i18n.t(`Download Client Data`, { ns: namespace }),
    CARD_SUPPORT: i18n.t(`Card Support`, { ns: namespace }),
    LOGIN: i18n.t(`Login`, { ns: namespace }),
    MANAGE_ACCOUNT: i18n.t(`Manage account`, { ns: namespace }),
    LOGIN_PROMPT: i18n.t(`Please log in with one of the following providers`, {
      ns: namespace,
    }),
    USER_MANAGEMENT: i18n.t(`User Management`, { ns: namespace }),
    TEAM_ASSIGNMENT: i18n.t(`Team Assignment`, { ns: namespace }),
    USER_GROUPS: i18n.t(`User Groups`, { ns: namespace }),
    USER_ROLES: i18n.t(`User Roles`, { ns: namespace }),
    TEAMS: i18n.t(`Teams`, { ns: namespace }),
    LOCATION_UNIT: i18n.t(`Location unit`, { ns: namespace }),
    LOCATION_UNIT_GROUP: i18n.t(`Location unit group`, { ns: namespace }),
    PRODUCT_CATALOGUE: i18n.t(`Product Catalogue`, { ns: namespace }),
    MANIFEST_RELEASES: i18n.t(`Manifest Releases`, { ns: namespace }),
    DRAFT_FILES: i18n.t(`Draft Files`, { ns: namespace }),
    JSON_VALIDATORS: i18n.t(`JSON Validators`, { ns: namespace }),
    FORM_CONFIGURATION: i18n.t(`Form Configuration`, { ns: namespace }),
    PLANS: i18n.t(`Plans`, { ns: namespace }),
    ACTIVE: i18n.t(`Active`, { ns: namespace }),
    DRAFT: i18n.t(`Draft`, { ns: namespace }),
    COMPLETE: i18n.t(`Complete`, { ns: namespace }),
    RETIRED: i18n.t(`Retired`, { ns: namespace }),
    LOCATIONS: i18n.t(`Locations`, { ns: namespace }),
    USERS: i18n.t(`Users`, { ns: namespace }),
    ADMIN: i18n.t(`Admin`, { ns: namespace }),
    MISSIONS: i18n.t(`Missions`, { ns: namespace }),
    WELCOME_TO_OPENSRP: i18n.t(`Welcome to OpenSRP`, { ns: namespace }),
    INVENTORY: i18n.t(`Inventory`, { ns: namespace }),
    SERVICE_POINT_INVENTORY: i18n.t(`Service point inventory`, { ns: namespace }),
    ADD_INVENTORY_VIA_CSV: i18n.t(`Add inventory via CSV`, { ns: namespace }),
  };
}

export default lang;
