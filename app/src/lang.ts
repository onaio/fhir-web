import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ERROR_OCCURRED = i18n.t(`${namespace}::An error occurred`);
  lang.DOWNLOAD_CLIENT_DATA = i18n.t(`${namespace}::Download Client Data`);
  lang.CARD_SUPPORT = i18n.t(`${namespace}::Card Support`);
  lang.LOGIN = i18n.t(`${namespace}::Login`);
  lang.MANAGE_ACCOUNT = i18n.t(`${namespace}::Manage account`);
  lang.LOGIN_PROMPT = i18n.t(`${namespace}::Please log in with one of the following providers`);
  lang.USER_MANAGEMENT = i18n.t(`${namespace}::User Management`);
  lang.TEAM_ASSIGNMENT = i18n.t(`${namespace}::Team Assignment`);
  lang.USER_GROUPS = i18n.t(`${namespace}::User Groups`);
  lang.USER_ROLES = i18n.t(`${namespace}::User Roles`);
  lang.TEAMS = i18n.t(`${namespace}::Teams`);
  lang.LOCATION_UNIT = i18n.t(`${namespace}::Location unit`);
  lang.LOCATION_UNIT_GROUP = i18n.t(`${namespace}::Location unit group`);
  lang.PRODUCT_CATALOGUE = i18n.t(`${namespace}::Product Catalogue`);
  lang.MANIFEST_RELEASES = i18n.t(`${namespace}::Manifest Releases`);
  lang.DRAFT_FILES = i18n.t(`${namespace}::Draft Files`);
  lang.JSON_VALIDATORS = i18n.t(`${namespace}::JSON Validators`);
  lang.FORM_CONFIGURATION = i18n.t(`${namespace}::Form Configuration`);
  lang.PLANS = i18n.t(`${namespace}::Plans`);
  lang.ACTIVE = i18n.t(`${namespace}::Active`);
  lang.DRAFT = i18n.t(`${namespace}::Draft`);
  lang.COMPLETE = i18n.t(`${namespace}::Complete`);
  lang.TRASH = i18n.t(`${namespace}::Retired`);
  lang.LOCATIONS = i18n.t(`${namespace}::Locations`);
  lang.USERS = i18n.t(`${namespace}::Users`);
  lang.ADMIN = i18n.t(`${namespace}::Admin`);
  lang.MISSIONS = i18n.t(`${namespace}::Missions`);
  lang.WELCOME_TO_OPENSRP = i18n.t(`${namespace}::Welcome to OpenSRP`);
  lang.INVENTORY = i18n.t(`${namespace}::Inventory`);
  lang.SERVICE_POINT_INVENTORY = i18n.t(`${namespace}::Service point inventory`);
  lang.ADD_INVENTORY_VIA_CSV = i18n.t(`${namespace}::Add inventory via CSV`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
