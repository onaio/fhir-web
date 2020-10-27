"use strict";
exports.__esModule = true;
var redux_reducer_registry_1 = require("@onaio/redux-reducer-registry");
var store_1 = require("@opensrp/store");
var location_units_1 = require("../location-units");
var fixtures_1 = require("./fixtures");
redux_reducer_registry_1["default"].register(location_units_1.reducerName, location_units_1["default"]);
describe('src/ducks/location-units', function () {
    beforeEach(function () {
        store_1.store.dispatch(location_units_1.removeLocationUnits());
    });
    it('should have initial state', function () {
        expect(location_units_1.getLocationUnitsById(store_1.store.getState())).toEqual({});
        expect(location_units_1.getLocationUnitById(store_1.store.getState(), 'someId')).toEqual(null);
        expect(location_units_1.getLocationUnitsArray(store_1.store.getState())).toEqual([]);
        expect(location_units_1.getTotalLocationUnits(store_1.store.getState())).toEqual(0);
    });
    it('sets total records correctly', function () {
        store_1.store.dispatch(location_units_1.setTotalLocationUnits(5));
        expect(location_units_1.getTotalLocationUnits(store_1.store.getState())).toEqual(5);
        store_1.store.dispatch(location_units_1.setTotalLocationUnits(10));
        expect(location_units_1.getTotalLocationUnits(store_1.store.getState())).toEqual(10);
    });
    it('fetches location units correctly', function () {
        var _a;
        store_1.store.dispatch(location_units_1.fetchLocationUnits([fixtures_1.locationUnit1, fixtures_1.locationUnit2]));
        expect(location_units_1.getLocationUnitsById(store_1.store.getState())).toEqual((_a = {},
            _a[fixtures_1.locationUnit1.id] = fixtures_1.locationUnit1,
            _a[fixtures_1.locationUnit2.id] = fixtures_1.locationUnit2,
            _a));
        expect(location_units_1.getLocationUnitById(store_1.store.getState(), fixtures_1.locationUnit2.id)).toEqual(fixtures_1.locationUnit2);
        expect(location_units_1.getLocationUnitsArray(store_1.store.getState())).toEqual([fixtures_1.locationUnit1, fixtures_1.locationUnit2]);
    });
    it('removes location units correctly', function () {
        store_1.store.dispatch(location_units_1.fetchLocationUnits([fixtures_1.locationUnit1, fixtures_1.locationUnit2]));
        expect(location_units_1.getLocationUnitsArray(store_1.store.getState())).toHaveLength(2);
        store_1.store.dispatch(location_units_1.removeLocationUnits());
        expect(location_units_1.getLocationUnitsArray(store_1.store.getState())).toHaveLength(0);
    });
});
