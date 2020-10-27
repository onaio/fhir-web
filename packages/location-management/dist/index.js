"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocationGroupAddition = require("./components/LocationGroupAddition");

Object.keys(_LocationGroupAddition).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LocationGroupAddition[key];
    }
  });
});