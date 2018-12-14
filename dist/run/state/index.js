"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "create", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function () {
    return _store.default;
  }
});
exports.default = void 0;

var _create = _interopRequireWildcard(require("./create"));

var _browser = _interopRequireDefault(require("./browser"));

var _test = _interopRequireDefault(require("./test"));

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Represents the state of the entire run process
 */
class State {
  constructor() {
    _defineProperty(this, "tests", []);

    _defineProperty(this, "browsers", []);

    _defineProperty(this, "ready", false);
  }

  /**
   * True when there are tests present
   * @property {Boolean}
   */
  get started() {
    return !!this.tests.length;
  }
  /**
   * True when all browsers are in a finished state
   * @property {Boolean}
   */


  get finished() {
    return this.browsers.every(browser => browser.finished);
  }
  /**
   * When there are failing tests, status is `1`, otherwise it is `0`
   * @property {Number}
   */


  get status() {
    return this.tests.some(test => test.failing) ? 1 : 0;
  }
  /**
   * Adds a launched browser state with an ID
   *
   * @param {String} id - Launched browser ID
   * @returns {State}
   */


  launchBrowser(id) {
    if (!this.browsers.find(browser => browser.id === id)) {
      return this.set({
        browsers: this.browsers.concat((0, _create.default)(_browser.default, {
          id,
          launched: true
        }))
      });
    } else {
      return this;
    }
  }
  /**
   * Updates the name of a launched browser so that other connections
   * from the same browser can accurately update the proper states
   *
   * @param {Object} meta - Websocket meta from the sockets server
   * @param {String} id - Launched browser ID
   * @returns {State}
   */


  updateLaunched(meta, id) {
    let index = this.browsers.findIndex(browser => {
      return browser.launched && browser.id === id;
    });

    if (index > -1) {
      return this.set({
        browsers: (0, _create.update)(this.browsers, index, browser => {
          return browser.set({
            name: meta.browser
          });
        })
      });
    } else {
      return this;
    }
  }
  /**
   * Connects a websocket to a specific browser's state
   *
   * @param {Object} meta - Websocket meta from the sockets server
   * @returns {State}
   */


  connectBrowser(meta) {
    let index = this.browsers.findIndex(browser => {
      return browser.name === meta.browser;
    });
    let results = this.set({
      browsers: (0, _create.update)(this.browsers, index, browser => {
        if (!browser) {
          browser = (0, _create.default)(_browser.default, {
            name: meta.browser
          });
        }

        return browser.connect(meta.id);
      })
    });
    let ready = results.browsers.filter(browser => browser.launched).every(browser => browser.connected);

    if (ready && !this.ready) {
      return results.set({
        ready
      });
    } else {
      return results;
    }
  }
  /**
   * Disconnects a websocket from a specific browser's state
   *
   * @param {Object} meta - Websocket meta from the sockets server
   * @returns {State}
   */


  disconnectBrowser(meta) {
    let index = this.browsers.findIndex(browser => {
      return browser.name === meta.browser;
    });

    if (index > -1) {
      return this.set({
        browsers: (0, _create.update)(this.browsers, index, browser => {
          return browser.disconnect(meta.id);
        })
      });
    } else {
      return this;
    }
  }
  /**
   * Transitions a browser into a running state and adds or updates
   * tests that have just started.
   *
   * @param {Object} meta - Websocket meta from the sockets server
   * @param {Object[]} tests - Array of test state properties
   * @returns {State}
   */


  startTests(meta, tests) {
    let index = this.browsers.findIndex(browser => {
      return browser.name === meta.browser;
    });

    if (index > -1) {
      let running = this.set({
        browsers: (0, _create.update)(this.browsers, index, browser => {
          return browser.run(meta.id);
        })
      });
      return running.updateTests(meta, tests);
    } else {
      return this;
    }
  }
  /**
   * Updates tests for a specific browser
   *
   * @param {Object} meta - Websocket meta from the sockets server
   * @param {Object[]} tests - Array of test state properties
   * @returns {State}
   */


  updateTests(meta, tests) {
    return this.set({
      tests: tests.reduce((tests, test) => {
        let props = {
          browser: meta.browser,
          ...test
        };
        let index = this.tests.findIndex(test => {
          return test.name === props.name && test.path.every((p, i) => p === props.path[i]);
        });
        return (0, _create.update)(tests, index, test => {
          return test ? test.update(props) : (0, _create.default)(_test.default, props);
        });
      }, this.tests)
    });
  }

  resetTests() {
    this.set({
      tests: []
    });
  }
  /**
   * Transitions a browser into a finished state
   *
   * @param {Object} meta - Websocket meta from the sockets server
   * @returns {State}
   */


  endTests(meta) {
    let index = this.browsers.findIndex(browser => {
      return browser.running && browser.name === meta.browser;
    });

    if (index > -1) {
      return this.set({
        browsers: (0, _create.update)(this.browsers, index, browser => {
          return browser.done(meta.id);
        })
      });
    } else {
      return this;
    }
  }

}

exports.default = State;