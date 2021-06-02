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
  lang.MSG_TEAMS_UPDATE_SUCCESS = i18n.t(`Successfully Updated Care Teams`, { ns: namespace });
  lang.MSG_TEAMS_ADD_SUCCESS = i18n.t(`Successfully Added Care Teams`, { ns: namespace });

  // Rendered text
  lang.STATUS = i18n.t(`Status`, { ns: namespace });
  lang.SAVING = i18n.t(`Saving`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.ACTIVE = i18n.t(`Active`, { ns: namespace });
  lang.INACTIVE = i18n.t(`Inactive`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.EDIT_TEAM = i18n.t(`Edit Care Team`, { ns: namespace });
  lang.CREATE_TEAM = i18n.t(`Create Care Team`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.CREATE = i18n.t(`Create`, { ns: namespace });
  lang.IDENTIFIER = i18n.t(`Identifier`, { ns: namespace });
  lang.TEAMS = i18n.t(`Care Teams`, { ns: namespace });
  lang.SEARCH = i18n.t(`Search`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
