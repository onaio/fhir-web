import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  // Tooltips
  lang.TIP_REQUIRED_FIELD = i18n.t(`${namespace}::This is a required field`);

  // Errors
  lang.ERROR_OCCURRED = i18n.t(`${namespace}::An error occurred`);

  // Messages
  lang.MSG_ASSIGN_PRACTITIONERS = i18n.t(`${namespace}::Assigning Practitioners`);
  lang.MSG_ASSIGN_PRACTITONERS_SUCCESS = i18n.t(
    `${namespace}::Successfully Assigned Practitioners`
  );
  lang.MSG_TEAMS_UPDATE_SUCCESS = i18n.t(`${namespace}::Successfully Updated Teams`);
  lang.MSG_TEAMS_ADD_SUCCESS = i18n.t(`${namespace}::Successfully Added Teams`);

  // Rendered text
  lang.ENTER_TEAM_NAME = i18n.t(`${namespace}::Enter a team name`);
  lang.TEAM_NAME = i18n.t(`${namespace}::Team Name`);
  lang.STATUS = i18n.t(`${namespace}::Status`);
  lang.TEAM_MEMBERS = i18n.t(`${namespace}::Team Members`);
  lang.SAVING = i18n.t(`${namespace}::Saving`);
  lang.SAVE = i18n.t(`${namespace}::Save`);
  lang.ACTIVE = i18n.t(`${namespace}::Active`);
  lang.INACTIVE = i18n.t(`${namespace}::Inactive`);
  lang.SELECT_PRACTITIONER = i18n.t(`${namespace}::Select user (practitioners only)`);
  lang.CANCEL = i18n.t(`${namespace}::Cancel`);
  lang.EDIT_TEAM = i18n.t(`${namespace}::Edit Team`);
  lang.CREATE_TEAM = i18n.t(`${namespace}::Create Team`);
  lang.EDIT = i18n.t(`${namespace}::Edit`);
  lang.CREATE = i18n.t(`${namespace}::Create`);
  lang.IDENTIFIER = i18n.t(`${namespace}::Identifier`);
  lang.NO_TEAM_MEMBERS = i18n.t(`${namespace}::No team members`);
  lang.TEAMS = i18n.t(`${namespace}::Teams`);
  lang.SEARCH = i18n.t(`${namespace}::Search`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
