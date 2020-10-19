"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getTotalLocationUnits = exports.getLocationUnitsArray = exports.getLocationUnitById = exports.getLocationsUnitsById = exports.setTotalLocationUnits = exports.removeLocationUnits = exports.fetchLocationUnits = exports.reducerName = exports.LocationUnitStatus = void 0;

var _reducerFactory = require("@opensrp/reducer-factory");

var LocationUnitStatus;
exports.LocationUnitStatus = LocationUnitStatus;

(function (LocationUnitStatus) {
  LocationUnitStatus["ACTIVE"] = "Active";
  LocationUnitStatus["INACTIVE"] = "InActive";
})(LocationUnitStatus || (exports.LocationUnitStatus = LocationUnitStatus = {}));

var reducerName = 'location-units';
exports.reducerName = reducerName;
var customfetchedActionType = 'location-units/LOCATION_UNITS_FETCHED';
var customRemoveActionType = 'location-units/REMOVE_LOCATION_UNITS';
var customSetTotalRecordsActionType = 'location-units/SET_TOTAL_LOCATION_UNITS';
var reducer = (0, _reducerFactory.reducerFactory)(reducerName, customfetchedActionType, customRemoveActionType, customSetTotalRecordsActionType);
var fetchLocationUnits = (0, _reducerFactory.fetchActionCreatorFactory)(reducerName, 'id');
exports.fetchLocationUnits = fetchLocationUnits;
var removeLocationUnits = (0, _reducerFactory.removeActionCreatorFactory)(reducerName);
exports.removeLocationUnits = removeLocationUnits;
var setTotalLocationUnits = (0, _reducerFactory.setTotalRecordsFactory)(reducerName);
exports.setTotalLocationUnits = setTotalLocationUnits;
var getLocationsUnitsById = (0, _reducerFactory.getItemsByIdFactory)(reducerName);
exports.getLocationsUnitsById = getLocationsUnitsById;
var getLocationUnitById = (0, _reducerFactory.getItemByIdFactory)(reducerName);
exports.getLocationUnitById = getLocationUnitById;
var getLocationUnitsArray = (0, _reducerFactory.getItemsArrayFactory)(reducerName);
exports.getLocationUnitsArray = getLocationUnitsArray;
var getTotalLocationUnits = (0, _reducerFactory.getTotalRecordsFactory)(reducerName);
exports.getTotalLocationUnits = getTotalLocationUnits;
var _default = reducer;
exports["default"] = _default;