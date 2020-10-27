"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var enzyme_1 = require("enzyme");
var react_1 = require("react");
var __1 = require("..");
var props = {
    key: '0',
    name: 'Edrward 0',
    level: 2,
    lastupdated: new Date(),
    status: 'Alive',
    type: 'Feautire',
    created: new Date(),
    externalid: 'asdkjh1230',
    openmrsid: 'asdasdasdkjh1230',
    username: 'edward 0',
    version: '0',
    syncstatus: 'Synced'
};
describe('component/locations/LocationDetail', function () {
    it('renders without crashing', function () {
        enzyme_1.shallow(react_1["default"].createElement(__1["default"], __assign({}, props)));
    });
});
