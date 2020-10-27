"use strict";
exports.__esModule = true;
var redux_reducer_registry_1 = require("@onaio/redux-reducer-registry");
var store_1 = require("@opensrp/store");
var location_tags_1 = require("../location-tags");
var fixtures_1 = require("./fixtures");
redux_reducer_registry_1["default"].register(location_tags_1.reducerName, location_tags_1["default"]);
describe('src/ducks/location-tags', function () {
    beforeEach(function () {
        store_1.store.dispatch(location_tags_1.removeLocationTags());
    });
    it('should have initial state', function () {
        expect(location_tags_1.getLocationTagsById(store_1.store.getState())).toEqual({});
        expect(location_tags_1.getLocationTagById(store_1.store.getState(), 'someId')).toEqual(null);
        expect(location_tags_1.getLocationTagsArray(store_1.store.getState())).toEqual([]);
        expect(location_tags_1.getTotalLocationTags(store_1.store.getState())).toEqual(0);
    });
    it('sets total records correctly', function () {
        store_1.store.dispatch(location_tags_1.setTotalLocationtags(5));
        expect(location_tags_1.getTotalLocationTags(store_1.store.getState())).toEqual(5);
        store_1.store.dispatch(location_tags_1.setTotalLocationtags(10));
        expect(location_tags_1.getTotalLocationTags(store_1.store.getState())).toEqual(10);
    });
    it('fetches location tags correctly', function () {
        store_1.store.dispatch(location_tags_1.fetchLocationTags([fixtures_1.locationTag1, fixtures_1.locationTag2]));
        expect(location_tags_1.getLocationTagsById(store_1.store.getState())).toEqual({
            1: fixtures_1.locationTag1,
            2: fixtures_1.locationTag2
        });
        expect(location_tags_1.getLocationTagById(store_1.store.getState(), '2')).toEqual(fixtures_1.locationTag2);
        expect(location_tags_1.getLocationTagsArray(store_1.store.getState())).toEqual([fixtures_1.locationTag1, fixtures_1.locationTag2]);
    });
    it('removes location tags correctly', function () {
        store_1.store.dispatch(location_tags_1.fetchLocationTags([fixtures_1.locationTag1, fixtures_1.locationTag2]));
        expect(location_tags_1.getLocationTagsArray(store_1.store.getState())).toHaveLength(2);
        store_1.store.dispatch(location_tags_1.removeLocationTags());
        expect(location_tags_1.getLocationTagsArray(store_1.store.getState())).toHaveLength(0);
    });
});
