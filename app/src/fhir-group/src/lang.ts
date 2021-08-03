import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  // Tooltips
  lang.TIP_REQUIRED_FIELD = i18n.t(`This is a required field`, { ns: namespace });

  // Errors
  lang.ERROR_OCCURRED = i18n.t(`An error occurred`, { ns: namespace });

  // Messages
  lang.MSG_ASSIGN_PRACTITIONERS = i18n.t(`Assigning Practitioners`, { ns: namespace });
  lang.MSG_ASSIGN_PRACTITONERS_SUCCESS = i18n.t(`Successfully Assigned Practitioners`, {
    ns: namespace,
  });
  lang.MSG_GROUP_UPDATE_SUCCESS = i18n.t(`Successfully Updated Group`, { ns: namespace });
  lang.MSG_GROUP_ADD_SUCCESS = i18n.t(`Successfully Added Group`, { ns: namespace });

  // Rendered text
  lang.ENTER_GROUP_NAME = i18n.t(`Enter a group name`, { ns: namespace });
  lang.ENTER_COMMENT = i18n.t(`Enter comment`, { ns: namespace });
  lang.ENTER_EXTRADETAILS = i18n.t(`Enter extra details`, { ns: namespace });
  lang.ENTER_ORGANIZATION = i18n.t(`Enter organization`, { ns: namespace });
  lang.LAST_UPDATED_DATE = i18n.t(`Last updated date`, { ns: namespace });
  lang.GROUP_NAME = i18n.t(`Group Name`, { ns: namespace });
  lang.STATUS = i18n.t(`Status`, { ns: namespace });
  lang.GROUP_MEMBERS = i18n.t(`Group Members`, { ns: namespace });
  lang.Active = i18n.t(`Active`, { ns: namespace });
  lang.ORGANIZATION = i18n.t(`Organization`, { ns: namespace });
  lang.NOORGANIZATION = i18n.t(`No organization`, { ns: namespace });
  lang.SAVING = i18n.t(`Saving`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.ACTIVE = i18n.t(`Active`, { ns: namespace });
  lang.INACTIVE = i18n.t(`Inactive`, { ns: namespace });
  lang.SELECT_PRACTITIONER = i18n.t(`Select user (practitioners only)`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.EDIT_GROUP = i18n.t(`Edit Group`, { ns: namespace });
  lang.CREATE_GROUP = i18n.t(`Create Group`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.COMMENT = i18n.t(`Comment`, { ns: namespace });
  lang.NOCOMMENT = i18n.t(`No comment`, { ns: namespace });
  lang.EXTRADETAILS = i18n.t(`Extra Details`, { ns: namespace });
  lang.CREATE = i18n.t(`Create`, { ns: namespace });
  lang.IDENTIFIER = i18n.t(`Identifier`, { ns: namespace });
  lang.NO_GROUP_MEMBERS = i18n.t(`No group members`, { ns: namespace });
  lang.GROUPS = i18n.t(`Groups`, { ns: namespace });
  lang.SEARCH = i18n.t(`Search`, { ns: namespace });
  lang.MSG_GROUPS_UPDATE_SUCCESS = i18n.t(`Groups Update Successfully`, { ns: namespace });
  lang.MSG_GROUPS_ADD_SUCCESS = i18n.t(`Groups Added Successfully`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
