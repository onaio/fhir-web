<<<<<<< HEAD
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _serviceClass = require('./serviceClass');

Object.keys(_serviceClass).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
=======
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _serviceClass = require("./serviceClass");

Object.keys(_serviceClass).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
>>>>>>> master
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _serviceClass[key];
<<<<<<< HEAD
    },
  });
});

var _errors = require('./errors');

Object.keys(_errors).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
=======
    }
  });
});

var _errors = require("./errors");

Object.keys(_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
>>>>>>> master
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _errors[key];
<<<<<<< HEAD
    },
  });
});
=======
    }
  });
});
>>>>>>> master
