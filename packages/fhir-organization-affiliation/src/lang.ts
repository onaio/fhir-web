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
  lang.ORG_AFFILIATION_UPDATE_SUCCESS = i18n.t(`Successfully Updated Organization Affiliation`, {
    ns: namespace,
  });
  lang.ORG_AFFILIATION_ADD_SUCCESS = i18n.t(`Successfully Added Organization Affiliation`, {
    ns: namespace,
  });
  lang.ORG_AFFILIATION_DELETE_SUCCESS = i18n.t(`Successfully Deleted Organization Affiliation`, {
    ns: namespace,
  });
  lang.CONFIRM_DELETE = i18n.t(`Are you sure you want to delete this Organization Affiliation?`, {
    ns: namespace,
  });
  lang.YES = i18n.t(`Yes`, { ns: namespace });
  lang.NO = i18n.t(`No`, { ns: namespace });

  // Rendered text
  lang.STATUS = i18n.t(`Status`, { ns: namespace });
  lang.NAME = i18n.t(`Name`, { ns: namespace });
  lang.LOCATION_NAME = i18n.t(`Practitioner Name`, { ns: namespace });
  lang.ORGANIZATION_NAME = i18n.t(`Organization Name`, { ns: namespace });
  lang.SAVING = i18n.t(`Saving`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.ACTIVE = i18n.t(`Active`, { ns: namespace });
  lang.INACTIVE = i18n.t(`Inactive`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.EDIT_ORG_AFFILIATION = i18n.t(`Edit Organization Affiliation`, { ns: namespace });
  lang.CREATE_ORG_AFFILIATION = i18n.t(`Create Organization Affiliation`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.CREATE = i18n.t(`Create`, { ns: namespace });
  lang.IDENTIFIER = i18n.t(`Identifier`, { ns: namespace });
  lang.ORGANIZATION_AFFILIATION = i18n.t(`Practitioner Roles`, { ns: namespace });
  lang.SEARCH = i18n.t(`Search`, { ns: namespace });
  lang.IDENTIFIER = i18n.t(`Identifier`, { ns: namespace });
  lang.ORG_AFFILIATION_PAGE_HEADER = i18n.t(`FHIR Organization Affiliation`, { ns: namespace });
  lang.ORGANIZATION = i18n.t(`Organization`, { ns: namespace });
  lang.LOCATION = i18n.t(`Practitioner`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
