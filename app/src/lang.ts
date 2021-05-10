import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ERROR_OCCURRED = i18n.t(`An error occurred`, { ns: namespace });
  lang.DOWNLOAD_CLIENT_DATA = i18n.t(`Download Client Data`, { ns: namespace });
  lang.CARD_SUPPORT = i18n.t(`Card Support`, { ns: namespace });
  lang.LOGIN = i18n.t(`Login`, { ns: namespace });
  lang.MANAGE_ACCOUNT = i18n.t(`Manage account`, { ns: namespace });
  lang.LOGIN_PROMPT = i18n.t(`Please log in with one of the following providers`, {
    ns: namespace,
  });
  lang.USER_MANAGEMENT = i18n.t(`User Management`, { ns: namespace });
  lang.TEAM_ASSIGNMENT = i18n.t(`Team Assignment`, { ns: namespace });
  lang.USER_GROUPS = i18n.t(`User Groups`, { ns: namespace });
  lang.USER_ROLES = i18n.t(`User Roles`, { ns: namespace });
  lang.TEAMS = i18n.t(`Teams`, { ns: namespace });
  lang.PATIENTS = i18n.t(`Patients`, { ns: namespace });
  lang.LOCATION_UNIT = i18n.t(`Location unit`, { ns: namespace });
  lang.LOCATION_UNIT_GROUP = i18n.t(`Location unit group`, { ns: namespace });
  lang.PRODUCT_CATALOGUE = i18n.t(`Product Catalogue`, { ns: namespace });
  lang.MANIFEST_RELEASES = i18n.t(`Manifest Releases`, { ns: namespace });
  lang.DRAFT_FILES = i18n.t(`Draft Files`, { ns: namespace });
  lang.JSON_VALIDATORS = i18n.t(`JSON Validators`, { ns: namespace });
  lang.FORM_CONFIGURATION = i18n.t(`Form Configuration`, { ns: namespace });
  lang.PLANS = i18n.t(`Plans`, { ns: namespace });
  lang.ACTIVE = i18n.t(`Active`, { ns: namespace });
  lang.DRAFT = i18n.t(`Draft`, { ns: namespace });
  lang.COMPLETE = i18n.t(`Complete`, { ns: namespace });
  lang.RETIRED = i18n.t(`Retired`, { ns: namespace });
  lang.LOCATIONS = i18n.t(`Locations`, { ns: namespace });
  lang.USERS = i18n.t(`Users`, { ns: namespace });
  lang.ADMIN = i18n.t(`Admin`, { ns: namespace });
  lang.MISSIONS = i18n.t(`Missions`, { ns: namespace });
  lang.WELCOME_TO_OPENSRP = i18n.t(`Welcome to OpenSRP`, { ns: namespace });
  lang.INVENTORY = i18n.t(`Inventory`, { ns: namespace });
  lang.SERVICE_POINT_INVENTORY = i18n.t(`Service point inventory`, { ns: namespace });
  lang.ADD_INVENTORY_VIA_CSV = i18n.t(`Add inventory via CSV`, { ns: namespace });
  lang.PATIENTS = i18n.t(`Patients`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
