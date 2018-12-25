(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["__bigtest__"] = factory();
	else
		root["__bigtest__"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BaseAdapter; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _window = window,
    WebSocket = _window.WebSocket;

var BaseAdapter =
/*#__PURE__*/
function () {
  _createClass(BaseAdapter, null, [{
    key: "init",
    value: function init(options) {
      var instance = new this();
      instance.init(options);
      window.addEventListener('load', function () {
        instance.connect(options.client);
      });
    }
  }]);

  function BaseAdapter() {
    _classCallCheck(this, BaseAdapter);

    // adapters are singletons
    if (this.constructor.instance) {
      return this.constructor.instance;
    } else {
      this.constructor.instance = this;
    } // attach the run listener


    this.on('run', this.run.bind(this));
  }

  _createClass(BaseAdapter, [{
    key: "connect",
    value: function connect(url) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var _ref = new URL(url),
            hostname = _ref.hostname,
            port = _ref.port; // connect socket


        _this.socket = new WebSocket("ws://".concat(hostname, ":").concat(port, "/adapter")); // promise listeners

        _this.socket.addEventListener('open', function () {
          return resolve();
        });

        _this.socket.addEventListener('error', function (e) {
          return reject(e);
        }); // socket messages trigger adapter events


        _this.socket.addEventListener('message', function (e) {
          try {
            var _JSON$parse = JSON.parse(e.data),
                event = _JSON$parse.event,
                data = _JSON$parse.data;

            if (event) _this.emit(event, data);
          } catch (err) {}
        });
      });
    }
  }, {
    key: "send",
    value: function send(event, data) {
      this.socket.send(JSON.stringify({
        event: event,
        data: data
      }));
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      this.listeners = this.listeners || {};
      this.listeners[event] = this.listeners[event] || [];
      this.listeners[event].push(callback);
    }
  }, {
    key: "emit",
    value: function emit(event, data) {
      this.listeners = this.listeners || {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.listeners[event][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var callback = _step.value;
          callback.call(this, data);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "init",
    value: function init() {}
  }, {
    key: "run",
    value: function run() {}
  }]);

  return BaseAdapter;
}();



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MochaAdapter; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


var _window = window,
    mocha = _window.mocha;

function gatherSuites(test) {
  var suite = test.parent;
  var suites = [];

  while (!suite.root) {
    suites.push(suite.title);
    suite = suite.parent;
  }

  return suites.reverse();
}

function serializeTest(test) {
  return {
    name: test.title,
    path: gatherSuites(test),
    passing: test.state === 'passed',
    failing: test.state === 'failed',
    skipped: test.pending,
    duration: test.duration,
    errors: [test.$error].filter(Boolean)
  };
}

function gatherTests(suite) {
  var _ref;

  return (_ref = []).concat.apply(_ref, [suite.tests.map(serializeTest)].concat(_toConsumableArray(suite.suites.map(gatherTests))));
}

var mochaStackReg = /\n.+\/mocha\/mocha\.js\?\w*:[\d:]+\)?(?=(\n|$))/g;

function serializeError(err) {
  var name = err.name,
      message = err.message,
      stack = err.stack;

  if (stack) {
    // remove mocha stack entries
    stack = stack.replace(mochaStackReg, '');
  } // formatted error


  return {
    name: name,
    message: message,
    stack: stack
  };
}

var MochaAdapter =
/*#__PURE__*/
function (_BaseAdapter) {
  _inherits(MochaAdapter, _BaseAdapter);

  function MochaAdapter() {
    _classCallCheck(this, MochaAdapter);

    return _possibleConstructorReturn(this, _getPrototypeOf(MochaAdapter).apply(this, arguments));
  }

  _createClass(MochaAdapter, [{
    key: "init",
    value: function init() {
      var _this = this;

      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$ui = _ref2.ui,
          ui = _ref2$ui === void 0 ? 'bdd' : _ref2$ui;

      var grep = window.localStorage.getItem('grep');

      if (grep) {
        mocha.setup({
          ui: ui,
          grep: new RegExp("^" + grep)
        });
        window.localStorage.removeItem('grep');
      } else {
        mocha.setup({
          ui: ui
        });
      }

      mocha.reporter(function (runner) {
        function send(event, data, err) {
          // console.log('sending', event, data, err)
          // console.log('sending serial', event, window.mochaTransport.serialize(data))
          window.socketIOClient.emit("mocha/" + event, window.mochaTransport.serialize(data), window.mochaTransport.serialize(err));
        }

        runner.on('start', function (data) {
          send('start', data);
        });
        runner.on('end', function (data) {
          send('end', data);
        });
        runner.on('suite', function (data) {
          send('suite', data);
        });
        runner.on('suite end', function (data) {
          send('suite end', data);
        });
        runner.on('test', function (data) {
          send('test', data);
        });
        runner.on('test end', function (data) {
          send('test end', data);
        });
        runner.on('hook', function (data) {
          send('hook', data);
        });
        runner.on('hook end', function (data) {
          send('hook end', data);
        });
        runner.on('pass', function (data) {
          send('pass', data);
        });
        runner.on('fail', function (data, err) {
          send('fail', data, err);
        });
        runner.on('pending', function (data) {
          send('pending', data);
        });
        runner.on('start', _this.handleStart.bind(_this));
        runner.on('end', _this.handleEnd.bind(_this));
        runner.on('test', _this.handleTest.bind(_this));
        runner.on('test end', _this.handleTestEnd.bind(_this));
        runner.on('fail', _this.handleFail.bind(_this));
      });
    }
  }, {
    key: "handleStart",
    value: function handleStart() {
      this.send('start', this.tests);
    }
  }, {
    key: "handleEnd",
    value: function handleEnd() {
      this.send('end', this.tests);
    }
  }, {
    key: "handleTest",
    value: function handleTest(test) {
      this.send('update', [_objectSpread({}, serializeTest(test), {
        running: true
      })]);
    }
  }, {
    key: "handleTestEnd",
    value: function handleTestEnd(test) {
      this.send('update', [serializeTest(test)]);
    }
  }, {
    key: "handleFail",
    value: function handleFail(runnable, err) {
      runnable.$error = serializeError(err);
      var error = serializeError(err);

      if (runnable.type === 'hook') {
        error.message = "".concat(runnable.originalTitle, ": ").concat(error.message);
        this.send('update', gatherTests(runnable.parent).map(function (test) {
          return _objectSpread({}, test, {
            failing: true,
            errors: [error]
          });
        }));
      }
    }
  }, {
    key: "run",
    value: function run() {
      mocha.run();
    }
  }, {
    key: "tests",
    get: function get() {
      var tests = gatherTests(mocha.suite);
      Object.defineProperty(this, 'tests', {
        value: tests
      });
      return tests;
    }
  }]);

  return MochaAdapter;
}(_base__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ })
/******/ ]);
});