import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_OCCURED = i18n.t(`An error occurred`, { ns: namespace });
  lang.FIRST_NAME_REQUIRED = i18n.t(`First Name is required`, { ns: namespace });
  lang.LAST_NAME_REQUIRED = i18n.t(`Last Name is required`, { ns: namespace });
  lang.USERNAME_REQUIRED = i18n.t(`Username is required`, { ns: namespace });
  lang.NAME_REQUIRED = i18n.t(`Name is required`, { ns: namespace });
  lang.ERROR_CONFIRM_PASSWORD_REQUIRED = i18n.t(`Confirm Password is required`, { ns: namespace });
  lang.ERROR_PASSWORD_REQUIRED = i18n.t(`Password is required`, { ns: namespace });
  lang.ERROR_PASSWORD_MISMATCH = i18n.t(`The two passwords that you entered do not match!`, {
    ns: namespace,
  });

  // Messages
  lang.USER_DELETED_SUCCESSFULLY = i18n.t(`User deleted successfully`, { ns: namespace });
  lang.MESSAGE_USER_EDITED = i18n.t(`User edited successfully`, { ns: namespace });
  lang.MESSAGE_USER_CREATED = i18n.t(`User created successfully`, { ns: namespace });
  lang.MESSAGE_USER_GROUP_EDITED = i18n.t(`User Group edited successfully`, { ns: namespace });
  lang.MESSAGE_USER_GROUP_CREATED = i18n.t(`User Group created successfully`, { ns: namespace });
  lang.CREDENTIALS_UPDATED_SUCCESSFULLY = i18n.t(`Credentials updated successfully`, {
    ns: namespace,
  });
  lang.PRACTITIONER_CREATED_SUCCESSFULLY = i18n.t(`Practitioner created successfully`, {
    ns: namespace,
  });
  lang.PRACTITIONER_UPDATED_SUCCESSFULLY = i18n.t(`Practitioner updated successfully`, {
    ns: namespace,
  });
  lang.PRACTITIONER_DEACTIVATED_SUCCESSFULLY = i18n.t(`Practitioner deactivated successfully`, {
    ns: namespace,
  });
  lang.PRACTITIONER_UNASSIGNED_SUCCESSFULLY = i18n.t(`Practitioner unassigned successfully`, {
    ns: namespace,
  });
  lang.ROLES_UPDATED_SUCCESSFULLY = i18n.t(`Role Mappings Updated Successfully`, { ns: namespace });
  lang.REALM_ROLES = i18n.t(`Realm Roles`, { ns: namespace });
  lang.AVAILABLE_ROLES = i18n.t(`Available Roles`, { ns: namespace });
  lang.ASSIGNED_ROLES = i18n.t(`Assigned Roles`, { ns: namespace });
  lang.EFFECTIVE_ROLES = i18n.t(`Effective Roles`, { ns: namespace });
  lang.LIST_IS_EMPTY = i18n.t(`The list is empty`, { ns: namespace });
  lang.SEARCH = i18n.t(`Search`, { ns: namespace });
  lang.NO_DATA_FOUND = i18n.t(`No Data Found`, { ns: namespace });

  // rendered text
  lang.CREDENTIALS = i18n.t(`User Credentials`, { ns: namespace });
  lang.RESET_PASSWORD = i18n.t(`Set password`, { ns: namespace });
  lang.EDIT_USER = i18n.t(`Edit User`, { ns: namespace });
  lang.EDIT_USER_GROUP = i18n.t(`Edit User Group`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.ACTIONS = i18n.t(`Actions`, { ns: namespace });
  lang.COMPOSITE = i18n.t(`Composite`, { ns: namespace });
  lang.DESCRIPTION = i18n.t(`Description`, { ns: namespace });
  lang.NAME = i18n.t(`Name`, { ns: namespace });
  lang.GROUP_UUID = i18n.t(`Group UUID`, { ns: namespace });
  lang.ROLES = i18n.t(`Roles`, { ns: namespace });
  lang.MEMBERS = i18n.t(`Members`, { ns: namespace });
  lang.ADD_USER = i18n.t(`Add User`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.USER_MANAGEMENT_PAGE_HEADER = i18n.t(`User Management`, { ns: namespace });
  lang.USER_GROUPS_PAGE_HEADER = i18n.t(`User Groups`, { ns: namespace });
  lang.USER_ROLES_PAGE_HEADER = i18n.t(`User Roles`, { ns: namespace });
  lang.ADD_USER_GROUP = i18n.t(`New User Group`, { ns: namespace });
  lang.VIEW_DETAILS = i18n.t(`View Details`, { ns: namespace });
  lang.TEMPORARY = i18n.t(`Temporary`, { ns: namespace });
  lang.PASSWORD = i18n.t(`Password`, { ns: namespace });
  lang.CONFIRM_PASSWORD = i18n.t(`Confirm Password`, { ns: namespace });
  lang.FIRST_NAME = i18n.t(`First Name`, { ns: namespace });
  lang.LAST_NAME = i18n.t(`Last Name`, { ns: namespace });
  lang.EMAIL = i18n.t(`Email`, { ns: namespace });
  lang.USERNAME = i18n.t(`Username`, { ns: namespace });
  lang.MARK_AS_PRACTITIONER = i18n.t(`Mark as Practitioner`, { ns: namespace });
  lang.REQUIRED_ACTIONS = i18n.t(`Required Actions`, { ns: namespace });
  lang.ENABLE_USER = i18n.t(`Enable user`, { ns: namespace });
  lang.PLEASE_SELECT = i18n.t(`Please select`, { ns: namespace });
  lang.GROUP = i18n.t(`Group`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.SAVING = i18n.t(`Saving`, { ns: namespace });
  lang.CONTACT = i18n.t(`Contact`, { ns: namespace });
  lang.CONTACT_IS_REQUIRED_ERROR = i18n.t(`Contact is required`, { ns: namespace });
  lang.CONTACT_REGEX_ERROR = i18n.t(`Contact should be 10 digits and start with 0`, {
    ns: namespace,
  });
  lang.KEYCLOAK_UUID = i18n.t(`Keycloak UUID`, { ns: namespace });
  lang.PRACTITIONER_UUID = i18n.t(`Practitioner UUID`, { ns: namespace });
  lang.PRACTITIONER_STATUS = i18n.t(`Practitioner Status`, { ns: namespace });
  lang.ASSIGNED_TEAMS = i18n.t(`Assigned Teams`, { ns: namespace });
  lang.NO_ASSIGNED_TEAMS = i18n.t(`No Assigned Teams`, { ns: namespace });
  lang.PRACTITIONER = i18n.t(`Practitioner`, { ns: namespace });
  lang.NO_ACTIVE_PRACTITIONER = i18n.t(`No Active Practitioner`, { ns: namespace });
  lang.NO_ASSIGNED_ROLES = i18n.t(`No Assigned Roles`, { ns: namespace });
  lang.NO_ASSIGNED_MEMBERS = i18n.t(`No Assigned Members`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
