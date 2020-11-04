/** Teams redux module */
import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
  getTotalRecordsFactory,
} from '@opensrp/reducer-factory';

/** The reducer name */
export const reducerName = 'teams';

/** interface for Teams coding property */
interface TeamCoding {
  code: string;
  display: string;
  system: string;
}

/** interface for the type key in an team Object */
interface TeamType {
  coding: TeamCoding[];
}

/** interface for a Team object */
export interface Team {
  active: boolean;
  id: number;
  identifier: string;
  name: string;
  partOf?: number;
  type?: TeamType;
}

// action interfaces

/** action type for action that adds Teams to store */
export const TEAMS_FETCHED = 'teams/TEAM_FETCHED';
/** action type for REMOVE_TEAMS action */
export const REMOVE_TEAMS = 'teams/REMOVE_TEAMS';
/** action type for SET_TOTAL_TEAMS */
export const SET_TOTAL_TEAMS = 'teams/SET_TOTAL_TEAMS';

/** Item Reducer */
const reducer = reducerFactory<Team>(reducerName, TEAMS_FETCHED, REMOVE_TEAMS, SET_TOTAL_TEAMS);

// actions
/** actionCreator returns action to add Item records to store */
export const fetchTeamsAction = fetchActionCreatorFactory<Team>(reducerName, 'id');
export const removeTeamsAction = removeActionCreatorFactory(reducerName);
export const setTotalTeamsAction = setTotalRecordsFactory(reducerName);

// selectors
// selectors
export const getTeamsById = getItemsByIdFactory<Team>(reducerName);
export const getTeamById = getItemByIdFactory<Team>(reducerName);
export const getTeamsArray = getItemsArrayFactory<Team>(reducerName);
export const getTotalTeams = getTotalRecordsFactory(reducerName);

export default reducer;
