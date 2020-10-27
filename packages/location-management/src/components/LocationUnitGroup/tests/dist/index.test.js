"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var enzyme_1 = require("enzyme");
var react_1 = require("react");
var test_utils_1 = require("react-dom/test-utils");
var flush_promises_1 = require("flush-promises");
var __1 = require("..");
describe('containers/pages/locations/locationunitgroup', function () {
    it('renders without crashing', function () {
        enzyme_1.shallow(react_1["default"].createElement(__1.LocationUnitGroup, null));
    });
    it('should open and close locations detail', function () {
        var wrapper = enzyme_1.mount(react_1["default"].createElement(__1.LocationUnitGroup, null));
        // click on view detail
        var first_action = wrapper.find('.location-table-action').first();
        first_action.children().last().simulate('click');
        wrapper
            .find('.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child')
            .first()
            .simulate('click');
        var viewDetail = wrapper.find('.ant-col.ant-col-8.pl-3.border-left');
        expect(viewDetail.length).toBe(1);
        viewDetail.find('button').simulate('click');
        viewDetail = wrapper.find('.ant-col.ant-col-8.pl-3.border-left');
        expect(viewDetail.length).toBe(0);
    });
    it('should save location detail on edit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, first_row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.mount(react_1["default"].createElement(__1.LocationUnitGroup, null));
                    first_row = wrapper.find('tr[data-row-key="0"]');
                    first_row.find('.ant-table-cell').last().find('.edit').simulate('click');
                    first_row = wrapper.find('tr[data-row-key="0"]');
                    first_row
                        .children()
                        .first()
                        .find('input')
                        .simulate('change', { target: { value: 'Testing 1' } });
                    first_row.find('button').first().simulate('click');
                    return [4 /*yield*/, test_utils_1.act(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, flush_promises_1["default"]()];
                                    case 1:
                                        _a.sent();
                                        wrapper.update();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should cancel location detail on edit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, first_row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.mount(react_1["default"].createElement(__1.LocationUnitGroup, null));
                    first_row = wrapper.find('tr[data-row-key="0"]');
                    first_row.find('.ant-table-cell').last().find('.edit').simulate('click');
                    first_row = wrapper.find('tr[data-row-key="0"]');
                    first_row
                        .children()
                        .first()
                        .find('input')
                        .simulate('change', { target: { value: 'Testing 1' } });
                    first_row.find('button').last().simulate('click');
                    return [4 /*yield*/, test_utils_1.act(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, flush_promises_1["default"]()];
                                    case 1:
                                        _a.sent();
                                        wrapper.update();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('renders onchange without crashing', function () {
        var wrapper = enzyme_1.mount(react_1["default"].createElement(__1.LocationUnitGroup, null));
        var first_row = wrapper.find('.ant-input.ant-input-lg');
        first_row.find('input').simulate('change', { target: { value: 'Testing 1' } });
    });
});
