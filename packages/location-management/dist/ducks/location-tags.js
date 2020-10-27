"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getTotalLocationTags = exports.getLocationTagsArray = exports.getLocationTagById = exports.getLocationTagsById = exports.setTotalLocationtags = exports.removeLocationTags = exports.fetchLocationTags = exports.reducerName = void 0;

var _reducerFactory = require("@opensrp/reducer-factory");

var reducerName = 'location-tags';
exports.reducerName = reducerName;
var customfetchedActionType = 'location-tags/LOCATION_TAGS_FETCHED';
var customRemoveActionType = 'location-tags/REMOVE_LOCATION_TAGS';
var customSetTotalRecordsActionType = 'location-tags/SET_TOTAL_LOCATION_TAGS';
var reducer = (0, _reducerFactory.reducerFactory)(reducerName, customfetchedActionType, customRemoveActionType, customSetTotalRecordsActionType);
var fetchLocationTags = (0, _reducerFactory.fetchActionCreatorFactory)(reducerName, 'id');
exports.fetchLocationTags = fetchLocationTags;
var removeLocationTags = (0, _reducerFactory.removeActionCreatorFactory)(reducerName);
exports.removeLocationTags = removeLocationTags;
var setTotalLocationtags = (0, _reducerFactory.setTotalRecordsFactory)(reducerName);
exports.setTotalLocationtags = setTotalLocationtags;
var getLocationTagsById = (0, _reducerFactory.getItemsByIdFactory)(reducerName);
exports.getLocationTagsById = getLocationTagsById;
var getLocationTagById = (0, _reducerFactory.getItemByIdFactory)(reducerName);
exports.getLocationTagById = getLocationTagById;
var getLocationTagsArray = (0, _reducerFactory.getItemsArrayFactory)(reducerName);
exports.getLocationTagsArray = getLocationTagsArray;
var getTotalLocationTags = (0, _reducerFactory.getTotalRecordsFactory)(reducerName);
exports.getTotalLocationTags = getTotalLocationTags;
var _default = reducer;
exports["default"] = _default;