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

/** interface for Client identfiers */
export interface Identifiers {
  zeir_id: string;
}

/** interface address field */
export interface AddressFields {
  address1: string;
  address2: string;
}

/** interface for client addresses  */
export interface Address {
  addressType: string;
  addressFields: AddressFields;
}

/** interface attributes */
export interface Attributes {
  age: string;
  card_status: string;
  ga_at_birth: string;
  sms_recipient: string;
  place_of_birth: string;
  card_status_date: string;
  registration_location_id: string;
  registration_location_name: string;
}

/** interface for  relationships*/
export interface Relationships {
  mother: string[];
}

/** interface client */
export interface Client {
  type: string;
  dateCreated: string;
  clientApplicationVersion: number;
  clientDatabaseVersion: number;
  serverVersion: number;
  baseEntityId: string;
  identifiers: Identifiers;
  addresses: Address[];
  attributes: Attributes;
  firstName: string;
  lastName: string;
  birthdate: string;
  birthdateApprox: boolean;
  deathdateApprox: boolean;
  gender: string;
  relationships: Relationships;
  teamId: string;
  locationId: string;
  _id: string;
  _rev: string;
}

/** reducer name */
export const reducerName = 'clients';

/** Action types */
const customfetchedActionType = 'clients/CLIENTS_FETCHED';
const customRemoveActionType = 'clients/REMOVE_CLIENTS';
const customSetTotalRecordsActionType = 'clients/SET_TOTAL_CLIENTS';

/** Item Reducer */
const reducer = reducerFactory<Client>(
  reducerName,
  customfetchedActionType,
  customRemoveActionType,
  customSetTotalRecordsActionType
);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchClients = fetchActionCreatorFactory<Client>(reducerName, '_id');
export const removeClients = removeActionCreatorFactory(reducerName);
export const setTotalClients = setTotalRecordsFactory(reducerName);

// selectors
export const getClientsById = getItemsByIdFactory<Client>(reducerName);
export const getClientById = getItemByIdFactory<Client>(reducerName);
export const getClientsArray = getItemsArrayFactory<Client>(reducerName);
export const getTotalClients = getTotalRecordsFactory(reducerName);

export default reducer;
