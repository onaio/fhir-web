"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NotFound = require("./NotFound");

Object.keys(_NotFound).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _NotFound[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _NotFound[key];
    }
  });
});