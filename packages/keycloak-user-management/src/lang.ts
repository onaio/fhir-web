import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_OCCURED = i18n.t(`${namespace}::An error occurred`);
  lang.FIRST_NAME_REQUIRED = i18n.t(`${namespace}::First Name is required`);
  lang.LAST_NAME_REQUIRED = i18n.t(`${namespace}::Last Name is required`);
  lang.USERNAME_REQUIRED = i18n.t(`${namespace}::Username is required`);
  lang.NAME_REQUIRED = i18n.t(`${namespace}::Name is required`);
  lang.ERROR_CONFIRM_PASSWORD_REQUIRED = i18n.t(`${namespace}::Confirm Password is required`);
  lang.ERROR_PASSWORD_REQUIRED = i18n.t(`${namespace}::Password is required`);
  lang.ERROR_PASSWORD_MISMATCH = i18n.t(
    `${namespace}::The two passwords that you entered do not match!`
  );

  // Messages
  lang.USER_DELETED_SUCCESSFULLY = i18n.t(`${namespace}::User deleted successfully`);
  lang.MESSAGE_USER_EDITED = i18n.t(`${namespace}::User edited successfully`);
  lang.MESSAGE_USER_CREATED = i18n.t(`${namespace}::User created successfully`);
  lang.MESSAGE_USER_GROUP_EDITED = i18n.t(`${namespace}::User Group edited successfully`);
  lang.MESSAGE_USER_GROUP_CREATED = i18n.t(`${namespace}::User Group created successfully`);
  lang.CREDENTIALS_UPDATED_SUCCESSFULLY = i18n.t(`${namespace}::Credentials updated successfully`);
  lang.PRACTITIONER_CREATED_SUCCESSFULLY = i18n.t(
    `${namespace}::Practitioner created successfully`
  );
  lang.PRACTITIONER_UPDATED_SUCCESSFULLY = i18n.t(
    `${namespace}::Practitioner updated successfully`
  );
  lang.ROLES_UPDATED_SUCCESSFULLY = i18n.t(`${namespace}::Role Mappings Updated Successfully`);
  lang.REALM_ROLES = i18n.t(`${namespace}::Realm Roles`);
  lang.AVAILABLE_ROLES = i18n.t(`${namespace}::Available Roles`);
  lang.ASSIGNED_ROLES = i18n.t(`${namespace}::Assigned Roles`);
  lang.EFFECTIVE_ROLES = i18n.t(`${namespace}::Effective Roles`);
  lang.LIST_IS_EMPTY = i18n.t(`${namespace}::The list is empty`);
  lang.SEARCH = i18n.t(`${namespace}::Search`);
  lang.NO_DATA_FOUND = i18n.t(`${namespace}::No Data Found`);

  // rendered text
  lang.CREDENTIALS = i18n.t(`${namespace}::User Credentials`);
  lang.RESET_PASSWORD = i18n.t(`${namespace}::Set password`);
  lang.EDIT_USER = i18n.t(`${namespace}::Edit User`);
  lang.EDIT_USER_GROUP = i18n.t(`${namespace}::Edit User Group`);
  lang.EDIT = i18n.t(`${namespace}::Edit`);
  lang.ACTIONS = i18n.t(`${namespace}::Actions`);
  lang.COMPOSITE = i18n.t(`${namespace}::Composite`);
  lang.DESCRIPTION = i18n.t(`${namespace}::Description`);
  lang.NAME = i18n.t(`${namespace}::Name`);
  lang.ROLES = i18n.t(`${namespace}::Roles`);
  lang.MEMBERS = i18n.t(`${namespace}::Members`);
  lang.ADD_USER = i18n.t(`${namespace}::Add User`);
  lang.CANCEL = i18n.t(`${namespace}::Cancel`);
  lang.USER_MANAGEMENT_PAGE_HEADER = i18n.t(`${namespace}::User Management`);
  lang.USER_GROUPS_PAGE_HEADER = i18n.t(`${namespace}::User Groups`);
  lang.USER_ROLES_PAGE_HEADER = i18n.t(`${namespace}::User Roles`);
  lang.ADD_USER_GROUP = i18n.t(`${namespace}::New User Group`);
  lang.VIEW_DETAILS = i18n.t(`${namespace}::View Details`);
  lang.TEMPORARY = i18n.t(`${namespace}::Temporary`);
  lang.PASSWORD = i18n.t(`${namespace}::Password`);
  lang.CONFIRM_PASSWORD = i18n.t(`${namespace}::Confirm Password`);
  lang.FIRST_NAME = i18n.t(`${namespace}::First Name`);
  lang.LAST_NAME = i18n.t(`${namespace}::Last Name`);
  lang.EMAIL = i18n.t(`${namespace}::Email`);
  lang.USERNAME = i18n.t(`${namespace}::Username`);
  lang.MARK_AS_PRACTITIONER = i18n.t(`${namespace}::Mark as Practitioner`);
  lang.REQUIRED_ACTIONS = i18n.t(`${namespace}::Required Actions`);
  lang.PLEASE_SELECT = i18n.t(`${namespace}::Please select`);
  lang.GROUP = i18n.t(`${namespace}::Group`);
  lang.SAVE = i18n.t(`${namespace}::Save`);
  lang.SAVING = i18n.t(`${namespace}::Saving`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
