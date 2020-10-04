"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _store = require("./store/store");

Object.keys(_store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _store[key];
    }
  });
});

var _ducks = require("./store/ducks");

Object.keys(_ducks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ducks[key];
    }
  });
});

var _selectors = require("./store/selectors");

Object.keys(_selectors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _selectors[key];
    }
  });
});