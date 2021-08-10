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
  lang.PRACTITIONER_ROLE_UPDATE_SUCCESS = i18n.t(`Successfully Updated Practitioner Role`, {
    ns: namespace,
  });
  lang.PRACTITIONER_ROLE_ADD_SUCCESS = i18n.t(`Successfully Added Practitioner Role`, {
    ns: namespace,
  });
  lang.PRACTITIONER_ROLE_DELETE_SUCCESS = i18n.t(`Successfully Deleted Practitioner Role`, {
    ns: namespace,
  });
  lang.CONFIRM_DELETE = i18n.t(`Are you sure you want to delete this Practitioner Role?`, {
    ns: namespace,
  });
  lang.YES = i18n.t(`Yes`, { ns: namespace });
  lang.NO = i18n.t(`No`, { ns: namespace });

  // Rendered text
  lang.STATUS = i18n.t(`Status`, { ns: namespace });
  lang.NAME = i18n.t(`Name`, { ns: namespace });
  lang.SAVING = i18n.t(`Saving`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.ACTIVE = i18n.t(`Active`, { ns: namespace });
  lang.INACTIVE = i18n.t(`Inactive`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.EDIT_PRACTITIONER_ROLE = i18n.t(`Edit Practitioner Role`, { ns: namespace });
  lang.CREATE_PRACTITIONER_ROLE = i18n.t(`Create Practitioner Role`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.CREATE = i18n.t(`Create`, { ns: namespace });
  lang.IDENTIFIER = i18n.t(`Identifier`, { ns: namespace });
  lang.TEAMS = i18n.t(`Practitioner Roles`, { ns: namespace });
  lang.SEARCH = i18n.t(`Search`, { ns: namespace });
  lang.IDENTIFIER = i18n.t(`Identifier`, { ns: namespace });
  lang.PRACTITIONER_ROLE_PAGE_HEADER = i18n.t(`FHIR Practitioner Role`, { ns: namespace });
  lang.ORGANIZATION = i18n.t(`Organization`, { ns: namespace });
  lang.PRACTITIONER = i18n.t(`Practitioner`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
