"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requireBrowser = requireBrowser;
exports.default = void 0;

var _resolveLocal = _interopRequireDefault(require("../util/resolve-local"));

var _browser = require("../util/browser");

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  assign
} = Object;
/**
 * Requires a local browser's or module's default export and ensure's
 * it is an instance of the base browser class.
 *
 * @private
 * @param {String} name - The local browser name, or module path
 * @returns {Browser} the resolved default browser export
 * @throws {Error} when the browser cannot be found, or if the default
 * export is not an instance of the base browser class
 */

function requireBrowser(name) {
  let Browser;

  if (typeof name === 'string') {
    let module = (0, _resolveLocal.default)('browser', name);
    Browser = require(module).default;
  } else if (typeof name === 'function') {
    Browser = name;
    name = Browser.name;
  }

  if (!(Browser && Browser.prototype instanceof _base.default)) {
    throw new Error(`Invalid browser "${name}"`);
  }

  return Browser;
}
/**
 * Requires browser launchers and provides wrapper methods to invoke
 * common browser launcher methods.
 *
 * @private
 * @param {String[]} browsers - Browser launchers to require
 * @param {Store} store - The coordinator's store instance
 */


class BrowserManager {
  constructor(browsers, options = {}) {
    assign(this, {
      browsers: browsers.map(browser => {
        if (browser === 'System Default') {
          browser = (0, _browser.getDefaultBrowser)();
        }

        let Browser = requireBrowser(browser);
        return new Browser(options[Browser.options]);
      })
    });
  }
  /**
   * Logs the browser being launched, updates the store, and actually
   * launches the browser with a reference to it's own ID used by the
   * store again later.
   *
   * @param {String} url - Launch target URL
   * @param {Function} hook - Invoked before launching the browser
   * @returns {Promise} resolves when all browsers have launched
   */


  async launch(url, hook) {
    await Promise.all(this.browsers.map(browser => {
      let target = `${url}?l=${browser.id}`;
      if (hook) hook(browser);
      return browser.launch(target);
    }));
  }
  /**
   * Logs to debug which browser is closing, then sends the kill
   * signal to each browser launcher.
   *
   * @returns {Promise} resolves when all browsers have closed
   */


  async kill() {
    await Promise.all(this.browsers.map(browser => {
      return browser.kill();
    }));
  }

}

exports.default = BrowserManager;