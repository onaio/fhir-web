import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Dictionary<string> = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_OCCURED = i18n.t(`${namespace}::An error occurred`);
  lang.ENTER_TEAM_NAME = i18n.t(`${namespace}::Enter a Team name`);
  lang.TEAMS = i18n.t(`${namespace}::Teams`);
  lang.SUCCESSFULLY_ASSIGNED_TEAMS = `Successfully Assigned Teams`;

  // Table view strings
  lang.TEAM_ASSIGNMENT_PAGE_TITLE = i18n.t(`${namespace}::Team Assignment`);
  lang.TEAM_ASSIGNMENT_MODAL_TITLE = i18n.t(`${namespace}::Assign/Unassign Teams`);
  lang.NAME = i18n.t(`${namespace}::Name`);
  lang.ACTIONS = i18n.t(`${namespace}::Actions`);
  lang.EDIT = i18n.t(`${namespace}::Edit`);
  lang.ASSIGN_TEAMS = i18n.t(`${namespace}::Assigned Teams`);
  lang.SAVE = i18n.t(`${namespace}::Save`);
  lang.CANCEL = i18n.t(`${namespace}::Cancel`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
