# Base Dux Module

## What am i

Am an abstraction (more like a template), that you can use to create other [dux modules](https://github.com/erikras/ducks-modular-redux).

I think the biggest win with me, is that there is reduced boilerplate when it comes to creating dux modules.

Currently , the only opinionated part about me is how i structure the stored data, basically it requires that my action creators are given data as list of objects, where each object bears a property akin to a `primary_key` i.e. this one single field should have unique values that are of type `string| number`.

## Installation

```node
yarn add @opensrp/reducer-factory
```

## Code example

```typescript
import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
  getTotalRecordsFactory,
  BaseDux,
} from '@opensrp/reducer-factory';

/** reducer name for the Item module */
export const reducerName = '<preferred reducer name>';

/** Item Reducer */
const reducer = reducerFactory<DataType>(reducerName);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchItem = fetchActionCreatorFactory<DataType>(reducerName, 'uniqueKey');
export const removeItemAction = removeActionCreatorFactory(reducerName);
export const setTotalItemRecords = setTotalRecordsFactory(reducerName);

// selectors
export const getAllItemById = getItemsByIdFactory<DataType>(reducerName);
export const getItemById = getItemByIdFactory<DataType>(reducerName);
export const getAllItemArray = getItemsArrayFactory<DataType>(reducerName);
export const getTotalItemRecords = getTotalRecordsFactory(reducerName);

export default reducer;
```

The default action types are

```ts
FETCHED = 'opensrp/reducer/objects/FETCHED';
REMOVE = 'opensrp/reducer/objects/REMOVE';
SET_TOTAL_RECORDS = 'opensrp/reducer/objects/SET_TOTAL_RECORDS';
```

If you would like to override the default values for the action types, pass the values as arguments when
creating the reducer

```ts
const customfetchedActionType = 'locations/location-units/LOCATION_UNITS_FETCHED';
const customRemoveActionType = 'locations/location-units/REMOVE_LOCATION_UNITS';
const customSetTotalRecordsActionType = 'locations/location-units/SET_TOTAL_LOCATION_UNITS';

const reducer = reducerFactory<DataType>(
  reducerName,
  customfetchedActionType,
  customRemoveActionType,
  customSetTotalRecordsActionType
);
```

## What am i provisioning

Glad you asked; The above example should have given you some clue, but am all to happy to summarize this for you here:

`reducerFactory` - this a factory method that returns a function that can be used as the reducer.
currently it supports 3 action types: - adding items - removing items - setting total records

### for action creators

`fetchActionCreatorFactory` - Use this to create action creators that you can use to create actions that when dispatched will add the data to a slice of the store. The argument is a key - which must be unique in the data set,

`removeActionCreatorFactory` - Use this to create action creators that return actions to remove all items from a slice of the store

`setTotalRecordsFactory` - This will create an action creator that adds the total number of records to specific slice of the store

### for the selectors

`getItemsByIdFactory` which returns a selector that gets all items from a store slice as an object

`getItemByIdFactory` which returns a selector that gets a single item from a store slice as an object

`getItemsArrayFactory` which returns a selector that gets all objects from a store slice as an array

`getTotalRecordsFactory` which returns a selector that gets the total number of records in a store slice
